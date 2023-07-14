'use client';

import * as React from 'react';
import { useEffect } from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from 'cmdk';

import Check from '@/components/ui/icons/check.svg';
import ChevronDown from '@/components/ui/icons/chevron-down.svg';
import Search from '@/components/ui/icons/search.svg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type Option = {
  value: string; // Values are converted to lowercase by cmdk
  label: string;
};

export interface FormComboboxProps {
  comoboboxRef?: React.Ref<HTMLButtonElement> | null;
  options: Option[];
  onValueChange: (value: string) => void;
  errorMessage?: string | null;
  label?: string | null;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  searchNotFoundLabel?: string;
  disabled?: boolean;
  selectedValue?: string | null;
}

export function FormCombobox({
  comoboboxRef = null,
  options,
  onValueChange,
  errorMessage = null,
  label = null,
  selectPlaceholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  searchNotFoundLabel = 'No results found.',
  disabled,
  selectedValue = null,
}: FormComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(selectedValue ?? '');

  useEffect(() => {
    if (selectedValue !== null) {
      setLocalValue(selectedValue);
    }
  }, [selectedValue]);

  const hasError =
    errorMessage !== undefined &&
    errorMessage !== null &&
    errorMessage.length > 0;
  const errorClass =
    'text-destructive-foreground border-destructive-foreground focus:border-destructive-foreground hover:border-input-hover';

  return (
    <>
      {label !== null && <span className="text-sm">{label}</span>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className="w-full [&[data-state=open]>div>svg]:rotate-180"
        >
          <button
            ref={comoboboxRef}
            role="combobox"
            aria-expanded={open}
            aria-controls="combobox-pop-over-list"
            type="button"
            className={cn(
              'flex w-full items-center justify-between rounded-xs border border-input bg-transparent px-3 py-2 text-base font-bold text-foreground ring-offset-background',
              'hover:border-input-hover focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-background disabled:text-primary-disabled-foreground',
              { [errorClass]: hasError },
            )}
            disabled={disabled}
          >
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {localValue
                ? options.find((option) => option.value === localValue)?.label
                : selectPlaceholder}
            </span>
            <div>
              <ChevronDown className="h-4 w-4 transition-transform duration-200" />
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] fade-in-80' rounded-xs border-none bg-select-content-popover p-0 text-text-regular shadow-light animate-in">
          <Command
            className="flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground"
            value={localValue}
          >
            <div
              className="flex items-center border-b px-3"
              cmdk-input-wrapper=""
            >
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder={searchPlaceholder}
                className="placeholder:text-foreground-muted flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <CommandEmpty className="py-6 text-center text-sm">
              {searchNotFoundLabel}
            </CommandEmpty>
            <CommandGroup className="overflow-hidden p-0 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(selectedValue) => {
                    const newSelectedValue =
                      selectedValue === localValue ? '' : selectedValue;
                    setLocalValue(newSelectedValue);
                    setOpen(false);
                    onValueChange(newSelectedValue);
                  }}
                  // 'relative flex w-full cursor-default select-none items-center rounded-none py-1.5 pl-8 pr-2 text-base font-normal text-text-regular outline-none focus:bg-select-item-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  className="relative flex w-full cursor-default select-none items-center rounded-none py-1.5 pl-2 text-base outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  // className="relative flex cursor-default select-none items-center rounded-none px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <div>
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        localValue === option.value
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                  </div>
                  <span className="pr-4 overflow-hidden text-ellipsis whitespace-nowrap">
                    {option.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {hasError && (
        <span className="text-sm text-destructive">{errorMessage}</span>
      )}
    </>
  );
}
