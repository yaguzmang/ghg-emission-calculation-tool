/**
 * organization-unit router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::organization-unit.organization-unit",
  {
    config: {
      findOne: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::organization-unit.organization-unit" },
          },
        ],
      },
    },
  }
);
