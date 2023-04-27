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

      const { reportingPeriods } = await strapi.entityService.findOne(
        "api::organization.organization",
        organizationId,
        {
          fields: [],
          populate: { reportingPeriods: true },
        }
      );

      return { data: reportingPeriods };
    },
  })
);
