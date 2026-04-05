import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    adminSectionService,
    CreateSectionRequest,
    UpdateSectionRequest,
    PagedRequest,
} from '@/services/admin/section.service';

// Query keys
export const adminSectionKeys = {
    all: ['admin', 'sections'] as const,
    lists: () => [...adminSectionKeys.all, 'list'] as const,
    list: (filters: PagedRequest) => [...adminSectionKeys.lists(), filters] as const,
    details: () => [...adminSectionKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminSectionKeys.details(), id] as const,
};

/**
 * Hook to get paginated sections (Admin only)
 */
export function useSectionsPaged(request: PagedRequest) {
    return useQuery({
        queryKey: adminSectionKeys.list(request),
        queryFn: () => adminSectionService.getSectionsPaged(request),
    });
}

/**
 * Hook to get all sections
 */
export function useAllSections() {
    return useQuery({
        queryKey: [...adminSectionKeys.all, 'all'],
        queryFn: adminSectionService.getAllSections,
        staleTime: 300000, // 5 minutes
    });
}

/**
 * Hook to create a new section
 */
export function useCreateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSectionRequest) => adminSectionService.createSection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSectionKeys.all });
        },
    });
}

/**
 * Hook to update a section
 */
export function useUpdateSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSectionRequest) => adminSectionService.updateSection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSectionKeys.all });
        },
    });
}

/**
 * Hook to delete a section
 */
export function useDeleteSection() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => adminSectionService.deleteSection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSectionKeys.all });
        },
    });
}

/**
 * Hook to reorder sections
 */
export function useReorderSections() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sectionIds: string[]) => adminSectionService.reorderSections(sectionIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminSectionKeys.all });
        },
    });
}
