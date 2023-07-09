import React from 'react';

import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const loaderVariants = cva('', {
  variants: {
    size: {
      default: 'h-8 w-8 md:w-16 md:h-16 lg:w-24 lg:h-24',
      xs: 'h-3 w-3',
      sm: 'h-8 w-8',
      md: 'h-16 w-16',
      lg: 'w-24 h-24',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

export interface LoaderProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  fullScreen?: boolean;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, fullScreen }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center',
        {
          'fixed left-0 top-0 z-[1030] h-screen w-screen justify-center bg-overlay/[.66]':
            fullScreen,
        },
        className
      )}
    >
      <div className={cn('relative', loaderVariants({ size }))}>
        <div
          className={cn(
            'absolute h-[calc(50%_-_2px)] w-[calc(50%_-_2px)] origin-[50%_50%] animate-loader-box',
            'left-0 top-0 bg-loader-dark animation-delay-[-400ms]'
          )}
        />
        <div
          className={cn(
            'absolute h-[calc(50%_-_2px)] w-[calc(50%_-_2px)] origin-[50%_50%] animate-loader-box',
            'right-0 top-0 bg-loader-light animation-delay-[-1800ms]'
          )}
        />
        <div
          className={cn(
            'absolute h-[calc(50%_-_2px)] w-[calc(50%_-_2px)] origin-[50%_50%] animate-loader-box',
            'bottom-0 left-0 bg-loader-light animation-delay-[-2000ms]'
          )}
        />
        <div
          className={cn(
            'absolute h-[calc(50%_-_2px)] w-[calc(50%_-_2px)] origin-[50%_50%] animate-loader-box',
            'bottom-0 right-0 bg-loader-dark animation-delay-[-1000ms]'
          )}
        />
      </div>
      <div className="" />
    </div>
  )
);

Loader.displayName = 'Loader';

Loader.defaultProps = {
  fullScreen: false,
};

export { Loader, loaderVariants };
