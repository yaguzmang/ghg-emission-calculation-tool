/**
 * organization controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import { OrganizationService } from "../services/organization";

const { ApplicationError } = utils.errors;

export default factories.createCoreController(
  "api::organization.organization",
  ({ strapi }) => ({
    async find(ctx) {
      // List only the authenticated user's own organizations

      const { data, meta } = await super.find(ctx);
      const ownOrganizationIds = await strapi
        .service<OrganizationService>("api::organization.organization")
        ?.findForUser(ctx.state.user.id);

      if (!ownOrganizationIds)
        throw new ApplicationError(
          "own organization ids could not be determined"
        );

      const filteredData = data.filter((org) =>
        ownOrganizationIds.includes(org.id)
      );

      meta.pagination.total = filteredData.length;

      return { data: filteredData, meta };
    },
  })
);
