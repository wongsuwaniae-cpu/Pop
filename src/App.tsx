import React, { useState } from 'react';
import { ScreenState, GameConfig, GameResult } from './types/game';
import { DEFAULT_GAME_CONFIG, VOCABULARY_DATA, GAME_SETS } from './data/plantData';
import { Layout } from './components/layout/Layout';
import { HomeScreen } from './components/screens/HomeScreen';
import { SelectGameSetScreen } from './components/screens/SelectGameSetScreen';
import { InstructionsScreen } from './components/screens/InstructionsScreen';
import { GameSetupScreen } from './components/screens/GameSetupScreen';
import { GameBoardScreen } from './components/screens/GameBoardScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AlertTriangle } from 'lucide-react';
import { PrimaryButton } from './components/common/PrimaryButton';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('HOME');
  const [previousScreen, setPreviousScreen] = useState<ScreenState | null>(null);
  const [gameConfig, setGameConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);

  const navigateTo = (screen: ScreenState) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
      setPreviousScreen(null);
    } else {
      setCurrentScreen('HOME');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateConfig = (newConfig: Partial<GameConfig>) => {
    setGameConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleSelectGameSet = (setId: string) => {
    const selectedSet = GAME_SETS.find((s) => s.id === setId);
    if (selectedSet) {
      setGameConfig((prev) => ({
        ...prev,
        selectedGameSetId: setId,
        matchingType: selectedSet.defaultMatchingType,
      }));
    }
  };

  const handleFinishGame = (result: GameResult) => {
    setLastGameResult(result);
    navigateTo('RESULT');
  };

  // Safe fallback if vocabulary data is empty
  if (!VOCABULARY_DATA || VOCABULARY_DATA.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f7faf7]">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full border border-rose-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">ไม่พบชุดข้อมูลคำศัพท์</h2>
          <p className="text-sm text-gray-600">
            ขออภัย ระบบไม่สามารถโหลดฐานข้อมูลคำศัพท์พฤกษศาสตร์ได้ในขณะนี้
          </p>
          <PrimaryButton
            id="empty-data-reload-btn"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            โหลดข้อมูลใหม่อีกครั้ง
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <Layout
      currentScreen={currentScreen}
      onNavigateHome={() => navigateTo('HOME')}
      onNavigateInstructions={() => navigateTo('INSTRUCTIONS')}
      onNavigateBack={currentScreen !== 'HOME' ? handleBack : undefined}
    >
      {currentScreen === 'HOME' && (
        <HomeScreen
          onStartGame={() => navigateTo('SETUP')}
          onSelectGameSet={() => navigateTo('SELECT_SET')}
          onViewInstructions={() => navigateTo('INSTRUCTIONS')}
        />
      )}

      {currentScreen === 'SELECT_SET' && (
        <SelectGameSetScreen
          selectedSetId={gameConfig.selectedGameSetId}
          onSelectSet={handleSelectGameSet}
          onContinue={() => navigateTo('SETUP')}
          onBack={() => navigateTo('HOME')}
        />
      )}

      {currentScreen === 'INSTRUCTIONS' && (
        <InstructionsScreen
          onStartGame={() => navigateTo('SETUP')}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'SETUP' && (
        <GameSetupScreen
          config={gameConfig}
          onUpdateConfig={handleUpdateConfig}
          onStartPlaying={() => navigateTo('BOARD')}
          onChangeGameSet={() => navigateTo('SELECT_SET')}
          onViewInstructions={() => navigateTo('INSTRUCTIONS')}
          onBack={() => navigateTo('HOME')}
        />
      )}

      {currentScreen === 'BOARD' && (
        <GameBoardScreen
          config={gameConfig}
          onFinishGame={handleFinishGame}
          onReturnToSetup={() => navigateTo('SETUP')}
          onReturnToHome={() => navigateTo('HOME')}
        />
      )}

      {currentScreen === 'RESULT' && (
        <ResultScreen
          config={gameConfig}
          result={lastGameResult}
          onPlayAgain={() => navigateTo('BOARD')}
          onGoToSetup={() => navigateTo('SETUP')}
          onReturnToHome={() => navigateTo('HOME')}
        />
      )}
    </Layout>
  );
};
