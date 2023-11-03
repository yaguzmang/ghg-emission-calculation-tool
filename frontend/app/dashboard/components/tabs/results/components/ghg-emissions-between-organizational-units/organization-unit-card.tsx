'use client';

import { Trans } from 'react-i18next';

import { ProportionalSemiCirclesChart } from '@/components/charts/proportional-semi-circles-chart';
import { Icons } from '@/components/ui/icons/icons';
import { kgsToTons } from '@/lib/numbers.ts/conversion';

type OrganizationalUnitCardProps = {
  title: string;
  primaryLabel: string;
  primaryValue: number;
  primaryValueNormalized: number;
  secondaryLabel: string;
  secondaryLabelUnit?: string | null;
  secondaryValue: number;
  secondaryValueNormalized: number;
};

export function OrganizationalUnitCard({
  title,
  primaryLabel,
  primaryValue,
  primaryValueNormalized,
  secondaryLabel,
  secondaryLabelUnit,
  secondaryValue,
  secondaryValueNormalized,
}: OrganizationalUnitCardProps) {
  return (
    <div className="flex w-full min-w-[320px] max-w-[400px] flex-wrap items-center justify-between bg-transparent px-0 py-2">
      <div className="flex w-full flex-col border border-gray-lighten">
        <div className="w-full bg-gray-lighten px-6 py-4">
          <span className="text-lg font-bold">{title}</span>
        </div>
        <div className="mt-3 w-full">
          <div className="mx-5 flex justify-between sm:mx-7">
            <div className="flex max-w-[150px] flex-col">
              <span className="text-proportional-area-chart-primary">
                <Icons.HalfCircle className="rotate-90" />
              </span>
              <span className="text-xs">{primaryLabel}</span>
              <span className="break-normal text-lg font-bold">
                {kgsToTons(primaryValue).toFixed(2)}
                <span className="pl-1 text-xs font-normal">
                  <Trans i18nKey="results.ghgEmissionsBetweenUnits.tCO2e" />
                </span>
              </span>
            </div>
            <div className="flex max-w-[150px] flex-col text-primary">
              <span className="text-proportional-area-chart-secondary">
                <Icons.HalfCircle className="rotate-[-90deg]" />
              </span>
              <span className="text-xs">{secondaryLabel}</span>
              <span className="text-lg font-bold ">
                {kgsToTons(secondaryValue).toFixed(2)}
              </span>
              <span className="break-normal pl-1 text-xs font-normal">
                <Trans i18nKey="results.ghgEmissionsBetweenUnits.tCO2e" />
                {secondaryLabelUnit && ` / ${secondaryLabelUnit}`}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-5 mt-8 h-[250px] w-full bg-transparent">
          <ProportionalSemiCirclesChart
            normalizedValueTop={primaryValueNormalized}
            normalizedValueBottom={secondaryValueNormalized}
          />
        </div>
      </div>
    </div>
  );
}
