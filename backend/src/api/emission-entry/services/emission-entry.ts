/**
 * emission-entry service
 */

import { factories } from "@strapi/strapi";
import { GenericService } from "@strapi/strapi/lib/core-api/service";
import * as yup from "yup";
import { EmissionEntry } from "..";
import { EmissionFactorDatumService } from "../../emission-factor-datum/services/emission-factor-datum";

export type EmissionEntryService = GenericService & {
  isAllowedForUser(emissionEntryId: number, userId: number): Promise<boolean>;
  findWithEmissions(
    reportingPeriodId: number,
    locale: string
  ): Promise<EmissionEntry[]>;
};

export default factories.createCoreService<EmissionEntryService>(
  "api::emission-entry.emission-entry",
  ({ strapi }) => ({
    /**
     * Check whether an emission entry is allowed for a given user
     * @param emissionEntryId The id of the emission entry to check
     * @param userId The id of the user to check
     * @returns Promise<boolean>
     */
    async isAllowedForUser(emissionEntryId, userId) {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          fields: [],
          populate: {
            organizations: {
              populate: {
                organizationUnits: { populate: { emissionEntries: true } },
              },
            },
          },
        }
      );

      const ownEmissionEntries = user.organizations.flatMap((org) =>
        org.organizationUnits.flatMap((unit) => unit.emissionEntries)
      );

      return ownEmissionEntries.some((unit) => unit.id === emissionEntryId);
    },

    /**
     * Find emission entries of a reportingPeriod and populate with their emissions
     * @param reportingPeriodId The id of the reporting period whose entries to find
     * @param locale The locale of the emission factor data to use
     * @returns Promise<EmissionEntry[]>
     */
    async findWithEmissions(reportingPeriodId, locale = "en") {
      // Concurrently perform the following:
      // 1. Find the emissionEntries of the reportingPeriod
      // 2. Find emissionFactorDatum for the reportingPeriod and locale

      const getEmissionEntries: EmissionEntry[] = strapi.entityService.findMany(
        "api::emission-entry.emission-entry",
        {
          filters: {
            reportingPeriod: reportingPeriodId,
          },
          populate: ["emissionSource"],
        }
      );

      const getEmissionFactorDatum = strapi
        .service<EmissionFactorDatumService>(
          "api::emission-factor-datum.emission-factor-datum"
        )
        .findOneByReportingPeriod(reportingPeriodId, { locale });

      const [emissionEntries, emissionFactorDatum] = await Promise.all([
        getEmissionEntries,
        getEmissionFactorDatum,
      ]);

      // Validate emissionFactorDatum JSON content

      const json = await strapi
        .service<EmissionFactorDatumService>(
          "api::emission-factor-datum.emission-factor-datum"
        )
        .validateJson(emissionFactorDatum.json);

      // Calculate the direct, indirect and biogenic emissions of each emission entry
      // If emission factor data is not available for a given entry, default to zero

      const entriesWithEmissions = emissionEntries.map((entry) => {
        const q = entry.quantity;
        const factors =
          json.emission_sources[entry.emissionSource.apiId]?.factors;
        const emissions = {
          direct: q * (factors?.direct?.value ?? 0),
          indirect: q * (factors?.indirect?.value ?? 0),
          biogenic: q * (factors?.biogenic?.value ?? 0),
        };
        return {
          ...entry,
          emissions,
        };
      });

      return entriesWithEmissions;
    },
  })
);
