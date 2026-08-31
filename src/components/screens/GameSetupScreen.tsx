import React from 'react';
import {
  Play,
  ArrowLeft,
  Grid,
  Settings2,
  Sparkles,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Info,
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { GameConfig, MatchingType, DifficultyLevel } from '../../types/game';
import {
  GAME_SETS,
  MATCHING_TYPE_DETAILS,
  DIFFICULTY_CONFIG,
  DEFAULT_GAME_CONFIG,
  validateGameConfig,
  VOCABULARY_DATA,
} from '../../data/plantData';

interface GameSetupScreenProps {
  config: GameConfig;
  onUpdateConfig: (newConfig: Partial<GameConfig>) => void;
  onStartPlaying: () => void;
  onChangeGameSet: () => void;
  onViewInstructions?: () => void;
  onBack: () => void;
}

export const GameSetupScreen: React.FC<GameSetupScreenProps> = ({
  config,
  onUpdateConfig,
  onStartPlaying,
  onChangeGameSet,
  onViewInstructions,
  onBack,
}) => {
  const currentSet = GAME_SETS.find((s) => s.id === config.selectedGameSetId) || GAME_SETS[0];
  const validation = validateGameConfig(config, GAME_SETS, VOCABULARY_DATA);

  const handleSelectSet = (setId: string) => {
    const nextSet = GAME_SETS.find((s) => s.id === setId);
    if (!nextSet) return;

    // If current matchingType is not allowed in new set, switch to its default
    const isMatchingAllowed = nextSet.allowedMatchingTypes.includes(config.matchingType);
    onUpdateConfig({
      selectedGameSetId: setId,
      matchingType: isMatchingAllowed ? config.matchingType : nextSet.defaultMatchingType,
    });
  };

  const handleResetDefaults = () => {
    onUpdateConfig(DEFAULT_GAME_CONFIG);
  };

  const handleAutoFix = () => {
    if (!currentSet.allowedMatchingTypes.includes(config.matchingType)) {
      onUpdateConfig({ matchingType: currentSet.defaultMatchingType });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100/70 text-emerald-800">
              <Settings2 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              ตั้งค่าเกม / Game Setup
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            กำหนดรูปแบบบทเรียน โหมดการจับคู่ ระดับความยาก และตัวจับเวลา (Configure game session)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="setup-reset-default-btn"
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-emerald-800 bg-white hover:bg-emerald-50/60 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้น"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ตค่าเริ่มต้น / Reset</span>
          </button>

          <SecondaryButton
            id="setup-back-btn"
            onClick={onBack}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            กลับ / Back
          </SecondaryButton>
        </div>
      </div>

      {/* STEP 1: Game Set Selection */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
              1
            </span>
            <Layers className="w-4 h-4 text-emerald-700" />
            <span>ชุดบทเรียน (Game Set)</span>
          </div>

          <button
            id="setup-change-set-btn"
            onClick={onChangeGameSet}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>ดูรายละเอียดทุกชุด / View All Sets</span>
          </button>
        </div>

        {/* Quick Selection Cards for 3 Game Sets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {GAME_SETS.map((set) => {
            const isSelected = currentSet.id === set.id;
            return (
              <button
                key={set.id}
                id={`setup-set-option-${set.id}`}
                type="button"
                onClick={() => handleSelectSet(set.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30'
                    : 'border-gray-200 hover:border-emerald-200 bg-white hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {set.itemIds.length} คำศัพท์
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{set.titleTh}</h3>
                  <p className="text-xs font-medium text-emerald-800 mt-0.5">{set.titleEn}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{set.descriptionTh}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Matching Type Selection */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
              2
            </span>
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>รูปแบบการจับคู่ (Matching Mode)</span>
          </div>

          <span className="text-xs text-gray-500">
            เลือกได้ 1 รูปแบบต่อรอบการเล่น (Single mode per session)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(MATCHING_TYPE_DETAILS) as MatchingType[]).map((modeKey) => {
            const mode = MATCHING_TYPE_DETAILS[modeKey];
            const isAllowed = currentSet.allowedMatchingTypes.includes(modeKey);
            const isSelected = config.matchingType === modeKey;

            return (
              <button
                key={modeKey}
                id={`mode-option-${modeKey}`}
                type="button"
                disabled={!isAllowed}
                onClick={() => isAllowed && onUpdateConfig({ matchingType: modeKey })}
                className={`p-4 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between ${
                  !isAllowed
                    ? 'border-gray-200/60 bg-gray-50/70 opacity-60 cursor-not-allowed'
                    : isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30 cursor-pointer'
                    : 'border-gray-200 hover:border-emerald-200 bg-white cursor-pointer'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {mode.shortLabelTh}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900">{mode.labelTh}</h3>
                  <p className="text-xs font-medium text-emerald-800 mt-0.5">{mode.labelEn}</p>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{mode.descriptionTh}</p>
                </div>

                {!isAllowed && (
                  <div className="mt-3 pt-2 border-t border-gray-200/60 flex items-center gap-1 text-[11px] text-amber-800 font-medium">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>ไม่รองรับในชุดบทเรียนนี้</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {currentSet.id === 'thai_to_english' && (
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">หมายเหตุสำหรับชุดที่ 2 (Thai ↔ English):</span>{' '}
              ชุดบทเรียนนี้มุ่งเน้นการจำแนกคำศัพท์เฉพาะทางพฤกษศาสตร์ระหว่างภาษาไทยและภาษาอังกฤษโดยตรง
              จึงใช้รูปแบบการจับคู่แบบ <strong>ภาษาไทย ↔ ภาษาอังกฤษ</strong>
            </div>
          </div>
        )}
      </div>

      {/* STEP 3 & 4: Difficulty & Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Difficulty Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
              3
            </span>
            <Award className="w-4 h-4 text-emerald-700" />
            <span>ระดับความยาก (Difficulty)</span>
          </div>

          <div className="space-y-2.5">
            {(Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[]).map((diffKey) => {
              const diff = DIFFICULTY_CONFIG[diffKey];
              const isSelected = config.difficulty === diffKey;

              return (
                <button
                  key={diffKey}
                  id={`difficulty-option-${diffKey}`}
                  type="button"
                  onClick={() => onUpdateConfig({ difficulty: diffKey })}
                  className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600/30'
                      : 'border-gray-200 hover:border-emerald-200 bg-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{diff.labelTh}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                    </div>
                    <p className="text-xs text-gray-600">{diff.descriptionTh}</p>
                  </div>
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-800 border border-gray-200/60 ml-2">
                    {diff.pairsLabelTh}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Timer Selection */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                4
              </span>
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>การจับเวลา (Timer Mode)</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              เปิดใช้งานการจำกัดเวลา 60 วินาที เพื่อฝึกความเร็วในการจำและตอบสนอง
              หรือปิดการจับเวลาเพื่อการเรียนรู้แบบไม่มีความกดดัน
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
              config.timerEnabled
                ? 'border-emerald-500 bg-emerald-50/30'
                : 'border-gray-200 bg-gray-50/60'
            }`}
          >
            <div>
              <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${config.timerEnabled ? 'text-emerald-700' : 'text-gray-500'}`} />
                <span>{config.timerEnabled ? 'เปิดจับเวลา (60 วินาที)' : 'ปิดการจับเวลา (ไม่จำกัดเวลา)'}</span>
              </div>
              <p className="text-xs text-gray-600 mt-0.5">
                {config.timerEnabled
                  ? '60-Second Timed Challenge'
                  : 'Untimed Relaxed Practice'}
              </p>
            </div>

            <button
              id="setup-timer-toggle-btn"
              type="button"
              role="switch"
              aria-checked={config.timerEnabled}
              onClick={() => onUpdateConfig({ timerEnabled: !config.timerEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                config.timerEnabled ? 'bg-emerald-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  config.timerEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* STEP 5: Configuration Summary & Validation Status Card */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>สรุปการตั้งค่ารอบการเล่น (Configuration Summary)</span>
          </div>

          {validation.isValid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>พร้อมเริ่มเล่น (Ready)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-bold border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
              <span>การตั้งค่าไม่สมบูรณ์</span>
            </span>
          )}
        </div>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-500 block">ชุดบทเรียน</span>
            <span className="text-sm font-bold text-gray-900 block truncate mt-0.5">
              {currentSet.titleTh}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium block truncate">
              {currentSet.titleEn}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-500 block">รูปแบบจับคู่</span>
            <span className="text-sm font-bold text-gray-900 block truncate mt-0.5">
              {MATCHING_TYPE_DETAILS[config.matchingType]?.labelTh || config.matchingType}
            </span>
            <span className="text-[11px] text-emerald-800 font-medium block truncate">
              {MATCHING_TYPE_DETAILS[config.matchingType]?.labelEn || ''}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-500 block">ระดับความยาก</span>
            <span className="text-sm font-bold text-gray-900 block truncate mt-0.5">
              {DIFFICULTY_CONFIG[config.difficulty]?.labelTh || config.difficulty}
            </span>
            <span className="text-[11px] text-gray-600 font-medium block truncate">
              {DIFFICULTY_CONFIG[config.difficulty]?.pairsLabelTh || ''}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-[11px] font-semibold text-gray-500 block">ตัวจับเวลา</span>
            <span className="text-sm font-bold text-gray-900 block truncate mt-0.5">
              {config.timerEnabled ? '60 วินาที' : 'ไม่จำกัดเวลา'}
            </span>
            <span className="text-[11px] text-gray-600 font-medium block truncate">
              {config.timerEnabled ? 'Timed Mode' : 'Untimed'}
            </span>
          </div>
        </div>

        {/* Invalidation Alert if any */}
        {!validation.isValid && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{validation.errorTh}</p>
                <p className="text-rose-700">{validation.errorEn}</p>
              </div>
            </div>

            <button
              id="setup-autofix-btn"
              type="button"
              onClick={handleAutoFix}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
            >
              แก้ไขอัตโนมัติ / Auto-Fix
            </button>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {onViewInstructions && (
            <SecondaryButton
              id="setup-how-to-play-btn"
              onClick={onViewInstructions}
              icon={<BookOpen className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              วิธีเล่น / How to Play
            </SecondaryButton>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <SecondaryButton
            id="setup-cancel-btn"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            ยกเลิก / Cancel
          </SecondaryButton>

          <PrimaryButton
            id="setup-start-btn"
            onClick={onStartPlaying}
            disabled={!validation.isValid}
            icon={<Play className="w-5 h-5 fill-current" />}
            className="w-full sm:w-auto px-8"
          >
            เริ่มเกม / Start Game
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
