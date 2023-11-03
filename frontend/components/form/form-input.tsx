import React from 'react';

import { Input } from '../ui/input';

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | null;
  secondaryLabel?: string | null;
  error?: boolean;
  errorMessage?: string | null;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    { className, type, error, errorMessage, label, secondaryLabel, ...props },
    ref,
  ) => {
    const hasErrorMessage =
      errorMessage !== undefined &&
      errorMessage !== null &&
      errorMessage.length > 0;
    return (
      <>
        <div className="m-0 overflow-auto">
          {label !== null && (
            <span className="float-left text-sm">{label}</span>
          )}
          {secondaryLabel !== null && (
            <span className="float-right text-sm">{secondaryLabel}</span>
          )}
        </div>
        <Input
          className={className}
          error={hasErrorMessage || error}
          type={type}
          ref={ref}
          {...props}
        />
        {hasErrorMessage && (
          <span className="text-sm text-destructive">{errorMessage}</span>
        )}
      </>
    );
  },
);

FormInput.displayName = 'Input';

FormInput.defaultProps = {
  label: null,
  secondaryLabel: null,
  errorMessage: null,
  error: false,
};

export default FormInput;
