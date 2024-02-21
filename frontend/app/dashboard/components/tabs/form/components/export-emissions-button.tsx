import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import useExportEmissionData from '@/redux/api/reporting-periods/exportEmissionEntriesHook';

interface ExportEmissionsButtonProps {
  reportingPeriodId: number;
}

export function ExportEmissionsButton({
  reportingPeriodId,
}: ExportEmissionsButtonProps) {
  const [{ data, loading, error }, triggerFetch] =
    useExportEmissionData(reportingPeriodId);
  const { t } = useTranslation();
  const [fetchComplete, setFetchComplete] = useState<boolean>(false);

  const handleDownload = useCallback((data: string) => {
    if (data === null) return;
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported-emissions.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  const handleClick = useCallback(async () => {
    await triggerFetch();
    setFetchComplete(true);
  }, [triggerFetch]);

  useEffect(() => {
    if (fetchComplete && data && !loading && !error) {
      handleDownload(data);
      setFetchComplete(false);
    }
  }, [fetchComplete, data, loading, error, handleDownload]);

  return (
    <>
      <Button variant="outline" onClick={handleClick} disabled={loading}>
        <span className="px-4">
          {!loading && <> {t('dashboard.form.exportEmissions')}</>}
          {loading && <>{t('api.loading.generic')} </>}
        </span>
      </Button>
      {error && <span>{t('api.error.generic')}</span>}
    </>
  );
}
