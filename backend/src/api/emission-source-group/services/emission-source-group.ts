/**
 * emission-source-group service
 */

import { factories } from "@strapi/strapi";
import {
  ApiServiceEntry,
  LocalizedApiServiceEntry,
  ServiceParams,
} from "../../api.types";

interface EmissionSourceGroup extends LocalizedApiServiceEntry {
  name: string;
  emissionSourceLabel;
  emissionSources?: ApiServiceEntry[];
  emissionCategory?: LocalizedApiServiceEntry;
  localizations?: EmissionSourceGroup[];
}

export default factories.createCoreService(
  "api::emission-source-group.emission-source-group",
  ({ strapi }) => ({
    async findOne(id: string, params: ServiceParams) {
      const res = (await super.findOne(
        id,
        params
      )) as EmissionSourceGroup | null;

      if (!res) return null;

      if (
        res.locale !== "en" &&
        ((typeof params.populate === "string" &&
          ["*", "emissionSources"].includes(params.populate)) ||
          (Array.isArray(params.populate) &&
            params.populate.includes("emissionSources")))
      ) {
        console.log("custom populate");
        const { localizations } = (await super.findOne(id, {
          populate: { localizations: { populate: "emissionSources" } },
        })) as EmissionSourceGroup;

        const enEmissionSourceGroup = localizations.find(
          ({ locale }) => locale === "en"
        );
        if (enEmissionSourceGroup) {
          res.emissionSources = enEmissionSourceGroup.emissionSources;
        }
      }

      return res;
    },
  })
);
