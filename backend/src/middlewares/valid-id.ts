/**
 * `valid-id` middleware
 *
 * Validates that a route has a parameter `id` that is a valid Strapi ID
 */

import { Strapi } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    const id = Number(ctx.params.id);

    if (Number.isNaN(id) || id < 1) {
      ctx.response.status = 400;
      ctx.response.message = "Organization ID must be a positive integer";
      return;
    }

    await next();
  };
};
