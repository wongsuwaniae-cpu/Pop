import { VocabularyRecord, GameSet, MatchingType, DifficultyLevel, GameConfig, ValidationResult } from '../types/game';

export const MATCHING_TYPES = {
  IMAGE_TO_THAI: 'IMAGE_TO_THAI' as MatchingType,
  IMAGE_TO_ENGLISH: 'IMAGE_TO_ENGLISH' as MatchingType,
  THAI_TO_ENGLISH: 'THAI_TO_ENGLISH' as MatchingType,
} as const;

export const MATCHING_TYPE_DETAILS: Record<MatchingType, {
  id: MatchingType;
  labelTh: string;
  labelEn: string;
  shortLabelTh: string;
  shortLabelEn: string;
  descriptionTh: string;
  descriptionEn: string;
}> = {
  IMAGE_TO_THAI: {
    id: 'IMAGE_TO_THAI',
    labelTh: 'ภาพ ↔ คำศัพท์ภาษาไทย',
    labelEn: 'Image ↔ Thai Term',
    shortLabelTh: 'ภาพ ↔ ไทย',
    shortLabelEn: 'Image ↔ Thai',
    descriptionTh: 'จับคู่ภาพอวัยวะพืชกับคำศัพท์ภาษาไทยที่ถูกต้อง',
    descriptionEn: 'Match plant structure images with their Thai botanical names',
  },
  IMAGE_TO_ENGLISH: {
    id: 'IMAGE_TO_ENGLISH',
    labelTh: 'ภาพ ↔ คำศัพท์ภาษาอังกฤษ',
    labelEn: 'Image ↔ English Term',
    shortLabelTh: 'ภาพ ↔ อังกฤษ',
    shortLabelEn: 'Image ↔ English',
    descriptionTh: 'จับคู่ภาพอวัยวะพืชกับคำศัพท์ภาษาอังกฤษที่ถูกต้อง',
    descriptionEn: 'Match plant structure images with their English botanical names',
  },
  THAI_TO_ENGLISH: {
    id: 'THAI_TO_ENGLISH',
    labelTh: 'ภาษาไทย ↔ ภาษาอังกฤษ',
    labelEn: 'Thai ↔ English Term',
    shortLabelTh: 'ไทย ↔ อังกฤษ',
    shortLabelEn: 'Thai ↔ English',
    descriptionTh: 'จับคู่คำศัพท์พฤกษศาสตร์ระหว่างภาษาไทยและภาษาอังกฤษ',
    descriptionEn: 'Match Thai botanical terms directly with English botanical terms',
  },
};

export const DIFFICULTY_CONFIG: Record<DifficultyLevel, {
  id: DifficultyLevel;
  labelTh: string;
  labelEn: string;
  pairsCount: number;
  minPairs: number;
  maxPairs: number;
  pairsLabelTh: string;
  pairsLabelEn: string;
  descriptionTh: string;
  descriptionEn: string;
}> = {
  EASY: {
    id: 'EASY',
    labelTh: 'ระดับง่าย (Easy)',
    labelEn: 'Easy',
    pairsCount: 3,
    minPairs: 3,
    maxPairs: 3,
    pairsLabelTh: '3 คู่ (6 ใบ)',
    pairsLabelEn: '3 Pairs (6 cards)',
    descriptionTh: 'จับคู่ 3 คู่ เหมาะสำหรับการเริ่มต้นทบทวนอย่างรวดเร็ว',
    descriptionEn: '3 pairs — ideal for initial review and quick practice',
  },
  MEDIUM: {
    id: 'MEDIUM',
    labelTh: 'ระดับปานกลาง (Medium)',
    labelEn: 'Medium',
    pairsCount: 4, // 4-6 pairs range
    minPairs: 4,
    maxPairs: 6,
    pairsLabelTh: '4–6 คู่ (8–12 ใบ)',
    pairsLabelEn: '4–6 Pairs (8–12 cards)',
    descriptionTh: 'จับคู่ 4–6 คู่ ฝึกความแม่นยำและการจำแนกความแตกต่าง',
    descriptionEn: '4–6 pairs — balanced pace and accuracy training',
  },
  HARD: {
    id: 'HARD',
    labelTh: 'ระดับท้าทาย (Hard)',
    labelEn: 'Hard',
    pairsCount: 6,
    minPairs: 6,
    maxPairs: 6,
    pairsLabelTh: '6 คู่ (12 ใบ)',
    pairsLabelEn: 'All 6 Pairs (12 cards)',
    descriptionTh: 'จับคู่ครบ 6 คู่ สำหรับทดสอบความจำและความแม่นยำขั้นสูง',
    descriptionEn: 'All 6 pairs — comprehensive botanical mastery test',
  },
};

