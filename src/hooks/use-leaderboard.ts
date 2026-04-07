import { useQuery } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';
import {
    LeaderboardPeriod,
    PaginationRequest,
} from '@/models/gamification.model';

// Query keys
export const leaderboardKeys = {
    all: ['leaderboard'] as const,
    list: (period: LeaderboardPeriod, pagination: PaginationRequest) =>
        [...leaderboardKeys.all, period, pagination] as const,
    myRank: () => [...leaderboardKeys.all, 'my-rank'] as const,
    aroundMe: (period: LeaderboardPeriod, range: number) =>
        [...leaderboardKeys.all, 'around-me', period, range] as const,
};

/**
 * Hook to get leaderboard data
 */
export function useLeaderboard(
    period: LeaderboardPeriod,
    pagination: PaginationRequest
) {
    return useQuery({
        queryKey: leaderboardKeys.list(period, pagination),
        queryFn: () => {
            switch (period) {
                case LeaderboardPeriod.Global:
                    return gamificationService.getGlobalLeaderboard(pagination);
                case LeaderboardPeriod.Weekly:
                    return gamificationService.getWeeklyLeaderboard(pagination);
                case LeaderboardPeriod.Monthly:
                    return gamificationService.getMonthlyLeaderboard(pagination);
                default:
                    return gamificationService.getWeeklyLeaderboard(pagination);
            }
        },
        staleTime: 60000, // Cache for 1 minute
    });
}

/**
 * Hook to get current user's rank
 */
export function useMyRank() {
    return useQuery({
        queryKey: leaderboardKeys.myRank(),
        queryFn: gamificationService.getMyRank,
        staleTime: 60000,
    });
}

/**
 * Hook to get rankings around current user
 */
export function useRankingsAroundMe(
    period: LeaderboardPeriod = LeaderboardPeriod.Weekly,
    range: number = 5
) {
    return useQuery({
        queryKey: leaderboardKeys.aroundMe(period, range),
        queryFn: () => gamificationService.getRankingsAroundMe(period, range),
        staleTime: 60000,
    });
}
