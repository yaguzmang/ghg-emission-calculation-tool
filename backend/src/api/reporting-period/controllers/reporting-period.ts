/**
 * reporting-period controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import {
  EmissionEntry,
  EmissionsAndAccuracies,
  SingleEmissionsAndAccuracy,
} from "../../emission-entry";
import { convertJsonTo, validate } from "../../../services/utils";
import { EmissionCategory } from "../../emission-category";
import { EmissionFactorDatum } from "../../emission-factor-datum";
import {
  EmissionFactorDataSource,
  Json,
} from "../../emission-factor-datum/services/emission-factor-datum";

const { ApplicationError, ValidationError, NotFoundError } = utils.errors;

/**
 * Combine two SingleEmissionsAndAccuracy objects
 * @param ea1 {SingleEmissionsAndAccuracy} 1
 * @param ea2 {SingleEmissionsAndAccuracy} 2
 * @returns {SingleEmissionsAndAccuracy}
 */
const combineSingleEmissionsAndAccuracies = (
  ea1?: SingleEmissionsAndAccuracy,
  ea2?: SingleEmissionsAndAccuracy
): SingleEmissionsAndAccuracy => {
  const ea1Emissions = ea1?.emissions ?? 0;
  const ea1Accuracy = ea1?.accuracy ?? 0;
  const ea2Emissions = ea2?.emissions ?? 0;
  const ea2Accuracy = ea2?.accuracy ?? 0;
  const newEmissions = ea1Emissions + ea2Emissions;
  const newAccuracy =
    newEmissions > 0
      ? (ea1Emissions / newEmissions) * ea1Accuracy +
        (ea2Emissions / newEmissions) * ea2Accuracy
      : 0;

  return {
    emissions: newEmissions,
    accuracy: newAccuracy,
  };
};

/**
 * Combine two scoped EmissionsAndAccuracies objects
 * @param ea1 {EmissionsAndAccuracies} 1
 * @param ea2 {EmissionsAndAccuracies} 2
 * @returns {EmissionsAndAccuracies}
 */
