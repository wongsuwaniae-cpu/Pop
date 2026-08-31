import React, { useEffect, useState } from 'react';
import { Play, Grid, BookOpen, Sparkles, CheckCircle2, Award } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { PlantIllustration } from '../common/PlantIllustration';
import { VOCABULARY_DATA } from '../../data/plantData';
import { getBestScore } from '../../utils/storage';

interface HomeScreenProps {
  onStartGame: () => void;
  onSelectGameSet: () => void;
  onViewInstructions: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onSelectGameSet,
  onViewInstructions,
}) => {
  const [bestScore, setBestScore] = useState<number | null>(null);

  useEffect(() => {
    setBestScore(getBestScore());
  }, []);

  return (
    <main className="flex flex-col items-center text-center space-y-8 sm:space-y-12">
      {/* Title & Introduction Section */}
      <section className="max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-semibold tracking-wide border border-emerald-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>สื่อการเรียนรู้ชีววิทยาและพฤกษศาสตร์ระดับอุดมศึกษา</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          เกมจับคู่โครงสร้างพืช
          <span className="block text-xl sm:text-2xl md:text-3xl font-semibold text-emerald-800 mt-2">
            Plant Structure Matching Game
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto">
          ฝึกทบทวนและจับคู่โครงสร้างส่วนประกอบของพืช ทั้งคำศัพท์ภาษาไทย ภาษาอังกฤษ และภาพกายวิภาคศาสตร์พืช
          เพื่อเตรียมความพร้อมสู่การเรียนรู้ด้านพฤกษศาสตร์และวิทยาศาสตร์สุขภาพ
        </p>

        {/* Lightweight Best Score Indicator */}
        {bestScore !== null && bestScore > 0 && (
          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold shadow-2xs">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>คะแนนสูงสุดที่ทำได้ (Best Score):</span>
              <span className="text-emerald-950 font-black text-sm">{bestScore}</span>
              <span>คะแนน</span>
            </div>
          </div>
        )}
      </section>

      {/* Action Buttons Section */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full max-w-md">
        <PrimaryButton
          id="home-start-game-btn"
          onClick={onStartGame}
          icon={<Play className="w-5 h-5 fill-current" />}
          fullWidth
          className="text-lg py-3.5 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          เริ่มเกม / Start Game
        </PrimaryButton>

        <SecondaryButton
          id="home-select-set-btn"
          onClick={onSelectGameSet}
          icon={<Grid className="w-5 h-5" />}
          fullWidth
          className="text-base py-3 focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          เลือกชุดเกม / Select Set
        </SecondaryButton>

        <SecondaryButton
          id="home-instructions-btn"
          onClick={onViewInstructions}
          icon={<BookOpen className="w-5 h-5" />}
          variant="outline"
          fullWidth
          className="text-base py-3 focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          วิธีเล่น / How to Play
        </SecondaryButton>
      </section>

      {/* Vocabulary Overview Grid */}
      <section className="w-full pt-4">
        <div className="flex items-center justify-between mb-4 px-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-gray-800 tracking-wider">
              โครงสร้างหลักในบทเรียน (6 Core Botanical Organs)
            </h2>
          </div>
          <span className="text-xs text-gray-700 font-medium">6 คำศัพท์มาตรฐาน</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {VOCABULARY_DATA.map((vocab) => (
            <div
              key={vocab.id}
              id={`vocab-preview-${vocab.id}`}
              className="bg-white rounded-xl p-3 border border-emerald-100/80 shadow-xs flex flex-col items-center text-center hover:border-emerald-300 transition-colors"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2">
                <PlantIllustration
                  id={vocab.id}
                  altText={vocab.altText}
                  imageSrc={vocab.image}
                />
              </div>
              <div className="font-bold text-gray-900 text-base">{vocab.thaiName}</div>
              <div className="text-xs font-semibold text-emerald-800">{vocab.englishName}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

