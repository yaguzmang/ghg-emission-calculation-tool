/**
 * emission-factor-datum service
 */

import { factories } from "@strapi/strapi";
import { GenericService } from "@strapi/strapi/lib/core-api/service";
import utils from "@strapi/utils";
import * as yup from "yup";
import { parse, format } from "date-fns";
import { EmissionFactorDatum } from "..";
import { ReportingPeriod } from "../../reporting-period";

const factorSchema = yup.object({
  value: yup.number(),
  data_source: yup.object({
    description: yup.string(),
    url: yup.string(),
  }),
});

const emissionSourceValueSchema = yup.object({
  label: yup.string().required(),
  unit: yup.string().required(),
  factors: yup.object({
    direct: factorSchema,
    indirect: factorSchema,
    biogenic: factorSchema,
  }),
});

type JsonEmissionSourceValue = yup.InferType<typeof emissionSourceValueSchema>;

interface Json {
  emission_sources: {
    [key: string]: JsonEmissionSourceValue;
  };
}

export type EmissionFactorDatumService = GenericService & {
  findOneByReportingPeriod(
    reportingPeriodId: number,
    params: object
  ): Promise<EmissionFactorDatum>;
  validateJson(json: unknown): Promise<Json>;
};

const { ApplicationError, NotFoundError } = utils.errors;

export default factories.createCoreService<EmissionFactorDatumService>(
  "api::emission-factor-datum.emission-factor-datum",
  ({ strapi }) => ({
    /**
     * Find the most recently updated emissionDatum entry for a reportingPeriod
     * @param reportingPeriodId The id of the reportingPeriod
     * @param params Additional params to pass to the Entity Service API
     * @returns Promise<EmissionFactorDatum>
     */
    async findOneByReportingPeriod(reportingPeriodId, params) {
      // Determine emission factor dataset based on reporting period

      const reportingPeriod: ReportingPeriod =
        await strapi.entityService.findOne(
          "api::reporting-period.reporting-period",
          reportingPeriodId,
          {
            populate: { organization: { populate: ["emissionFactorDataset"] } },
          }
        );

      if (!reportingPeriod) {
        throw new NotFoundError("reporting period not found");
      }

      const { organization, endDate: endDateString } = reportingPeriod;

      if (!organization) {
        throw new ApplicationError(
          "no organization assigned to reporting period"
        );
      }

      const { emissionFactorDataset } = organization;

      if (!emissionFactorDataset) {
        throw new ApplicationError(
          "no emission factor dataset assigned to organization"
        );
      }

      // Determine emission factor year based on the end date

      const endDate = parse(endDateString, "y-MM-dd", new Date());
      const year = format(endDate, "y");

      // Find emission factor data that match the dataset and year

      const emissionFactorData: EmissionFactorDatum[] =
        await strapi.entityService.findMany(
          "api::emission-factor-datum.emission-factor-datum",
          {
            filters: {
              dataset: emissionFactorDataset,
              year,
            },
            sort: { updatedAt: "desc" },
            ...params,
          }
        );

      if (emissionFactorData.length < 1) {
        throw new NotFoundError("emission factor data not found");
      }

      // Return the most recently updated emission factor datum

      return emissionFactorData[0];
    },

    /**
     * Validate emission factor datum JSON content
     * @param json Emission factor datum JSON to validate
     * @returns Validated JSON
     */
    async validateJson(json) {
      const jsonSchema = yup.object({
        emission_sources: yup.lazy((obj) => {
          if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
            return yup.object().required();
          }
          const entries = Object.entries(obj).map(([key]) => {
            return [key, emissionSourceValueSchema];
          });

          return yup.object(Object.fromEntries(entries));
        }),
      });

      const validatedJson = (await jsonSchema.validate(json)) as Json;

      return validatedJson;
    },
  })
);
