/**
 * organization-unit service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::organization-unit.organization-unit",
  ({ strapi }) => ({
    async isAllowedForUser(
      organizationUnitId: number,
      userId: number
    ): Promise<boolean> {
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

      return ownOrganizationUnits.some(
        (unit) => unit.id === organizationUnitId
      );
    },
  })
);
