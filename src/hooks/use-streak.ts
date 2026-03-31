import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';

// Query keys
export const streakKeys = {
    all: ['streak'] as const,
    info: () => [...streakKeys.all, 'info'] as const,
};

/**
 * Hook to get streak information
 */
export function useStreakInfo() {
    return useQuery({
        queryKey: streakKeys.info(),
        queryFn: gamificationService.getStreakInfo,
        staleTime: 60000, // Consider data stale after 1 minute
    });
}

/**
 * Hook to freeze streak (Premium feature)
 */
export function useFreezeStreak() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gamificationService.freezeStreak,
        onSuccess: () => {
            // Invalidate streak info to refetch
            queryClient.invalidateQueries({ queryKey: streakKeys.info() });
        },
    });
}
