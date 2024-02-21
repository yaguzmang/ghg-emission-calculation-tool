'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

import Link from 'next/link';

import EmissionsEntriesContainer from './components/emission-entries/emission-entries-container';

import { Button } from '@/components/ui/button';
import { EmissionIconsByScope } from '@/components/ui/icons/icons';
import {
  ArrowReadMore,
  Popover,
  PopoverContentReadMore,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { UserWalkthrough } from '@/components/user-walkthrough/user-walkthrough';
import { useGetEmissionCategoriesWithFactorsQuery } from '@/redux/api/emission-categories/emissionCategoriesApiSlice';
import {
  DashboardTab,
  UserWalkthroughStep,
} from '@/redux/store/ui/shared/stateType';

interface EmissionsFormProps {
  emissionCategoryId: number;
  reportingPeriodId: number;
  organizationId: number;
  locale: string;
}

export default function EmissionsFormPanel({
  emissionCategoryId,
  reportingPeriodId,
  organizationId,
  locale,
}: EmissionsFormProps) {
  const { t } = useTranslation();

  const emissionCategoryWithFactors = useGetEmissionCategoriesWithFactorsQuery(
    {
      emissionCategoryId: emissionCategoryId ?? -1,
      reportingPeriodId: reportingPeriodId ?? -1,
    },
    {
      skip: emissionCategoryId === undefined || reportingPeriodId === undefined,
    },
  );

  const isEmissionCategoryLoading =
    emissionCategoryWithFactors.isLoading ||
    emissionCategoryWithFactors.isFetching;

  const emissionIcon =
    EmissionIconsByScope[
      (emissionCategoryWithFactors.currentData
        ?.primaryScope as keyof typeof EmissionIconsByScope) ?? 1
    ];

  return (
    <div className="flex w-full max-w-[720px] flex-col px-4 pt-10 sm:px-12 xl:ml-auto">
      <div>
        <Link href={`/dashboard#${DashboardTab.inventory}`}>
          <Button variant="link" size="fit" type="button">
            <span className="pr-2 text-base text-secondary">
              {t('dashboard.form.overview')}
            </span>
          </Button>
        </Link>

        <span className="px-1 text-secondary">/</span>

        <UserWalkthrough
          isButton={false}
          step={UserWalkthroughStep.formInformation}
        >
          <span className="px-2 text-center text-primary-disabled-foreground">
            {isEmissionCategoryLoading ? (
              <Skeleton className="inline-block h-3 w-16" />
            ) : (
              emissionCategoryWithFactors.currentData?.title
            )}
          </span>
        </UserWalkthrough>
      </div>

      <div className="mt-8 flex items-center">
        {isEmissionCategoryLoading ? (
          <Skeleton className="inline-block h-6 w-48" />
        ) : (
          <h1 className="flex items-center">
            <span className="text-lg">{emissionIcon}</span>
            <span className="ml-2 text-xl font-bold uppercase">
              {emissionCategoryWithFactors.currentData?.title}
            </span>
          </h1>
        )}
      </div>

      <div className="mt-8 flex flex-col text-text-regular">
        {isEmissionCategoryLoading ? (
          <>
            <Skeleton className="inline-block h-3 w-full" />
            <Skeleton className="mt-4 inline-block h-3 w-full" />
            <Skeleton className="mt-1 inline-block h-3 w-10/12" />
          </>
        ) : (
          <Markdown>
            {emissionCategoryWithFactors.currentData?.description?.split(
              '\n',
            )[0] ?? ''}
          </Markdown>
        )}
      </div>

      <div className="ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="link" size="fit" type="button">
              {t('dashboard.form.emissionEntry.description.readMore')}
            </Button>
          </PopoverTrigger>
          <PopoverContentReadMore side="bottom" sideOffset={12}>
            <p>
              {t('dashboard.form.emissionEntry.description.readMore.content')}
            </p>
            <ArrowReadMore />
          </PopoverContentReadMore>
        </Popover>
      </div>

      {emissionCategoryWithFactors.currentData !== undefined && (
        <EmissionsEntriesContainer
          emissionCategoryId={emissionCategoryId}
          reportingPeriodId={reportingPeriodId}
          organizationId={organizationId}
          locale={locale}
          emissionCategoryWithFactors={emissionCategoryWithFactors.currentData}
        />
      )}

      <div className="mt-8">
        <Link href={`/dashboard#${DashboardTab.inventory}`}>
          <Button variant="link" size="fit" type="button">
            {t('dashboard.form.emissionEntry.backToFormOverview')}
          </Button>
        </Link>
      </div>
    </div>
  );
}
