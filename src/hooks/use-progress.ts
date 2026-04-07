import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services/progress.service';

// Query keys
export const progressKeys = {
    all: ['progress'] as const,
    level: (levelId: string) => [...progressKeys.all, 'level', levelId] as const,
    section: (sectionId: string) => [...progressKeys.all, 'section', sectionId] as const,
    sectionSummary: (sectionId: string) =>
        [...progressKeys.all, 'section-summary', sectionId] as const,
    allProgress: () => [...progressKeys.all, 'all-progress'] as const,
    stats: {
        xp: () => [...progressKeys.all, 'stats', 'xp'] as const,
        completedLevels: () => [...progressKeys.all, 'stats', 'completed-levels'] as const,
    },
};

/**
 * Hook to get level progress
 */
export function useLevelProgress(levelId: string | undefined) {
    return useQuery({
        queryKey: levelId ? progressKeys.level(levelId) : [''],
        queryFn: () => (levelId ? progressService.getLevelProgress(levelId) : null),
        enabled: !!levelId,
    });
}

/**
 * Hook to get section progress
 */
export function useSectionProgress(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? progressKeys.section(sectionId) : [''],
        queryFn: () => (sectionId ? progressService.getSectionProgress(sectionId) : null),
        enabled: !!sectionId,
    });
}

/**
 * Hook to get section summary
 */
export function useSectionSummary(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? progressKeys.sectionSummary(sectionId) : [''],
        queryFn: () => (sectionId ? progressService.getSectionSummary(sectionId) : null),
        enabled: !!sectionId,
    });
}

/**
 * Hook to get all progress
 */
export function useAllProgress() {
    return useQuery({
        queryKey: progressKeys.allProgress(),
        queryFn: progressService.getAllProgress,
    });
}

/**
 * Hook to get total XP
 */
export function useTotalXP() {
    return useQuery({
        queryKey: progressKeys.stats.xp(),
        queryFn: progressService.getTotalXP,
    });
}

/**
 * Hook to get completed levels count
 */
export function useCompletedLevelsCount() {
    return useQuery({
        queryKey: progressKeys.stats.completedLevels(),
        queryFn: progressService.getCompletedLevelsCount,
    });
}
