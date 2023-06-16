/**
 * `has-access-to-relations` middleware
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";
import { OrganizationService } from "../../organization/services/organization";

const { ValidationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In has-access-to-relations middleware.");

    const relationSchema = yup.object({
      data: yup.object({
        organization: yup.number().required(),
      }),
    });

    const {
      data: { organization },
    } = await validate(ctx.request.body, relationSchema, ValidationError);

    const userHasAccessToOrganization = await strapi
      .service<OrganizationService>("api::organization.organization")
      ?.isAllowedForUser(organization, ctx.state.user.id);

    if (!userHasAccessToOrganization)
      return ctx.forbidden("forbidden organization id");

    await next();
  };
};
