import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamificationService } from '@/services/gamification.service';
import { HeartStatus } from '@/models/gamification.model';

// Query keys
export const heartKeys = {
    all: ['hearts'] as const,
    status: () => [...heartKeys.all, 'status'] as const,
};

/**
 * Hook to get heart status with auto-refresh
 */
export function useHeartStatus() {
    return useQuery({
        queryKey: heartKeys.status(),
        queryFn: gamificationService.getHeartStatus,
        // Refetch every minute to update regeneration timer
        refetchInterval: (data) => {
            if (!data) return false;
            // If not maxed hearts, refetch every minute
            return data.isMaxed ? false : 60000;
        },
        staleTime: 30000, // Consider data stale after 30 seconds
    });
}

/**
 * Hook to restore heart by watching ad
 */
export function useRestoreHeartByAd() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gamificationService.restoreHeartByAd,
        onSuccess: () => {
            // Invalidate heart status to refetch
            queryClient.invalidateQueries({ queryKey: heartKeys.status() });
        },
    });
}

/**
 * Hook to calculate time until next heart regeneration
 */
export function useHeartRegenTimer(heartStatus: HeartStatus | undefined) {
    if (!heartStatus || heartStatus.isMaxed) {
        return { timeRemaining: 0, formattedTime: '00:00' };
    }

    const minutes = Math.floor(heartStatus.minutesUntilNextRegen);
    const seconds = Math.floor((heartStatus.minutesUntilNextRegen - minutes) * 60);

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return {
        timeRemaining: heartStatus.minutesUntilNextRegen,
        formattedTime,
    };
}
