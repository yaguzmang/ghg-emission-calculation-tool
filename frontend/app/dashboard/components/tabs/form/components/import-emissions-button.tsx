import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface ImportEmissionsButtonProps {
  reportingPeriodId: number;
}

export function ImportEmissionsButton({
  reportingPeriodId,
}: ImportEmissionsButtonProps) {
  const { t } = useTranslation();

  return (
    <Button>
      {reportingPeriodId !== undefined && (
        <span className="px-4"> {t('dashboard.form.importEmissions')}</span>
      )}
    </Button>
  );
}
