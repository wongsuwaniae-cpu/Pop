import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowLeft,
  Home,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Clock,
  Award,
  CheckCircle2,
  CheckCircle,
  Settings2,
  Lightbulb,
  Timer,
} from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SecondaryButton } from '../common/SecondaryButton';
import { BotanicalCard } from '../game/BotanicalCard';
import { GameConfig, GameCard, RoundData, GameResult, GameOutcome } from '../../types/game';
import {
  GAME_SETS,
  MATCHING_TYPE_DETAILS,
  DIFFICULTY_CONFIG,
  validateGameConfig,
  VOCABULARY_DATA,
  DEFAULT_TIMER_DURATION_SECONDS,
  SCORE_CORRECT_MATCH,
  SCORE_HINT_PENALTY,
  SCORE_COMPLETION_BONUS,
  HINT_DISPLAY_DURATION_MS,
} from '../../data/plantData';
import {
  generateRound,
  checkCardsMatch,
  buildGameResult,
} from '../../utils/gameEngine';

interface GameBoardScreenProps {
  config: GameConfig;
  onFinishGame: (result: GameResult) => void;
  onReturnToSetup: () => void;
  onReturnToHome: () => void;
}

export const GameBoardScreen: React.FC<GameBoardScreenProps> = ({
  config,
  onFinishGame,
  onReturnToSetup,
  onReturnToHome,
}) => {
  // Config information
  const currentSet = GAME_SETS.find((s) => s.id === config.selectedGameSetId) || GAME_SETS[0];
  const matchingTypeInfo = MATCHING_TYPE_DETAILS[config.matchingType] || MATCHING_TYPE_DETAILS.IMAGE_TO_THAI;
  const difficultyInfo = DIFFICULTY_CONFIG[config.difficulty] || DIFFICULTY_CONFIG.EASY;
  const validation = validateGameConfig(config, GAME_SETS, VOCABULARY_DATA);

  // Active Round State
  const [roundData, setRoundData] = useState<RoundData | null>(null);
  const [selectedLeftCardId, setSelectedLeftCardId] = useState<string | null>(null);
  const [selectedRightCardId, setSelectedRightCardId] = useState<string | null>(null);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [matchingScore, setMatchingScore] = useState<number>(0);
  const [hintsUsedCount, setHintsUsedCount] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  const [activeHintPairId, setActiveHintPairId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorCardIds, setErrorCardIds] = useState<string[]>([]);
  const [roundOutcome, setRoundOutcome] = useState<GameOutcome | null>(null);
  const [cachedResult, setCachedResult] = useState<GameResult | null>(null);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'hint';
    messageTh: string;
    messageEn: string;
  } | null>(null);

  // Timer State
  const initialTime = config.timerDurationSeconds || DEFAULT_TIMER_DURATION_SECONDS;
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);

  // References for safe cleanup and race condition prevention
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const roundStartedAtRef = useRef<number>(Date.now());
  const isFinalizedRef = useRef<boolean>(false);

  // Clear running timers
  const cleanupTimers = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
  }, []);

  // Finalize Round and produce GameResult
  const finalizeRound = useCallback(
    (outcome: GameOutcome, currentMatchedIds: string[], currentScore: number, hintCount: number, misses: number) => {
      if (isFinalizedRef.current) return;
      isFinalizedRef.current = true;
      cleanupTimers();
      setRoundOutcome(outcome);
      setIsEvaluating(true); // Lock interactions

      const roundEndedAt = Date.now();
      let timeUsedSeconds = 0;
      if (config.timerEnabled) {
        timeUsedSeconds = Math.max(1, initialTime - timeRemaining);
      } else {
        timeUsedSeconds = Math.max(1, Math.round((roundEndedAt - roundStartedAtRef.current) / 1000));
      }

      if (roundData) {
        const result = buildGameResult({
          outcome,
          matchingScore: currentScore,
          hintsUsedCount: hintCount,
          matchedPairs: currentMatchedIds.length,
          totalPairs: roundData.totalPairs,
          incorrectAttempts: misses,
          timeUsedSeconds,
          config,
          roundItems: roundData.roundItems,
        });
        setCachedResult(result);
      }
    },
    [cleanupTimers, config, initialTime, roundData, timeRemaining]
  );

  // Initialize a fresh round
  const startNewRound = useCallback(() => {
    cleanupTimers();
    isFinalizedRef.current = false;
    roundStartedAtRef.current = Date.now();

    if (!validation.isValid) {
      setRoundData(null);
      return;
    }

    const newRound = generateRound(config, GAME_SETS, VOCABULARY_DATA);
    setRoundData(newRound);
    setSelectedLeftCardId(null);
    setSelectedRightCardId(null);
    setMatchedPairIds([]);
    setMatchingScore(0);
    setHintsUsedCount(0);
    setIncorrectAttempts(0);
    setActiveHintPairId(null);
    setRoundOutcome(null);
    setCachedResult(null);
    setIsEvaluating(false);
    setErrorCardIds([]);
    setFeedback(null);
    setTimeRemaining(initialTime);

    // If timer is enabled, launch countdown
    if (config.timerEnabled) {
      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [cleanupTimers, config, initialTime, validation.isValid]);

  // Monitor Timer reaching 0
  useEffect(() => {
    if (config.timerEnabled && timeRemaining === 0 && !isFinalizedRef.current && roundData) {
      finalizeRound('TIME_UP', matchedPairIds, matchingScore, hintsUsedCount, incorrectAttempts);
    }
  }, [config.timerEnabled, timeRemaining, finalizeRound, matchedPairIds, matchingScore, hintsUsedCount, incorrectAttempts, roundData]);

  // Initialize round on mount or config change
  useEffect(() => {
    startNewRound();
    return () => {
      cleanupTimers();
    };
  }, [startNewRound, cleanupTimers]);

  // Handle Hint Request
  const handleUseHint = () => {
    if (
      isFinalizedRef.current ||
      isEvaluating ||
      activeHintPairId !== null ||
      !roundData ||
      matchedPairIds.length >= roundData.totalPairs
    ) {
      return;
    }

    // Find all unmatched items in this round
    const unmatchedItems = roundData.roundItems.filter(
      (item) => !matchedPairIds.includes(item.id)
    );

    if (unmatchedItems.length === 0) return;

    // Pick 1 random unmatched pair
    const randomIndex = Math.floor(Math.random() * unmatchedItems.length);
    const chosenItem = unmatchedItems[randomIndex];

    // Deduct 5 points (cannot be below 0)
    setHintsUsedCount((prev) => prev + 1);
    setActiveHintPairId(chosenItem.id);

    setFeedback({
      type: 'hint',
      messageTh: `💡 คำใบ้: ไฮไลต์คู่ "${chosenItem.thaiName}" (หัก ${SCORE_HINT_PENALTY} คะแนน)`,
      messageEn: `Hint: Highlighted "${chosenItem.englishName}" (-${SCORE_HINT_PENALTY} pts)`,
    });

    // Auto-clear hint highlight after specified duration
    if (hintTimeoutRef.current) {
      clearTimeout(hintTimeoutRef.current);
    }
    hintTimeoutRef.current = setTimeout(() => {
      setActiveHintPairId(null);
    }, HINT_DISPLAY_DURATION_MS);
  };

  // Evaluate matching pair
  const evaluateMatch = (leftCard: GameCard, rightCard: GameCard) => {
    if (isFinalizedRef.current || !roundData) return;

    const isCorrect = checkCardsMatch(leftCard, rightCard);

    if (isCorrect) {
      // Successful match
      const updatedMatched = [...matchedPairIds, leftCard.pairId];
      const updatedScore = matchingScore + SCORE_CORRECT_MATCH;
      setMatchedPairIds(updatedMatched);
      setMatchingScore(updatedScore);
      setSelectedLeftCardId(null);
      setSelectedRightCardId(null);
      setErrorCardIds([]);

      // If active hint was matching this pair, clear hint immediately
      if (activeHintPairId === leftCard.pairId) {
        setActiveHintPairId(null);
        if (hintTimeoutRef.current) {
          clearTimeout(hintTimeoutRef.current);
        }
      }

      setFeedback({
        type: 'success',
        messageTh: `ถูกต้อง! จับคู่สำเร็จ (+${SCORE_CORRECT_MATCH} คะแนน)`,
        messageEn: `Correct match! (+${SCORE_CORRECT_MATCH} pts)`,
      });

      // Check if all pairs are matched -> Trigger Completion
      if (updatedMatched.length === roundData.totalPairs) {
        finalizeRound('COMPLETED', updatedMatched, updatedScore, hintsUsedCount, incorrectAttempts);
      }
    } else {
      // Incorrect match: Lock interactions temporarily for feedback
      setIsEvaluating(true);
      const newMisses = incorrectAttempts + 1;
      setIncorrectAttempts(newMisses);
      setErrorCardIds([leftCard.cardId, rightCard.cardId]);
      setFeedback({
        type: 'error',
        messageTh: 'ยังไม่ถูกต้อง ลองจับคู่อีกครั้ง (+0 คะแนน)',
        messageEn: 'Not a match. Please try again.',
      });

      // Reset selection after short feedback interval
      setTimeout(() => {
        if (!isFinalizedRef.current) {
          setSelectedLeftCardId(null);
          setSelectedRightCardId(null);
          setErrorCardIds([]);
          setIsEvaluating(false);
        }
      }, 750);
    }
  };

  // Handle Card Selection Logic
  const handleCardClick = (clickedCard: GameCard) => {
    // Block interaction if finalizing, evaluating, round completed, or card is already matched
    if (
      isFinalizedRef.current ||
      isEvaluating ||
      roundOutcome !== null ||
      matchedPairIds.includes(clickedCard.pairId)
    ) {
      return;
    }

    if (clickedCard.side === 'left') {
      // Toggle unselect if clicking same card
      if (selectedLeftCardId === clickedCard.cardId) {
        setSelectedLeftCardId(null);
        return;
      }

      setSelectedLeftCardId(clickedCard.cardId);

      // If a right card was already selected, evaluate pair match
      if (selectedRightCardId) {
        const rightCard = roundData?.rightCards.find((c) => c.cardId === selectedRightCardId);
        if (rightCard) {
          evaluateMatch(clickedCard, rightCard);
        }
      }
    } else {
      // Toggle unselect if clicking same card
      if (selectedRightCardId === clickedCard.cardId) {
        setSelectedRightCardId(null);
        return;
      }

      setSelectedRightCardId(clickedCard.cardId);

      // If a left card was already selected, evaluate pair match
      if (selectedLeftCardId) {
        const leftCard = roundData?.leftCards.find((c) => c.cardId === selectedLeftCardId);
        if (leftCard) {
          evaluateMatch(leftCard, clickedCard);
        }
      }
    }
  };

  // If configuration is invalid, show a safety card with return button
  if (!validation.isValid || !roundData) {
    return (
      <div className="space-y-6 max-w-xl mx-auto text-center py-8">
        <div className="bg-white rounded-2xl p-8 border border-rose-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">ไม่สามารถเริ่มรอบเกมได้</h2>
          <p className="text-sm text-gray-600">
            {validation.errorTh || 'เกิดข้อผิดพลาดในการสร้างรอบเกมจากชุดข้อมูลที่เลือก'}
          </p>
          <p className="text-xs text-rose-700">
            {validation.errorEn || 'Failed to initialize game round.'}
          </p>
          <div className="pt-2">
            <PrimaryButton
              id="board-fix-setup-btn"
              onClick={onReturnToSetup}
              icon={<ArrowLeft className="w-4 h-4" />}
              className="w-full"
            >
              กลับไปปรับแต่งการตั้งค่า / Return to Setup
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  // Calculate live score: max(0, matchingScore - (hintsUsedCount * 5) + (roundOutcome === 'COMPLETED' ? 10 : 0))
  const completionBonus = roundOutcome === 'COMPLETED' ? SCORE_COMPLETION_BONUS : 0;
  const hintPenalties = hintsUsedCount * SCORE_HINT_PENALTY;
  const currentLiveScore = Math.max(0, matchingScore - hintPenalties + completionBonus);

  const matchedCount = matchedPairIds.length;
  const totalCount = roundData.totalPairs;
  const progressPercent = Math.round((matchedCount / totalCount) * 100);

  // Column header labels based on matching type
  const leftColumnTitleTh = config.matchingType === 'THAI_TO_ENGLISH' ? 'คำศัพท์ภาษาไทย' : 'ภาพอวัยวะพืช';
  const leftColumnTitleEn = config.matchingType === 'THAI_TO_ENGLISH' ? 'Thai Terms' : 'Botanical Diagrams';
  const rightColumnTitleTh = config.matchingType === 'IMAGE_TO_THAI' ? 'คำศัพท์ภาษาไทย' : 'คำศัพท์ภาษาอังกฤษ';
  const rightColumnTitleEn = config.matchingType === 'IMAGE_TO_THAI' ? 'Thai Terms' : 'English Terms';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Stats Dashboard */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                {currentSet.titleTh}
              </span>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                {matchingTypeInfo.shortLabelTh}
              </span>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-700" />
                <span>{difficultyInfo.labelEn}</span>
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              กระดานเกมจับคู่พฤกษศาสตร์ / Botanical Matching Board
            </h1>
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {/* Hint Button */}
            <button
              id="board-hint-btn"
              type="button"
              disabled={
                isFinalizedRef.current ||
                isEvaluating ||
                activeHintPairId !== null ||
                roundOutcome !== null ||
                matchedCount >= totalCount
              }
              onClick={handleUseHint}
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 shadow-2xs ${
                activeHintPairId !== null
                  ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse cursor-default'
                  : roundOutcome !== null || matchedCount >= totalCount || isEvaluating
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900 cursor-pointer active:scale-95'
              }`}
              title="ใช้คำใบ้ช่วยจับคู่ 1 คู่ (หัก 5 คะแนน)"
            >
              <Lightbulb className={`w-3.5 h-3.5 ${activeHintPairId ? 'text-amber-600' : 'text-amber-700'}`} />
              <span>คำใบ้ / Hint (-5)</span>
            </button>

            <button
              id="board-restart-btn"
              type="button"
              onClick={startNewRound}
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-emerald-800 bg-gray-50 hover:bg-emerald-50/60 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="เริ่มรอบใหม่พร้อมสุ่มการ์ดใหม่"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">เริ่มใหม่ / Restart</span>
              <span className="sm:hidden">เริ่มใหม่</span>
            </button>

            <button
              id="board-setup-link-btn"
              type="button"
              onClick={onReturnToSetup}
              className="px-3 py-2 text-xs font-semibold text-gray-700 hover:text-emerald-800 bg-gray-50 hover:bg-emerald-50/60 rounded-xl border border-gray-200 hover:border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="กลับไปหน้าตั้งค่าเกม"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ตั้งค่า / Setup</span>
              <span className="sm:hidden">ตั้งค่า</span>
            </button>
          </div>
        </div>

        {/* Live Gameplay Metrics (Score, Progress, Attempts, Timer Status) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Score */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              คะแนนรอบนี้ (Score)
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span id="board-score-value" className="text-2xl font-black text-emerald-950">
                {currentLiveScore}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">แต้ม</span>
              {hintsUsedCount > 0 && (
                <span className="text-[10px] text-amber-700 font-medium ml-1">
                  (ใบ้ -{hintPenalties})
                </span>
              )}
            </div>
          </div>

          {/* Matched Progress */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              จับคู่แล้ว (Matched)
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span id="board-matched-count" className="text-2xl font-black text-gray-900">
                {matchedCount}
              </span>
              <span className="text-xs text-gray-500 font-semibold">/ {totalCount} คู่</span>
            </div>
          </div>

          {/* Incorrect Attempts */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              ข้อผิดพลาด (Misses)
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span id="board-misses-count" className="text-2xl font-black text-gray-900">
                {incorrectAttempts}
              </span>
              <span className="text-xs text-gray-500 font-semibold">ครั้ง</span>
            </div>
          </div>

          {/* Timer Mode Status */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors ${
              config.timerEnabled && timeRemaining <= 10 && timeRemaining > 0
                ? 'bg-rose-50 border-rose-200 text-rose-950 animate-pulse'
                : config.timerEnabled && timeRemaining <= 20
                ? 'bg-amber-50 border-amber-200 text-amber-950'
                : 'bg-gray-50 border-gray-200/80 text-gray-900'
            }`}
          >
            <span className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-600" />
              เวลา / Timer
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              {config.timerEnabled ? (
                <>
                  <span id="board-timer-value" className="text-2xl font-black">
                    {timeRemaining}
                  </span>
                  <span className="text-xs font-semibold">วินาที (s)</span>
                </>
              ) : (
                <span className="text-sm font-bold text-gray-700">ไม่จำกัดเวลา (Untimed)</span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-xs font-bold text-gray-600">
            <span>ความคืบหน้าของรอบ (Round Progress)</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Live Feedback Banner */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : feedback.type === 'hint'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === 'hint' ? (
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.messageTh}</span>
          </div>
          <span className="hidden sm:inline text-gray-500 font-medium">{feedback.messageEn}</span>
        </div>
      )}

      {/* Time-Up Outcome Banner */}
      {roundOutcome === 'TIME_UP' && (
        <div className="bg-rose-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-rose-800 text-rose-200 mx-auto flex items-center justify-center border border-rose-700 shadow-inner">
            <Timer className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">
              หมดเวลาการเล่น! / Time Up!
            </h2>
            <p className="text-sm text-rose-200 font-medium">
              เวลา 60 วินาทีหมดลงแล้ว คุณจับคู่ได้สำเร็จ {matchedCount} จาก {totalCount} คู่
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-rose-950/60 rounded-xl px-5 py-2.5 border border-rose-800 text-xs sm:text-sm font-bold">
            <span>คะแนน: {currentLiveScore} คะแนน</span>
            <span className="text-rose-700">|</span>
            <span>จับคู่ได้: {matchedCount}/{totalCount} คู่</span>
            <span className="text-rose-700">|</span>
            <span>ข้อผิดพลาด: {incorrectAttempts} ครั้ง</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {cachedResult && (
              <PrimaryButton
                id="board-timeup-view-result-btn"
                onClick={() => onFinishGame(cachedResult)}
                icon={<Award className="w-4 h-4" />}
                className="bg-white text-rose-950 hover:bg-rose-50 font-black px-6"
              >
                ดูรายงานผลคะแนน / View Result
              </PrimaryButton>
            )}

            <SecondaryButton
              id="board-timeup-play-again-btn"
              onClick={startNewRound}
              icon={<RotateCcw className="w-4 h-4" />}
              className="bg-rose-800/80 text-white border-rose-700 hover:bg-rose-700"
            >
              ลองใหม่อีกครั้ง / Retry
            </SecondaryButton>

            <SecondaryButton
              id="board-timeup-setup-btn"
              onClick={onReturnToSetup}
              icon={<Settings2 className="w-4 h-4" />}
              className="bg-rose-800/80 text-white border-rose-700 hover:bg-rose-700"
            >
              ตั้งค่า / Setup
            </SecondaryButton>
          </div>
        </div>
      )}

      {/* Completion Outcome Banner (When all pairs matched) */}
      {roundOutcome === 'COMPLETED' && (
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-emerald-800 text-emerald-200 mx-auto flex items-center justify-center border border-emerald-700 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">
              ยอดเยี่ยม! จับคู่ครบทุกรายการแล้ว
            </h2>
            <p className="text-sm text-emerald-200 font-medium">
              Congratulations! You have completed all {totalCount} botanical pairs. (+{SCORE_COMPLETION_BONUS} โบนัสจบเกม)
            </p>
          </div>

          <div className="inline-flex items-center gap-4 bg-emerald-950/60 rounded-xl px-5 py-2.5 border border-emerald-800 text-xs sm:text-sm font-bold">
            <span>คะแนนรวม: {currentLiveScore} คะแนน</span>
            <span className="text-emerald-700">|</span>
            <span>ข้อผิดพลาด: {incorrectAttempts} ครั้ง</span>
            <span className="text-emerald-700">|</span>
            <span>คำใบ้ที่ใช้: {hintsUsedCount} ครั้ง</span>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {cachedResult && (
              <PrimaryButton
                id="board-complete-view-result-btn"
                onClick={() => onFinishGame(cachedResult)}
                icon={<Award className="w-4 h-4" />}
                className="bg-white text-emerald-950 hover:bg-emerald-50 font-black px-6"
              >
                ดูหน้ารายงานผล / View Result Screen
              </PrimaryButton>
            )}

            <SecondaryButton
              id="board-complete-play-again-btn"
              onClick={startNewRound}
              icon={<RotateCcw className="w-4 h-4" />}
              className="bg-emerald-800/80 text-white border-emerald-700 hover:bg-emerald-700"
            >
              เล่นอีกรอบ / Play Again
            </SecondaryButton>

            <SecondaryButton
              id="board-complete-setup-btn"
              onClick={onReturnToSetup}
              icon={<Settings2 className="w-4 h-4" />}
              className="bg-emerald-800/80 text-white border-emerald-700 hover:bg-emerald-700"
            >
              เปลี่ยนการตั้งค่า / Setup
            </SecondaryButton>
          </div>
        </div>
      )}

      {/* Main Dual-Column Matching Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Column (Side A: Image or Thai) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                A
              </span>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{leftColumnTitleTh}</h3>
                <span className="text-[10px] text-gray-500 font-medium">{leftColumnTitleEn}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {roundData.leftCards.length} รายการ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {roundData.leftCards.map((card) => {
              const isSelected = selectedLeftCardId === card.cardId;
              const isMatched = matchedPairIds.includes(card.pairId);
              const isError = errorCardIds.includes(card.cardId);
              const isHinted = activeHintPairId === card.pairId;

              return (
                <BotanicalCard
                  key={card.cardId}
                  card={card}
                  isSelected={isSelected}
                  isMatched={isMatched}
                  isError={isError}
                  isHinted={isHinted}
                  disabled={isEvaluating || roundOutcome !== null}
                  onClick={() => handleCardClick(card)}
                />
              );
            })}
          </div>
        </div>

        {/* Right Column (Side B: Thai or English Term) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center justify-center">
                B
              </span>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{rightColumnTitleTh}</h3>
                <span className="text-[10px] text-gray-500 font-medium">{rightColumnTitleEn}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {roundData.rightCards.length} รายการ
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {roundData.rightCards.map((card) => {
              const isSelected = selectedRightCardId === card.cardId;
              const isMatched = matchedPairIds.includes(card.pairId);
              const isError = errorCardIds.includes(card.cardId);
              const isHinted = activeHintPairId === card.pairId;

              return (
                <BotanicalCard
                  key={card.cardId}
                  card={card}
                  isSelected={isSelected}
                  isMatched={isMatched}
                  isError={isError}
                  isHinted={isHinted}
                  disabled={isEvaluating || roundOutcome !== null}
                  onClick={() => handleCardClick(card)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <SecondaryButton
          id="board-bottom-home-btn"
          onClick={onReturnToHome}
          icon={<Home className="w-4 h-4" />}
          className="w-full sm:w-auto"
        >
          หน้าหลัก / Home
        </SecondaryButton>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SecondaryButton
            id="board-bottom-setup-btn"
            onClick={onReturnToSetup}
            icon={<ArrowLeft className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            ตั้งค่า / Setup
          </SecondaryButton>

          <PrimaryButton
            id="board-bottom-restart-btn"
            onClick={startNewRound}
            icon={<RotateCcw className="w-4 h-4" />}
            className="w-full sm:w-auto px-6"
          >
            สุ่มรอบใหม่ / New Round
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
