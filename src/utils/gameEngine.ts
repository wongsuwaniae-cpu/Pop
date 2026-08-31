import {
  GameConfig,
  GameSet,
  VocabularyRecord,
  GameCard,
  RoundData,
  DifficultyLevel,
  MatchingType,
  GameOutcome,
  GameResult,
} from '../types/game';
import {
  GAME_SETS,
  VOCABULARY_DATA,
  DIFFICULTY_CONFIG,
  validateGameConfig,
  SCORE_CORRECT_MATCH,
  SCORE_INCORRECT_MATCH,
  SCORE_HINT_PENALTY,
  SCORE_COMPLETION_BONUS,
  DEFAULT_TIMER_DURATION_SECONDS,
  getPerformanceLevel,
} from '../data/plantData';

export {
  SCORE_CORRECT_MATCH,
  SCORE_INCORRECT_MATCH,
  SCORE_HINT_PENALTY,
  SCORE_COMPLETION_BONUS,
};

/**
 * Performs an unbiased Fisher-Yates shuffle on an array.
 * Returns a new array without mutating the source.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Determines the number of pairs for a given round based on difficulty and available dataset.
 * - EASY: 3 pairs
 * - MEDIUM: Random integer between minPairs (4) and maxPairs (6) based on available records
 * - HARD: 6 pairs
 */
