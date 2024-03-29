/**
 * `has-access` middleware
 *
 * Checks that the user has access to the requested entry
 */

import { Strapi } from "@strapi/strapi";

/**
 * has-access middleware
 *
 * @param config.uid {string} The uid of the content type to check access rights for
 */
export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const entryId = Number(ctx.params.id);
    const userId = ctx.state.user.id;

    const isAllowed: boolean = await strapi
      .service(config.uid)
      ?.isAllowedForUser(entryId, userId);

    if (!isAllowed) {
      return ctx.forbidden();
    }

    await next();
  };
};
