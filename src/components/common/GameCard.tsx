import React from 'react';
import { Check } from 'lucide-react';

interface GameCardProps {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  isSelected?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  subtitle,
  description,
  badgeText,
  isSelected = false,
  onClick,
  icon,
  children,
  className = '',
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      id={id}
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`
        relative text-left p-5 md:p-6 rounded-2xl bg-white border-2 transition-all duration-150 cursor-pointer
        select-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2
        ${
          isSelected
            ? 'border-emerald-600 shadow-md bg-emerald-50/20 ring-1 ring-emerald-600/30'
            : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'
        }
        ${className}
      `}
    >
      {/* Visual selection indicator badge in top-right corner */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {badgeText && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700">
            {badgeText}
          </span>
        )}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
            isSelected
              ? 'bg-emerald-600 border-emerald-600 text-white'
              : 'border-gray-300 bg-white text-transparent'
          }`}
          aria-hidden="true"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>

      <div className="flex items-start gap-4 pr-12">
        {icon && (
          <div
            className={`p-3 rounded-xl shrink-0 transition-colors ${
              isSelected ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{title}</h3>
          {subtitle && <p className="text-sm font-medium text-emerald-800 mt-0.5">{subtitle}</p>}
          {description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{description}</p>}
        </div>
      </div>

      {children && <div className="mt-4 pt-3 border-t border-gray-100">{children}</div>}
    </div>
  );
};
