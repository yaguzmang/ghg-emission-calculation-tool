/**
 * `validate-divider-values` middleware
 *
 * Validate dividerValues in the request payload
 */

import { Strapi } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";

const { ValidationError, ApplicationError } = utils.errors;

const getUnitOrganization = async (organizationUnitId: number) => {
  const organizationUnit = await strapi.entityService.findOne(
    "api::organization-unit.organization-unit",
    organizationUnitId,
    {
      populate: {
        organization: {
          populate: "organizationDividers",
        },
      },
    }
  );

  return organizationUnit?.organization;
};

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const isPost = ctx.method === "POST";

    const bodySchema = yup.object({
      data: yup.object({
        organization: isPost ? yup.number().required() : yup.number().oneOf([]),
        dividerValues: yup.array().of(
          yup.object({
            organizationDivider: yup.number().required(),
            value: yup.number().required(),
          })
        ),
      }),
    });

    const paramsSchema = yup.object({
      id: isPost ? yup.number().oneOf([]) : yup.number().required(),
    });

    const [
      {
        data: { organization: organizationId, dividerValues },
      },
      { id: organizationUnitId },
    ] = await Promise.all([
      validate(ctx.request.body, bodySchema, ValidationError),
      validate(ctx.params, paramsSchema, ValidationError),
    ]);

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

      const organization = isPost
        ? await strapi.entityService?.findOne(
            "api::organization.organization",
            organizationId as number,
            {
              populate: "organizationDividers",
            }
          )
        : await getUnitOrganization(organizationUnitId as number);

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
