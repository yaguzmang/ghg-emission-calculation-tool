/**
 * reporting-period controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { EmissionEntryService } from "../../emission-entry/services/emission-entry";
import { EmissionCategoryService } from "../../emission-category/services/emission-category";
import { EmissionEntry, EmissionsAndAccuracies } from "../../emission-entry";
import { validate } from "../../../services/utils";
import { ReportingPeriod } from "..";
import { EmissionCategory } from "../../emission-category";

const { ApplicationError, ValidationError } = utils.errors;

/**
 * Combine two EmissionsAndAccuracies objects
 * @param ea1 {EmissionsAndAccuracies} 1
 * @param ea2 {EmissionsAndAccuracies} 2
 * @returns {EmissionsAndAccuracies}
 */
const combineEmissionsAndAccuracies = (
  ea1: EmissionsAndAccuracies | undefined,
  ea2: EmissionsAndAccuracies | undefined
): EmissionsAndAccuracies => {
  const emissionTypes = ["direct", "indirect", "biogenic"] as const;

  const EmissionsAndAccuraciesEntries = emissionTypes.map((type) => {
    const ea1Emissions = ea1?.[type]?.emissions ?? 0;
    const ea1Accuracy = ea1?.[type]?.accuracy ?? 0;
    const ea2Emissions = ea2?.[type]?.emissions ?? 0;
    const ea2Accuracy = ea2?.[type]?.accuracy ?? 0;
    const newEmissions = ea1Emissions + ea2Emissions;
    const newAccuracy =
      newEmissions > 0
        ? (ea1Emissions / newEmissions) * ea1Accuracy +
          (ea2Emissions / newEmissions) * ea2Accuracy
        : 0;

    return [type, { emissions: newEmissions, accuracy: newAccuracy }];
  });

  return Object.fromEntries(EmissionsAndAccuraciesEntries);
};

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
            [key: string]: EmissionsAndAccuracies;
          }>((acc, entry) => {
            const esid = entry.emissionSource?.id;

            if (!esid)
              throw new ApplicationError(
                "emission source id could not be determined"
              );

            const { emissions, tier } = entry;

            if (!emissions)
              throw new ApplicationError("no emissions found from entry");

            const entryEmissionsAndAccuracies: EmissionsAndAccuracies =
              Object.fromEntries(
                Object.entries(emissions).map(([key, emissionEntry]) => {
                  const emissionEntryWithAccuracies = {
                    emissions: emissionEntry,
                    accuracy: tier,
                  };
                  return [key, emissionEntryWithAccuracies];
                })
              );

            return {
              ...acc,
              [esid]: combineEmissionsAndAccuracies(
                acc[esid],
                entryEmissionsAndAccuracies
              ),
            };
          }, {});

          // Populate the calculated emissions to emission categories
          const categoriesWithEmissions: EmissionCategory[] = emissionCategories
            .map((category) => {
              if (!Array.isArray(category.emissionSources))
                throw new ApplicationError("emission sources not available");

              const emissionsAndAccuracies =
                category.emissionSources.reduce<EmissionsAndAccuracies>(
                  (sum, current) => {
                    const cur = emissionsBySource[current.id];
                    return combineEmissionsAndAccuracies(sum, cur);
                  },
                  {
                    direct: { emissions: 0, accuracy: 0 },
                    indirect: { emissions: 0, accuracy: 0 },
                    biogenic: { emissions: 0, accuracy: 0 },
                  }
                );
              return {
                ...category,
                emissions: emissionsAndAccuracies,
              };
            })
            .filter(({ emissions: { direct, indirect, biogenic } }) => {
              return [direct, indirect, biogenic].some(
                (val) => (val?.emissions ?? 0) > 0
              );
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
              const { direct, indirect, biogenic } =
                emissions as EmissionsAndAccuracies;
              const scope1Emissions = (primaryScope === 1 &&
                Number(direct?.emissions) > 0 &&
                direct) || { emissions: 0, accuracy: 0 };
              const scope2Emissions = (primaryScope === 2 &&
                Number(direct?.emissions) > 0 &&
                direct) || { emissions: 0, accuracy: 0 };
              const scope3DirectEmissions = (primaryScope === 3 &&
                Number(direct?.emissions) > 0 &&
                direct) || { emissions: 0, accuracy: 0 };
              const scope3IndirectEmissions = indirect ?? {
                emissions: 0,
                accuracy: 0,
              };
              const scope3TotalEmissions =
                scope3DirectEmissions.emissions +
                scope3IndirectEmissions.emissions;
              const scope3Emissions = {
                emissions: scope3TotalEmissions,
                accuracy:
                  scope3TotalEmissions > 0
                    ? (scope3DirectEmissions.emissions / scope3TotalEmissions) *
                        scope3DirectEmissions.accuracy +
                      (scope3IndirectEmissions.emissions /
                        scope3TotalEmissions) *
                        scope3IndirectEmissions.accuracy
                    : 0,
              };
              const biogenicEmissions = biogenic ?? {
                emissions: 0,
                accuracy: 0,
              };

              const strippedCategory = { id, title, primaryScope, color };

              return {
                scope1: scope1Emissions.emissions
                  ? [...acc.scope1, { ...strippedCategory, ...scope1Emissions }]
                  : acc.scope1,
                scope2: scope2Emissions.emissions
                  ? [...acc.scope2, { ...strippedCategory, ...scope2Emissions }]
                  : acc.scope2,
                scope3: scope3Emissions.emissions
                  ? [...acc.scope3, { ...strippedCategory, ...scope3Emissions }]
                  : acc.scope3,
                biogenic: biogenicEmissions.emissions
                  ? [
                      ...acc.biogenic,
                      { ...strippedCategory, ...biogenicEmissions },
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
        data: { organizationUnits: unitsWithEmissions },
      };
    },
  })
);
