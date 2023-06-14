/**
 * emission-category controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";
import { EmissionEntryService } from "../../emission-entry/services/emission-entry";
import { Emissions } from "../../emission-entry";
import { EmissionCategoryService } from "../services/emission-category";
import { EmissionCategory } from "..";
import { EmissionFactorDatumService } from "../../emission-factor-datum/services/emission-factor-datum";
import { EmissionSourceGroup } from "../../emission-source-group";
import { EmissionSource } from "../../emission-source";
import { ReportingPeriodService } from "../../reporting-period/services/reporting-period";

const { ValidationError } = utils.errors;

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => {
    return {
      async findOneWithEmissionFactors(ctx) {
        const paramsSchema = yup.object({
          id: yup.number().required(),
        });

        const querySchema = yup.object({
          reportingPeriod: yup.number().required(),
        });

        const [{ id }, { reportingPeriod }] = await Promise.all([
          validate(ctx.params, paramsSchema, ValidationError),
          validate(ctx.query, querySchema, ValidationError),
        ]);

        // Check access to reportingPeriod

        const userHasAccesToReportingPeriod = await strapi
          .service<ReportingPeriodService>(
            "api::reporting-period.reporting-period"
          )
          .isAllowedForUser(reportingPeriod, ctx.state.user.id);

        if (!userHasAccesToReportingPeriod) {
          return ctx.forbidden();
        }

        // Find emission category by id, populated with emission sources and emission source groups

        const emissionCategory: EmissionCategory | null =
          await strapi.entityService.findOne(
            "api::emission-category.emission-category",
            id,
            {
              populate: {
                emissionSources: {
                  populate: "emissionSourceGroup",
                },
                localizations: {
                  populate: {
                    emissionSources: {
                      populate: {
                        emissionSourceGroup: {
                          populate: "localizations",
                        },
                      },
                    },
                  },
                },
              },
            }
          );

        if (!emissionCategory) return ctx.notFound();

        const populatedEmissionCategory = strapi
          .service<EmissionCategoryService>(
            "api::emission-category.emission-category"
          )
          .populateEmissionSources(emissionCategory);

        // Get emission factor data and validate it

        const emissionFactorDatum = await strapi
          .service<EmissionFactorDatumService>(
            "api::emission-factor-datum.emission-factor-datum"
          )
          .findOneByReportingPeriod(reportingPeriod);

        const json = await strapi
          .service<EmissionFactorDatumService>(
            "api::emission-factor-datum.emission-factor-datum"
          )
          .validateJson(emissionFactorDatum.json);

        // Attach emission factor data to emission sources

        const { emissionSources, ...plainEmissionCategory } =
          populatedEmissionCategory;
        const emissionSourcesWithFactors = emissionSources.map((source) => {
          return {
            ...source,
            factors: json.emission_sources[source.apiId]?.factors,
          };
        });

        interface EmissionSourceGroupWithSources extends EmissionSourceGroup {
          emissionSources: EmissionSource[];
        }

        // Group emission sources by emission source group

        const emissionSourceGroups = emissionSourcesWithFactors.reduce<
          EmissionSourceGroupWithSources[]
        >((groups, { emissionSourceGroup, ...source }) => {
          const group = emissionSourceGroup ?? {
            id: -1,
            createdAt: "",
            updatedAt: "",
            locale: emissionCategory.locale,
            name: "default",
            emissionSourceLabel: emissionCategory.emissionSourceLabel ?? "",
          };

          const groupLoc = groups.findIndex(({ id }) => id === group.id);

          return groupLoc > -1
            ? [
                ...groups.slice(0, groupLoc),
                {
                  ...groups[groupLoc],
                  emissionSources: [
                    ...groups[groupLoc].emissionSources,
                    source,
                  ],
                },
                ...groups.slice(groupLoc + 1),
              ]
            : [...groups, { ...group, emissionSources: [source] }];
        }, []);

        return {
          ...plainEmissionCategory,
          emissionSourceGroups,
        };
      },

      /**
       * Find ordered emission categories with emissions
       * @param ctx The Strapi context
       * @returns object
       */
      async findWithEmissions(ctx) {
        // Validate query

        const querySchema = yup.object({
          locale: yup.string().required(),
          reportingPeriod: yup.number().required(),
        });

        const { locale, reportingPeriod } = await validate(
          ctx.query,
          querySchema,
          ValidationError
        );

        // Check access to reportingPeriod

        const userHasAccesToReportingPeriod = await strapi
          .service<ReportingPeriodService>(
            "api::reporting-period.reporting-period"
          )
          .isAllowedForUser(reportingPeriod, ctx.state.user.id);

        if (!userHasAccesToReportingPeriod) {
          return ctx.forbidden();
        }

        // Concurrently get:
        // 1. emissionEntries for reportingPeriod and locale, populated with emissions
        // 2. ordered emissionCategories, populated with emissionSources

        const getEmissionEntries = strapi
          .service<EmissionEntryService>("api::emission-entry.emission-entry")
          .findWithEmissions(reportingPeriod, locale);

        const getEmissionCategories = strapi
          .service<EmissionCategoryService>(
            "api::emission-category.emission-category"
          )
          .findOrdered(locale);

        const [emissionEntries, emissionCategories] = await Promise.all([
          getEmissionEntries,
          getEmissionCategories,
        ]);

        // Group the calculated emissions by emission source

        const emissionsBySource = emissionEntries.reduce<{
          [key: string]: Emissions;
        }>((acc, entry) => {
          const esid = entry.emissionSource.id;
          const { emissions } = entry;

          return {
            ...acc,
            [esid]: acc[esid]
              ? {
                  direct: acc[esid].direct + emissions.direct,
                  indirect: acc[esid].indirect + emissions.indirect,
                  biogenic: acc[esid].biogenic + emissions.biogenic,
                }
              : {
                  direct: emissions.direct,
                  indirect: emissions.indirect,
                  biogenic: emissions.biogenic,
                },
          };
        }, {});

        // For each emissionCategory, sum up the emissions of its emissionSources

        const categoriesWithEmissions = emissionCategories.map((category) => {
          const emissions = category.emissionSources.reduce(
            (sum, current) => {
              const cur = emissionsBySource[current.id];
              return {
                direct: sum.direct + (cur?.direct ?? 0),
                indirect: sum.indirect + (cur?.indirect ?? 0),
                biogenic: sum.biogenic + (cur?.biogenic ?? 0),
              };
            },
            { direct: 0, indirect: 0, biogenic: 0 }
          );
          return {
            ...category,
            emissions,
          };
        });

        return {
          data: categoriesWithEmissions,
        };
      },
    };
  }
);
