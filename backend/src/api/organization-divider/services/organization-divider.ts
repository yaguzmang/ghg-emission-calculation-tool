/**
 * organization-divider service
 */

import { factories } from "@strapi/strapi";
import { AuthorizedService, User } from "../../api.types";
import { OrganizationDivider } from "..";

export type OrganizationDividerService = AuthorizedService;

export default factories.createCoreService<
  "api::organization-divider.organization-divider",
  OrganizationDividerService
>("api::organization-divider.organization-divider", ({ strapi }) => ({
  async isAllowedForUser(organizationDividerId, userId) {
    const user: User | undefined = await strapi.entityService.findOne(
      "plugin::users-permissions.user",
      userId,
      {
        populate: {
          organizations: { populate: "organizationDividers" },
        },
      }
    );

    if (!user?.organizations) return false;

    const ownOrganizationDividers = user.organizations.reduce<
      OrganizationDivider[]
    >((acc, { organizationDividers }) => {
      if (!organizationDividers) {
        return acc;
      }
      return [...acc, ...organizationDividers];
    }, []);

    return ownOrganizationDividers.some(
      ({ id }) => id === organizationDividerId
    );
  },
}));
