import React, { useState } from 'react';

interface PlantIllustrationProps {
  id: string;
  altText: string;
  imageSrc?: string;
  className?: string;
}

export const PlantIllustration: React.FC<PlantIllustrationProps> = ({
  id,
  altText,
  imageSrc,
  className = 'w-full h-full object-contain',
}) => {
  const [imageError, setImageError] = useState(false);

  // If there's an imageSrc provided and it hasn't failed to load, attempt rendering image
  if (imageSrc && !imageError) {
    return (
      <img
        src={imageSrc}
        alt={altText}
        className={className}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    );
  }

  // Graceful, crisp SVG Botanical diagrams when static image file is not present or fails
  const renderBotanicalSvg = () => {
    switch (id) {
      case 'root':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Ground line */}
            <line x1="15" y1="35" x2="105" y2="35" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
            <text x="60" y="25" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">ระดับผิวดิน / Soil Surface</text>
            {/* Base Stem */}
            <path d="M 55 35 L 55 15 Q 60 12 65 15 L 65 35" fill="#40916c" />
            {/* Primary Taproot */}
            <path d="M 55 35 Q 60 75 60 108 Q 62 75 65 35 Z" fill="#854d0e" opacity="0.9" />
            {/* Secondary & Lateral Roots */}
            <path d="M 58 48 Q 40 55 25 65 M 58 58 Q 42 68 30 82 M 59 75 Q 45 84 35 96" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            <path d="M 62 48 Q 80 55 95 65 M 62 58 Q 78 68 90 82 M 61 75 Q 75 84 85 96" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            {/* Tertiary Root Hairs */}
            <path d="M 28 63 Q 22 68 18 72 M 35 80 Q 28 85 24 90 M 92 63 Q 98 68 102 72 M 85 80 Q 92 85 96 90" fill="none" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case 'stem':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Main Shoot / Stem Axis */}
            <path d="M 54 110 L 54 18 Q 60 14 66 18 L 66 110 Z" fill="#2d6a4f" />
            {/* Nodes & Internodes */}
            <line x1="50" y1="85" x2="70" y2="85" stroke="#1b4332" strokeWidth="2.5" />
            <line x1="50" y1="55" x2="70" y2="55" stroke="#1b4332" strokeWidth="2.5" />
            <line x1="52" y1="28" x2="68" y2="28" stroke="#1b4332" strokeWidth="2.5" />
            {/* Axillary Buds & Side branches */}
            <path d="M 54 85 Q 38 78 30 70" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="28" cy="68" rx="4" ry="7" fill="#52b788" transform="rotate(-30 28 68)" />
            <path d="M 66 55 Q 82 48 90 40" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="92" cy="38" rx="4" ry="7" fill="#52b788" transform="rotate(30 92 38)" />
            {/* Apical Bud at the tip */}
            <path d="M 60 12 C 55 16 57 22 60 22 C 63 22 65 16 60 12 Z" fill="#74c69d" />
          </svg>
        );

      case 'leaf':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Petiole (ก้านใบ) */}
            <path d="M 20 100 Q 38 85 50 68" fill="none" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" />
            {/* Leaf Blade (แผ่นใบ) */}
            <path d="M 45 74 C 28 50 40 18 95 18 C 105 55 85 92 45 74 Z" fill="#52b788" stroke="#1b4332" strokeWidth="1.5" />
            {/* Midrib (เส้นกลางใบ) */}
            <path d="M 45 74 Q 65 52 95 18" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" />
            {/* Lateral Veins (เส้นแขนงใบ) */}
            <path d="M 55 64 Q 50 48 44 42 M 65 53 Q 58 38 52 30 M 75 42 Q 68 28 62 20" fill="none" stroke="#2d6a4f" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M 58 61 Q 72 62 80 66 M 68 50 Q 82 48 88 52 M 78 39 Q 88 34 94 36" fill="none" stroke="#2d6a4f" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case 'flower':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Pedicel / Stem */}
            <path d="M 60 70 L 60 110" stroke="#2d6a4f" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 60 90 Q 75 85 82 78" stroke="#2d6a4f" strokeWidth="2" fill="none" />
            <ellipse cx="84" cy="76" rx="4" ry="7" fill="#52b788" transform="rotate(45 84 76)" />
            {/* Sepals (กลีบเลี้ยง) */}
            <path d="M 46 72 C 54 75 66 75 74 72 L 60 82 Z" fill="#2d6a4f" />
            {/* Petals (กลีบดอก) */}
            <circle cx="60" cy="36" r="16" fill="#fb7185" />
            <circle cx="38" cy="50" r="16" fill="#fb7185" />
            <circle cx="82" cy="50" r="16" fill="#fb7185" />
            <circle cx="46" cy="68" r="16" fill="#f43f5e" />
            <circle cx="74" cy="68" r="16" fill="#f43f5e" />
            {/* Central Flower Core (เกสร) */}
            <circle cx="60" cy="54" r="13" fill="#fde047" stroke="#eab308" strokeWidth="1.5" />
            {/* Pistil & Stamen details */}
            <circle cx="56" cy="50" r="1.5" fill="#ca8a04" />
            <circle cx="64" cy="50" r="1.5" fill="#ca8a04" />
            <circle cx="60" cy="58" r="1.5" fill="#ca8a04" />
            <circle cx="53" cy="56" r="1.5" fill="#ca8a04" />
            <circle cx="67" cy="56" r="1.5" fill="#ca8a04" />
          </svg>
        );

      case 'fruit':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Fruit Stalk */}
            <path d="M 60 30 Q 55 15 48 10" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
            {/* Calyx remnants */}
            <ellipse cx="60" cy="30" rx="6" ry="3" fill="#4d7c0f" />
            {/* Fruit Body (Pericarp) */}
            <path d="M 60 32 C 30 32 18 55 22 80 C 26 100 48 110 60 108 C 72 110 94 100 98 80 C 102 55 90 32 60 32 Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Highlight gleam */}
            <path d="M 38 48 C 32 58 32 72 36 82" fill="none" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </svg>
        );

      case 'seed':
        return (
          <svg viewBox="0 0 120 120" className={className} aria-label={altText} role="img">
            {/* Seed Coat (Testa) outer contour */}
            <path d="M 60 15 C 32 15 22 45 25 75 C 28 98 48 110 65 110 C 85 110 98 90 95 62 C 92 35 82 15 60 15 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            {/* Hilum (ขั้วเมล็ด) */}
            <path d="M 32 55 Q 28 68 34 80" fill="none" stroke="#fef3c7" strokeWidth="3.5" strokeLinecap="round" />
            {/* Cutaway showing Cotyledon and Embryo */}
            <path d="M 60 30 C 42 30 38 50 40 70 C 42 88 56 95 68 95 C 80 95 86 80 84 60 C 82 42 75 30 60 30 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
            {/* Radicle and Plumule (ต้นอ่อน) */}
            <path d="M 48 60 Q 52 50 56 46 Q 60 42 65 44" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="66" cy="44" r="2" fill="#22c55e" />
          </svg>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 text-emerald-800 rounded-lg text-center h-full">
            <span className="text-2xl mb-1">🌱</span>
            <span className="text-xs font-medium">{altText}</span>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2 bg-gradient-to-b from-emerald-50/50 to-emerald-100/30 rounded-lg overflow-hidden">
      {renderBotanicalSvg()}
    </div>
  );
};
