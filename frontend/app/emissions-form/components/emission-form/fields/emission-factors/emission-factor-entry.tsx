'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

import FormInput from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons/icons';
import {
  Arrow,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { EmissionType } from '@/types/emission';

interface EmissionFactorEntryProps {
  label: string;
  value: string;
  source?: string;
  isValueEdited: boolean;
  isEditing: boolean;
  emissionType: EmissionType;
  valueErrorMessage: string | null;
  sourceErrorMessage: string | null;
  onValueEdit: (emissionType: EmissionType, value: string) => void;
  onSourceEdit: (emissionType: EmissionType, value: string) => void;
  onOpenEdit: (emissionType: EmissionType) => void;
  onSaveEdit: (emissionType: EmissionType) => void;
  onUndoEdit: (emissionType: EmissionType) => void;
}

export default function EmissionFactorEntry({
  label,
  value,
  source = '',
  isValueEdited,
  isEditing,
  emissionType,
  valueErrorMessage,
  sourceErrorMessage,
  onValueEdit,
  onSourceEdit,
  onUndoEdit,
  onSaveEdit,
  onOpenEdit,
}: EmissionFactorEntryProps) {
  const { t } = useTranslation();
  const sourceInputRef = React.useRef<HTMLInputElement>(null);
  const valueInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (valueErrorMessage !== null || value.length === 0) {
      valueInputRef.current?.focus();
      return;
    }
    if (sourceErrorMessage !== null || source.length === 0) {
      sourceInputRef.current?.focus();
      return;
    }
    onSaveEdit(emissionType);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mt-1 flex flex-wrap items-center justify-between">
        <span className="pt-5 text-text-regular">{label}</span>
        <div className="flex flex-col">
          <span className="ml-auto h-5 pr-4 text-text-regular">
            {isValueEdited &&
              t(
                'dashboard.form.emissionEntry.emissionFactors.factors.customized',
              )}
          </span>
          <div
            className={cn(
              'flex h-10 w-48 items-center justify-between rounded-full bg-light px-4 text-lg text-text-regular transition-all',
              { 'bg-primary text-primary-foreground': isEditing },
            )}
          >
            {isEditing ? (
              <>
                <input
                  ref={valueInputRef}
                  type="number"
                  step="any"
                  lang="en"
                  className="w-full bg-transparent pl-4 font-bold outline-none [appearance:none] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  value={value}
                  onWheel={(e) => e.currentTarget.blur()}
                  onChange={(e) => onValueEdit(emissionType, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  // Autofocus is okay here because the user is opening the custom EF editor
                  // and it could be hard to notice that it is an input field.
                  autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="icon"
                        size="fit"
                        className="px-2 text-primary-foreground"
                        onClick={() => onUndoEdit(emissionType)}
                      >
                        <Icons.Undo />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-base">
                        {t(
                          'dashboard.form.emissionEntry.emissionFactors.factors.resetTooltip',
                        )}
                      </p>
                      <Arrow width={11} height={5} className="fill-tooltip" />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  type="button"
                  variant="icon"
                  size="fit"
                  className="px-2 text-primary-foreground"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  <Icons.Check />
                </Button>
              </>
            ) : (
              <>
                <span className="truncate pl-4 text-lg font-bold">
                  {Number(Number(value).toFixed(4))}
                </span>
                <div className="flex items-center">
                  {isValueEdited && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="icon"
                            size="fit"
                            className={cn('px-2 text-primary', {
                              'text-primary-foreground': isEditing,
                            })}
                            onClick={() => onUndoEdit(emissionType)}
                          >
                            <Icons.Undo />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-base">
                            {t(
                              'dashboard.form.emissionEntry.emissionFactors.factors.resetTooltip',
                            )}
                          </p>
                          <Arrow
                            width={11}
                            height={5}
                            className="fill-tooltip"
                          />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  <Button
                    type="button"
                    variant="icon"
                    size="fit"
                    className="px-2 text-primary"
                    onClick={() => onOpenEdit(emissionType)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                    onKeyUp={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onOpenEdit(emissionType);
                      }
                    }}
                  >
                    <Icons.Edit />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {valueErrorMessage !== null && valueErrorMessage.length > 0 && (
        <span className="ml-auto text-sm text-destructive">
          {valueErrorMessage}
        </span>
      )}
      {isEditing && (
        <div>
          <FormInput
            ref={sourceInputRef}
            label={t(
              'dashboard.form.emissionEntry.emissionFactors.insertSource',
            )}
            placeholder={t(
              'dashboard.form.emissionEntry.emissionFactors.insertSource.placeholder',
            )}
            value={source}
            onChange={(e) => {
              onSourceEdit(emissionType, e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
            error={!(source.length > 0)}
            errorMessage={sourceErrorMessage}
            className="placeholder-destructive"
          />
        </div>
      )}
    </div>
  );
}
