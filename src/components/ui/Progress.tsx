interface ProgressProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'warning' | 'danger';
}

export default function Progress({
  value,
  max = 100,
  size = 'md',
  showLabel = false,
  label,
  variant = 'default',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Auto-determine variant based on percentage if not explicitly set
  const autoVariant =
    variant === 'default'
      ? percentage >= 90
        ? 'danger'
        : percentage >= 75
          ? 'warning'
          : 'default'
      : variant;

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-zinc-50',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400',
  };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-zinc-400">{label}</span>}
          {showLabel && (
            <span className="text-xs text-zinc-400 tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-zinc-800 rounded-sm overflow-hidden ${sizes[size]}`}
      >
        <div
          className={`h-full transition-all duration-300 ease-out rounded-sm ${variants[autoVariant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
