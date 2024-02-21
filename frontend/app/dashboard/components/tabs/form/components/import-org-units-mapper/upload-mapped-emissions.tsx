import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { useBatchCreateEmissionEntriesMutation } from '@/redux/api/emission-entries/emissionEntriesApiSlice';
import {
  EmissionDataItemsArray,
  ValidateCSVResponse,
} from '@/redux/api/emission-entries/validateCsvEntriesHook';

interface UploadMappedEmissionsProps {
  data: ValidateCSVResponse;
  mappedOrganizationIds: Record<string, number>;
  onCancel: () => void;
  onSuccess: () => void;
}

export function UploadMappedEmissions({
  data,
  mappedOrganizationIds,
  onCancel,
  onSuccess,
}: UploadMappedEmissionsProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string>('');
  const [batchCreateEmissionEntries, { isLoading }] =
    useBatchCreateEmissionEntriesMutation();

  const handleButtonClick = async () => {
    const allMapped = data.organizationUnitKeys.every(
      (key) =>
        mappedOrganizationIds[key] !== undefined &&
        mappedOrganizationIds[key] !== null,
    );
    if (!allMapped) {
      setError(
        t(
          'dashboard.form.import.mapper.error.allOrganizationUnitsMustBeMapped',
        ),
      );
      return;
    }
    setError('');

    const mappedData: EmissionDataItemsArray = data.data.map(
      (emissionEntry) => ({
        data: {
          ...emissionEntry,
          organizationUnit:
            mappedOrganizationIds[emissionEntry.organizationUnit],
        },
      }),
    );

    const result = await batchCreateEmissionEntries(mappedData);

    if ('error' in result) {
      setError(t('dashboard.form.import.mapper.uploadEmissions.error'));
    } else {
      setError('');
      onSuccess();
    }
  };

  return (
    <div className="mt-8 flex w-full flex-col items-center">
      <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
        <Button
          type="button"
          variant="link"
          size="fit"
          className="text-lg font-bold"
          onClick={onCancel}
        >
          {t('forms.cancel')}
        </Button>
        <Button
          variant="default"
          className="h-10 w-fit px-8 py-2 text-base hover:no-underline focus:no-underline"
          type="button"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          {t('dashboard.form.import.mapper.uploadEmissions')}
        </Button>
      </div>

      {error.length > 0 && (
        <span className="font-bold text-destructive">{error}</span>
      )}
    </div>
  );
}
