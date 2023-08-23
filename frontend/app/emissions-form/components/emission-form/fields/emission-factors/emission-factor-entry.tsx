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
    <div className="w-full flex flex-col">
      <div className="flex justify-between items-center mt-1 flex-wrap">
        <span className="text-text-regular pt-5">{label}</span>
        <div className="flex flex-col">
          <span className="text-text-regular ml-auto pr-4 h-5">
            {isValueEdited &&
              t(
                'dashboard.form.emissionEntry.emissionFactors.factors.customized',
              )}
          </span>
          <div
            className={cn(
              'w-48 h-10 bg-light text-text-regular text-lg rounded-full flex justify-between items-center px-4 transition-all',
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
                  className="w-full bg-transparent font-bold outline-none pl-4 [appearance:none] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                        className="text-primary-foreground px-2"
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
                  className="text-primary-foreground px-2"
                  onClick={() => {
                    handleSave();
                  }}
                >
                  <Icons.Check />
                </Button>
              </>
            ) : (
              <>
                <span className="text-lg font-bold pl-4 truncate">
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
                            className={cn('text-primary px-2', {
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
                    className="text-primary px-2"
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
