import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  id,
  children,
  icon,
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      id={id}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px]
        font-medium text-base rounded-xl transition-all duration-150 select-none
        shadow-sm active:scale-[0.98]
        ${
          disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none active:scale-100'
            : 'bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white cursor-pointer hover:shadow focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
        }
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
};
