import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ChangeFileButton } from './change-file-button';
import { OrganizationUnitsMapper } from './org-units-mapper';
import { UploadMappedEmissions } from './upload-mapped-emissions';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useValidateCsvEntries from '@/redux/api/emission-entries/validateCsvEntriesHook';

interface ImportOrganizationUnitsFileMapperProps {
  reportingPeriodId: number;
  file: File;
  onChangeFile: (file: File) => void;
}

export function ImportOrganizationUnitsFileMapper({
  reportingPeriodId,
  file,
  onChangeFile,
}: ImportOrganizationUnitsFileMapperProps) {
  const { t } = useTranslation();

  const [{ data, loading, error, progress, resetState }, triggerUpload] =
    useValidateCsvEntries({ file, reportingPeriodId });

  const isFileValidatedSuccessfully =
    !loading && data && !error && progress === 100;

  const upLoadFile = useCallback(async () => {
    await triggerUpload();
  }, [triggerUpload]);

  const handleChangeFile = (file: File) => {
    resetState();
    onChangeFile(file);
  };

  const [mappedOrganizationIds, setMappedOrganizationIds] = useState<
    Record<string, number>
  >({});

  const handleMappedOrganizationIdsChange = (
    organizationUnitKey: string,
    organizationUnitId: number,
  ) => {
    setMappedOrganizationIds((prevState) => ({
      ...prevState,
      [organizationUnitKey]: organizationUnitId,
    }));
  };

  return (
    <div className="flex w-full max-w-3xl flex-col rounded-[4px] border-2 border-border-highlight px-2 py-8 sm:px-8 lg:px-12">
      <div className="self-center justify-self-center">
        <span className="text-text-regular-lighten">
          {t('dashboard.form.import.mapper.file.maxSize')}
        </span>
      </div>
      <div className="flex flex-col gap-y-3 rounded-[5px] border bg-file px-2 py-4 sm:px-8">
        <span
          className={cn('font-bold text-black', {
            'text-destructive': error !== null && error.length > 0,
          })}
        >
          {file.name}
        </span>
        <div className="h-[3px] w-full">
          <div
            className="h-full bg-secondary"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
        {isFileValidatedSuccessfully && (
          <span>
            {t('dashboard.form.import.mapper.file.validatedSuccessfully')}
          </span>
        )}
      </div>
      {error === null && !isFileValidatedSuccessfully && (
        <div className="self-center justify-self-center">
          <Button
            variant="link"
            className="text-base hover:no-underline focus:no-underline"
            type="button"
            onClick={upLoadFile}
            disabled={loading}
          >
            {t('dashboard.form.import.mapper.file.validate')}
          </Button>
        </div>
      )}
      {((error !== null && error.length > 0) ||
        isFileValidatedSuccessfully) && (
        <div className="self-center justify-self-center">
          <ChangeFileButton
            disabled={loading}
            onFileSelected={handleChangeFile}
          />
        </div>
      )}
      {error && (
        <span className="font-bold text-destructive">{`${t(
          'common.error',
        )}: ${error}`}</span>
      )}
      {data && (
        <>
          <OrganizationUnitsMapper
            data={data}
            mappedOrganizationIds={mappedOrganizationIds}
            onChangeMappedOrganizationIds={handleMappedOrganizationIdsChange}
          />
          <UploadMappedEmissions
            data={data}
            mappedOrganizationIds={mappedOrganizationIds}
          />
        </>
      )}
    </div>
  );
}
