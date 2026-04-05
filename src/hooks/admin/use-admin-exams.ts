/**
 * Admin Exam React Query Hooks
 * Provides data fetching and mutations for exam admin functionality
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminExamService } from '@/services/admin/exam.service';
import {
    CreateExamRequest,
    UpdateExamRequest,
    ExamListRequest,
    AddExamQuestionsRequest,
    UpdateExamQuestionRequest,
    ReorderQuestionsRequest,
    ExamParticipantsRequest,
    ImportQuestionsRequest,
} from '@/models/exam.model';

// ==================== Query Keys ====================

export const adminExamKeys = {
    all: ['admin', 'exams'] as const,
    lists: () => [...adminExamKeys.all, 'list'] as const,
    list: (filters: ExamListRequest) => [...adminExamKeys.lists(), filters] as const,
    details: () => [...adminExamKeys.all, 'detail'] as const,
    detail: (id: string) => [...adminExamKeys.details(), id] as const,
    questions: (examId: string) => [...adminExamKeys.all, 'questions', examId] as const,
};

// ==================== Exam Queries ====================

/**
 * Hook to list exams with pagination and filters
 */
export function useAdminExams(request: ExamListRequest) {
    return useQuery({
        queryKey: adminExamKeys.list(request),
        queryFn: () => adminExamService.listExams(request),
    });
}

/**
 * Hook to get exam details
 */
export function useAdminExam(examId: string, enabled = true) {
    return useQuery({
        queryKey: adminExamKeys.detail(examId),
        queryFn: () => adminExamService.getExam(examId),
        enabled: enabled && !!examId,
    });
}

/**
 * Hook to get exam questions (with correct answers)
 */
export function useAdminExamQuestions(examId: string, enabled = true) {
    return useQuery({
        queryKey: adminExamKeys.questions(examId),
        queryFn: () => adminExamService.getExamQuestions(examId),
        enabled: enabled && !!examId,
    });
}

// ==================== Exam Mutations ====================

/**
 * Hook to create a new exam
 */
export function useCreateExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateExamRequest) => adminExamService.createExam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.lists() });
        },
    });
}

/**
 * Hook to update an exam
 */
export function useUpdateExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateExamRequest) => adminExamService.updateExam(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.lists() });
            queryClient.invalidateQueries({ queryKey: adminExamKeys.detail(variables.id) });
        },
    });
}

/**
 * Hook to delete an exam
 */
export function useDeleteExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examId: string) => adminExamService.deleteExam(examId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.lists() });
        },
    });
}

/**
 * Hook to toggle exam active status
 */
export function useToggleExamActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examId: string) => adminExamService.toggleExamActive(examId),
        onSuccess: (_, examId) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.lists() });
            queryClient.invalidateQueries({ queryKey: adminExamKeys.detail(examId) });
        },
    });
}

// ==================== Question Mutations ====================

/**
 * Hook to add questions to an exam
 */
export function useAddExamQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ examId, data }: { examId: string; data: AddExamQuestionsRequest }) =>
            adminExamService.addQuestions(examId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.questions(variables.examId) });
            queryClient.invalidateQueries({ queryKey: adminExamKeys.detail(variables.examId) });
        },
    });
}

/**
 * Hook to update a question
 */
export function useUpdateExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            questionId,
            data,
            examId,
        }: {
            questionId: string;
            data: UpdateExamQuestionRequest;
            examId: string;
        }) => adminExamService.updateQuestion(questionId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.questions(variables.examId) });
        },
    });
}

/**
 * Hook to delete a question
 */
export function useDeleteExamQuestion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ questionId, examId }: { questionId: string; examId: string }) =>
            adminExamService.deleteQuestion(questionId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.questions(variables.examId) });
            queryClient.invalidateQueries({ queryKey: adminExamKeys.detail(variables.examId) });
        },
    });
}

/**
 * Hook to reorder questions
 */
export function useReorderExamQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ examId, data }: { examId: string; data: ReorderQuestionsRequest }) =>
            adminExamService.reorderQuestions(examId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.questions(variables.examId) });
        },
    });
}

// ==================== Participants & Statistics ====================

/**
 * Hook to get exam participants with pagination and filters
 */
export function useExamParticipants(
    examId: string,
    options: ExamParticipantsRequest,
    enabled = true
) {
    return useQuery({
        queryKey: [...adminExamKeys.all, 'participants', examId, options] as const,
        queryFn: () => adminExamService.getExamParticipants(examId, options),
        enabled: enabled && !!examId,
    });
}

/**
 * Hook to get exam statistics
 */
export function useExamStatistics(examId: string, enabled = true) {
    return useQuery({
        queryKey: [...adminExamKeys.all, 'statistics', examId] as const,
        queryFn: () => adminExamService.getExamStatistics(examId),
        enabled: enabled && !!examId,
    });
}

/**
 * Hook to get participant attempt detail
 */
export function useParticipantAttempt(attemptId: string, enabled = true) {
    return useQuery({
        queryKey: [...adminExamKeys.all, 'attempt', attemptId] as const,
        queryFn: () => adminExamService.getParticipantAttempt(attemptId),
        enabled: enabled && !!attemptId,
    });
}

// ==================== Import Questions ====================

/**
 * Hook to import questions from JSON
 */
export function useImportExamQuestions() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ examId, data }: { examId: string; data: ImportQuestionsRequest }) =>
            adminExamService.importQuestions(examId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: adminExamKeys.questions(variables.examId) });
            queryClient.invalidateQueries({ queryKey: adminExamKeys.detail(variables.examId) });
        },
    });
}
