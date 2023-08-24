/**
 * translation service
 */

import { factories } from "@strapi/strapi";
import { LocalizedApiServiceEntry } from "../../api.types";

interface TranslatableContentType {
  kind: "collectionType" | "singleType";
  attributes: {
    [key: string]: {
      type: "string" | "richtext" | "component";
    };
  };
}

interface TranslatableComponent {
  [key: string]: string;
}

export type TranslatableEntry = {
  [key: string]: string | TranslatableComponent;
};

export type TranslationService = {
  getTranslatableContentType(
    uid: string
  ): Promise<TranslatableContentType | null>;
  getTranslatableEntries(
    uid: string,
    schema: TranslatableContentType
  ): Promise<TranslatableEntry[]>;
};

export default factories.createCoreService<
  "api::translation.translation",
  TranslationService
>("api::translation.translation", ({ strapi }) => ({
  /**
   * Get a translatable content type by Strapi uid
   * @param uid {string} The Strapi uid of the content type
   * @returns {Promise<TranslatableContentType|null>} depending on whether a content type was found for the uid or not
   */
  async getTranslatableContentType(uid) {
    // TODO
    return null;
  },

  /**
   * Get translatable entries of a content type
   * @param uid {string} The Strapi uid of the content type
   * @param schema {TranslatableContentType} The translatable content type schema
   * @returns {Promise<TranslatableEntry[]>}
   */
  async getTranslatableEntries(uid, schema) {
    // TODO
    return [];
  },
}));
