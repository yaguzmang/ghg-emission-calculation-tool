/**
 * organization-unit router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter(
  "api::organization-unit.organization-unit",
  {
    config: {
      find: {
        policies: ["global::block-access"],
      },
      findOne: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::organization-unit.organization-unit" },
          },
        ],
      },
      create: {
        middlewares: [
          {
            name: "global::block-mutations",
            config: {
              blockedProperties: ["emissionEntries"],
            },
          },
          {
            name: "global::has-access-to-relations",
            config: {
              relations: [
                {
                  key: "organization",
                  uid: "api::organization.organization",
                },
              ],
            },
          },
          "api::organization-unit.validate-divider-values",
        ],
      },
      delete: {
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
