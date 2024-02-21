import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

interface ChangeFileButtonProps {
  disabled?: boolean;
  onFileSelected: (file: File) => void;
}

export function ChangeFileButton({
  disabled,
  onFileSelected,
}: ChangeFileButtonProps) {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      onFileSelected(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Button
        variant="link"
        className="text-base hover:no-underline focus:no-underline"
        type="button"
        onClick={handleButtonClick}
        disabled={disabled}
      >
        {t('dashboard.form.import.mapper.file.change')}
      </Button>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
        id="fileInput"
        name="file"
        accept=".csv"
      />
    </div>
  );
}
