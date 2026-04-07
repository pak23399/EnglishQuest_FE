import {
  Question,
  QuizResult,
  QuizSession,
  QuizSessionHistory,
  SubmitAnswerRequest,
  SubmitAnswerResponse,
} from '@/models/quiz.model';
import apiClient from '@/lib/api-client';

export const quizService = {
  /**
   * Start a new quiz session for a specific level
   */
  async startQuiz(levelId: string): Promise<QuizSession> {
    const response = await apiClient.post(`/quiz-session/start/${levelId}`);
    return response.data;
  },

  /**
   * Get the current user's active quiz session
   */
  async getActiveSession(): Promise<QuizSession | null> {
    const response = await apiClient.get('/quiz-session/active');
    return response.data;
  },

  /**
   * Get the current question for a session
   */
  async getCurrentQuestion(sessionId: string): Promise<Question> {
    const response = await apiClient.get(`/quiz-session/${sessionId}/question`);
    return response.data;
  },

  /**
   * Submit an answer for the current question
   */
  async submitAnswer(
    sessionId: string,
    data: SubmitAnswerRequest,
  ): Promise<SubmitAnswerResponse> {
    const response = await apiClient.post(
      `/quiz-session/${sessionId}/answer`,
      data,
    );
    return response.data;
  },

  /**
   * Complete the quiz session
   */
  async completeQuiz(sessionId: string): Promise<QuizResult> {
    const response = await apiClient.post(`/quiz-session/${sessionId}/complete`);
    return response.data;
  },

  /**
   * Abandon the current quiz session
   */
  async abandonQuiz(sessionId: string): Promise<{ status: boolean }> {
    const response = await apiClient.post(`/quiz-session/${sessionId}/abandon`);
    return response.data;
  },

  /**
   * Resume a previously abandoned session
   */
  async resumeSession(sessionId: string): Promise<QuizSession> {
    const response = await apiClient.post(`/quiz-session/${sessionId}/resume`);
    return response.data;
  },

  /**
   * Get user's quiz session history
   */
  async getSessionHistory(limit: number = 10): Promise<QuizSessionHistory[]> {
    const response = await apiClient.get('/quiz-session/history', {
      params: { limit },
    });
    return response.data;
  },
};
