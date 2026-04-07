import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quizService } from '@/services/quiz.service';
import {
    QuizSession,
    Question,
    SubmitAnswerRequest,
    QuizResult,
    QuizSessionHistory,
} from '@/models/quiz.model';

// Query keys
export const quizKeys = {
    all: ['quiz'] as const,
    sessions: () => [...quizKeys.all, 'sessions'] as const,
    activeSession: () => [...quizKeys.sessions(), 'active'] as const,
    session: (id: string) => [...quizKeys.sessions(), id] as const,
    question: (sessionId: string) => [...quizKeys.session(sessionId), 'question'] as const,
    history: (limit?: number) => [...quizKeys.all, 'history', limit] as const,
};

/**
 * Hook to get active quiz session
 */
export function useActiveQuizSession() {
    return useQuery({
        queryKey: quizKeys.activeSession(),
        queryFn: quizService.getActiveSession,
    });
}

/**
 * Hook to get current question
 */
export function useCurrentQuestion(sessionId: string | undefined) {
    return useQuery({
        queryKey: sessionId ? quizKeys.question(sessionId) : [''],
        queryFn: () => (sessionId ? quizService.getCurrentQuestion(sessionId) : null),
        enabled: !!sessionId,
    });
}

/**
 * Hook to get quiz session history
 */
export function useQuizHistory(limit: number = 10) {
    return useQuery({
        queryKey: quizKeys.history(limit),
        queryFn: () => quizService.getSessionHistory(limit),
    });
}

/**
 * Hook to start a quiz
 */
export function useStartQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (levelId: string) => quizService.startQuiz(levelId),
        onSuccess: (data) => {
            // Update active session cache
            queryClient.setQueryData(quizKeys.activeSession(), data);
            queryClient.invalidateQueries({ queryKey: quizKeys.sessions() });
        },
    });
}

/**
 * Hook to submit an answer
 */
export function useSubmitAnswer(sessionId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubmitAnswerRequest) =>
            quizService.submitAnswer(sessionId, data),
        onSuccess: (data) => {
            // Invalidate current question to fetch next one
            queryClient.invalidateQueries({ queryKey: quizKeys.question(sessionId) });

            // Update session cache if available
            queryClient.invalidateQueries({ queryKey: quizKeys.session(sessionId) });
        },
    });
}

/**
 * Hook to complete a quiz
 */
export function useCompleteQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: string) => quizService.completeQuiz(sessionId),
        onSuccess: () => {
            // Clear active session and invalidate related queries
            queryClient.setQueryData(quizKeys.activeSession(), null);
            queryClient.invalidateQueries({ queryKey: quizKeys.sessions() });
            queryClient.invalidateQueries({ queryKey: quizKeys.history() });
            queryClient.invalidateQueries({ queryKey: ['progress'] });
            queryClient.invalidateQueries({ queryKey: ['hearts'] });
            queryClient.invalidateQueries({ queryKey: ['streak'] });
        },
    });
}

/**
 * Hook to abandon a quiz
 */
export function useAbandonQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: string) => quizService.abandonQuiz(sessionId),
        onSuccess: () => {
            // Clear active session
            queryClient.setQueryData(quizKeys.activeSession(), null);
            queryClient.invalidateQueries({ queryKey: quizKeys.sessions() });
        },
    });
}

/**
 * Hook to resume a quiz session
 */
export function useResumeQuiz() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (sessionId: string) => quizService.resumeSession(sessionId),
        onSuccess: (data) => {
            queryClient.setQueryData(quizKeys.activeSession(), data);
            queryClient.invalidateQueries({ queryKey: quizKeys.sessions() });
        },
    });
}
