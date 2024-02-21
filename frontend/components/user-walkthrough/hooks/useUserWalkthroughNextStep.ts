import { useMemo } from 'react';

import { UserWalkthroughStep } from '@/redux/store/ui/shared/stateType';

type Props = {
  currentStep: UserWalkthroughStep | undefined;
};

type Returned = {
  nextStep: UserWalkthroughStep;
};

const userWalkthroughSteps = Object.values(UserWalkthroughStep);

export const useUserWalkthroughNextStep = (props: Props): Returned => {
  const { currentStep } = props;
  const nextStep = useMemo<UserWalkthroughStep>(() => {
    if (currentStep === undefined) {
      return UserWalkthroughStep.welcome;
    }
    const nextStepIndex = userWalkthroughSteps.indexOf(currentStep) + 1;
    if (nextStepIndex < userWalkthroughSteps.length) {
      return userWalkthroughSteps[nextStepIndex];
    }
    return UserWalkthroughStep.finished;
  }, [currentStep]);

  return { nextStep };
};
