/**
 * block-access policy
 *
 * Can be used anywhere to easily block all access to a route.
 */

export default (policyContext, config, { strapi }) => {
  return false;
};
