/**
 * emission-entry router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::emission-entry.emission-entry",
  {
    config: {
      create: {
        middlewares: ["api::emission-entry.has-access-to-relations"],
      },
    },
  }
);
