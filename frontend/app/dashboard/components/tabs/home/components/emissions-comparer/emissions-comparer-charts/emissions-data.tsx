import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EmissionsBar } from './emissions-bar';

import {
  calculateTotalGHGEmissionsFromResult,
  calculateTotalGHGEmissionsOfCategoryInAllUnits,
  calculateTotalGHGEmissionsOfOrganizationUnit,
  calculateTotalGHGEmissionsOfOrganizationUnitAndCategory,
} from '@/lib/data/organizations-utils';
import { kgsToTons } from '@/lib/numbers.ts/conversion';
import { useGetEmissionsResultsByReportingPeriodQuery } from '@/redux/api/emission-results/emissionResultsApiSlice';
import { useGetDashboardEmissionCategoriesByLocaleQuery } from '@/redux/api/settings/dashboardSettingsApiSlice';
import { useSelectedLocale } from '@/redux/store/ui/shared/hooks';
import {
  TOTAL_ALL_EMISSIONS,
  TOTAL_ORGANIZATION_ID,
} from '@/redux/store/ui/shared/stateType';
import {
  EmissionResults,
  EmissionResultsPerReportinPeriodId,
} from '@/types/emission-result';

interface EmissionsDataProps {
  emissionResultsPerReportingPeriodId: EmissionResultsPerReportinPeriodId;
  highestTotalEmissions: number | null;
  onEmissionResultsChange: (
    reportingPeriodId: number,
    results: EmissionResults | 'loading' | 'error',
  ) => void;
  organizationUnitId: number | undefined;
  emissionCategoryId: number | undefined;
  reportingPeriodId: number;
  locale: string | undefined;
}

