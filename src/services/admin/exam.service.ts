/**
 * Admin Exam Service
 * CRUD operations for exam management (Admin only)
 * Base Path: /api/exams/admin
 */

import {
    AdminExam,
    CreateExamRequest,
    UpdateExamRequest,
    ExamListRequest,
    ExamListResponse,
    AdminExamQuestion,
    AddExamQuestionsRequest,
    UpdateExamQuestionRequest,
    ReorderQuestionsRequest,
    ExamParticipantsRequest,
    ExamParticipantsResponse,
    ExamStatistics,
    ParticipantAttemptDetail,
    ImportQuestionsRequest,
    ImportQuestionsResponse,
} from '@/models/exam.model';
import apiClient from '@/lib/api-client';

const ADMIN_EXAM_BASE_PATH = '/exam-admin';

export const adminExamService = {
    // ==================== Exam CRUD ====================

    /**
     * Create a new exam
     */
    async createExam(data: CreateExamRequest): Promise<AdminExam> {
        const response = await apiClient.post(ADMIN_EXAM_BASE_PATH, data);
        return response.data;
    },

    /**
     * Update an existing exam
     */
    async updateExam(data: UpdateExamRequest): Promise<AdminExam> {
        const response = await apiClient.put(ADMIN_EXAM_BASE_PATH, data);
        return response.data;
    },

    /**
     * Delete an exam (soft delete)
     */
    async deleteExam(examId: string): Promise<boolean> {
        const response = await apiClient.delete(`${ADMIN_EXAM_BASE_PATH}/${examId}`);
        return response.data;
    },

    /**
     * Get exam details
     */
    async getExam(examId: string): Promise<AdminExam> {
        const response = await apiClient.get(`${ADMIN_EXAM_BASE_PATH}/${examId}`);
        return response.data;
    },

    /**
     * List exams with pagination and filters
     */
    async listExams(request: ExamListRequest): Promise<ExamListResponse> {
        const response = await apiClient.post(`${ADMIN_EXAM_BASE_PATH}/list`, request);
        return response.data;
    },

    /**
     * Toggle exam active status
     */
    async toggleExamActive(examId: string): Promise<boolean> {
        const response = await apiClient.post(`${ADMIN_EXAM_BASE_PATH}/${examId}/toggle-active`);
        return response.data;
    },

    // ==================== Question Management ====================

    /**
     * Add questions to an exam
     */
    async addQuestions(examId: string, data: AddExamQuestionsRequest): Promise<AdminExamQuestion[]> {
        const response = await apiClient.post(
            `${ADMIN_EXAM_BASE_PATH}/${examId}/questions`,
            data
        );
        return response.data;
    },

    /**
     * Update a question
     */
    async updateQuestion(questionId: string, data: UpdateExamQuestionRequest): Promise<AdminExamQuestion> {
        const response = await apiClient.put(
            `${ADMIN_EXAM_BASE_PATH}/questions/${questionId}`,
            data
        );
        return response.data;
    },

    /**
     * Delete a question
     */
    async deleteQuestion(questionId: string): Promise<boolean> {
        const response = await apiClient.delete(`${ADMIN_EXAM_BASE_PATH}/questions/${questionId}`);
        return response.data;
    },

    /**
     * Get all questions for an exam (with correct answers)
     */
    async getExamQuestions(examId: string): Promise<AdminExamQuestion[]> {
        const response = await apiClient.get(`${ADMIN_EXAM_BASE_PATH}/${examId}/questions`);
        return response.data;
    },

    /**
     * Reorder questions
     */
    async reorderQuestions(examId: string, data: ReorderQuestionsRequest): Promise<boolean> {
        const response = await apiClient.put(
            `${ADMIN_EXAM_BASE_PATH}/${examId}/questions/reorder`,
            data
        );
        return response.data;
    },

    // ==================== Participants & Statistics ====================

    /**
     * Get exam participants with filtering and pagination
     */
    async getExamParticipants(examId: string, request: ExamParticipantsRequest): Promise<ExamParticipantsResponse> {
        const response = await apiClient.post(
            `${ADMIN_EXAM_BASE_PATH}/${examId}/participants`,
            request
        );
        return response.data;
    },

    /**
     * Get exam aggregate statistics
     */
    async getExamStatistics(examId: string): Promise<ExamStatistics> {
        const response = await apiClient.get(`${ADMIN_EXAM_BASE_PATH}/${examId}/stats`);
        return response.data;
    },

    /**
     * Get participant's full attempt detail
     */
    async getParticipantAttempt(attemptId: string): Promise<ParticipantAttemptDetail> {
        const response = await apiClient.get(`${ADMIN_EXAM_BASE_PATH}/attempts/${attemptId}`);
        return response.data;
    },

    // ==================== Import Questions ====================

    /**
     * Import questions from JSON (simplified format, no points)
     */
    async importQuestions(examId: string, data: ImportQuestionsRequest): Promise<ImportQuestionsResponse> {
        const response = await apiClient.post(
            `${ADMIN_EXAM_BASE_PATH}/${examId}/import`,
            data
        );
        return response.data;
    },
};
