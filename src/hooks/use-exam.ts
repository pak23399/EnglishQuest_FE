/**
 * Exam React Query Hooks
 * Provides data fetching and mutations for exam functionality
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examService } from '@/services/exam.service';
import { AutosaveRequest, SubmitExamRequest } from '@/models/exam.model';

// ==================== Query Keys ====================

export const examKeys = {
    all: ['exam'] as const,
    available: () => [...examKeys.all, 'available'] as const,
    sessions: () => [...examKeys.all, 'sessions'] as const,
    session: (sessionId: string) => [...examKeys.sessions(), sessionId] as const,
    results: () => [...examKeys.all, 'results'] as const,
    result: (submissionId: string) => [...examKeys.results(), submissionId] as const,
};

// ==================== Available Exams Query ====================

/**
 * Get list of available exams for the current user
 */
export function useAvailableExams(enabled = true) {
    return useQuery({
        queryKey: examKeys.available(),
        queryFn: () => examService.getAvailableExams(),
        enabled,
    });
}

// ==================== Exam Session Mutations ====================

/**
 * Start a new exam session
 */
export function useStartExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (examId: string) => examService.startExam(examId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: examKeys.sessions() });
        },
    });
}

/**
 * Autosave answers during exam (call every 5 seconds)
 */
export function useAutosaveAnswers() {
    return useMutation({
        mutationFn: ({
            sessionId,
            data,
        }: {
            sessionId: string;
            data: AutosaveRequest;
        }) => examService.autosaveAnswers(sessionId, data),
    });
}

/**
 * Submit exam for grading
 */
export function useSubmitExam() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            sessionId,
            data,
        }: {
            sessionId: string;
            data: SubmitExamRequest;
        }) => examService.submitExam(sessionId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: examKeys.sessions() });
        },
    });
}

// ==================== Exam Results Queries ====================

/**
 * Get exam results by submission ID
 * Poll this until sessionId !== '00000000-0000-0000-0000-000000000000'
 */
export function useExamResults(submissionId: string, enabled = true) {
    return useQuery({
        queryKey: examKeys.result(submissionId),
        queryFn: () => examService.getExamResults(submissionId),
        enabled: enabled && !!submissionId,
        refetchInterval: (query) => {
            // Stop polling when results are ready (sessionId is not empty GUID)
            const data = query.state.data;
            if (
                data?.sessionId &&
                data.sessionId !== '00000000-0000-0000-0000-000000000000'
            ) {
                return false;
            }
            // Poll every 2 seconds while waiting
            return 2000;
        },
    });
}

// ==================== User History & Review ====================

/**
 * Get user's exam attempt history
 */
export function useExamHistory(enabled = true) {
    return useQuery({
        queryKey: [...examKeys.all, 'history'] as const,
        queryFn: () => examService.getExamHistory(),
        enabled,
    });
}

/**
 * Get exam review (respects admin visibility settings)
 */
export function useExamReview(attemptId: string, enabled = true) {
    return useQuery({
        queryKey: [...examKeys.all, 'review', attemptId] as const,
        queryFn: () => examService.getExamReview(attemptId),
        enabled: enabled && !!attemptId,
    });
}
