import { forwardRef, type HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', size = 'sm', className = '', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center font-medium rounded-sm whitespace-nowrap';

    const variants = {
      default: 'bg-zinc-800 text-zinc-300 border border-zinc-700',
      success: 'bg-green-900/30 text-green-400 border border-green-800/50',
      warning: 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50',
      error: 'bg-red-900/30 text-red-400 border border-red-800/50',
      info: 'bg-blue-900/30 text-blue-400 border border-blue-800/50',
      outline: 'bg-transparent text-zinc-400 border border-zinc-700',
    };

    const sizes = {
      sm: 'text-xs px-1.5 py-0.5 gap-1',
      md: 'text-sm px-2 py-1 gap-1.5',
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
