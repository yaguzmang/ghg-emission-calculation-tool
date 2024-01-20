/**
 * `has-access-to-relations` middleware
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import type { Context, Next } from "koa";
import "koa-body"; // for module augmentation

const { ValidationError } = utils.errors;

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

const apiNameToStrapiUid = (apiName: string): `api::${string}.${string}` => {
  return `api::${apiName}.${apiName}`;
};

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx: Context, next: Next) => {
    if (!ctx.request.body) {
      throw new ValidationError("Empty body");
    }

    const body = Array.isArray(ctx.request.body)
      ? ctx.request.body
      : [ctx.request.body];

    for (const payload of body) {
      if (!payload.data) {
        // Missing data payload will be caught by validator
        return await next();
      }

      const requiredRelations = ["organization-unit", "reporting-period"];

      for (const key of requiredRelations) {
        const camelCaseKey = apiNameToCamelCase(key);
        const relationId = payload.data[camelCaseKey];

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
            ?.isAllowedForUser(relationId, ctx.state.user.id))
        ) {
          return ctx.forbidden(`Forbidden '${camelCaseKey}' ${relationId}`);
        }
      }
    }

    await next();
  };
};
