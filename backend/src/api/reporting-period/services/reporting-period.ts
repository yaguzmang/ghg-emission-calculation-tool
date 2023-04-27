/**
 * reporting-period service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::reporting-period.reporting-period",
  ({ strapi }) => ({
    async isAllowedForUser(
      reportingPeriodId: number,
      userId: number
    ): Promise<boolean> {
      const user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        userId,
        {
          fields: [],
          populate: { organizations: { populate: { reportingPeriods: true } } },
        }
      );

      const ownReportingPeriods = user.organizations.flatMap(
        (org) => org.reportingPeriods
      );

      return ownReportingPeriods.some(
        (period) => period.id === reportingPeriodId
      );
    },
  })
);
