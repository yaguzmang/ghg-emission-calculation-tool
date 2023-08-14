import React from 'react';

import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn } from '@/lib/utils';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    className={cn('flex gap-2', className)}
    {...props}
    ref={ref}
  />
));

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-full bg-transparent px-4 py-2',
      'text-sm font-medium text-primary',
      'border-2 border-outline-foreground bg-transparent',
      'transition-colors hover:bg-outline-hover',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground',
      className,
    )}
    type="button"
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));

export { ToggleGroup, ToggleGroupItem };
