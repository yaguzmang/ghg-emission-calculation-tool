/**
 * emission-category service
 */

import { factories } from "@strapi/strapi";

import { ServiceParams } from "../../api.types";
import { EmissionCategory } from "..";
import { GenericService } from "@strapi/strapi/lib/core-api/service";
import { DashboardSettings } from "../../settings-dashboard";

export type EmissionCategoryService = GenericService & {
  populateEmissionSources(emissionCategory: EmissionCategory): EmissionCategory;
  findOrdered(locale: string): Promise<EmissionCategory[]>;
};

export default factories.createCoreService<EmissionCategoryService>(
  "api::emission-category.emission-category",
  ({ strapi }) => ({
    /**
     * Overwrite default findOne service by including emissionSources in all locales
     * @param id The id of the emission category to find
     * @param params Additional params included in the request
     * @returns Promise<EmissionCategory>
     */
    async findOne(id: string, params: ServiceParams) {
      const res = (await super.findOne(id, params)) as EmissionCategory | null;

      if (!res) return null;

      if (
        (res.locale !== "en" &&
          ((typeof params.populate === "string" &&
            ["*", "emissionSources"].includes(params.populate)) ||
            (Array.isArray(params.populate) &&
              params.populate.includes("emissionSources")))) ||
        (typeof params.populate === "object" &&
          Object.keys(params.populate).includes("emissionSources"))
      ) {
        const { localizations } = (await super.findOne(id, {
          populate: { localizations: { populate: params.populate } },
        })) as EmissionCategory;

        const enEmissionCategory = localizations.find(
          ({ locale }) => locale === "en"
        );
        if (enEmissionCategory) {
          res.emissionSources = enEmissionCategory.emissionSources;
        }
      }

      return res;
    },

    /**
     * Populate emission sources from English locale
     * @param emissionCategory The emission category to populate. Emission sources for the current and all other localizations need to be populated before calling this function.
     * @returns EmissionCategory
     */
    populateEmissionSources(emissionCategory) {
      const { localizations, ...category } = emissionCategory;

      if (emissionCategory.locale === "en") return category;

      // If a non-English locale, populate emission sources from the English locale

      const enCategory = localizations.find(({ locale }) => locale === "en");

      if (!enCategory) return category;

      const emissionSources = enCategory.emissionSources.map((source) => {
        if (source.emissionSourceGroup) {
          const localeSourceGroup =
            source.emissionSourceGroup.localizations.find(
              ({ locale }) => locale === emissionCategory.locale
            );
          return {
            ...source,
            emissionSourceGroup: localeSourceGroup,
          };
        }
        return source;
      });

      return {
        ...category,
        emissionSources,
      };
    },

    /**
     * Find emission categories as ordered in dashboard settings
     * @param locale The locale to use
     * @returns Promise<EmissionCategory>
     */
    async findOrdered(locale) {
      const dashboardSettings: DashboardSettings | null =
        await strapi.entityService.findMany(
          "api::settings-dashboard.settings-dashboard",
          {
            locale,
            populate: {
              emissionCategories: {
                populate: {
                  emissionSources: true,
                  localizations: {
                    populate: ["emissionSources"],
                  },
                },
              },
            },
          }
        );

      if (!dashboardSettings) return [];

      const { emissionCategories } = dashboardSettings;

      if (!emissionCategories || emissionCategories.length < 0) return [];

      return emissionCategories.map(
        strapi.service<EmissionCategoryService>(
          "api::emission-category.emission-category"
        ).populateEmissionSources
      );
    },
  })
);
