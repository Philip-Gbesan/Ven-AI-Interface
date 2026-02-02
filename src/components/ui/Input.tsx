import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-zinc-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 text-sm
            bg-zinc-900 border border-zinc-700 rounded-sm
            text-zinc-100 placeholder-zinc-500
            focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
