export interface UserProgress {
    id: string;
    userId: string;
    levelId: string;
    sectionId: string;
    status: ProgressStatus;
    stats: ProgressStats;
    lastAttemptAt: string;
    completedAt?: string;
    progressPercentage: number;
    isLocked: boolean;
    isCompleted: boolean;
}

export enum ProgressStatus {
    NotStarted = 0,
    InProgress = 1,
    Completed = 2,
}

export interface ProgressStats {
    totalAttempts: number;
    bestScore: number;
    bestAccuracy: number;
    totalXpEarned: number;
    firstAttemptAt: string;
    bestAttemptAt: string;
}

export interface SectionProgress {
    id: string;
    levelId: string;
    status: ProgressStatus;
    stats: {
        bestScore: number;
        bestAccuracy: number;
        totalAttempts: number;
    };
    progressPercentage: number;
}

export interface SectionSummary {
    sectionId: string;
    sectionTitle: string;
    totalLevels: number;
    completedLevels: number;
    inProgressLevels: number;
    notStartedLevels: number;
    totalXpEarned: number;
    averageAccuracy: number;
    progressPercentage: number;
}
