'use client';

import { Trans } from 'react-i18next';

import { ProportionalSemiCirclesChart } from '@/components/charts/proportional-semi-circles-chart';
import { Icons } from '@/components/ui/icons/icons';

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
    <div className="w-full min-w-[320px] max-w-[400px] flex justify-between flex-wrap bg-transparent px-0 py-2 items-center">
      <div className="flex flex-col w-full border border-gray-lighten">
        <div className="w-full bg-gray-lighten py-4 px-6">
          <span className="text-lg font-bold">{title}</span>
        </div>
        <div className="w-full mt-3">
          <div className="flex justify-between mx-5 sm:mx-7">
            <div className="flex flex-col max-w-[150px] break-all">
              <span className="text-proportional-area-chart-primary">
                <Icons.HalfCircle className="rotate-90" />
              </span>
              <span className="text-xs">{primaryLabel}</span>
              <span className="font-bold text-lg ">
                {primaryValue}
                <span className="pl-1 text-xs font-normal">
                  <Trans i18nKey="results.ghgEmissionsBetweenUnits.tCO2e" />
                </span>
              </span>
            </div>
            <div className="flex flex-col max-w-[150px] break-all text-primary">
              <span className="text-proportional-area-chart-secondary">
                <Icons.HalfCircle className="rotate-[-90deg]" />
              </span>
              <span className="text-xs">{secondaryLabel}</span>
              <span className="font-bold text-lg ">{secondaryValue}</span>
              <span className="pl-1 text-xs font-normal break-normal">
                <Trans i18nKey="results.ghgEmissionsBetweenUnits.tCO2e" />
                {secondaryLabelUnit && ` / ${secondaryLabelUnit}`}
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-[250px] bg-transparent mt-8 mb-5">
          <ProportionalSemiCirclesChart
            normalizedValueTop={primaryValueNormalized}
            normalizedValueBottom={secondaryValueNormalized}
          />
        </div>
      </div>
    </div>
  );
}
