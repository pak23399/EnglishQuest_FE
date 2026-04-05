import { Difficulty } from './quiz.model';
import { SubscriptionPlan } from './user.model';

export { Difficulty };

export interface SectionMetadata {
  TotalLevels: number;
  EstimatedMinutes: number;
  LocalizedTitles?: Record<string, string>;
  LocalizedDescriptions?: Record<string, string>;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  imageUrl: string | null;
  iconUrl: string | null;
  isFreeAccess: boolean;
  requiredPlan: SubscriptionPlan;
  prerequisiteIds: string[];
  estimatedMinutes: number;
  metadata: SectionMetadata;
  createdDate: string;
  createdBy: string;
  updatedDate: string;
  updatedBy: string;
  deletedDate: string | null;
  deletedBy: string | null;
  isActive: boolean;
  // Computed property for convenience
  totalLevels?: number;
  // Levels array (populated when returned by admin API)
  levels?: Level[];
}

export interface Level {
  id: string;
  sectionId: string;
  title: string;
  description?: string;
  order: number;
  difficulty: Difficulty;
  prerequisiteIds: string[];
  config: LevelConfig;
  createdDate: string;
  isActive: boolean;
}

export interface LevelConfig {
  passingScore: number;
  totalQuestions: number;
  xpReward: number;
  estimatedMinutes: number;
  isRandomized: boolean;
}

export interface SectionWithLevels extends Section {
  levels: Level[];
}

export interface LevelAccessStatus {
  canAccess: boolean;
  isLocked: boolean;
  lockReason?: string | null;
  requiresSubscription: boolean;
  requiredPlan: SubscriptionPlan;
  currentPlan: SubscriptionPlan;
  hasPrerequisites: boolean;
  totalPrerequisites: number;
  completedPrerequisites: number;
  missingPrerequisiteIds: string[];
}

export interface LevelUnlockProgress {
  levelId: string;
  levelTitle: string;
  isUnlocked: boolean;
  canUnlock: boolean;
  requirements: {
    hasSubscription: boolean;
    prerequisitesMet: boolean;
    missingPrerequisites: string[];
  };
  totalPrerequisites: number;
  completedPrerequisites: number;
  progressPercentage: number;
}