export const DEFAULT_TIMER_DURATION_SECONDS = 60;
export const SCORE_CORRECT_MATCH = 10;
export const SCORE_INCORRECT_MATCH = 0;
export const SCORE_HINT_PENALTY = 5;
export const SCORE_COMPLETION_BONUS = 10;
export const HINT_DISPLAY_DURATION_MS = 2500;

export const PERFORMANCE_LEVELS = [
  {
    key: 'EXCELLENT' as const,
    labelTh: 'ยอดเยี่ยม',
    labelEn: 'Excellent',
    minAccuracy: 90,
    maxAccuracy: 100,
    badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    descriptionTh: 'เข้าใจโครงสร้างพืชได้อย่างแม่นยำยอดเยี่ยม จดจำศัพท์ได้ครบถ้วน',
  },
  {
    key: 'VERY_GOOD' as const,
    labelTh: 'ดีมาก',
    labelEn: 'Very Good',
    minAccuracy: 80,
    maxAccuracy: 89,
    badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
    descriptionTh: 'มีความรู้ความเข้าใจในระดับดีมาก จำแนกโครงสร้างพืชได้ถูกต้องเกือบทั้งหมด',
  },
  {
    key: 'GOOD' as const,
    labelTh: 'ดี',
    labelEn: 'Good',
    minAccuracy: 70,
    maxAccuracy: 79,
    badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
    descriptionTh: 'จำแนกโครงสร้างพืชได้ดี มีความเข้าใจโครงสร้างหลักอย่างถูกต้อง',
  },
  {
    key: 'FAIR' as const,
    labelTh: 'พอใช้',
    labelEn: 'Fair',
    minAccuracy: 60,
    maxAccuracy: 69,
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
    descriptionTh: 'ผ่านเกณฑ์พื้นฐาน ควรทบทวนศัพท์และรูปภาพเพิ่มเติมเพื่อความแม่นยำ',
  },
  {
    key: 'KEEP_PRACTICING' as const,
    labelTh: 'ฝึกต่อไป',
    labelEn: 'Keep Practicing',
    minAccuracy: 0,
    maxAccuracy: 59,
    badgeClass: 'bg-rose-100 text-rose-900 border-rose-300',
    descriptionTh: 'ลองทบทวนบทเรียนและคำศัพท์อีกครั้ง แล้วกลับมาทดสอบใหม่นะ!',
  },
];

/**
 * Derives the performance level from calculated accuracy (0-100).
 */
export function getPerformanceLevel(accuracy: number) {
  const roundedAccuracy = Math.round(accuracy);
  const matched = PERFORMANCE_LEVELS.find(
    (level) => roundedAccuracy >= level.minAccuracy && roundedAccuracy <= level.maxAccuracy
  );
  return matched || PERFORMANCE_LEVELS[PERFORMANCE_LEVELS.length - 1];
}