export function EmissionsData({
  emissionResultsPerReportingPeriodId,
  highestTotalEmissions,
  onEmissionResultsChange,
  organizationUnitId,
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: EmissionsDataProps) {
  const { t } = useTranslation();
  const selectedLocale = useSelectedLocale();
  const emissionResults = useGetEmissionsResultsByReportingPeriodQuery(
    {
      reportingPeriodId: reportingPeriodId ?? -1,
      locale: locale ?? '',
    },
    {
      skip: reportingPeriodId === undefined || locale === undefined,
    },
  );
  const emissionCategories = useGetDashboardEmissionCategoriesByLocaleQuery(
    selectedLocale ?? (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as string),
  );

  const selectedEmissionCategory = useMemo(() => {
    if (emissionCategories.currentData !== undefined) {
      return emissionCategories.currentData?.find(
        (emissionCategory) => emissionCategory.id === emissionCategoryId,
      );
    }
    return null;
  }, [emissionCategories.currentData, emissionCategoryId]);

  const selectedOrganizationUnitResults = useMemo(() => {
    if (
      organizationUnitId !== TOTAL_ORGANIZATION_ID &&
      emissionResults.currentData !== undefined
    ) {
      const orgUnitResults = emissionResults.currentData.organizationUnits.find(
        (unit) => unit.id === organizationUnitId,
      );
      if (orgUnitResults === undefined) return null;
      return orgUnitResults;
    }
    return null;
  }, [organizationUnitId, emissionResults.currentData]);

  const totalEmissionOfOrgUnit = useMemo(() => {
    if (selectedOrganizationUnitResults !== null) {
      return calculateTotalGHGEmissionsOfOrganizationUnit(
        selectedOrganizationUnitResults,
      );
    }
    return null;
  }, [selectedOrganizationUnitResults]);

  const totalGHGEmissions =
    emissionResults.currentData?.totalEmissions !== undefined
      ? calculateTotalGHGEmissionsFromResult(
          emissionResults.currentData?.totalEmissions,
        )
      : 0;

  useEffect(() => {
    if (
      emissionResults.isFetching &&
      emissionResultsPerReportingPeriodId[reportingPeriodId] !== 'loading'
    ) {
      onEmissionResultsChange(reportingPeriodId, 'loading');
      return;
    }
    if (
      emissionResults.isError &&
      emissionResultsPerReportingPeriodId[reportingPeriodId] !== 'error'
    ) {
      onEmissionResultsChange(reportingPeriodId, 'error');
      return;
    }
    if (
      emissionResults.isSuccess &&
      typeof emissionResultsPerReportingPeriodId[reportingPeriodId] !== 'object'
    ) {
      onEmissionResultsChange(reportingPeriodId, emissionResults.data);
    }
  }, [
    emissionResults.data,
    emissionResults.isFetching,
    emissionResults.isError,
    emissionResults.isSuccess,
    onEmissionResultsChange,
    reportingPeriodId,
    emissionResultsPerReportingPeriodId,
  ]);

  const totalEmissionByOrgUnitAndEmissionCategory = useMemo(() => {
    if (
      emissionCategoryId !== undefined &&
      emissionCategoryId !== TOTAL_ALL_EMISSIONS &&
      organizationUnitId !== undefined &&
      organizationUnitId !== TOTAL_ORGANIZATION_ID &&
      emissionResults.currentData !== undefined
    ) {
      return calculateTotalGHGEmissionsOfOrganizationUnitAndCategory(
        emissionResults.currentData,
        organizationUnitId,
        emissionCategoryId,
      );
    }
    return null;
  }, [emissionCategoryId, organizationUnitId, emissionResults.currentData]);

  const totalCategoryEmissionsInAllUnits = useMemo(() => {
    if (
      emissionCategoryId !== undefined &&
      emissionCategoryId !== TOTAL_ALL_EMISSIONS &&
      organizationUnitId === TOTAL_ORGANIZATION_ID &&
      emissionResults.currentData !== undefined
    ) {
      return calculateTotalGHGEmissionsOfCategoryInAllUnits(
        emissionResults.currentData,
        emissionCategoryId,
      );
    }
    return null;
  }, [emissionCategoryId, organizationUnitId, emissionResults.currentData]);

  if (emissionResults.isFetching)
    return (
      <span className="font-bold text-black">{t('api.loading.generic')} </span>
    );

  if (emissionResults.isError) {
    let errorMessage = null;
    // TODO: Turn this logic into a component or lib to get error messages
    if (
      'status' in emissionResults.error &&
      emissionResults.error.status === 404
    ) {
      errorMessage = t('api.error.emissionFactorDataNotFound');
    } else if (
      'status' in emissionResults.error &&
      emissionResults.error.status === 400
    ) {
      errorMessage = t('api.error.emissionFactorDataGeneric');
    } else {
      errorMessage = t('api.error.generic');
    }
    return <span className="font-bold text-destructive">{errorMessage}</span>;
  }

  return (
    emissionResults.currentData !== undefined && (
      <div className="flex flex-col gap-2 text-black">
        <div className="inline-block">
          <div className="inline-grid grid-cols-2 gap-2">
            <div className="col-span-1">
              {t('dashboard.home.compare.totalEmissions')}
            </div>
            <div className="col-span-1 font-bold">
              {kgsToTons(totalGHGEmissions).toFixed(2)}
            </div>
            {organizationUnitId !== TOTAL_ORGANIZATION_ID && (
              <>
                <div className="col-span-1">
                  {selectedOrganizationUnitResults !== null &&
                    selectedOrganizationUnitResults?.name}
                </div>
                <div className="col-span-1 font-bold">
                  {totalEmissionOfOrgUnit !== null &&
                    kgsToTons(totalEmissionOfOrgUnit).toFixed(2)}
                </div>
              </>
            )}
            {emissionCategoryId !== TOTAL_ALL_EMISSIONS && (
              <>
                <div className="col-span-1">
                  {selectedEmissionCategory?.attributes.title}
                </div>
                <div className="col-span-1 font-bold">
                  {organizationUnitId !== TOTAL_ORGANIZATION_ID &&
                  totalEmissionByOrgUnitAndEmissionCategory !== null
                    ? kgsToTons(
                        totalEmissionByOrgUnitAndEmissionCategory,
                      ).toFixed(2)
                    : totalCategoryEmissionsInAllUnits !== null &&
                      kgsToTons(totalCategoryEmissionsInAllUnits).toFixed(2)}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Total vs Unit vs Category */}
        {highestTotalEmissions !== null &&
          organizationUnitId !== undefined &&
          organizationUnitId !== TOTAL_ORGANIZATION_ID &&
          emissionCategoryId !== undefined &&
          emissionCategoryId !== TOTAL_ALL_EMISSIONS && (
            <EmissionsBar
              highestTotalEmissions={highestTotalEmissions}
              totalGHGEmissions={totalGHGEmissions}
              totalEmissionOfOrgUnit={totalEmissionOfOrgUnit}
              totalEmissionOfEmissionCategory={
                totalEmissionByOrgUnitAndEmissionCategory
              }
              categoryColor={selectedEmissionCategory?.attributes.color || null}
            />
          )}
        {/* Total vs Category Total in Unit */}
        {highestTotalEmissions !== null &&
          organizationUnitId === TOTAL_ORGANIZATION_ID &&
          emissionCategoryId !== undefined &&
          emissionCategoryId !== TOTAL_ALL_EMISSIONS && (
            <EmissionsBar
              highestTotalEmissions={highestTotalEmissions}
              totalGHGEmissions={totalGHGEmissions}
              totalEmissionOfOrgUnit={
                totalEmissionOfOrgUnit !== null
                  ? totalEmissionOfOrgUnit
                  : totalEmissionOfOrgUnit
              }
              totalEmissionOfEmissionCategory={totalCategoryEmissionsInAllUnits}
              categoryColor={selectedEmissionCategory?.attributes.color || null}
            />
          )}
        {/* Total vs Unit total */}
        {highestTotalEmissions !== null &&
          organizationUnitId !== undefined &&
          organizationUnitId !== TOTAL_ORGANIZATION_ID &&
          emissionCategoryId === TOTAL_ALL_EMISSIONS && (
            <EmissionsBar
              highestTotalEmissions={highestTotalEmissions}
              totalGHGEmissions={totalGHGEmissions}
              totalEmissionOfOrgUnit={totalEmissionOfOrgUnit}
              totalEmissionOfEmissionCategory={null}
              categoryColor={selectedEmissionCategory?.attributes.color || null}
            />
          )}
        {/* Total */}
        {highestTotalEmissions !== null &&
          organizationUnitId === TOTAL_ORGANIZATION_ID &&
          emissionCategoryId === TOTAL_ALL_EMISSIONS && (
            <EmissionsBar
              highestTotalEmissions={highestTotalEmissions}
              totalGHGEmissions={totalGHGEmissions}
              totalEmissionOfOrgUnit={null}
              totalEmissionOfEmissionCategory={null}
              categoryColor={selectedEmissionCategory?.attributes.color || null}
            />
          )}
      </div>
    )
  );
}
