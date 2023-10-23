/**
 * `has-access-to-relations` middleware
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";

const { ValidationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const relationSchema = yup.object({
      data: yup.object({
        organization: yup.number().required(),
      }),
    });

    const {
      data: { organization },
    } = await validate(ctx.request.body, relationSchema, ValidationError);

    if (ctx.request.body.data.emissionEntries)
      return ctx.forbidden("emissionEntries mutation forbidden");

    const userHasAccessToOrganization: boolean | undefined = await strapi
      .service("api::organization.organization")
      ?.isAllowedForUser(organization, ctx.state.user.id);

    if (!userHasAccessToOrganization)
      return ctx.forbidden("forbidden organization id");

    await next();
  };
};
