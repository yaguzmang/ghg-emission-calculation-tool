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
      update: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::emission-entry.emission-entry" },
          },
          "api::emission-entry.has-access-to-relations",
        ],
      },
      find: {
        policies: ["global::block-access"],
      },
      findOne: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::emission-entry.emission-entry" },
          },
        ],
      },
      delete: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::emission-entry.emission-entry" },
          },
        ],
      },
    },
  }
);
