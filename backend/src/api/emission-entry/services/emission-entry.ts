/**
 * emission-entry service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::emission-entry.emission-entry",
  ({ strapi }) => ({
    async isAllowedForUser(
      emissionEntryId: number,
      userId: number
    ): Promise<boolean> {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          fields: [],
          populate: {
            organizations: {
              populate: {
                organizationUnits: { populate: { emissionEntries: true } },
              },
            },
          },
        }
      );

      const ownEmissionEntries = user.organizations.flatMap((org) =>
        org.organizationUnits.flatMap((unit) => unit.emissionEntries)
      );

      return ownEmissionEntries.some((unit) => unit.id === emissionEntryId);
    },
  })
);
