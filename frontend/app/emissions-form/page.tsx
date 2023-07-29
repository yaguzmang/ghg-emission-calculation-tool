'use client';

import React, { useEffect } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';

import EmissionsFormPanel from './emissions-form-panel';
import EmissionsStatisticsPanel from './emissions-statistics-panel';

import { useAppDispatch } from '@/redux/store';
import { SharedUIActions } from '@/redux/store/ui/shared';

const searchParamsData = z.object({
  emissionCategoryId: z.coerce.number().int().positive(),
  reportingPeriodId: z.coerce.number().int().positive(),
  organizationId: z.coerce.number().int().positive(),
  locale: z.coerce.string().min(2).max(2),
});

const validateSearchParamsData = (inputs: unknown) => {
  const validatedData = searchParamsData.safeParse(inputs);
  return validatedData;
};

export default function MainEmissionsPage() {
  const searchParams = useSearchParams();
  const emissionCategoryId = searchParams?.get('emissionCategoryId');
  const reportingPeriodId = searchParams?.get('reportingPeriodId');
  const organizationId = searchParams?.get('organizationId');
  const locale = searchParams?.get('locale');
  const dispatch = useAppDispatch();
  const validatedSearchParams = validateSearchParamsData({
    emissionCategoryId,
    reportingPeriodId,
    organizationId,
    locale,
  });
  const router = useRouter();
  useEffect(() => {
    if (validatedSearchParams.success && locale) {
      dispatch(SharedUIActions.setSelectedLocale({ locale }));
    } else if (!validatedSearchParams.success) {
      router.push('404');
    }
  }, [validatedSearchParams.success, locale, dispatch, router]);

  return validatedSearchParams.success ? (
    <div className="flex flex-col md:flex-row w-full">
      <div className="w-full md:w-2/4 items-center min-h-screen md:h-screen bg-white md:overflow-auto pb-16">
        <EmissionsFormPanel
          emissionCategoryId={validatedSearchParams.data.emissionCategoryId}
          reportingPeriodId={validatedSearchParams.data.reportingPeriodId}
          organizationId={validatedSearchParams.data.organizationId}
          locale={validatedSearchParams.data.locale}
        />
      </div>

      <div className="flex flex-col md:w-2/4 items-center bg-background md:h-screen md:overflow-auto pb-16">
        <EmissionsStatisticsPanel
          emissionCategoryId={validatedSearchParams.data.emissionCategoryId}
          reportingPeriodId={validatedSearchParams.data.reportingPeriodId}
          locale={validatedSearchParams.data.locale}
        />
      </div>
    </div>
  ) : null;
}
