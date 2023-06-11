'use client';

import { initReactI18next } from 'react-i18next';

import i18next from 'i18next';
import Backend from 'i18next-http-backend';

import { Translation } from '@/types/translation';

type TranslationsApiResponse = {
  data: Translation[];
};

i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/translations?locale={{lng}}&pagination[start]=0&pagination[limit]=1000`,
      parse: (translationsData: string) => {
        const parsedTranslationsData: TranslationsApiResponse =
          JSON.parse(translationsData);
        const translations: Record<string, string> = {};
        parsedTranslationsData.data.forEach((translation) => {
          translations[translation.attributes.key] =
            translation.attributes.translation;
        });
        return translations;
      },
    },
    fallbackLng: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    // allow keys to be phrases having `:`, `.`
    nsSeparator: false,
    keySeparator: false,
    lng: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
    debug: true,
  });

export default i18next;
