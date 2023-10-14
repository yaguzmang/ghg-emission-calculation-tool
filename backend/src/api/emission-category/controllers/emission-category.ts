/**
 * emission-category controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";
import { EmissionEntry, Emissions } from "../../emission-entry";
import { EmissionCategory } from "..";
import { Json } from "../../emission-factor-datum/services/emission-factor-datum";
import { EmissionSourceGroup } from "../../emission-source-group";
import { EmissionSource } from "../../emission-source";
import { EmissionFactorDatum } from "../../emission-factor-datum";

const { ValidationError, ApplicationError } = utils.errors;

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

        const userHasAccesToReportingPeriod: boolean = await strapi
          .service("api::reporting-period.reporting-period")
          .isAllowedForUser(reportingPeriod, ctx.state.user.id);

        if (!userHasAccesToReportingPeriod) {
          return ctx.forbidden();
        }

        // Find emission category by id, populated with emission sources and emission source groups

        const emissionCategory = (await strapi.entityService?.findOne(
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
        )) as EmissionCategory | undefined | null;

        if (!emissionCategory) return ctx.notFound();

        const populatedEmissionCategory: EmissionCategory | undefined = strapi
          .service("api::emission-category.emission-category")
          ?.populateEmissionSources(emissionCategory);

        if (!populatedEmissionCategory)
          throw new ApplicationError(
            "emission cateogry could not be populated"
          );

        // Get emission factor data and validate it

        const emissionFactorDatum: EmissionFactorDatum | undefined =
          await strapi
            .service("api::emission-factor-datum.emission-factor-datum")
            ?.findOneByReportingPeriod(reportingPeriod, {
              locale: emissionCategory.locale,
            });

        if (!emissionFactorDatum)
          throw new ApplicationError("emission factor data could not be found");

        const json: Json | undefined = await strapi
          .service("api::emission-factor-datum.emission-factor-datum")
          ?.validateJson(emissionFactorDatum?.json);

        if (!json) throw new ApplicationError("json could not be validated");

        // Attach emission factor data to emission sources

        const { emissionSources, ...plainEmissionCategory } =
          populatedEmissionCategory;

        if (!emissionSources)
          throw new ApplicationError("emission sources not available");

        const emissionSourcesWithFactors = emissionSources.map((source) => {
          return {
            ...source,
            factors: json.emission_sources[source.apiId]?.factors,
            label: json.emission_sources[source.apiId]?.label,
            unit: json.emission_sources[source.apiId]?.unit,
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
            quantityLabel: emissionCategory.quantityLabel ?? "",
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

        const userHasAccesToReportingPeriod: boolean | undefined = await strapi
          .service("api::reporting-period.reporting-period")
          ?.isAllowedForUser(reportingPeriod, ctx.state.user.id);

        if (!userHasAccesToReportingPeriod) {
          return ctx.forbidden();
        }

        // Concurrently get:
        // 1. emissionEntries for reportingPeriod and locale, populated with emissions
        // 2. ordered emissionCategories, populated with emissionSources

        const getEmissionEntries: EmissionEntry[] | undefined = strapi
          .service("api::emission-entry.emission-entry")
          ?.findWithEmissions(reportingPeriod, locale);

        if (!getEmissionEntries)
          throw new ApplicationError("emission getter not available");

        const getEmissionCategories: EmissionCategory[] | undefined = strapi
          .service("api::emission-category.emission-category")
          ?.findOrdered(locale);

        if (!getEmissionCategories)
          throw new ApplicationError("emission category getter not available");

        const [emissionEntries, emissionCategories] = await Promise.all([
          getEmissionEntries,
          getEmissionCategories,
        ]);

        // Group the calculated emissions by emission source

        const emissionsBySource = emissionEntries.reduce<{
          [key: string]: Emissions;
        }>((acc, entry) => {
          const esid = entry.emissionSource?.id;

          if (!esid)
            throw new ApplicationError(
              "emission source id could not be determined"
            );

          const { emissions } = entry;

          if (!emissions)
            throw new ApplicationError("no emissions found from entry");

          return {
            ...acc,
            [esid]: acc[esid]
              ? {
                  direct: (acc[esid]?.direct ?? 0) + (emissions.direct ?? 0),
                  indirect:
                    (acc[esid]?.indirect ?? 0) + (emissions.indirect ?? 0),
                  biogenic:
                    (acc[esid]?.biogenic ?? 0) + (emissions.biogenic ?? 0),
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
          if (!Array.isArray(category.emissionSources))
            throw new ApplicationError("emission sources not available");

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
