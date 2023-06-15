/**
 * reporting-period router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::reporting-period.reporting-period",
  {
    config: {
      findOne: {
        middlewares: [
          {
            name: "global::has-access",
            config: {
              uid: "api::reporting-period.reporting-period",
            },
          },
        ],
      },
      find: {
        policies: ["global::block-access"],
      },
      create: {
        middlewares: ["api::reporting-period.has-access-to-relations"],
      },
    },
  }
);
