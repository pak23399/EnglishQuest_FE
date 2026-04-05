import {
    AutosaveRequest,
    AutosaveResponse,
    ExamResult,
    ExamSession,
    SubmitExamRequest,
    SubmitExamResponse,
    ExamListItem,
    ExamHistoryItem,
    ExamReview,
} from '@/models/exam.model';
import apiClient from '@/lib/api-client';


// Note: Exam API uses a different base path than other APIs
const EXAM_BASE_PATH = '/exam';

export const examService = {
    /**
     * Get list of available exams for the current user
     */
    async getAvailableExams(): Promise<ExamListItem[]> {
        const response = await apiClient.post('/exam-admin/list', {
            page: 1,
            limit: 100,
            isActive: true,
        });
        return response.data.items || [];
    },

    /**
     * Start a new timed exam session
     */
    async startExam(examId: string): Promise<ExamSession> {
        const response = await apiClient.post(`${EXAM_BASE_PATH}/start`, {
            examId,
        });
        return response.data;
    },

    /**
     * Autosave answers periodically (call every 5 seconds)
     */
    async autosaveAnswers(
        sessionId: string,
        data: AutosaveRequest,
    ): Promise<AutosaveResponse> {
        const response = await apiClient.post(
            `${EXAM_BASE_PATH}/sessions/${sessionId}/autosave`,
            data,
        );
        return response.data;
    },

    /**
     * Submit exam for grading
     * Uses idempotency key to prevent duplicate submissions
     */
    async submitExam(
        sessionId: string,
        data: SubmitExamRequest,
    ): Promise<SubmitExamResponse> {
        const idempotencyKey = crypto.randomUUID();
        const response = await apiClient.post(
            `${EXAM_BASE_PATH}/sessions/${sessionId}/submit`,
            data,
            {
                headers: {
                    'Idempotency-Key': idempotencyKey,
                },
            },
        );
        return response.data;
    },

    /**
     * Get exam results (poll until grading is complete)
     */
    async getExamResults(submissionId: string): Promise<ExamResult> {
        const response = await apiClient.get(
            `${EXAM_BASE_PATH}/submissions/${submissionId}`,
        );
        return response.data;
    },

    // ==================== User History & Review ====================

    /**
     * Get user's exam attempt history
     */
    async getExamHistory(): Promise<ExamHistoryItem[]> {
        const response = await apiClient.get(`${EXAM_BASE_PATH}/history`);
        return response.data;
    },

    /**
     * Get exam review (respects admin visibility settings)
     */
    async getExamReview(attemptId: string): Promise<ExamReview> {
        const response = await apiClient.get(
            `${EXAM_BASE_PATH}/attempts/${attemptId}/review`,
        );
        return response.data;
    },
};

