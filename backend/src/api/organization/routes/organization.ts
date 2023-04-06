/**
 * organization router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::organization.organization", {
  config: {
    findOne: {
      policies: ["has-access"],
    },
  },
});