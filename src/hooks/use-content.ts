import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';

// Query keys
export const contentKeys = {
    all: ['content'] as const,
    sections: {
        all: () => [...contentKeys.all, 'sections'] as const,
        available: () => [...contentKeys.all, 'sections', 'available'] as const,
        detail: (id: string) => [...contentKeys.all, 'sections', id] as const,
        withLevels: (id: string) => [...contentKeys.all, 'sections', id, 'levels'] as const,
    },
    levels: {
        all: () => [...contentKeys.all, 'levels'] as const,
        detail: (id: string) => [...contentKeys.all, 'levels', id] as const,
        bySection: (sectionId: string) =>
            [...contentKeys.all, 'levels', 'section', sectionId] as const,
        unlocked: (sectionId: string) =>
            [...contentKeys.all, 'levels', 'unlocked', sectionId] as const,
    },
    access: {
        level: (id: string) => [...contentKeys.all, 'access', 'level', id] as const,
        levelStatus: (id: string) => [...contentKeys.all, 'access', 'level-status', id] as const,
        section: (id: string) => [...contentKeys.all, 'access', 'section', id] as const,
        feature: (name: string) => [...contentKeys.all, 'access', 'feature', name] as const,
    },
    unlock: {
        progress: (levelId: string) =>
            [...contentKeys.all, 'unlock', 'progress', levelId] as const,
    },
};

// ==================== Sections ====================

export function useAllSections() {
    return useQuery({
        queryKey: contentKeys.sections.all(),
        queryFn: contentService.getAllSections,
        staleTime: 300000, // 5 minutes
    });
}

export function useAvailableSections() {
    return useQuery({
        queryKey: contentKeys.sections.available(),
        queryFn: contentService.getAvailableSections,
        staleTime: 300000,
    });
}

export function useSection(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? contentKeys.sections.detail(sectionId) : [''],
        queryFn: () => (sectionId ? contentService.getSection(sectionId) : null),
        enabled: !!sectionId,
    });
}

export function useSectionWithLevels(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? contentKeys.sections.withLevels(sectionId) : [''],
        queryFn: () => (sectionId ? contentService.getSectionWithLevels(sectionId) : null),
        enabled: !!sectionId,
    });
}

// ==================== Levels ====================

export function useLevel(levelId: string | undefined) {
    return useQuery({
        queryKey: levelId ? contentKeys.levels.detail(levelId) : [''],
        queryFn: () => (levelId ? contentService.getLevel(levelId) : null),
        enabled: !!levelId,
        retry: false, // Don't retry on 404 - endpoint may not be implemented
    });
}

export function useLevelsBySection(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? contentKeys.levels.bySection(sectionId) : [''],
        queryFn: () => (sectionId ? contentService.getLevelsBySection(sectionId) : null),
        enabled: !!sectionId,
    });
}

export function useUnlockedLevels(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? contentKeys.levels.unlocked(sectionId) : [''],
        queryFn: () => (sectionId ? contentService.getUnlockedLevels(sectionId) : null),
        enabled: !!sectionId,
    });
}

// ==================== Access Control ====================

export function useLevelAccess(levelId: string | undefined) {
    return useQuery({
        queryKey: levelId ? contentKeys.access.level(levelId) : [''],
        queryFn: () => (levelId ? contentService.checkLevelAccess(levelId) : null),
        enabled: !!levelId,
    });
}

export function useLevelAccessStatus(levelId: string | undefined) {
    return useQuery({
        queryKey: levelId ? contentKeys.access.levelStatus(levelId) : [''],
        queryFn: () => (levelId ? contentService.getLevelAccessStatus(levelId) : null),
        enabled: !!levelId,
        retry: false, // Don't retry on 404 - endpoint may not be implemented
    });
}

export function useSectionAccess(sectionId: string | undefined) {
    return useQuery({
        queryKey: sectionId ? contentKeys.access.section(sectionId) : [''],
        queryFn: () => (sectionId ? contentService.checkSectionAccess(sectionId) : null),
        enabled: !!sectionId,
    });
}

export function useFeatureAccess(featureName: string | undefined) {
    return useQuery({
        queryKey: featureName ? contentKeys.access.feature(featureName) : [''],
        queryFn: () => (featureName ? contentService.checkFeatureAccess(featureName) : null),
        enabled: !!featureName,
    });
}

// ==================== Unlocking ====================

export function useLevelUnlockProgress(levelId: string | undefined) {
    return useQuery({
        queryKey: levelId ? contentKeys.unlock.progress(levelId) : [''],
        queryFn: () => (levelId ? contentService.getLevelUnlockProgress(levelId) : null),
        enabled: !!levelId,
    });
}

export function useUnlockNextLevel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (currentLevelId: string) => contentService.unlockNextLevel(currentLevelId),
        onSuccess: () => {
            // Invalidate content queries to refetch unlocked levels
            queryClient.invalidateQueries({ queryKey: contentKeys.levels.all() });
            queryClient.invalidateQueries({ queryKey: contentKeys.access.level });
        },
    });
}

export function useUnlockSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sectionId: string) => contentService.unlockSection(sectionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: contentKeys.sections.all() });
            queryClient.invalidateQueries({ queryKey: contentKeys.access.section });
        },
    });
}
