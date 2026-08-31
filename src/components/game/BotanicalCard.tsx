import React, { useState } from 'react';
import { Check, AlertCircle, ImageOff, Sparkles, Lightbulb } from 'lucide-react';
import { GameCard } from '../../types/game';

interface BotanicalCardProps {
  card: GameCard;
  isSelected: boolean;
  isMatched: boolean;
  isError: boolean;
  isHinted?: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const BotanicalCard: React.FC<BotanicalCardProps> = ({
  card,
  isSelected,
  isMatched,
  isError,
  isHinted = false,
  disabled,
  onClick,
}) => {
  const [imageError, setImageError] = useState(false);

  // Status-dependent classes
  let cardStyles = 'border-gray-200/90 bg-white hover:border-emerald-300 hover:shadow-xs';
  if (isMatched) {
    cardStyles = 'border-emerald-600 bg-emerald-50/50 text-emerald-950 shadow-2xs opacity-90 cursor-default';
  } else if (isError) {
    cardStyles = 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-400 text-rose-950 animate-shake';
  } else if (isSelected) {
    cardStyles = 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500 shadow-sm text-emerald-950';
  } else if (isHinted) {
    cardStyles = 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400 shadow-sm text-amber-950';
  }

  const ariaLabelText = card.contentType === 'image'
    ? `${card.altText || 'ภาพโครงสร้างพืช'} (${isMatched ? 'จับคู่แล้ว' : isSelected ? 'เลือกอยู่' : isHinted ? 'มีคำใบ้' : 'ยังไม่เลือก'})`
    : `${card.displayValue} (${isMatched ? 'จับคู่แล้ว' : isSelected ? 'เลือกอยู่' : isHinted ? 'มีคำใบ้' : 'ยังไม่เลือก'})`;

  return (
    <button
      id={`card-${card.cardId}`}
      type="button"
      disabled={disabled || isMatched}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-disabled={disabled || isMatched}
      aria-label={ariaLabelText}
      className={`group relative w-full rounded-2xl border-2 p-3 sm:p-4 text-center transition-all duration-150 flex flex-col items-center justify-center min-h-[105px] sm:min-h-[135px] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
        disabled || isMatched ? 'cursor-default' : 'cursor-pointer'
      } ${cardStyles}`}
    >
      {/* Matched Check Indicator */}
      {isMatched && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-emerald-600 text-white rounded-full p-1 shadow-2xs" aria-hidden="true">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && !isMatched && !isError && (
        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5" aria-hidden="true">
          <Sparkles className="w-2.5 h-2.5 fill-current" />
          <span>เลือก</span>
        </div>
      )}

      {/* Hint Indicator */}
      {isHinted && !isMatched && !isSelected && !isError && (
        <div className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5 animate-pulse" aria-hidden="true">
          <Lightbulb className="w-2.5 h-2.5 fill-current" />
          <span>คำใบ้</span>
        </div>
      )}

      {/* Error Indicator */}
      {isError && (
        <div className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1 shadow-2xs" aria-hidden="true">
          <AlertCircle className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      )}

      {/* Content Rendering */}
      {card.contentType === 'image' ? (
        <div className="w-full flex flex-col items-center justify-center gap-2">
          {!imageError && card.image ? (
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 rounded-xl bg-gray-50/80 border border-gray-100 group-hover:border-emerald-200 transition-colors">
              <img
                src={card.image}
                alt={card.altText || card.displayValue}
                onError={() => setImageError(true)}
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <ImageOff className="w-6 h-6 text-emerald-600 mb-1" />
              <span className="text-[10px] font-bold text-center leading-tight line-clamp-2">
                {card.altText || card.displayValue}
              </span>
            </div>
          )}
          <span className="text-[11px] font-semibold text-gray-500 group-hover:text-emerald-800 transition-colors">
            ภาพอวัยวะพืช
          </span>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center py-2 px-1">
          <span
            className={`font-extrabold text-base sm:text-xl tracking-tight transition-colors ${
              isMatched
                ? 'text-emerald-900'
                : isSelected
                ? 'text-emerald-950'
                : 'text-gray-900 group-hover:text-emerald-900'
            }`}
          >
            {card.displayValue}
          </span>
          <span className="text-[11px] font-semibold text-gray-400 mt-1 uppercase tracking-wider">
            {card.contentType === 'thai' ? 'คำศัพท์ภาษาไทย' : 'Botanical Term'}
          </span>
        </div>
      )}
    </button>
  );
};
