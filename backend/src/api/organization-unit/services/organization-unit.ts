/**
 * organization-unit service
 */

import { factories } from "@strapi/strapi";
import { AuthorizedService } from "../../api.types";

export type OrganizationUnitService = AuthorizedService;

export default factories.createCoreService<
  "api::organization-unit.organization-unit",
  OrganizationUnitService
>("api::organization-unit.organization-unit", ({ strapi }) => ({
  async isAllowedForUser(organizationUnitId, userId): Promise<boolean> {
    const user = await strapi.entityService?.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        fields: [],
        populate: {
          organizations: { populate: { organizationUnits: true } },
        },
      }
    );

    const ownOrganizationUnits = user?.organizations?.flatMap(
      (org) => org.organizationUnits
    );

    return (
      ownOrganizationUnits?.some((unit) => unit?.id === organizationUnitId) ||
      false
    );
  },
}));
