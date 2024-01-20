/**
 * emission-entry controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import type { Context } from "koa";
import "koa-body"; // for module augmentation
import fs from "fs";
import Papa from "papaparse";
import * as yup from "yup";
import { ReportingPeriodService } from "../../reporting-period/services/reporting-period";
import { validate } from "../../../services/utils";

const { ValidationError, ApplicationError, UnauthorizedError, ForbiddenError } =
  utils.errors;

const entrySchema = yup
  .array()
  .required()
  .of(
    yup.object({
      organizationUnit: yup.string().required(),
      emissionSource: yup.string().required(),
      quantity: yup.number().required(),
      tier: yup.number().required(),
      quantitySource: yup.string().nullable(),
    })
  );

export default factories.createCoreController(
  "api::emission-entry.emission-entry",
  ({ strapi }) => ({
    async importCSV(ctx: Context) {
      const userId = Number(ctx.state.user?.id);
      if (Number.isNaN(userId))
        throw new UnauthorizedError("Missing or invalid authorization");

      if (!ctx.is("multipart"))
        throw new ValidationError("Request must be multipart");

      const bodySchema = yup.object({
        reportingPeriod: yup.number().required(),
      });

      const { reportingPeriod: reportingPeriodId } = await validate(
        ctx.request.body,
        bodySchema,
        ValidationError
      );

      if (
        !(await (
          strapi.service(
            "api::reporting-period.reporting-period"
          ) as ReportingPeriodService
        ).isAllowedForUser(reportingPeriodId, userId))
      )
        throw new ForbiddenError("Forbidden reporting period");

      const files = ctx.request.files?.file;

      if (files == undefined) throw new ValidationError("'file' is required");

      const file = Array.isArray(files) ? files[0] : files;

      if (file.type !== "text/csv")
        throw new ValidationError("'file' type must be csv");

      const fileContents = fs.readFileSync(file.path, "utf8");

      // Parse CSV file
      const { data, errors } = Papa.parse(fileContents, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });

      if (errors.length > 0) throw new ValidationError(errors.toString());

      const validatedData = await validate(data, entrySchema, ValidationError);

      const organizationUnits = new Set(
        validatedData.map((_) => _.organizationUnit)
      );

      const populatedData = await Promise.all(
        validatedData.map((entry) => {
          const { emissionSource, ...emissionEntry } = entry;
          const req = strapi.entityService?.findMany(
            "api::emission-source.emission-source",
            { filters: { apiId: emissionSource } }
          );

          if (!req) throw new ApplicationError("Entity service not available");

          return req.then((emissionSources) => {
            if (emissionSources.length < 1)
              throw new ValidationError(
                `Unknown emission source "${emissionSource}"`
              );

            const { id } = emissionSources[0];

            return {
              ...emissionEntry,
              emissionSource: id,
              reportingPeriod: reportingPeriodId,
            };
          });
        })
      );

      return {
        data: populatedData,
        organizationUnitKeys: [...organizationUnits],
      };
    },

    async batchCreate(ctx) {
      const res = await Promise.allSettled(
        ctx.request.body.map((payload) => {
          return strapi.entityService?.create(
            "api::emission-entry.emission-entry",
            payload
          );
        })
      );
      return res;
    },
  })
);
