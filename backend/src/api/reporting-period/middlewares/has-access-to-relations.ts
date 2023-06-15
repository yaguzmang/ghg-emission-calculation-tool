/**
 * `has-access-to-relations` middleware
 */

import { Strapi } from "@strapi/strapi";
import * as yup from "yup";

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In has-access-to-relations middleware.");

    const relationSchema = yup.object({
      data: yup.object({
        organization: yup.number().required(),
      }),
    });

    await next();
  };
};
