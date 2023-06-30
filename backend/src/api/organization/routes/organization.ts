/**
 * organization router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::organization.organization", {
  config: {
    findOne: {
      middlewares: [
        {
          name: "global::has-access",
          config: { uid: "api::organization.organization" },
        },
      ],
    },
    update: {
      middlewares: [
        "api::organization.restrict-editable-fields",
        {
          name: "global::has-access",
          config: { uid: "api::organization.organization" },
        },
      ],
    },
  },
});
