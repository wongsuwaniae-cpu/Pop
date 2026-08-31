import React from 'react';
import { Sprout, HelpCircle, ArrowLeft, Home } from 'lucide-react';
import { ScreenState } from '../../types/game';

interface HeaderProps {
  currentScreen: ScreenState;
  onNavigateHome: () => void;
  onNavigateInstructions: () => void;
  onNavigateBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigateHome,
  onNavigateInstructions,
  onNavigateBack,
}) => {
  return (
    <header id="app-header" className="bg-white/90 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Logo / Brand & Back navigation */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'HOME' && (
            <button
              id="header-back-btn"
              onClick={onNavigateBack || onNavigateHome}
              aria-label="ย้อนกลับ (Go back)"
              className="p-2 -ml-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <button
            id="header-brand-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-800 transition-colors shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base sm:text-lg leading-tight group-hover:text-emerald-800 transition-colors">
                เกมจับคู่โครงสร้างพืช
              </div>
              <div className="text-xs text-gray-700 font-medium tracking-wide">
                Plant Structure Matching Game
              </div>
            </div>
          </button>
        </div>

        {/* Right action controls */}
        <nav aria-label="Main Navigation" className="flex items-center gap-2">
          {currentScreen !== 'HOME' && (
            <button
              id="header-home-btn"
              onClick={onNavigateHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:text-emerald-800 hover:bg-emerald-50/60 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>หน้าหลัก / Home</span>
            </button>
          )}

          {currentScreen !== 'INSTRUCTIONS' && (
            <button
              id="header-help-btn"
              onClick={onNavigateInstructions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600"
              aria-label="วิธีเล่นเกม (How to play)"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">วิธีเล่น / Instructions</span>
              <span className="sm:hidden">วิธีเล่น</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
