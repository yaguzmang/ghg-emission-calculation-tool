/**
 * has-access policy
 */

import type { Strapi } from "@strapi/strapi";
import type { PolicyContext } from "../../api.types";

export default async (
  policyContext: PolicyContext,
  config,
  { strapi }: { strapi: Strapi }
) => {
  const userId = policyContext.state.user?.id;

  // Require login
  if (userId === undefined) {
    strapi.log.error("Not logged in");
    return false;
  }

  // Require valid user
  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId,
    {
      populate: { organizations: true },
    }
  );
  if (!user) {
    strapi.log.error("Not a valid user");
    return false;
  }

  // Require organization unit id
  if (
    !Array.isArray(policyContext.captures) ||
    policyContext.captures.length < 1
  ) {
    strapi.log.error("Organization unit id could not be determined");
    return false;
  }

  // Require organization unit
  const organizationUnitId = Number(policyContext.captures[0]);
  const organizationUnit = await strapi.entityService.findOne(
    "api::organization-unit.organization-unit",
    organizationUnitId,
    {
      populate: { organization: true },
    }
  );
  if (!organizationUnit) {
    strapi.log.error("Organization unit not found");
    return false;
  }

  // Require access to organization unit
  const userHasAccessToOrganization = user.organizations
    .map((org) => org.id)
    .includes(organizationUnit.organization.id);
  if (!userHasAccessToOrganization) {
    strapi.log.error("User does not have access to organization");
    return false;
  }

  return true;
};
