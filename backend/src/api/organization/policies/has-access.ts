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
  if (userId === undefined) return false;

  const user = await strapi.entityService.findOne(
    "plugin::users-permissions.user",
    userId,
    {
      populate: { organizations: true },
    }
  );

  // Require valid user
  if (!user) return false;

  // Require organizationId
  if (
    !Array.isArray(policyContext.captures) ||
    policyContext.captures.length < 1
  )
    return false;

  const organizationId = Number(policyContext.captures[0]);

  return user.organizations.map((org) => org.id).includes(organizationId);
};

export default hasAccess;
