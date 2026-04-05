import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  adminQuestionService,
  BulkCreateQuestionsRequest,
  CreateQuestionRequest,
  ImportQuestionsJsonRequest,
  UpdateQuestionRequest,
} from '@/services/admin/question.service';
import { PagedRequest } from '@/services/admin/section.service';

// Query keys
export const adminQuestionKeys = {
  all: ['admin', 'questions'] as const,
  lists: () => [...adminQuestionKeys.all, 'list'] as const,
  list: (filters: PagedRequest) =>
    [...adminQuestionKeys.lists(), filters] as const,
  byLevel: (levelId: string) =>
    [...adminQuestionKeys.all, 'level', levelId] as const,
  detail: (id: string) => [...adminQuestionKeys.all, 'detail', id] as const,
};

/**
 * Hook to get paginated questions (Admin only)
 */
export function useQuestionsPaged(request: PagedRequest) {
  return useQuery({
    queryKey: adminQuestionKeys.list(request),
    queryFn: () => adminQuestionService.getQuestionsPaged(request),
  });
}

/**
 * Hook to get questions by level
 */
export function useQuestionsByLevel(levelId: string) {
  return useQuery({
    queryKey: adminQuestionKeys.byLevel(levelId),
    queryFn: () => adminQuestionService.getQuestionsByLevel(levelId),
    enabled: !!levelId,
  });
}

/**
 * Hook to get a question by ID (Admin only)
 */
export function useQuestionById(id: string | null) {
  return useQuery({
    queryKey: adminQuestionKeys.detail(id || ''),
    queryFn: () => adminQuestionService.getQuestionById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to create a new question
 */
export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionRequest) =>
      adminQuestionService.createQuestion(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionKeys.byLevel(variables.levelId),
      });
    },
  });
}

/**
 * Hook to update a question
 */
export function useUpdateQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateQuestionRequest) =>
      adminQuestionService.updateQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
    },
  });
}

/**
 * Hook to delete a question
 */
export function useDeleteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminQuestionService.deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
    },
  });
}

/**
 * Hook to bulk create questions
 */
export function useBulkCreateQuestions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkCreateQuestionsRequest) =>
      adminQuestionService.bulkCreateQuestions(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionKeys.byLevel(variables.levelId),
      });
    },
  });
}

/**
 * Hook to import questions from JSON payload
 */
export function useImportQuestionsJson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ImportQuestionsJsonRequest) =>
      adminQuestionService.importQuestionsJson(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminQuestionKeys.all });
      queryClient.invalidateQueries({
        queryKey: adminQuestionKeys.byLevel(variables.levelId),
      });
    },
  });
}

/**
 * Hook to export questions
 */
export function useExportQuestions() {
  return useMutation({
    mutationFn: (levelId: string) =>
      adminQuestionService.exportQuestions(levelId),
    onSuccess: (blob, levelId) => {
      // Auto-download the exported file
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `questions-${levelId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });
}
