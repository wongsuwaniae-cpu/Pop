import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  id: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  id,
  children,
  icon,
  variant = 'outline',
  fullWidth = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const variantStyles =
    variant === 'outline'
      ? 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
      : 'bg-transparent text-gray-700 hover:bg-gray-100/80 border border-transparent';

  return (
    <button
      id={id}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px]
        font-medium text-base rounded-xl transition-all duration-150 select-none
        active:scale-[0.98]
        ${
          disabled
            ? 'opacity-50 cursor-not-allowed active:scale-100 bg-gray-100 text-gray-400 border-gray-200'
            : `${variantStyles} cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2`
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
