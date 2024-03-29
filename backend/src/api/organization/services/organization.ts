/**
 * organization service
 */

import { factories } from "@strapi/strapi";
import { AuthorizedService } from "../../api.types";

export type OrganizationService = AuthorizedService & {
  findForUser: (userId: number) => Promise<number[]>;
};

export default factories.createCoreService<
  "api::organization.organization",
  OrganizationService
>("api::organization.organization", ({ strapi }) => ({
  async findForUser(userId) {
    const user = await strapi.entityService?.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        populate: { organizations: true },
      }
    );
    return user?.organizations?.map((org) => Number(org.id)) || [];
  },

  async isAllowedForUser(
    organizationId: number,
    userId: number
  ): Promise<boolean> {
    const ownOrganizationIds = await this.findForUser(userId);
    return ownOrganizationIds.includes(organizationId);
  },
}));
