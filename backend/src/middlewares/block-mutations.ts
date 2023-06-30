/**
 * `block-mutations` middleware
 *
 * A reusable middleware for blocking certain properties of an entry being mutated
 */

import { Strapi } from "@strapi/strapi";
import * as yup from "yup";

export default (config: unknown, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const configSchema = yup.object({
      blockedProperties: yup.array().of(yup.string().required()).required(),
    });

    const { blockedProperties } = await configSchema.validate(config);

    const data = ctx.request.body?.data;

    if (!data) {
      // Nothing to block so pass on
      await next();
      return;
    }

    const blockedProp = blockedProperties.find((prop) => data[prop]);

    if (blockedProp)
      return ctx.badRequest(
        `unallowed property "${blockedProp}" found in the request body`
      );

    await next();
  };
};