export function determinePairCount(
  difficulty: DifficultyLevel,
  availableCount: number
): number {
  const diffConfig = DIFFICULTY_CONFIG[difficulty];
  if (!diffConfig) return 3;

  if (difficulty === 'EASY') {
    return Math.min(3, availableCount);
  }

  if (difficulty === 'HARD') {
    return Math.min(6, availableCount);
  }

  // MEDIUM: 4-6 pairs range
  const min = diffConfig.minPairs; // 4
  const max = Math.min(diffConfig.maxPairs, availableCount); // up to 6
  if (availableCount < min) {
    return availableCount;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Selects a randomized subset of vocabulary items without duplicates.
 */
export function selectRoundVocabulary(
  availableItems: VocabularyRecord[],
  pairCount: number
): VocabularyRecord[] {
  const shuffled = shuffleArray(availableItems);
  return shuffled.slice(0, pairCount);
}

/**
 * Generates independent left and right game cards from the selected round items.
 */
export function generateCardsForRound(
  items: VocabularyRecord[],
  matchingType: MatchingType
): { leftCards: GameCard[]; rightCards: GameCard[] } {
  const leftCards: GameCard[] = [];
  const rightCards: GameCard[] = [];

  items.forEach((item, index) => {
    const uniqueSuffix = Math.random().toString(36).substring(2, 7);

    // Left card (Side A)
    if (matchingType === 'IMAGE_TO_THAI' || matchingType === 'IMAGE_TO_ENGLISH') {
      leftCards.push({
        cardId: `left-${item.id}-${uniqueSuffix}-${index}`,
        pairId: item.id,
        side: 'left',
        contentType: 'image',
        displayValue: matchingType === 'IMAGE_TO_THAI' ? item.thaiName : item.englishName,
        image: item.image,
        altText: item.altText,
      });
    } else {
      // THAI_TO_ENGLISH: Left card is Thai term
      leftCards.push({
        cardId: `left-${item.id}-${uniqueSuffix}-${index}`,
        pairId: item.id,
        side: 'left',
        contentType: 'thai',
        displayValue: item.thaiName,
        altText: `คำศัพท์ภาษาไทย: ${item.thaiName}`,
      });
    }

    // Right card (Side B)
    if (matchingType === 'IMAGE_TO_THAI') {
      rightCards.push({
        cardId: `right-${item.id}-${uniqueSuffix}-${index}`,
        pairId: item.id,
        side: 'right',
        contentType: 'thai',
        displayValue: item.thaiName,
        altText: `คำศัพท์ภาษาไทย: ${item.thaiName}`,
      });
    } else {
      // IMAGE_TO_ENGLISH or THAI_TO_ENGLISH: Right card is English term
      rightCards.push({
        cardId: `right-${item.id}-${uniqueSuffix}-${index}`,
        pairId: item.id,
        side: 'right',
        contentType: 'english',
        displayValue: item.englishName,
        altText: `English botanical term: ${item.englishName}`,
      });
    }
  });

  return {
    leftCards: shuffleArray(leftCards),
    rightCards: shuffleArray(rightCards),
  };
}

/**
 * High-level round generator that validates config and creates an active round.
 */
export function generateRound(
  config: GameConfig,
  gameSets: GameSet[] = GAME_SETS,
  vocabData: VocabularyRecord[] = VOCABULARY_DATA
): RoundData | null {
  const validation = validateGameConfig(config, gameSets, vocabData);
  if (!validation.isValid) {
    return null;
  }

  const selectedSet = gameSets.find((s) => s.id === config.selectedGameSetId);
  if (!selectedSet) {
    return null;
  }

  const availableItems = vocabData.filter((item) => selectedSet.itemIds.includes(item.id));
  const pairCount = determinePairCount(config.difficulty, availableItems.length);
  const selectedItems = selectRoundVocabulary(availableItems, pairCount);

  if (selectedItems.length === 0) {
    return null;
  }

  const { leftCards, rightCards } = generateCardsForRound(selectedItems, config.matchingType);

  return {
    roundItems: selectedItems,
    leftCards,
    rightCards,
    totalPairs: selectedItems.length,
  };
}

/**
 * Validates whether two selected cards constitute a correct botanical match.
 * Validation uses stable pairId identity (not display strings or indices).
 */
export function checkCardsMatch(cardA: GameCard, cardB: GameCard): boolean {
  if (!cardA || !cardB) return false;
  if (cardA.cardId === cardB.cardId) return false;
  if (cardA.side === cardB.side) return false;
  return cardA.pairId === cardB.pairId;
}

/**
 * Calculates percentage accuracy: Correct Pairs / Total Pairs * 100.
 * Handled safely for 0 pairs.
 */
export function calculateAccuracy(matchedPairs: number, totalPairs: number): number {
  if (totalPairs <= 0) return 0;
  return Math.round((matchedPairs / totalPairs) * 100);
}

/**
 * Formats time duration into clear readable Thai and English format.
 */
export function formatTimeUsed(seconds: number): string {
  const safeSeconds = Math.max(0, Math.round(seconds));
  if (safeSeconds < 60) {
    return `${safeSeconds} วินาที (${safeSeconds}s)`;
  }
  const mins = Math.floor(safeSeconds / 60);
  const remainingSecs = safeSeconds % 60;
  return `${mins}:${remainingSecs.toString().padStart(2, '0')} นาที (${mins}m ${remainingSecs}s)`;
}

export interface BuildGameResultParams {
  outcome: GameOutcome;
  matchingScore: number;
  hintsUsedCount: number;
  matchedPairs: number;
  totalPairs: number;
  incorrectAttempts: number;
  timeUsedSeconds: number;
  config: GameConfig;
  roundItems: VocabularyRecord[];
}

/**
 * Compiles a structured GameResult object from active round state.
 * Enforces scoring rules:
 *   Final Score = max(0, matchingScore - (hintsUsedCount * 5) + (outcome === 'COMPLETED' ? 10 : 0))
 */
export function buildGameResult(params: BuildGameResultParams): GameResult {
  const {
    outcome,
    matchingScore,
    hintsUsedCount,
    matchedPairs,
    totalPairs,
    incorrectAttempts,
    timeUsedSeconds,
    config,
    roundItems,
  } = params;

  const completionBonus = outcome === 'COMPLETED' ? SCORE_COMPLETION_BONUS : 0;
  const hintPenalties = hintsUsedCount * SCORE_HINT_PENALTY;
  
  // Total score cannot be below 0
  const finalScore = Math.max(0, matchingScore - hintPenalties + completionBonus);
  const accuracy = calculateAccuracy(matchedPairs, totalPairs);
  const performanceLevel = getPerformanceLevel(accuracy);

  return {
    outcome,
    score: finalScore,
    matchingScore,
    completionBonus,
    hintPenalties,
    hintsUsedCount,
    correctPairs: matchedPairs,
    matchedPairs,
    totalPairs,
    incorrectAttempts,
    accuracy,
    timeUsedSeconds: Math.max(1, timeUsedSeconds),
    formattedTimeUsed: formatTimeUsed(timeUsedSeconds),
    timerEnabled: config.timerEnabled,
    timeLimitSeconds: config.timerDurationSeconds || DEFAULT_TIMER_DURATION_SECONDS,
    difficulty: config.difficulty,
    matchingType: config.matchingType,
    selectedGameSetId: config.selectedGameSetId || 'basic_plant_structures',
    roundItems,
    performanceLevel,
    completed: outcome === 'COMPLETED',
    completedAt: new Date().toISOString(),
  };
}
