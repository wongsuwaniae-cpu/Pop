import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Layers, Languages, Image as ImageIcon, CheckCircle, Info } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { GameCard } from '../common/GameCard';
import { GAME_SETS, VOCABULARY_DATA } from '../../data/plantData';

interface SelectGameSetScreenProps {
  selectedSetId: string | null;
  onSelectSet: (setId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const SelectGameSetScreen: React.FC<SelectGameSetScreenProps> = ({
  selectedSetId,
  onSelectSet,
  onContinue,
  onBack,
}) => {
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedSetId || 'basic_plant_structures');

  const handleSelect = (setId: string) => {
    setCurrentSelected(setId);
    onSelectSet(setId);
  };

  const getSetIcon = (setId: string) => {
    switch (setId) {
      case 'basic_plant_structures':
        return <Layers className="w-6 h-6 text-emerald-700" />;
      case 'thai_to_english':
        return <Languages className="w-6 h-6 text-emerald-700" />;
      case 'image_to_vocab':
        return <ImageIcon className="w-6 h-6 text-emerald-700" />;
      default:
        return <Layers className="w-6 h-6 text-emerald-700" />;
    }
  };

  const selectedSetData = GAME_SETS.find((s) => s.id === currentSelected);

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            เลือกชุดเกม / Select Game Set
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            เลือกรูปแบบชุดคำศัพท์และบทเรียนที่ต้องการฝึกฝน (Select your preferred practice deck)
          </p>
        </div>

        <SecondaryButton
          id="select-set-back-btn"
          onClick={onBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="self-start sm:self-auto"
        >
          กลับหน้าหลัก / Home
        </SecondaryButton>
      </div>

      {/* Game Set Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {GAME_SETS.map((gameSet, index) => {
          const isSelected = currentSelected === gameSet.id;
          return (
            <GameCard
              key={gameSet.id}
              id={`game-set-card-${gameSet.id}`}
              title={gameSet.titleTh}
              subtitle={gameSet.titleEn}
              description={gameSet.descriptionTh}
              badgeText={`ชุดที่ ${index + 1}`}
              isSelected={isSelected}
              onClick={() => handleSelect(gameSet.id)}
              icon={getSetIcon(gameSet.id)}
              className="flex flex-col justify-between"
            >
              {/* Set Contents Summary */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                  <span>คำศัพท์ในบทเรียน ({gameSet.itemIds.length} รายการ):</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {gameSet.itemIds.map((itemId) => {
                    const vocab = VOCABULARY_DATA.find((v) => v.id === itemId);
                    return (
                      <span
                        key={itemId}
                        className="inline-block text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        {vocab ? `${vocab.thaiName} (${vocab.englishName})` : itemId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </GameCard>
          );
        })}
      </div>

      {/* Selected Set Confirmation & Actions */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
          <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-800 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">ชุดที่เลือกปัจจุบัน:</div>
            <div className="text-base font-bold text-emerald-900">
              {selectedSetData ? `${selectedSetData.titleTh} (${selectedSetData.titleEn})` : 'กรุณาเลือกชุดเกม'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <PrimaryButton
            id="select-set-continue-btn"
            onClick={onContinue}
            disabled={!currentSelected}
            icon={<ArrowRight className="w-5 h-5" />}
            fullWidth
            className="sm:w-auto px-8"
          >
            ดำเนินการต่อ / Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
