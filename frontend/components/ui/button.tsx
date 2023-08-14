import React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:ring-offset-0 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-hover-foreground disabled:bg-primary-disabled disabled:text-primary-disabled-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-secondary-hover-foreground disabled:bg-secondary-disabled disabled:text-secondary-disabled-foreground',
        light:
          'bg-light text-light-foreground hover:bg-light-hover hover:text-light-hover-foreground disabled:bg-light-disabled disabled:text-light-disabled-foreground',
        outline:
          'border-2 border-outline-foreground bg-transparent text-outline-foreground hover:bg-outline-hover hover:text-outline-hover-foreground active:bg-outline-active active:text-outline-active-foreground focus-visible:ring-[2px]  disabled:border-outline-disabled disabled:text-outline-disabled-foreground',
        link: 'rounded-none focus-visible:ring-[2px] focus-visible:ring-offset-4 focus:underline bg-transparent text-link underline-offset-2 hover:text-link-hover hover:underline active:text-link-active disabled:text-link-disabled',
        icon: 'rounded-none focus-visible:ring-[2px] focus-visible:ring-offset-4 bg-transparent text-link hover:text-link-hover hover:underline active:text-link-active disabled:text-link-disabled',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        fit: 'h-fit w-fit px-0 py-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

Button.defaultProps = {
  asChild: false,
};

export { Button, buttonVariants };
