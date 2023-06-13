import type { Strapi } from "@strapi/strapi";
import * as yup from "yup";
import estoniaDefault2022En from "../../data/ef-tables/estonia-default_2022_en.json";
import estoniaDefault2022Fi from "../../data/ef-tables/estonia-default_2022_fi.json";
import utils from "@strapi/utils";
import { validate } from "./utils";

const data = {
  "estonia-default": {
    "2022": {
      en: estoniaDefault2022En,
      fi: estoniaDefault2022Fi,
    },
  },
};

export const getEmissionFactorData = async (
  dataset: string,
  year: string,
  locale: string
) => {
  const res: unknown = await data[dataset]?.[year]?.[locale];
  return res;
};

export const pullEmissionFactorData = async (id: number, strapi: Strapi) => {
  // Get dataset, year and locale by id

  const entry = await strapi.entityService.findOne(
    "api::emission-factor-datum.emission-factor-datum",
    id,
    { populate: "dataset" }
  );

  if (!entry) throw new utils.errors.NotFoundError();

  const entrySchema = yup.object({
    year: yup.string(),
    locale: yup.string(),
    dataset: yup.object({
      apiName: yup.string(),
    }),
  });

  const {
    dataset: { apiName: dataset },
    year,
    locale,
  } = await validate(entry, entrySchema);

  // Get emission factor data

  const emissionFactorData = await getEmissionFactorData(dataset, year, locale);

  if (!emissionFactorData)
    throw new utils.errors.ApplicationError("data not found");

  // Store emission factor data

  await strapi.entityService.update(
    "api::emission-factor-datum.emission-factor-datum",
    id,
    { data: { json: emissionFactorData } }
  );
};