const combineScopedEmissionsAndAccuracies = (
  ea1: EmissionsAndAccuracies | undefined,
  ea2: EmissionsAndAccuracies | undefined
): EmissionsAndAccuracies => {
  const emissionTypes = ["direct", "indirect", "biogenic"] as const;

  const EmissionsAndAccuraciesEntries = emissionTypes.map((type) => {
    return [
      type,
      combineSingleEmissionsAndAccuracies(ea1?.[type], ea2?.[type]),
    ];
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

      const getEmissionEntries: Promise<EmissionEntry[]> | undefined = strapi
        .service("api::emission-entry.emission-entry")
        ?.findWithEmissions(reportingPeriodId);

      if (!getEmissionEntries)
        throw new ApplicationError("emission getter not available");

      const getEmissionCategories: Promise<EmissionCategory[]> | undefined =
        strapi
          .service("api::emission-category.emission-category")
          ?.findOrdered(locale);

      if (!getEmissionCategories)
        throw new ApplicationError("emission category getter not available");

      const getReportingPeriod = strapi.entityService?.findOne(
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
              [esid]: combineScopedEmissionsAndAccuracies(
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
                    return combineScopedEmissionsAndAccuracies(sum, cur);
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
          > & { accuracy: number };

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
              const scope3Emissions = combineSingleEmissionsAndAccuracies(
                scope3DirectEmissions,
                scope3IndirectEmissions
              );
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
          emissions: emissionsByUnitAndSource[unit.id] ?? {
            scope1: [],
            scope2: [],
            scope3: [],
            biogenic: [],
          },
        };
      });

      interface ScopedEmissionsAndAccuracies {
        scope1: SingleEmissionsAndAccuracy;
        scope2: SingleEmissionsAndAccuracy;
        scope3: SingleEmissionsAndAccuracy;
        biogenic: SingleEmissionsAndAccuracy;
      }

      const totalEmissions =
        unitsWithEmissions.reduce<ScopedEmissionsAndAccuracies>(
          (acc, { emissions }) => {
            const types = ["scope1", "scope2", "scope3", "biogenic"] as const;
            const combinedEntries = types.map((type) => {
              const current = emissions[
                type
              ].reduce<SingleEmissionsAndAccuracy>(
                (acc, { emissions: em, accuracy }) => {
                  const emissions = em as number;
                  return combineSingleEmissionsAndAccuracies(acc, {
                    emissions,
                    accuracy,
                  });
                },
                {
                  emissions: 0,
                  accuracy: 0,
                }
              );
              const combinedEntries = combineSingleEmissionsAndAccuracies(
                acc[type],
                current
              );
              return [type, combinedEntries];
            });
            return Object.fromEntries(combinedEntries);
          },
          {
            scope1: { emissions: 0, accuracy: 0 },
            scope2: { emissions: 0, accuracy: 0 },
            scope3: { emissions: 0, accuracy: 0 },
            biogenic: { emissions: 0, accuracy: 0 },
          }
        );

      return {
        data: { totalEmissions, organizationUnits: unitsWithEmissions },
      };
    },

    async exportEmissionEntries(ctx): Promise<string> {
      // Validate request
      const { params, query } = await validate(
        ctx,
        yup.object({
          params: yup.object({
            id: yup.number().required(),
          }),
          query: yup.object({
            as: yup.string().oneOf(["csv"]).required(),
          }),
        }),
        ValidationError
      );

      const reportingPeriod = await strapi.entityService?.findOne(
        "api::reporting-period.reporting-period",
        params.id,
        {
          populate: {
            emissionEntries: {
              populate: {
                organizationUnit: true,
                emissionSource: {
                  populate: {
                    emissionCategory: {
                      populate: {
                        emissionGroup: true,
                      },
                    },
                  },
                },
                customEmissionFactorDirect: true,
                customEmissionFactorIndirect: true,
                customEmissionFactorBiogenic: true,
              },
            },
            organization: {
              populate: {
                emissionFactorDataset: true,
              },
            },
          },
        }
      );

      if (!reportingPeriod)
        throw new NotFoundError("reportingPeriod not found");

      if (!reportingPeriod.emissionEntries)
        throw new ApplicationError("population of emissionEntries failed");

      const datasetId = reportingPeriod.organization?.emissionFactorDataset?.id;

      if (!datasetId) throw new NotFoundError("dataset not found");

      const emissionFactorData: EmissionFactorDatum = await strapi
        .service("api::emission-factor-datum.emission-factor-datum")
        .findOneByReportingPeriod(reportingPeriod.id);
      const json: Json = await strapi
        .service("api::emission-factor-datum.emission-factor-datum")
        .validateJson(emissionFactorData.json);

      // For each emissionEntry, create a row

      const rows = reportingPeriod.emissionEntries.map((emissionEntry) => {
        const emissionSource = emissionEntry.emissionSource;
        const emissionCategory = emissionSource?.emissionCategory;
        const apiId = emissionSource?.apiId;
        const jsonEmissionSourceValue = apiId
          ? json.emission_sources[apiId]
          : undefined;

        const primaryScope = emissionCategory?.primaryScope;

        const directEmissionFactor =
          emissionEntry.customEmissionFactorDirect?.value ??
          jsonEmissionSourceValue?.factors.direct.value;
        const indirectEmissionFactor =
          emissionEntry.customEmissionFactorIndirect?.value ??
          jsonEmissionSourceValue?.factors.indirect.value;
        const biogenicEmissionFactor =
          emissionEntry.customEmissionFactorBiogenic?.value ??
          jsonEmissionSourceValue?.factors.biogenic.value;

        const quantity = emissionEntry.quantity;
        const directEmissions =
          (directEmissionFactor && quantity * directEmissionFactor) || 0;
        const indirectEmissions =
          (indirectEmissionFactor && quantity * indirectEmissionFactor) || 0;
        const biogenicEmissions =
          (biogenicEmissionFactor && quantity * biogenicEmissionFactor) || 0;

        const scope1Emissions = (primaryScope === 1 && directEmissions) || 0;
        const scope2Emissions = (primaryScope === 2 && directEmissions) || 0;
        const scope3DirectEmissions =
          (primaryScope === 3 && directEmissions) || 0;
        const scope3Emissions = scope3DirectEmissions + indirectEmissions;

        const formatSource = (
          source: EmissionFactorDataSource | undefined
        ): string => {
          const description = source?.description;
          const url = source?.url;

          if (description && url) return `[${description}](${url})`;
          if (description) return description;
          if (url) return url;
          return "";
        };

        return {
          organization: reportingPeriod.organization?.name || "",
          organizationUnit: emissionEntry.organizationUnit?.name || "",
          reportingPeriodStartDate: reportingPeriod.startDate || "",
          reportingPeriodEndDate: reportingPeriod.endDate || "",
          primaryScope: emissionCategory?.primaryScope || "",
          emissionGroup: emissionCategory?.emissionGroup?.title || "",
          emissionCategory: emissionCategory?.title || "",
          emissionSource: jsonEmissionSourceValue?.label || "",
          tier: emissionEntry.tier,
          quantity: emissionEntry.quantity,
          unit: jsonEmissionSourceValue?.unit || "",
          quantitySource: emissionEntry.quantitySource || "",

          // Emissions
          emissionsScope1: scope1Emissions,
          emissionsScope2: scope2Emissions,
          emissionsScope3: scope3Emissions,
          emissionsBiogenic: biogenicEmissions,

          // Default emission factors
          defaultEmissionFactorDirectValue:
            jsonEmissionSourceValue?.factors.direct.value || 0,
          defaultEmissionFactorDirectSource: formatSource(
            jsonEmissionSourceValue?.factors.direct.data_source
          ),
          defaultEmissionFactorIndirectValue:
            jsonEmissionSourceValue?.factors.indirect.value || 0,
          defaultEmissionFactorIndirectSource: formatSource(
            jsonEmissionSourceValue?.factors.direct.data_source
          ),
          defaultEmissionFactorBiogenicValue:
            jsonEmissionSourceValue?.factors.biogenic.value || 0,
          defaultEmissionFactorBiogenicSource: formatSource(
            jsonEmissionSourceValue?.factors.biogenic.data_source
          ),

          // Custom emission factors
          customEmissionFactorDirectValue:
            emissionEntry.customEmissionFactorDirect?.value || 0,
          customEmissionFactorDirectSource:
            emissionEntry.customEmissionFactorDirect?.source || "",
          customEmissionFactorIndirectValue:
            emissionEntry.customEmissionFactorIndirect?.value || 0,
          customEmissionFactorIndirectSource:
            emissionEntry.customEmissionFactorIndirect?.source || "",
          customEmissionFactorBiogenicValue:
            emissionEntry.customEmissionFactorBiogenic?.value || 0,
          customEmissionFactorBiogenicSource:
            emissionEntry.customEmissionFactorBiogenic?.source || "",
        };
      });

      // Convert the row to the specified format
      const format = query.as;
      const output = convertJsonTo(rows, format);

      ctx.attachment(
        `emissions_${reportingPeriod.startDate}_${reportingPeriod.endDate}.${format}`
      );
      return output;
    },
  })
);
