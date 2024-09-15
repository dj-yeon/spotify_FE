import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, disabled, children, ...props }, ref) => {
    return (
      <select
        className={twMerge(
          `
          flex
          w-full
          rounded-md
          bg-neutral-700
          border
          border-transparent
          px-3
          py-3
          text-sm
          placeholder:text-neutral-400
          disabled:cursor-not-allowed
          disabled:opacity-50
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-neutral-800
          focus:ring-indigo-500
          `,
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = 'Select';

export default Select;
