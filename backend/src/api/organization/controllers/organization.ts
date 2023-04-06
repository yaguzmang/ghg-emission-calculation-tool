/**
 * organization controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::organization.organization",
  ({ strapi }) => ({
    async find(ctx) {
      // List only the authenticated user's own organizations

      const { data, meta } = await super.find(ctx);
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        ctx.state.user.id,
        {
          populate: { organizations: true },
        }
      );
      const ownOrganizationIds = user.organizations.map((org) => org.id);
      const filteredData = data.filter((org) =>
        ownOrganizationIds.includes(org.id)
      );

      return { data: filteredData, meta };
    },
  })
);
