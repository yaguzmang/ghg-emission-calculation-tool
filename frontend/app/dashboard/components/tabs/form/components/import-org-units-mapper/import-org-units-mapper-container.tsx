import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// interface ImportEmissionsButtonProps {
//   // reportingPeriodId: number;
// }

export function FileInfo() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full max-w-3xl flex-col rounded-[4px] border-2 border-border-highlight px-2 py-8 sm:px-8 lg:px-12">
      <div className="self-center justify-self-center">
        <span className="text-text-regular-lighten">Max file size</span>
      </div>
      <div className="flex flex-col gap-y-3 rounded-[5px] border bg-file px-2 py-4 sm:px-8">
        <span className="font-bold text-black">File name.xls</span>
        <div className="h-[3px] w-full bg-secondary" />
      </div>
      <div className="self-center justify-self-center">
        <Button
          variant="link"
          className="text-base hover:no-underline focus:no-underline"
        >
          Remove file
        </Button>
      </div>
      <div className="my-4 self-center justify-self-center">
        <span className="text-base text-black">
          Match organization unit’s names with your Admin’s created names. The
          names in the drop down menu will be the ones shown in the too.
        </span>
      </div>

      <div className="flex flex-wrap gap-y-4 rounded-[5px] bg-file px-2 py-4 text-black sm:px-8">
        <div className="flex flex-1 flex-col gap-y-3">
          <span className="text-xs">Name in excel</span>
          <span className="text-sm font-bold text-secondary">
            Organization unit A
          </span>
        </div>
        <div className="flex flex-1 justify-around">
          <div className="flex flex-col gap-y-1 justify-self-center">
            <span className="text-xs">Choose organization name *</span>
            <Select key={-1} onValueChange={() => {}} value="">
              <SelectTrigger className="w-[230px] bg-white">
                <SelectValue
                  placeholder={t('dashboard.home.compare.chooseOrganization')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {/* {organizationSelectOptions.map((option) => ( */}
                  <SelectItem
                    key="option.value"
                    value="option.value.toString()"
                  >
                    option.label
                  </SelectItem>
                  {/* ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
