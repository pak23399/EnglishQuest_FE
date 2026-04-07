// Hearts System
export interface HeartStatus {
    currentHearts: number;
    maxHearts: number;
    lastRegeneratedAt: string;
    nextRegenAt: string;
    minutesUntilNextRegen: number;
    regenRateMinutes: number;
    isMaxed: boolean;
    canRestoreWithAd: boolean;
}

// Streak System
export interface StreakInfo {
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
    streakFreezeCount: number;
    isAtRisk: boolean;
    canEarnToday: boolean;
}

// Leaderboard
export interface LeaderboardEntry {
    userId: string;
    userName: string;
    avatar?: string | null;
    rank: number;
    previousRank: number | null;
    rankChange: number;
    rankingScore: number;
    totalXp: number;
    completedLevels: number;
    currentStreak: number;
    averageAccuracy: number;
    isCurrentUser?: boolean;
}

export interface PaginatedLeaderboard {
    meta: {
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    };
    items: LeaderboardEntry[];
}

export interface MyRank {
    userId: string;
    globalRank: number;
    weeklyRank: number;
    monthlyRank: number;
    globalRankingScore: number;
    weeklyRankingScore: number;
    monthlyRankingScore: number;
    totalUsers: number;
}

export enum LeaderboardPeriod {
    Global = 'global',
    Weekly = 'weekly',
    Monthly = 'monthly',
}

export interface PaginationRequest {
    pageNumber: number;
    pageSize: number;
}
