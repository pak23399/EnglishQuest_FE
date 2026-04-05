import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminLevelService,
  CreateLevelRequest,
  UpdateLevelRequest,
} from '@/services/admin/level.service';
import { PagedRequest } from '@/services/admin/section.service';

// Query keys
export const adminLevelKeys = {
  all: ['admin', 'levels'] as const,
  lists: () => [...adminLevelKeys.all, 'list'] as const,
  list: (filters: PagedRequest) =>
    [...adminLevelKeys.lists(), filters] as const,
  bySection: (sectionId: string) =>
    [...adminLevelKeys.all, 'section', sectionId] as const,
  detail: (id: string) => [...adminLevelKeys.all, 'detail', id] as const,
};

/**
 * Hook to get paginated levels (Admin only)
 */
export function useLevelsPaged(request: PagedRequest) {
  return useQuery({
    queryKey: adminLevelKeys.list(request),
    queryFn: () => adminLevelService.getLevelsPaged(request),
  });
}

/**
 * Hook to get levels by section
 */
export function useLevelsBySection(sectionId: string) {
  return useQuery({
    queryKey: adminLevelKeys.bySection(sectionId),
    queryFn: () => adminLevelService.getLevelsBySection(sectionId),
    enabled: !!sectionId,
  });
}

/**
 * Hook to get a level by ID (Admin only)
 */
export function useLevelById(id: string | null) {
  return useQuery({
    queryKey: adminLevelKeys.detail(id || ''),
    queryFn: () => adminLevelService.getLevelById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to create a new level
 */
export function useCreateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLevelRequest) =>
      adminLevelService.createLevel(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminLevelKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminLevelKeys.bySection(variables.sectionId),
      });
    },
  });
}

/**
 * Hook to update a level
 */
export function useUpdateLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateLevelRequest) =>
      adminLevelService.updateLevel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLevelKeys.all });
    },
  });
}

/**
 * Hook to delete a level
 */
export function useDeleteLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminLevelService.deleteLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLevelKeys.all });
    },
  });
}

/**
 * Hook to reorder levels
 */
export function useReorderLevels() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (levelIds: string[]) =>
      adminLevelService.reorderLevels(levelIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminLevelKeys.all });
    },
  });
}
