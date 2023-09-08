/**
 * translation service
 */

import { factories } from "@strapi/strapi";

export interface TranslatableContentType {
  uid: string;
  kind: string;
  attributes: {
    [key: string]: {
      type: string;
    };
  };
}

interface ContentType {
  kind: string;
  attributes: {
    [key: string]: {
      type: string;
      pluginOptions?: {
        i18n?: {
          localized: boolean;
        };
      };
    };
  };
}

export interface TranslatableComponent {
  [key: string]: string;
}

export interface TranslatableAttributes {
  [key: string]: string | TranslatableComponent | null;
}

export type TranslatableEntry = TranslatableAttributes & {
  id: number;
};

export interface TranslatableEntryOutput {
  uid: string;
  id: number;
  attributes: TranslatableAttributes;
}

export type TranslationService = {
  getTranslatableContentType(uid: string): TranslatableContentType | null;
  getTranslatableEntries(
    uid: string,
    schema: TranslatableContentType
  ): Promise<TranslatableEntryOutput[]>;
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
  getTranslatableContentType(uid) {
    const contentType = strapi.contentTypes[uid] as ContentType | undefined;

    if (!contentType) return null;

    const { kind, attributes } = contentType;

    const translatableAttributes = Object.fromEntries(
      Object.entries(attributes)
        .filter(([_, { pluginOptions }]) => pluginOptions?.i18n?.localized)
        .map(([key, { type }]) => [key, { type }])
    );

    return { uid, kind, attributes: translatableAttributes };
  },

  /**
   * Get translatable entries of a content type
   * @param uid {string} The Strapi uid of the content type
   * @param schema {TranslatableContentType} The translatable content type schema
   * @returns {Promise<TranslatableEntryOutput[]>}
   */
  async getTranslatableEntries(uid, schema) {
    const { fields, populate } = Object.entries(schema.attributes).reduce<{
      fields: string[];
      populate: string[];
    }>(
      ({ fields, populate }, [key, { type }]) => {
        if (type === "component")
          return { fields, populate: [...populate, key] };
        return { fields: [...fields, key], populate };
      },
      { fields: [], populate: [] }
    );

    const entries: TranslatableEntry | TranslatableEntry[] =
      await strapi.entityService.findMany(uid, {
        fields,
        populate,
      });

    // Convert single types to array to enable mapping
    const entriesArr = Array.isArray(entries) ? entries : [entries];

    const output = entriesArr.map(({ id, ...attributes }) => ({
      uid,
      id,
      attributes,
    }));

    return output;
  },
}));
