/**
 * organization-unit controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::organization-unit.organization-unit",
  ({ strapi }) => ({
    async find(ctx) {
      // List only the authenticated user's own organization units

      // Force population to authorize based on associated organization
      ctx.query = {
        ...ctx.query,
        populate: "*",
      };

      const { data, meta } = await super.find(ctx);
      const ownOrganizationIds = await strapi
        .service("api::organization.organization")
        .findForUser(ctx.state.user.id);
      const filteredData = data.filter((orgUnit) =>
        ownOrganizationIds.includes(orgUnit.attributes.organization.data.id)
      );

      meta.pagination.total = filteredData.length;

      return { data: filteredData, meta };
    },
  })
);
