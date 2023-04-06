/**
 * has-access policy
 */
import type { Strapi } from "@strapi/strapi";

interface PolicyContext {
  state: {
    user?: {
      id: number;
    };
  };
  captures: string[];
}

const hasAccess = async (
  policyContext: PolicyContext,
  config,
  { strapi }: { strapi: Strapi }
) => {
  strapi.log.info("In has-access policy.");
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

  // Require organizationId
  if (
    !Array.isArray(policyContext.captures) ||
    policyContext.captures.length < 1
  ) {
    strapi.log.error("Organization id could not be determined");
    return false;
  }

  // Require access to organization
  const organizationId = Number(policyContext.captures[0]);
  const userHasAccessToOrganization = user.organizations
    .map((org) => org.id)
    .includes(organizationId);
  if (!userHasAccessToOrganization) {
    strapi.log.error("User does not have access to organization");
    return false;
  }

  return true;
};

export default hasAccess;
