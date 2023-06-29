/**
 * reporting-period controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { EmissionEntryService } from "../../emission-entry/services/emission-entry";
import { EmissionCategoryService } from "../../emission-category/services/emission-category";
import { EmissionEntry, Emissions } from "../../emission-entry";
import { validate } from "../../../services/utils";
import { ReportingPeriod } from "..";
import { EmissionCategory } from "../../emission-category";

const { ApplicationError, ValidationError } = utils.errors;

export default factories.createCoreController(
  "api::reporting-period.reporting-period",
  ({ strapi }) => ({
    async getEmissions(ctx) {
      const { id: reportingPeriodId } = await validate(
        ctx.params,
        yup.object({
          id: yup.number().required(),
        }),
        ValidationError
      );

      const { locale } = await validate(
        ctx.query,
        yup.object({ locale: yup.string().required() }),
        ValidationError
      );

      // Concurrently get:
      // 1. emissionEntries for reportingPeriod and locale, populated with emissions
      // 2. ordered emissionCategories, populated with emissionSources
      // 3. organization units

      const getEmissionEntries = strapi
        .service<EmissionEntryService>("api::emission-entry.emission-entry")
        ?.findWithEmissions(reportingPeriodId);

      if (!getEmissionEntries)
        throw new ApplicationError("emission getter not available");

      const getEmissionCategories = strapi
        .service<EmissionCategoryService>(
          "api::emission-category.emission-category"
        )
        ?.findOrdered(locale);

      if (!getEmissionCategories)
        throw new ApplicationError("emission category getter not available");

      const getReportingPeriod: Promise<ReportingPeriod | undefined> =
        strapi.entityService.findOne(
          "api::reporting-period.reporting-period",
          reportingPeriodId,
          {
            populate: {
              organization: {
                populate: "organizationUnits",
              },
            },
          }
        );

      const [emissionEntries, emissionCategories, reportingPeriod] =
        await Promise.all([
          getEmissionEntries,
          getEmissionCategories,
          getReportingPeriod,
        ]);

      const organizationUnits =
        reportingPeriod?.organization?.organizationUnits;

      if (!organizationUnits)
        throw new ApplicationError("organization units not found");

      // Group the emission entries by organization unit

      const entriesByUnit = emissionEntries.reduce<{
        [key: string]: EmissionEntry[];
      }>((acc, entry) => {
        const key = entry.organizationUnit?.id?.toString();

        if (!key) return acc;

        const existing = acc[key] ?? [];

        return {
          ...acc,
          [key]: [...existing, entry],
        };
      }, {});

      const emissionsByUnitAndSource = Object.fromEntries(
        Object.entries(entriesByUnit).map(([key, entries]) => {
          // Group the calculated emissions by emission source
          const emissionsBySource = entries.reduce<{
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

          // Populate the calculated emissions to emission categories
          const categoriesWithEmissions: EmissionCategory[] = emissionCategories
            .map((category) => {
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
            })
            .filter(({ emissions: { direct, indirect, biogenic } }) => {
              return [direct, indirect, biogenic].some((val) => val > 0);
            });

          type ScopedEmissionCategory = Pick<
            EmissionCategory,
            "id" | "title" | "emissions" | "primaryScope" | "color"
          >;

          // Group the emission categories and their emissions by scope
          const emissionsByScopeAndCategory = categoriesWithEmissions.reduce<{
            scope1: ScopedEmissionCategory[];
            scope2: ScopedEmissionCategory[];
            scope3: ScopedEmissionCategory[];
            biogenic: ScopedEmissionCategory[];
          }>(
            (acc, category) => {
              const { primaryScope, emissions, id, title, color } = category;
              const { direct, indirect, biogenic } = emissions as Emissions;
              const scope1Emissions =
                (primaryScope === 1 && Number(direct) > 0 && direct) || 0;
              const scope2Emissions =
                (primaryScope === 2 && Number(direct) > 0 && direct) || 0;
              const scope3Emissions =
                ((primaryScope === 3 && Number(direct) > 0 && direct) || 0) +
                (indirect ?? 0);
              const biogenicEmissions = biogenic ?? 0;

              const strippedCategory = { id, title, primaryScope, color };

              return {
                scope1: scope1Emissions
                  ? [
                      ...acc.scope1,
                      { ...strippedCategory, emissions: scope1Emissions },
                    ]
                  : acc.scope1,
                scope2: scope2Emissions
                  ? [
                      ...acc.scope2,
                      { ...strippedCategory, emissions: scope2Emissions },
                    ]
                  : acc.scope2,
                scope3: scope3Emissions
                  ? [
                      ...acc.scope3,
                      { ...strippedCategory, emissions: scope3Emissions },
                    ]
                  : acc.scope3,
                biogenic: biogenicEmissions
                  ? [
                      ...acc.biogenic,
                      { ...strippedCategory, emissions: biogenicEmissions },
                    ]
                  : acc.biogenic,
              };
            },
            { scope1: [], scope2: [], scope3: [], biogenic: [] }
          );

          return [key, emissionsByScopeAndCategory];
        })
      );

      // Populate the scoped emissions to organization units
      const unitsWithEmissions = organizationUnits.map((unit) => {
        return {
          ...unit,
          emissions: emissionsByUnitAndSource[unit.id],
        };
      });

      return {
        data: unitsWithEmissions,
      };
    },
  })
);
