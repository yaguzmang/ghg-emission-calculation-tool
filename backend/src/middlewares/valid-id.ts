/**
 * `valid-id` middleware
 *
 * Validates that a route has a parameter `id` that is a valid Strapi ID
 */

import { Strapi } from "@strapi/strapi";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const id = Number(ctx.params.id);

    if (Number.isNaN(id) || id < 1) {
      return ctx.badRequest("Organization ID must be a positive integer");
    }

    await next();
  };
};
