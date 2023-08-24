/**
 * translation controller
 */

import { factories } from "@strapi/strapi";
import utils from "@strapi/utils";
import * as yup from "yup";
import { validate } from "../../../services/utils";
import { TranslatableEntry, TranslationService } from "../services/translation";

const { ApplicationError, ValidationError } = utils.errors;

interface ExportableAttributes {
  uid: string;
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
  entry: TranslatableEntry
): ExportableAttributes[] => {
  // TODO
  return [];
};

/**
 * Convert a JSON-compliant JavaScript array of objects to a specified data format
 * @param input {object[]} And array of objects to convert
 * @param format {string} The output format
 * @returns {string} The converted output
 */
const convertJsonTo = (input: object[], format: string): string => {
  // TODO
  return "";
};

export default factories.createCoreController(
  "api::translation.translation",
  ({ strapi }) => ({
    async exportTranslations(ctx) {
      // Validate request and extract typed arguments
      const { as } = await validate(
        ctx.query,
        yup.object({ as: yup.string().required().oneOf(["csv"]) }),
        ValidationError
      );

      // For each translatable uid, collect each translatable attribute
      const translatableUids = [
        "api:::emission-category.emission-category",
        "api:::emission-group.emission-group",
        "api:::emission-source-group.emission-source-group",
        "api:::translation.translation",
        "api:::settings-general.settings-general",
      ];

      const getTranslatableContentType = strapi.service<TranslationService>(
        "api::translation.translation"
      )?.getTranslatableContentType;

      if (!getTranslatableContentType)
        throw new ApplicationError(
          "getTranslatableContentType service not available"
        );

      const translatableContentTypes = await Promise.all(
        translatableUids.map(getTranslatableContentType)
      );

      // Find all entries of each translatable content type, selecting/populating the translatable attributes
      const getTranslatableEntries = strapi.service<TranslationService>(
        "api::translation.translation"
      )?.getTranslatableEntries;

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
      const translatableAttributes = translatableEntries.flatMap(
        convertEntryToExportableAttributes
      );

      // Transfer the json to csv and initiate a download
      const output = convertJsonTo(translatableAttributes, as);

      return output;
    },
  })
);
