/**
 * organization service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::organization.organization",
  ({ strapi }) => ({
    async findForUser(userId: number): Promise<number[]> {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          populate: { organizations: true },
        }
      );
      return user.organizations.map((org) => org.id);
    },
  })
);
