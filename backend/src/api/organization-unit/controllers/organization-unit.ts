/**
 * organization-unit controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::organization-unit.organization-unit",
  ({ strapi }) => ({
    async find(ctx) {
      // List only the authenticated user's own organization units

      const { data, meta } = await super.find(ctx);
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          populate: { organizations: true },
        }
      );
      const ownOrganizationIds = user.organizations.map((org) => org.id);
      const filteredData = data.filter((orgUnit) =>
        ownOrganizationIds.includes(orgUnit.attributes.organization.data.id)
      );

      meta.pagination.total = filteredData.length;

      return { data: filteredData, meta };
    },
  })
);
