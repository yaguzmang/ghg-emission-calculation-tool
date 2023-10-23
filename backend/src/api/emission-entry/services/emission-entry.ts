/**
 * emission-entry service
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import { EmissionEntry } from "..";
import { Json } from "../../emission-factor-datum/services/emission-factor-datum";
import { AuthorizedService } from "../../api.types";
import { EmissionFactorDatum } from "../../emission-factor-datum";

export type EmissionEntryService = AuthorizedService & {
  findWithEmissions(
    reportingPeriodId: number,
    locale?: string
  ): Promise<EmissionEntry[]>;
};

const { ApplicationError } = utils.errors;

export default factories.createCoreService(
  "api::emission-entry.emission-entry",
  ({ strapi }) => ({
    /**
     * Check whether an emission entry is allowed for a given user
     * @param emissionEntryId The id of the emission entry to check
     * @param userId The id of the user to check
     * @returns Promise<boolean>
     */
    async isAllowedForUser(emissionEntryId, userId) {
      const user = await strapi.entityService?.findOne(
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

      if (!user?.organizations) return false;

      const ownEmissionEntries = user.organizations.flatMap((org) =>
        org?.organizationUnits?.flatMap((unit) => unit.emissionEntries)
      );

      return ownEmissionEntries.some((unit) => unit?.id === emissionEntryId);
    },

    /**
     * Find emission entries of a reportingPeriod and populate with their emissions
     * @param reportingPeriodId The id of the reporting period whose entries to find
     * @param locale The locale of the emission factor data to use, defaults to "en"
     * @returns Promise<EmissionEntry[]>
     */
    async findWithEmissions(reportingPeriodId, locale = "en") {
      // Concurrently perform the following:
      // 1. Find the emissionEntries of the reportingPeriod
      // 2. Find emissionFactorDatum for the reportingPeriod and locale

      const getEmissionEntries = strapi.entityService?.findMany(
        "api::emission-entry.emission-entry",
        {
          filters: {
            reportingPeriod: { id: reportingPeriodId },
          },
          populate: [
            "emissionSource",
            "organizationUnit",
            "customEmissionFactorDirect",
            "customEmissionFactorIndirect",
            "customEmissionFactorBiogenic",
          ],
        }
      );

      if (!getEmissionEntries)
        throw new ApplicationError("getEmissionEntries service not available");

      const getEmissionFactorDatum: EmissionFactorDatum | undefined = strapi
        .service("api::emission-factor-datum.emission-factor-datum")
        ?.findOneByReportingPeriod(reportingPeriodId, { locale });

      if (!getEmissionFactorDatum)
        throw new ApplicationError(
          "getEmissionFactorDatum service not available"
        );

      const [emissionEntries, emissionFactorDatum] = await Promise.all([
        getEmissionEntries,
        getEmissionFactorDatum,
      ]);

      // Validate emissionFactorDatum JSON content

      const json: Json | undefined = await strapi
        .service("api::emission-factor-datum.emission-factor-datum")
        ?.validateJson(emissionFactorDatum.json);

      if (!json) throw new ApplicationError("json not validated");

      // Calculate the direct, indirect and biogenic emissions of each emission entry
      // Priority of emission factors:
      // 1. Custom emission factor
      // 2. Predetermined emission factor
      // 3. Zero (if neither custom nor predetermined is available for a given entry)

      const entriesWithEmissions = emissionEntries.map((entry) => {
        const q = entry.quantity;
        const apiId = entry.emissionSource?.apiId;

        if (!apiId) throw new ApplicationError("apiId could not be determined");

        const f = json.emission_sources[apiId]?.factors;
        const cf = {
          direct: entry.customEmissionFactorDirect,
          indirect: entry.customEmissionFactorIndirect,
          biogenic: entry.customEmissionFactorBiogenic,
        };

        const emissions = {
          direct: q * (cf.direct?.value ?? f?.direct?.value ?? 0),
          indirect: q * (cf.indirect?.value ?? f?.indirect?.value ?? 0),
          biogenic: q * (cf.biogenic?.value ?? f?.biogenic?.value ?? 0),
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
