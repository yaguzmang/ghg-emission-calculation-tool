'use client';

import React from 'react';

import { Separator } from './ui/separator';

import { cn } from '@/lib/utils';
import { useGetLocalesQuery } from '@/redux/api/translations/localesApiSlice';
import { useAppDispatch } from '@/redux/store';
import { SharedUIActions, useSelectedLocale } from '@/redux/store/ui/shared';

export function HeaderLanguageSelector() {
  const locales = useGetLocalesQuery();
  const selectedLocale = useSelectedLocale();
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-5 items-center space-x-2">
      {locales.currentData !== undefined &&
        locales.currentData.map((locale, index) => (
          <React.Fragment key={locale.code}>
            <button
              type="button"
              onClick={() =>
                dispatch(
                  SharedUIActions.setSelectedLocale({ locale: locale.code })
                )
              }
              className={cn('uppercase before:font-bold', {
                'font-bold': selectedLocale === locale.code,
              })}
            >
              {locale.code}
            </button>
            {locales.currentData !== undefined &&
              index !== locales.currentData.length - 1 && (
                <Separator orientation="vertical" className="h-4" />
              )}
          </React.Fragment>
        ))}
    </div>
  );
}
