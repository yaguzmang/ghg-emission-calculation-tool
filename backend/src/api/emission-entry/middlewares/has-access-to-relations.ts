/**
 * `has-access-to-relations` middleware
 */

import { Strapi } from "@strapi/strapi";

const capitalize = (str: string): string => {
  if (str.length < 1) return str;
  return str[0].toUpperCase() + str.slice(1);
};

const apiNameToCamelCase = (apiName: string): string => {
  const parts = apiName.split("-");
  return parts.reduce((prev, curr) => {
    return prev + capitalize(curr);
  });
};

const apiNameToStrapiUid = (apiName: string): string => {
  return `api::${apiName}.${apiName}`;
};

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    if (!ctx.request.body.data) {
      // Missing data payload will be caught by validator
      return await next();
    }

    const requiredRelations = ["organization-unit", "reporting-period"];

    for (const key of requiredRelations) {
      const camelCaseKey = apiNameToCamelCase(key);
      const relationId = ctx.request.body.data[camelCaseKey];

      // Require the relation when creating a new entry.
      if (ctx.method === "POST" && !relationId) {
        return ctx.badRequest(
          `Missing "${camelCaseKey}" payload in the request body`
        );
      }

      // Bypass checks if not updating this relation.
      if (ctx.method === "PUT" && !relationId) {
        continue;
      }

      const uid = apiNameToStrapiUid(key);

      if (
        !(await strapi
          .service(uid)
          .isAllowedForUser(relationId, ctx.state.user.id))
      ) {
        return ctx.forbidden(`Forbidden "${camelCaseKey}"`);
      }
    }

    await next();
  };
};
