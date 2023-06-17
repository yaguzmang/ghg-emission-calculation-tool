/**
 * organization-unit service
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { AuthorizedService } from "../../api.types";
import { validate } from "../../../services/utils";
import { OrganizationService } from "../../organization/services/organization";
import { Organization } from "../../organization";

export type OrganizationUnitService = AuthorizedService;

const { ValidationError, ApplicationError } = utils.errors;

export default factories.createCoreService<
  "api::organization-unit.organization-unit",
  OrganizationUnitService
>("api::organization-unit.organization-unit", ({ strapi }) => ({
  async isAllowedForUser(organizationUnitId, userId): Promise<boolean> {
    const user = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        fields: [],
        populate: {
          organizations: { populate: { organizationUnits: true } },
        },
      }
    );

    const ownOrganizationUnits = user.organizations.flatMap(
      (org) => org.organizationUnits
    );

    return ownOrganizationUnits.some((unit) => unit.id === organizationUnitId);
  },

  async create(params: unknown) {
    const paramsSchema = yup.object({
      data: yup.object({
        dividerValues: yup.lazy((val) => {
          const isObject = typeof val === "object" && !Array.isArray(val);
          const valShape = isObject
            ? Object.fromEntries(
                Object.entries(val).map(([key]) => [
                  key,
                  yup.number().required(),
                ])
              )
            : {};
          return yup.object(valShape);
        }),
        organization: yup.number().required(),
      }),
    });

    const {
      data: { dividerValues, ...data },
    } = await validate(params, paramsSchema, ValidationError);

    // If no dividerValues provided, proceed with defaults
    if (!dividerValues) return await super.create(params);

    // For each dividerValues key, make sure the divider belongs to the organization

    const organization: Organization | undefined =
      await strapi.entityService.findOne(
        "api::organization.organization",
        data.organization,
        {
          populate: "organizationDividers",
        }
      );

    if (!organization) throw new ApplicationError("organization not found");

    Object.keys(dividerValues).forEach((key) => {
      const dividerBelongsToOrganization = organization.organizationDividers
        ?.map(({ id }) => id)
        .includes(Number(key));

      if (!dividerBelongsToOrganization)
        throw new ValidationError(
          `divider ${key} does not belong to organization`
        );
    });

    // Convert dividerValues to Strapi array format

    const convertedDividerValues = Object.entries(dividerValues).map(
      ([key, value]) => ({
        organizationDivider: Number(key),
        value,
      })
    );

    const result = await super.create({
      data: {
        ...data,
        dividerValues: convertedDividerValues,
      },
    });

    return result;
  },
}));
