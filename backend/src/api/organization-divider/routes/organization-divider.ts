/**
 * organization-divider router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::organization-divider.organization-divider",
  {
    config: {
      find: {
        policies: ["global::block-access"],
      },
      findOne: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::organization-divider.organization-divider" },
          },
        ],
      },
    },
  }
);
