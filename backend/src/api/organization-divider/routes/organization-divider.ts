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
      update: {
        middlewares: [
          {
            name: "global::block-mutations",
            config: { blockedProperties: ["organization"] },
          },
          {
            name: "global::has-access",
            config: { uid: "api::organization-divider.organization-divider" },
          },
        ],
      },
      delete: {
        middlewares: [
          {
            name: "global::has-access",
            config: { uid: "api::organization-divider.organization-divider" },
          },
        ],
      },
      create: {
        middlewares: [
          {
            name: "global::has-access-to-relations",
            config: {
              relations: [
                { key: "organization", uid: "api::organization.organization" },
              ],
            },
          },
        ],
      },
    },
  }
);
