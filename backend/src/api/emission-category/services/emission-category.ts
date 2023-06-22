/**
 * emission-category service
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import { ServiceParams } from "../../api.types";
import { EmissionCategory } from "..";
import { DashboardSettings } from "../../settings-dashboard";

export type EmissionCategoryService = {
  populateEmissionSources(emissionCategory: EmissionCategory): EmissionCategory;
  findOrdered(locale: string): Promise<EmissionCategory[]>;
};

const { ApplicationError } = utils.errors;

export default factories.createCoreService<
  "api::emission-category.emission-category",
  EmissionCategoryService
>("api::emission-category.emission-category", ({ strapi }) => ({
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
        Object.keys(params.populate ?? {}).includes("emissionSources"))
    ) {
      const { localizations } = (await super.findOne(id, {
        populate: { localizations: { populate: params.populate } },
      })) as EmissionCategory;

      if (!localizations)
        throw new ApplicationError("localizations not available");

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

    if (!localizations)
      throw new ApplicationError("localizations not available");

    const enCategory = localizations.find(({ locale }) => locale === "en");

    if (!enCategory?.emissionSources) return category;

    const emissionSources = enCategory.emissionSources.map((source) => {
      if (source.emissionSourceGroup?.localizations) {
        const localeSourceGroup = source.emissionSourceGroup.localizations.find(
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

    return emissionCategories.map((category) => {
      const populatedEmissionSources = strapi
        .service<EmissionCategoryService>(
          "api::emission-category.emission-category"
        )
        ?.populateEmissionSources(category);

      if (!populatedEmissionSources)
        throw new ApplicationError("populated emission sources not available");

      return populatedEmissionSources;
    });
  },
}));
