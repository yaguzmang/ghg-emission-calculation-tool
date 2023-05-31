/**
 * emission-category service
 */

import { factories } from "@strapi/strapi";

import {
  ApiServiceEntry,
  LocalizedApiServiceEntry,
  ServiceParams,
} from "../../api.types";

interface EmissionCategory extends LocalizedApiServiceEntry {
  title: string;
  description?: string;
  emissionGroup?: LocalizedApiServiceEntry;
  emissionSources?: ApiServiceEntry[];
  localizations?: EmissionCategory[];
}

export default factories.createCoreService(
  "api::emission-category.emission-category",
  ({ strapi }) => ({
    async findOne(id: string, params: ServiceParams) {
      const res = (await super.findOne(id, params)) as EmissionCategory | null;

      if (!res) return null;

      console.log(params.populate);

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
  })
);