export const VOCABULARY_DATA: VocabularyRecord[] = [
  {
    id: 'root',
    thaiName: 'ราก',
    englishName: 'Root',
    image: '/assets/botany/root.svg',
    category: 'Plant Structure',
    difficulty: 'EASY',
    description: 'อวัยวะพืชที่ทำหน้าที่ดูดซึมน้ำและแร่ธาตุจากดิน พร้อมทั้งยึดลำต้นให้ตั้งตรง',
    altText: 'แผนภาพแสดงระบบรากของพืช (Plant Root System)',
  },
  {
    id: 'stem',
    thaiName: 'ลำต้น',
    englishName: 'Stem',
    image: '/assets/botany/stem.svg',
    category: 'Plant Structure',
    difficulty: 'EASY',
    description: 'แกนหลักของพืช ทำหน้าที่ชูกิ่งก้านใบ ดอก ผล และลำเลียงน้ำสารอาหารผ่านท่อลำเลียง',
    altText: 'แผนภาพแสดงโครงสร้างลำต้นพืช (Plant Stem Structure)',
  },
  {
    id: 'leaf',
    thaiName: 'ใบ',
    englishName: 'Leaf',
    image: '/assets/botany/leaf.svg',
    category: 'Plant Structure',
    difficulty: 'EASY',
    description: 'อวัยวะหลักในการสังเคราะห์ด้วยแสง การแลกเปลี่ยนก๊าซ และการคายน้ำของพืช',
    altText: 'แผนภาพแสดงโครงสร้างใบพืชและเส้นใบ (Plant Leaf and Venation)',
  },
  {
    id: 'flower',
    thaiName: 'ดอก',
    englishName: 'Flower',
    image: '/assets/botany/flower.svg',
    category: 'Plant Structure',
    difficulty: 'MEDIUM',
    description: 'โครงสร้างสืบพันธุ์แบบอาศัยเพศของพืชดอก ประกอบด้วยกลีบเลี้ยง กลีบดอก เกสรเพศผู้และเกสรเพศเมีย',
    altText: 'แผนภาพแสดงโครงสร้างดอกไม้ (Flower Anatomy)',
  },
  {
    id: 'fruit',
    thaiName: 'ผล',
    englishName: 'Fruit',
    image: '/assets/botany/fruit.svg',
    category: 'Plant Structure',
    difficulty: 'MEDIUM',
    description: 'รังไข่ที่เจริญเติบโตเต็มที่หลังจากการปฏิสนธิ ทำหน้าที่ปกป้องและช่วยแพร่กระจายเมล็ด',
    altText: 'แผนภาพแสดงผลและผนังผล (Fruit Anatomy and Pericarp)',
  },
  {
    id: 'seed',
    thaiName: 'เมล็ด',
    englishName: 'Seed',
    image: '/assets/botany/seed.svg',
    category: 'Plant Structure',
    difficulty: 'HARD',
    description: 'โครงสร้างที่พัฒนามาจากออวุล ภายในมีต้นอ่อน (Embryo) และอาหารสะสมสำหรับงอกเป็นต้นใหม่',
    altText: 'แผนภาพแสดงเมล็ดและต้นอ่อนภายใน (Plant Seed and Embryo)',
  },
];

