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

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => {
    return {
      async findWithEmissions(ctx) {
        const querySchema = yup.object({
          locale: yup.string().required(),
          reportingPeriod: yup.number().required(),
        });

        const { locale, reportingPeriod } = await validate(
          ctx.query,
          querySchema,
          utils.errors.ValidationError
        );

        // 1a. Get emission entries with emissions for reporting period

        const getEmissionEntries = strapi
          .service<EmissionEntryService>("api::emission-entry.emission-entry")
          .findWithEmissions(reportingPeriod, locale);

        // 1b. Get all emission categories populated with emissionSources

        const getEmissionCategories = strapi
          .service<EmissionCategoryService>(
            "api::emission-category.emission-category"
          )
          .findOrdered(locale);

        const [emissionEntries, emissionCategories] = await Promise.all([
          getEmissionEntries,
          getEmissionCategories,
        ]);

        // 2. Group the calculated emissions by emission source

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

        // 3. For each emissionCategory (from 1b), calculate its direct, indirect and biogenic emissions

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
