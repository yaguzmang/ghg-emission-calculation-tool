/**
 * `validate-divider-values` middleware
 *
 * Validate dividerValues in the request payload
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";
import { Organization } from "../../organization";

const { ValidationError, ApplicationError } = utils.errors;

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const bodySchema = yup.object({
      data: yup.object({
        organization: yup.number().required(),
        dividerValues: yup.array().of(
          yup.object({
            organizationDivider: yup.number().required(),
            value: yup.number().required(),
          })
        ),
      }),
    });

    const {
      data: { organization: organizationId, dividerValues },
    } = await validate(ctx.request.body, bodySchema, ValidationError);

    if (dividerValues) {
      // Check that each divider is used at most once

      dividerValues.reduce<number[]>((ids, { organizationDivider }) => {
        if (ids.includes(organizationDivider))
          throw new ValidationError(
            `organizationDivider ${organizationDivider} is used more than once`
          );

        return [...ids, organizationDivider];
      }, []);

      // Check that each divider belongs to the organization

      const organization: Organization | undefined =
        await strapi.entityService.findOne(
          "api::organization.organization",
          organizationId,
          {
            populate: "organizationDividers",
          }
        );

      if (!organization) throw new ApplicationError("organization not found");

      dividerValues.forEach(({ organizationDivider }) => {
        const dividerBelongsToOrganization = organization.organizationDividers
          ?.map(({ id }) => id)
          .includes(organizationDivider);

        if (!dividerBelongsToOrganization)
          throw new ValidationError(
            `organizationDivider ${organizationDivider} does not belong to organization`
          );
      });
    }

    await next();
  };
};
