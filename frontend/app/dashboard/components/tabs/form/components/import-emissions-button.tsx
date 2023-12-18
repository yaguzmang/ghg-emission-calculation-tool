import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface ImportEmissionsButtonProps {
  reportingPeriodId: number;
}

export function ImportEmissionsButton({
  reportingPeriodId,
}: ImportEmissionsButtonProps) {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // Handle the selected file, for example, you can upload it to a server.
      // console.log('Selected file:', selectedFile);
    }
  };

  const handleButtonClick = () => {
    // Trigger the click event of the file input when the button is clicked
    if (fileInputRef.current) {
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
      />
    </div>
  );
}
