import React, { useEffect, useState } from 'react';
import {
  Award,
  RotateCcw,
  Home,
  Settings2,
  CheckCircle2,
  AlertCircle,
  Timer,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  Target,
  Trophy,
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { GameConfig, GameResult } from '../../types/game';
import {
  GAME_SETS,
  MATCHING_TYPE_DETAILS,
  DIFFICULTY_CONFIG,
} from '../../data/plantData';
import { recordCompletedScore, getBestScore } from '../../utils/storage';

interface ResultScreenProps {
  config: GameConfig;
  result: GameResult | null;
  onPlayAgain: () => void;
  onGoToSetup: () => void;
  onReturnToHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  config,
  result,
  onPlayAgain,
  onGoToSetup,
  onReturnToHome,
}) => {
  const currentSet = GAME_SETS.find((s) => s.id === (result?.selectedGameSetId || config.selectedGameSetId)) || GAME_SETS[0];
  const matchingTypeInfo = MATCHING_TYPE_DETAILS[result?.matchingType || config.matchingType] || MATCHING_TYPE_DETAILS.IMAGE_TO_THAI;
  const difficultyInfo = DIFFICULTY_CONFIG[result?.difficulty || config.difficulty] || DIFFICULTY_CONFIG.EASY;

  const [bestScore, setBestScore] = useState<number>(0);
  const [isNewBestRecord, setIsNewBestRecord] = useState<boolean>(false);

  useEffect(() => {
    if (result) {
      const { isNewBest, currentBest } = recordCompletedScore(result.score, result.outcome);
      setIsNewBestRecord(isNewBest);
      setBestScore(currentBest);
    } else {
      setBestScore(getBestScore() ?? 0);
    }
  }, [result]);

  // Safe fallback if navigated to Result without valid active result
  if (!result) {
    return (
      <main className="space-y-6 max-w-xl mx-auto text-center py-10">
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <HelpCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ไม่พบข้อมูลผลการเล่นล่าสุด</h1>
          <p className="text-sm text-gray-600">
            ยังไม่มีรอบการเล่นที่เสร็จสิ้น กรุณาเริ่มเล่นเกมใหม่อีกครั้ง
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <PrimaryButton
              id="result-empty-setup-btn"
              onClick={onGoToSetup}
              icon={<Settings2 className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              ไปหน้าตั้งค่าเกม / Game Setup
            </PrimaryButton>
            <SecondaryButton
              id="result-empty-home-btn"
              onClick={onReturnToHome}
              icon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              กลับหน้าหลัก / Home
            </SecondaryButton>
          </div>
        </div>
      </main>
    );
  }

  const isCompleted = result.outcome === 'COMPLETED';

  return (
    <main className="space-y-6 max-w-3xl mx-auto">
      {/* Top Main Result Card */}
      <section
        className={`bg-white rounded-3xl p-6 sm:p-8 border shadow-xs space-y-6 text-center ${
          isCompleted ? 'border-emerald-200' : 'border-rose-200'
        }`}
      >
        {/* Outcome Badge & Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {isCompleted ? (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-black shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>เล่นสำเร็จ / Completed!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-900 border border-rose-300 text-xs sm:text-sm font-black shadow-2xs">
                <Timer className="w-4 h-4 text-rose-700" />
                <span>หมดเวลาการเล่น / Time Up!</span>
              </div>
            )}

            {isNewBestRecord && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-xs font-black shadow-2xs animate-pulse">
                <Trophy className="w-3.5 h-3.5 text-amber-700 fill-current" />
                <span>สถิติใหม่ / New Best Record!</span>
              </div>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            สรุปผลการทดสอบพฤกษศาสตร์ / Performance Summary
          </h1>

          {/* Performance Level Pill */}
          <div className="flex flex-col items-center justify-center gap-1.5 pt-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              ระดับผลการประเมิน (Performance Level)
            </span>
            <div
              className={`px-4 py-1.5 rounded-xl border text-sm sm:text-base font-black flex items-center gap-2 ${result.performanceLevel.badgeClass}`}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>
                {result.performanceLevel.labelTh} ({result.performanceLevel.labelEn})
              </span>
            </div>
            <p className="text-xs text-gray-600 max-w-md pt-1">
              {result.performanceLevel.descriptionTh}
            </p>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Current Score & Best Score */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between text-left">
            <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              คะแนนรอบนี้ (Score)
            </span>
            <div className="mt-2">
              <span id="result-score-value" className="text-3xl font-black text-emerald-950">
                {result.score}
              </span>
              <span className="text-xs font-semibold text-emerald-800 ml-1">แต้ม</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] text-emerald-800 font-semibold border-t border-emerald-200/60 pt-1">
              <span>คะแนนสูงสุด (Best):</span>
              <span className="font-black text-emerald-950">{bestScore} แต้ม</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between text-left">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-700" />
              ความแม่นยำ (Accuracy)
            </span>
            <div className="mt-2">
              <span id="result-accuracy-value" className="text-3xl font-black text-gray-900">
                {result.accuracy}%
              </span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-medium">
              {result.matchedPairs} จาก {result.totalPairs} คู่
            </span>
          </div>

          {/* Misses */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between text-left">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              ข้อผิดพลาด (Misses)
            </span>
            <div className="mt-2">
              <span id="result-misses-value" className="text-3xl font-black text-gray-900">
                {result.incorrectAttempts}
              </span>
              <span className="text-xs font-semibold text-gray-500 ml-1">ครั้ง</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-medium">
              {result.hintsUsedCount > 0 ? `(ใช้คำใบ้ ${result.hintsUsedCount} ครั้ง)` : 'ไม่ใช้คำใบ้'}
            </span>
          </div>

          {/* Time Used */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col justify-between text-left">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-600" />
              เวลาที่ใช้ (Time)
            </span>
            <div className="mt-2">
              <span id="result-time-value" className="text-lg sm:text-xl font-black text-gray-900 leading-tight">
                {result.formattedTimeUsed}
              </span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-medium">
              {result.timerEnabled ? 'โหมดจำกัดเวลา 60s' : 'โหมดไม่จำกัดเวลา'}
            </span>
          </div>
        </div>

        {/* Configuration Summary Badge Strip */}
        <div className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 text-left space-y-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            รายละเอียดการตั้งค่ารอบนี้ (Round Details)
          </span>
          <div className="flex flex-wrap gap-2 pt-1 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-800">
              ชุด: <strong className="text-gray-950">{currentSet.titleTh}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-800">
              รูปแบบ: <strong className="text-gray-950">{matchingTypeInfo.shortLabelTh}</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-800">
              ความยาก: <strong className="text-gray-950">{difficultyInfo.labelEn} ({result.totalPairs} คู่)</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 font-semibold text-gray-800">
              โหมดเวลา: <strong className="text-gray-950">{result.timerEnabled ? '60 วินาที' : 'ไม่จับเวลา'}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Vocabulary Review Section */}
      {result.roundItems && result.roundItems.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-base font-bold text-gray-900">
                ทบทวนคำศัพท์พฤกษศาสตร์ในรอบนี้ / Botanical Vocabulary Review
              </h2>
              <p className="text-xs text-gray-500">
                คำศัพท์และโครงสร้างพืชที่ปรากฏในการทดสอบ {result.roundItems.length} รายการ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.roundItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-200/80 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 p-1 flex items-center justify-center shrink-0">
                  <img
                    src={item.image}
                    alt={item.altText}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-gray-900">{item.thaiName}</span>
                    <span className="text-xs text-emerald-800 font-semibold">({item.englishName})</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Navigation & Action Buttons */}
      <nav aria-label="Result Screen Navigation" className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <SecondaryButton
          id="result-home-btn"
          onClick={onReturnToHome}
          icon={<Home className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          หน้าหลัก / Home
        </SecondaryButton>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SecondaryButton
            id="result-setup-btn"
            onClick={onGoToSetup}
            icon={<Settings2 className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            ตั้งค่าเกมใหม่ / New Game
          </SecondaryButton>

          <PrimaryButton
            id="result-play-again-btn"
            onClick={onPlayAgain}
            icon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto px-8"
          >
            เล่นอีกครั้ง / Play Again
          </PrimaryButton>
        </div>
      </nav>
    </main>
  );
};

