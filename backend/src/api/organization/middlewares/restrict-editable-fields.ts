/**
 * `restrict-editable-fields` middleware
 *
 * Restrict editable fields to a known subset. If the request body's data contains anything else, throw a validation error.
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";

const { ValidationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const bodySchema = yup
      .object({
        data: yup
          .object({
            name: yup.string(),
          })
          .noUnknown(),
      })
      .strict();

    const body = await validate(ctx.request.body, bodySchema, ValidationError);

    await next();
  };
};
