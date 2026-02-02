interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-zinc-800 rounded-sm';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-sm',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            style={{
              ...style,
              width: i === lines - 1 ? '75%' : width, // Last line is shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton patterns
export function SkeletonCard() {
  return (
    <div className="p-4 border border-zinc-800 bg-zinc-900 rounded-sm space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={80} />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width={60} height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="border border-zinc-800 rounded-sm overflow-hidden">
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800">
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="text" width={`${20 + i * 5}%`} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="px-4 py-3 border-b border-zinc-800 last:border-0"
        >
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((j) => (
              <Skeleton key={j} variant="text" width={`${20 + j * 5}%`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
