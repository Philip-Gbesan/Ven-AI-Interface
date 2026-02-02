import { motion } from 'framer-motion';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Toggle({
  enabled,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const sizes = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const sizeConfig = sizes[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => !disabled && onChange(!enabled)}
      className={`group flex items-center gap-3 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200
          ${sizeConfig.track}
          ${enabled ? 'bg-zinc-50' : 'bg-zinc-700'}
          ${!disabled && 'group-hover:ring-2 group-hover:ring-zinc-600 group-hover:ring-offset-2 group-hover:ring-offset-zinc-950'}
        `}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`
            inline-block rounded-full shadow-sm
            ${sizeConfig.thumb}
            ${enabled ? 'bg-zinc-900 ml-auto mr-0.5' : 'bg-zinc-400 ml-0.5'}
          `}
        />
      </span>
      {(label || description) && (
        <div className="flex flex-col text-left">
          {label && (
            <span className="text-sm font-medium text-zinc-100">{label}</span>
          )}
          {description && (
            <span className="text-xs text-zinc-500">{description}</span>
          )}
        </div>
      )}
    </button>
  );
}
