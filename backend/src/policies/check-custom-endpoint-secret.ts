/**
 * check-custom-endpoint-secret policy
 */

export default (policyContext, config, { strapi }) => {
  const incomingSecret = policyContext.request.header["custom-endpoint-secret"];
  const actualSecret = process.env.STRAPI_ADMIN_CUSTOM_ENDPOINT_SECRET;

  return incomingSecret === actualSecret;
};
