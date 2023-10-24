/**
 * emission-factor-datum service
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { parse, format } from "date-fns";
import { EmissionFactorDatum } from "..";
import { ReportingPeriod } from "../../reporting-period";
import { validate } from "../../../services/utils";

const dataSourceSchema = yup.object({
  description: yup.string(),
  url: yup.string(),
});

const factorSchema = yup.object({
  value: yup.number(),
  data_source: dataSourceSchema,
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

export type EmissionFactorDataSource = yup.InferType<typeof dataSourceSchema>;

type JsonEmissionSourceValue = yup.InferType<typeof emissionSourceValueSchema>;

export interface Json {
  emission_sources: {
    [key: string]: JsonEmissionSourceValue;
  };
}

export type EmissionFactorDatumService = {
  findOneByReportingPeriod(
    reportingPeriodId: number,
    params?: object
  ): Promise<EmissionFactorDatum>;
  validateJson(json: unknown): Promise<Json>;
};

const { ApplicationError, NotFoundError } = utils.errors;

export default factories.createCoreService<
  "api::emission-factor-datum.emission-factor-datum",
  EmissionFactorDatumService
>("api::emission-factor-datum.emission-factor-datum", ({ strapi }) => ({
  /**
   * Find the most recently updated emissionDatum entry for a reportingPeriod
   * @param reportingPeriodId The id of the reportingPeriod
   * @param params Additional params to pass to the Entity Service API
   * @returns Promise<EmissionFactorDatum>
   */
  async findOneByReportingPeriod(reportingPeriodId, params = {}) {
    // Determine emission factor dataset based on reporting period

    const reportingPeriod = (await strapi.entityService?.findOne(
      "api::reporting-period.reporting-period",
      reportingPeriodId,
      {
        populate: { organization: { populate: ["emissionFactorDataset"] } },
      }
    )) as ReportingPeriod | undefined;

    if (!reportingPeriod) {
      throw new NotFoundError("reporting period not found");
    }

    const { organization, endDate: endDateValue } = reportingPeriod;

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

    const endDateString = String(endDateValue);
    const endDate = parse(endDateString, "y-MM-dd", new Date());
    const year = format(endDate, "y");

    // Find emission factor data that match the dataset and year

    const emissionFactorData = (await strapi.entityService?.findMany(
      "api::emission-factor-datum.emission-factor-datum",
      {
        filters: {
          dataset: emissionFactorDataset,
          year,
        },
        sort: { updatedAt: "desc" },
        ...params,
      }
    )) as EmissionFactorDatum[] | undefined;

    if (!emissionFactorData || emissionFactorData.length < 1) {
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

    const validatedJson = (await validate(
      json,
      jsonSchema,
      ApplicationError
    )) as Json;

    return validatedJson;
  },
}));
