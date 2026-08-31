import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScreenState } from '../../types/game';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: ScreenState;
  onNavigateHome: () => void;
  onNavigateInstructions: () => void;
  onNavigateBack?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentScreen,
  onNavigateHome,
  onNavigateInstructions,
  onNavigateBack,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7faf7] text-gray-900">
      <Header
        currentScreen={currentScreen}
        onNavigateHome={onNavigateHome}
        onNavigateInstructions={onNavigateInstructions}
        onNavigateBack={onNavigateBack}
      />
      <main id="main-content" className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
};
