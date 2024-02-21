import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface ImportEmissionsButtonProps {
  reportingPeriodId: number;
  onImportFileSelected: (file: File) => void;
}

export function ImportEmissionsButton({
  reportingPeriodId,
  onImportFileSelected,
}: ImportEmissionsButtonProps) {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onImportFileSelected(selectedFile);
    }
  };

  const handleButtonClick = () => {
    // Trigger the click event of the file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>
        {reportingPeriodId !== undefined && (
          <span className="px-4">{t('dashboard.form.importEmissions')}</span>
        )}
      </Button>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
        id="fileInput"
        name="file"
        accept=".csv"
      />
    </div>
  );
}