export const GAME_SETS: GameSet[] = [
  {
    id: 'basic_plant_structures',
    titleTh: 'ส่วนประกอบพื้นฐานของพืช',
    titleEn: 'Basic Plant Structures',
    descriptionTh: 'ชุดฝึกฝนโครงสร้างพื้นฐาน 6 ส่วนประกอบหลักของพืชดอก',
    descriptionEn: 'Core botanical foundations covering the 6 primary vegetative and reproductive organs',
    defaultMatchingType: 'IMAGE_TO_THAI',
    allowedMatchingTypes: ['IMAGE_TO_THAI', 'IMAGE_TO_ENGLISH', 'THAI_TO_ENGLISH'],
    itemIds: ['root', 'stem', 'leaf', 'flower', 'fruit', 'seed'],
  },
  {
    id: 'thai_to_english',
    titleTh: 'จับคู่ภาษาไทย–ภาษาอังกฤษ',
    titleEn: 'Thai ↔ English',
    descriptionTh: 'ฝึกการเทียบศัพท์เฉพาะทางพฤกษศาสตร์และเภสัชพฤกษศาสตร์ ไทย-อังกฤษ',
    descriptionEn: 'Practice bilingual terminology translation between Thai and English botanical terms',
    defaultMatchingType: 'THAI_TO_ENGLISH',
    allowedMatchingTypes: ['THAI_TO_ENGLISH'],
    itemIds: ['root', 'stem', 'leaf', 'flower', 'fruit', 'seed'],
  },
  {
    id: 'image_to_vocab',
    titleTh: 'จับคู่ภาพกับคำศัพท์',
    titleEn: 'Image ↔ Vocabulary',
    descriptionTh: 'ฝึกการจำแนกภาพโครงสร้างพืชจริงกับชื่อศัพท์พฤกษศาสตร์',
    descriptionEn: 'Visual identification linking accurate anatomical diagrams with botanical names',
    defaultMatchingType: 'IMAGE_TO_THAI',
    allowedMatchingTypes: ['IMAGE_TO_THAI', 'IMAGE_TO_ENGLISH'],
    itemIds: ['root', 'stem', 'leaf', 'flower', 'fruit', 'seed'],
  },
];

export const DEFAULT_GAME_CONFIG: GameConfig = {
  selectedGameSetId: 'basic_plant_structures',
  matchingType: 'IMAGE_TO_THAI',
  difficulty: 'EASY',
  timerEnabled: false,
  timerDurationSeconds: DEFAULT_TIMER_DURATION_SECONDS,
};

/**
 * Validates whether a given game configuration is complete, compatible, and playable.
 */
export function validateGameConfig(
  config: GameConfig,
  gameSets: GameSet[] = GAME_SETS,
  vocabData: VocabularyRecord[] = VOCABULARY_DATA
): ValidationResult {
  if (!config.selectedGameSetId) {
    return {
      isValid: false,
      errorTh: 'กรุณาเลือกชุดเกมก่อนเริ่มเล่น',
      errorEn: 'Please select a game set.',
    };
  }

  const selectedSet = gameSets.find((s) => s.id === config.selectedGameSetId);
  if (!selectedSet) {
    return {
      isValid: false,
      errorTh: 'ไม่พบชุดข้อมูลเกมที่เลือก',
      errorEn: 'Selected game set does not exist.',
    };
  }

  if (!selectedSet.allowedMatchingTypes.includes(config.matchingType)) {
    const matchingDetail = MATCHING_TYPE_DETAILS[config.matchingType];
    return {
      isValid: false,
      errorTh: `รูปแบบการจับคู่ "${matchingDetail?.labelTh || config.matchingType}" ไม่รองรับในชุด "${selectedSet.titleTh}"`,
      errorEn: `Matching mode "${matchingDetail?.labelEn || config.matchingType}" is not supported in "${selectedSet.titleEn}".`,
    };
  }

  const diffConfig = DIFFICULTY_CONFIG[config.difficulty];
  if (!diffConfig) {
    return {
      isValid: false,
      errorTh: 'ระดับความยากไม่ถูกต้อง',
      errorEn: 'Invalid difficulty level.',
    };
  }

  const availableItems = vocabData.filter((item) => selectedSet.itemIds.includes(item.id));
  if (availableItems.length < diffConfig.minPairs) {
    return {
      isValid: false,
      errorTh: `ชุดคำศัพท์มีจำนวน (${availableItems.length} คำ) ไม่เพียงพอสำหรับระดับ ${diffConfig.labelTh} (ต้องการอย่างน้อย ${diffConfig.minPairs} คู่)`,
      errorEn: `Insufficient vocabulary items (${availableItems.length}) for ${diffConfig.labelEn} (requires at least ${diffConfig.minPairs} pairs).`,
    };
  }

  return { isValid: true };
}
