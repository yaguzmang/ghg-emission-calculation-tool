import React from 'react';

import { Input } from '../ui/input';

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string | null;
  label?: string | null;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, errorMessage, label, ...props }, ref) => {
    const hasError =
      errorMessage !== undefined &&
      errorMessage !== null &&
      errorMessage.length > 0;
    return (
      <>
        {label && <span className="text-sm">{label}</span>}
        <Input
          className={className}
          error={hasError}
          type={type}
          ref={ref}
          {...props}
        />
        {hasError && (
          <span className="text-sm text-destructive">{errorMessage}</span>
        )}
      </>
    );
  },
);

FormInput.displayName = 'Input';

FormInput.defaultProps = {
  errorMessage: null,
  label: null,
};

export default FormInput;
