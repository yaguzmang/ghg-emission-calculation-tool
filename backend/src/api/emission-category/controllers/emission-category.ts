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

const { ValidationError } = utils.errors;

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => {
    return {
      async findOneWithEmissionFactors(ctx) {
        const paramsSchema = yup.object({
          id: yup.number().required(),
        });
        const { id } = await validate(
          ctx.params,
          paramsSchema,
          ValidationError
        );

        console.log(id);
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
          .service("api::reporting-period.reporting-period")
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
