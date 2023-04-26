/**
 * emission-category controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::emission-category.emission-category",
  ({ strapi }) => ({
    async findOne(ctx) {
      const { data, meta } = await super.findOne(ctx);
      const { populate } = ctx.query;

      if (
        data.attributes.locale != "en" &&
        (populate == "*" || populate == "emissionSources")
      ) {
        // Populate emission sources to non-English locales
        const localizationQuery = {
          populate: { localizations: { populate: "emissionSources" } },
        };
        const localizationCtx = { ...ctx, query: localizationQuery };
        const { data: localizationData } = await super.findOne(localizationCtx);
        const { localizations } = localizationData.attributes;
        const enLocale = localizations.data.find(
          ({ attributes }) => attributes.locale == "en"
        );
        data.attributes.emissionSources = enLocale.attributes.emissionSources;
      }

      return { data, meta };
    },
  })
);
