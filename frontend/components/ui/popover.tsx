'use client';

import React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const {
  Arrow: PopoverArrow,
  Anchor: PopoverAnchor,
  Portal: PopoverPortal,
  Close: PopoverClose,
} = PopoverPrimitive;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverContentReadMore = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      arrowPadding={2}
      className={cn(
        'z-50 w-64 animate-in rounded-[2px] bg-tooltip fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95  p-4 text-tooltip-foreground shadow-strong outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContentReadMore.displayName = PopoverPrimitive.Content.displayName;

const ArrowReadMore = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    className={cn('fill-tooltip', className)}
    ref={ref}
    {...props}
  />
));

export {
  ArrowReadMore,
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverContentReadMore,
  PopoverPortal,
  PopoverTrigger,
};
