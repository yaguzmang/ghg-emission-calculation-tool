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

    async findWithEmissions(reportingPeriodId, locale = "en") {
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

      const json = await strapi
        .service<EmissionFactorDatumService>(
          "api::emission-factor-datum.emission-factor-datum"
        )
        .validateJson(emissionFactorDatum.json);

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
