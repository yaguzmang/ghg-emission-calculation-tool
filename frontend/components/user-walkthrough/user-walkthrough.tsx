'use client';

/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import { useUserWalkthroughNextStep } from './hooks/useUserWalkthroughNextStep';

import {
  Arrow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/redux/store';
import { SharedUIActions } from '@/redux/store/ui/shared';
import {
  useSelectedReportingPeriodId,
  useUserWalkthrough,
} from '@/redux/store/ui/shared/hooks';
import {
  DashboardTab,
  UserWalkthroughStep,
} from '@/redux/store/ui/shared/stateType';

interface UserWalkthroughProps {
  className?: string;
  children: React.ReactNode;
  step: UserWalkthroughStep;
  side?: 'top' | 'right' | 'bottom' | 'left';
  isButton: boolean;
}
const ShouldContinueOnStepTrigger: Record<UserWalkthroughStep, boolean> = {
  [UserWalkthroughStep.welcome]: true,
  [UserWalkthroughStep.openPeriodSettings]: true,
  [UserWalkthroughStep.startAPeriod]: false,
  [UserWalkthroughStep.selectAFormCategory]: true,
  [UserWalkthroughStep.formInformation]: false,
  [UserWalkthroughStep.formStatisticsInformation]: false,
  [UserWalkthroughStep.resultsPageInformation]: false,
  [UserWalkthroughStep.finished]: false,
};

const ShouldRenderContinueButton: Record<UserWalkthroughStep, boolean> = {
  [UserWalkthroughStep.welcome]: true,
  [UserWalkthroughStep.openPeriodSettings]: false,
  [UserWalkthroughStep.startAPeriod]: true,
  [UserWalkthroughStep.selectAFormCategory]: false,
  [UserWalkthroughStep.formInformation]: true,
  [UserWalkthroughStep.formStatisticsInformation]: true,
  [UserWalkthroughStep.resultsPageInformation]: true,
  [UserWalkthroughStep.finished]: false,
};

export function UserWalkthrough(props: UserWalkthroughProps) {
  const { children, step, side, className } = props;

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const selectedeportingPeriodId = useSelectedReportingPeriodId('form');
  const userWalkthroughState = useUserWalkthrough();
  const { enabled, step: currentStep } = userWalkthroughState ?? {};
  const { nextStep } = useUserWalkthroughNextStep({ currentStep });
  const shouldOpen =
    enabled &&
    currentStep !== UserWalkthroughStep.finished &&
    step === currentStep;

  const userWalkthroughRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (userWalkthroughRef.current && currentStep === step) {
      userWalkthroughRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentStep, step]);

  const handleContinue = () => {
    dispatch(SharedUIActions.setUserWalkthroughStep({ step: nextStep }));
    if (currentStep === UserWalkthroughStep.formStatisticsInformation) {
      router.push(`/dashboard#${DashboardTab.results}`);
    }
    if (currentStep === UserWalkthroughStep.resultsPageInformation) {
      dispatch(SharedUIActions.setUserWalkthroughEnabled({ enabled: false }));
    }
  };

  const handleSkip = () => {
    dispatch(
      SharedUIActions.setUserWalkthroughStep({
        step: UserWalkthroughStep.finished,
      }),
    );
    dispatch(SharedUIActions.setUserWalkthroughEnabled({ enabled: false }));
  };

  const handleTriggerClick = () => {
    if (shouldOpen && ShouldContinueOnStepTrigger[currentStep]) {
      dispatch(SharedUIActions.setUserWalkthroughStep({ step: nextStep }));
    }
  };

  if (!shouldOpen) return children;

  return (
    <TooltipProvider>
      <Tooltip open={shouldOpen}>
        <TooltipTrigger
          ref={userWalkthroughRef}
          onClick={() => handleTriggerClick()}
          className={className}
          // asChild={isButton}
        >
          {children}
        </TooltipTrigger>
        <TooltipContent
          side={side}
          className="bg-popover-menu p-5 text-primary shadow-sm"
        >
          <div className="flex w-full max-w-[288px] flex-col gap-y-5 ">
            <p className="text-base">{t(`walkthrough.${step}`)}</p>
            <div className="flex w-full flex-row flex-wrap items-center justify-between">
              {currentStep !== UserWalkthroughStep.resultsPageInformation && (
                <Button
                  onClick={() => {
                    handleSkip();
                  }}
                  variant="link"
                  size="fit"
                  className="text-popover-foreground hover:text-popover-foreground"
                  type="button"
                >
                  <span>{t('walkthrough.skip')}</span>
                </Button>
              )}
              {currentStep !== undefined &&
                ShouldRenderContinueButton[currentStep] && (
                  <Button
                    onClick={() => {
                      handleContinue();
                    }}
                    className={cn('h-9 p-0', {
                      'ml-auto':
                        currentStep ===
                        UserWalkthroughStep.resultsPageInformation,
                    })}
                    type="button"
                    disabled={
                      currentStep === UserWalkthroughStep.startAPeriod &&
                      selectedeportingPeriodId === undefined
                    }
                  >
                    <span className="px-5 py-2 text-sm">
                      {currentStep ===
                      UserWalkthroughStep.resultsPageInformation
                        ? t('walkthrough.finish')
                        : t('common.continue')}
                    </span>
                  </Button>
                )}
              {currentStep !== undefined &&
                currentStep !== UserWalkthroughStep.resultsPageInformation &&
                !ShouldRenderContinueButton[currentStep] && (
                  <span className="px-5 py-2 text-sm">
                    {t('walkthrough.openToContinue')}
                  </span>
                )}
            </div>
          </div>
          <Arrow width={11} height={5} className="fill-popover-menu" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
