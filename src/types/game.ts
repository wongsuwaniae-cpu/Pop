export type ScreenState = 
  | 'HOME' 
  | 'SELECT_SET' 
  | 'SETUP' 
  | 'INSTRUCTIONS' 
  | 'BOARD' 
  | 'RESULT';

export type GameOutcome = 'COMPLETED' | 'TIME_UP';

export type MatchingType = 
  | 'IMAGE_TO_THAI' 
  | 'IMAGE_TO_ENGLISH' 
  | 'THAI_TO_ENGLISH';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type PerformanceLevelKey = 
  | 'EXCELLENT' 
  | 'VERY_GOOD' 
  | 'GOOD' 
  | 'FAIR' 
  | 'KEEP_PRACTICING';

export interface PerformanceLevelInfo {
  key: PerformanceLevelKey;
  labelTh: string;
  labelEn: string;
  minAccuracy: number;
  maxAccuracy: number;
  badgeClass: string;
  descriptionTh: string;
}

export interface VocabularyRecord {
  id: string;
  thaiName: string;
  englishName: string;
  image: string;
  category: 'Plant Structure';
  difficulty: DifficultyLevel;
  description: string;
  altText: string;
}

export interface GameSet {
  id: string;
  titleTh: string;
  titleEn: string;
  descriptionTh: string;
  descriptionEn: string;
  defaultMatchingType: MatchingType;
  allowedMatchingTypes: MatchingType[];
  itemIds: string[];
}

export interface GameConfig {
  selectedGameSetId: string | null;
  matchingType: MatchingType;
  difficulty: DifficultyLevel;
  timerEnabled: boolean;
  timerDurationSeconds: number;
}

export interface ValidationResult {
  isValid: boolean;
  errorTh?: string;
  errorEn?: string;
  warningTh?: string;
}

export type CardSide = 'left' | 'right';
export type CardContentType = 'image' | 'thai' | 'english';

export interface GameCard {
  cardId: string;
  pairId: string;
  side: CardSide;
  contentType: CardContentType;
  displayValue: string;
  image?: string;
  altText?: string;
}

export interface RoundData {
  roundItems: VocabularyRecord[];
  leftCards: GameCard[];
  rightCards: GameCard[];
  totalPairs: number;
}

export interface ActiveRoundState {
  score: number;
  incorrectAttempts: number;
  matchedPairIds: string[];
  isCompleted: boolean;
}

export interface GameResult {
  outcome: GameOutcome;
  score: number;
  matchingScore: number;
  completionBonus: number;
  hintPenalties: number;
  hintsUsedCount: number;
  correctPairs: number;
  matchedPairs: number;
  totalPairs: number;
  incorrectAttempts: number;
  accuracy: number;
  timeUsedSeconds: number;
  formattedTimeUsed: string;
  timerEnabled: boolean;
  timeLimitSeconds: number;
  difficulty: DifficultyLevel;
  matchingType: MatchingType;
  selectedGameSetId: string;
  roundItems: VocabularyRecord[];
  performanceLevel: PerformanceLevelInfo;
  completed: boolean;
  completedAt: string;
}
