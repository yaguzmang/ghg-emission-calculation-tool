'use client';

import React from 'react';

import EmissionsFormStatistics from './components/emission-statistics/emissions-statistics';

interface EmissionsStatisticsPanelProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  locale: string;
}

export default function EmissionsStatisticsPanel({
  emissionCategoryId,
  reportingPeriodId,
  locale,
}: EmissionsStatisticsPanelProps) {
  return (
    <div className="w-full py-6 px-4 sm:px-12 max-w-[720px] xl:mr-auto">
      <EmissionsFormStatistics
        emissionCategoryId={emissionCategoryId}
        reportingPeriodId={reportingPeriodId}
        locale={locale}
      />
    </div>
  );
}
