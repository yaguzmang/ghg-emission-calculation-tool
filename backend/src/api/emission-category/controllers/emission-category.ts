/**
 * emission-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => ({
    async findWithEmissions(ctx) {
      console.log("findWithEmissions");
      return;
    },
  })
);
