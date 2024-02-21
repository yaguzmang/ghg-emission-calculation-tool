import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetDashboardEmissionCategoriesByLocaleQuery } from '@/redux/api/settings/dashboardSettingsApiSlice';
import { useAppDispatch } from '@/redux/store';
import { SharedUIActions } from '@/redux/store/ui/shared';
import {
  useSelectedEmissionCategoryId,
  useSelectedLocale,
} from '@/redux/store/ui/shared/hooks';
import {
  OrganizationAndReportingPeriodSections,
  TOTAL_ALL_EMISSIONS,
} from '@/redux/store/ui/shared/stateType';

export function EmissionCategorySelector() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedLocale = useSelectedLocale();

  const selectedEmissionCategoryId = useSelectedEmissionCategoryId('home');

  const emissionCategories = useGetDashboardEmissionCategoriesByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

  const emissionCategoriesSelectOptions = useMemo(() => {
    const options =
      emissionCategories.currentData?.map((emissionCategory) => ({
        value: emissionCategory.id,
        label: emissionCategory.attributes.title,
      })) ?? [];

    if (options.length > 0) {
      options.push({
        value: TOTAL_ALL_EMISSIONS,
        label: t('dashboard.home.compare.allEmissions'),
      });
    }

    return options;
  }, [emissionCategories.currentData, t]);

  const handleOrganizationEmissionCategoryChange = useCallback(
    (selectedValue: string) => {
      const selectedEmissionCategoryId = parseInt(selectedValue, 10);
      dispatch(
        SharedUIActions.setSelectedEmissionCategoryId({
          selectedEmissionCategoryId,
          section: OrganizationAndReportingPeriodSections.home,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="flex w-full flex-col gap-8">
      <div>
        <span className="text-xs">
          {t('dashboard.home.compare.chooseCategory')}
        </span>
        <div className="flex flex-row flex-wrap items-center gap-8">
          <Select
            key={emissionCategoriesSelectOptions?.[0]?.value ?? -1}
            onValueChange={handleOrganizationEmissionCategoryChange}
            value={
              selectedEmissionCategoryId !== undefined
                ? selectedEmissionCategoryId.toString()
                : undefined
            }
          >
            <SelectTrigger className="w-[230px] bg-white">
              <SelectValue
                placeholder={t(
                  'dashboard.form.emissionEntry.organizationUnit.choose',
                )}
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                {emissionCategoriesSelectOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
