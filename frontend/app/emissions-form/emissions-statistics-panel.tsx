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
    <div className="w-full max-w-[720px] px-4 py-6 sm:px-12 xl:mr-auto">
      <EmissionsFormStatistics
        emissionCategoryId={emissionCategoryId}
        reportingPeriodId={reportingPeriodId}
        locale={locale}
      />
    </div>
  );
}
