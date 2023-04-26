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
      const ownOrganizationIds = await strapi
        .service("api::organization.organization")
        .findForUser(ctx.state.user.id);
      const filteredData = data.filter((org) =>
        ownOrganizationIds.includes(org.id)
      );

      return { data: filteredData, meta };
    },

    async findReportingPeriods(ctx) {
      const organizationId = Number(ctx.params.id);

      if (Number.isNaN(organizationId) || organizationId < 1) {
        ctx.response.status = 400;
        ctx.response.message = "Organization ID must be a positive integer";
        return;
      }

      const isAllowed = await strapi
        .service("api::organization.organization")
        .isAllowedForUser(organizationId, ctx.state.user.id);

      if (!isAllowed) {
        ctx.response.status = 403;
        return;
      }

      const { organizationUnits } = await strapi.entityService.findOne(
        "api::organization.organization",
        organizationId,
        {
          fields: [],
          populate: { organizationUnits: true },
        }
      );

      return organizationUnits;
    },
  })
);
