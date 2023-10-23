/**
 * translation controller
 */

import { factories } from "@strapi/strapi";
import type Strapi from "@strapi/types";
import utils from "@strapi/utils";
import * as yup from "yup";
import Papa from "papaparse";
import { validate } from "../../../services/utils";
import {
  TranslatableComponent,
  TranslatableContentType,
  TranslatableEntryOutput,
  TranslationService,
} from "../services/translation";

const { ApplicationError, ValidationError } = utils.errors;

interface ExportableAttributes {
  uid: Strapi.Common.UID.ContentType;
  id: number;
  attribute: string;
  value_en: string;
}

/**
 * Convert a content entry to an array of exportable attributes
 * @param entry {TranslatableEntry} The entry to convert
 * @returns {ExportableAttributes[]}
 */
const convertEntryToExportableAttributes = (
  entry: TranslatableEntryOutput,
  schema: TranslatableContentType
): ExportableAttributes[] => {
  const { uid, id, attributes } = entry;
  const output = Object.entries(attributes)
    .flatMap(([key, value]) => {
      // TODO
      if (value === null) return null;
      const { type } = schema.attributes[key];
      if (type === "component") {
        return Object.entries(value as TranslatableComponent).map(
          ([childKey, childValue]) => ({
            uid,
            id,
            attribute: `${key}.${childKey}`,
            value_en: childValue,
          })
        );
      }

      return { uid, id, attribute: key, value_en: value as string };
    })
    .filter((_): _ is ExportableAttributes => !!_);

  return output;
};

/**
 * Convert a JSON-compliant JavaScript array of objects to a specified data format
 * @param input {object[]} And array of objects to convert
 * @param format {string} The output format
 * @returns {string} The converted output
 */
const convertJsonTo = (input: object[], format: string): string => {
  switch (format) {
    case "csv":
      return Papa.unparse(input);
    default:
      throw new ApplicationError(`unknown format ${format}`);
  }
};

export default factories.createCoreController(
  "api::translation.translation",
  ({ strapi }) => ({
    // GET /api/translations/export?as=
    async exportTranslations(ctx) {
      // Validate request
      const { as } = await validate(
        ctx.query,
        yup.object({ as: yup.string().required().oneOf(["csv"]) }),
        ValidationError
      );

      // For each translatable uid, collect each translatable attribute
      const translatableUids: Strapi.Common.UID.ContentType[] = [
        "api::emission-category.emission-category",
        "api::emission-group.emission-group",
        "api::emission-source-group.emission-source-group",
        "api::translation.translation",
        "api::settings-general.settings-general",
      ];

      const getTranslatableContentType: TranslationService["getTranslatableContentType"] =
        strapi.service(
          "api::translation.translation"
        )?.getTranslatableContentType;

      if (!getTranslatableContentType)
        throw new ApplicationError(
          "getTranslatableContentType service not available"
        );

      const translatableContentTypes = Object.fromEntries(
        translatableUids
          .map((uid) => getTranslatableContentType(uid))
          .filter((_): _ is TranslatableContentType => !!_)
          .map((_) => [_.uid, _])
      );

      // Find all entries of each translatable content type, selecting/populating the translatable attributes
      const getTranslatableEntries: TranslationService["getTranslatableEntries"] =
        strapi.service("api::translation.translation")?.getTranslatableEntries;

      if (!getTranslatableEntries)
        throw new ApplicationError(
          "getTranslatableEntries service not available"
        );

      const translatableEntries = (
        await Promise.all(
          translatableUids.map((uid) =>
            getTranslatableEntries(uid, translatableContentTypes[uid])
          )
        )
      ).flatMap((_) => _);

      // Loop through each entry's each attribute and build the exportable array of objects
      const translatableAttributes = translatableEntries.flatMap((entry) =>
        convertEntryToExportableAttributes(
          entry,
          translatableContentTypes[entry.uid]
        )
      );

      // Transfer the json to csv and initiate a download
      const output = convertJsonTo(translatableAttributes, as);

      ctx.attachment("translations.csv");
      return output;
    },
  })
);
