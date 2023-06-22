import React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const errorClass =
      'text-destructive-foreground border-destructive-foreground focus:border-destructive-foreground hover:border-input-hover';
    return (
      <input
        type={type}
        className={cn(
          'placeholder:text-muted-foreground flex h-10 w-full rounded-xs border border-input bg-transparent px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-input-hover focus:border-input-focus focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:bg-input-disabled',
          { [errorClass]: error },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

Input.defaultProps = {
  error: false,
};

export { Input };
