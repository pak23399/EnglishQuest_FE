import { Difficulty, Question, QuestionType } from '@/models/quiz.model';
import apiClient from '@/lib/api-client';
import { PagedRequest, PagedResponse } from './section.service';

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  mediaUrl?: string | null;
  explanation?: string | null;
}

export interface CreateQuestionRequest {
  levelId: string;
  type: QuestionType;
  text: string;
  correctAnswer: string;
  explanation?: string;
  difficulty: Difficulty;
  order: number;
  points: number;
  options: string[];
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface UpdateQuestionRequest {
  id: string;
  text?: string;
  correctAnswer?: string;
  explanation?: string;
  difficulty?: Difficulty;
  order?: number;
  points?: number;
  options?: string[];
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface BulkCreateQuestionsRequest {
  levelId: string;
  questions: Omit<CreateQuestionRequest, 'levelId'>[];
}

// Question type strings supported by the import API
export type ImportQuestionType =
  | 'fill-in-the-blank'
  | 'meaning'
  | 'correct-sentence'
  | 'pattern'
  | 'listening'
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'ordering';

export interface ImportPatternData {
  baseSentence?: string;
  exampleSentence?: string;
  questionSentence?: string;
}

export interface ImportQuestionItem {
  type: ImportQuestionType | number;
  text: string;
  correctAnswer: string;
  options?: string[];
  explanation?: string;
  difficulty?: number; // 1=Beginner, 2=Elementary, 3=Intermediate, 4=UpperIntermediate, 5=Advanced
  points?: number;
  order?: number;
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  pattern?: ImportPatternData | null;
}

export interface ImportQuestionsJsonRequest {
  levelId: string;
  replaceExisting?: boolean;
  questions: ImportQuestionItem[];
}

export interface ImportQuestionError {
  index: number;
  questionText: string;
  errorMessage: string;
}

export interface ImportQuestionsJsonResponse {
  isSuccess: boolean;
  message: string;
  importedCount: number;
  failedCount: number;
  replacedCount: number;
  importedQuestionIds: string[];
  errors: ImportQuestionError[];
}

export const adminQuestionService = {
  /**
   * Create a new question (Admin only)
   */
  async createQuestion(data: CreateQuestionRequest): Promise<Question> {
    const response = await apiClient.post('/question', data);
    return response.data;
  },

  /**
   * Update an existing question (Admin only)
   */
  async updateQuestion(data: UpdateQuestionRequest): Promise<Question> {
    const response = await apiClient.put('/question', data);
    return response.data;
  },

  /**
   * Delete a question (Admin only)
   */
  async deleteQuestion(id: string): Promise<{ status: boolean }> {
    const response = await apiClient.delete(`/question/${id}`);
    return response.data;
  },

  /**
   * Get paginated questions (Admin only)
   */
  async getQuestionsPaged(
    request: PagedRequest,
  ): Promise<PagedResponse<Question>> {
    const response = await apiClient.post('/question/paged', request);
    return response.data;
  },

  /**
   * Get questions by level (Admin only)
   */
  async getQuestionsByLevel(levelId: string): Promise<Question[]> {
    const response = await apiClient.get(`/question/level/${levelId}`);
    return response.data;
  },

  /**
   * Get question by ID (Admin only)
   */
  async getQuestionById(id: string): Promise<Question> {
    const response = await apiClient.get(`/question/${id}`);
    return response.data;
  },

  /**
   * Bulk create questions (Admin only)
   */
  async bulkCreateQuestions(
    data: BulkCreateQuestionsRequest,
  ): Promise<Question[]> {
    const response = await apiClient.post('/question/bulk', data);
    return response.data;
  },

  /**
   * Import questions from JSON (Admin only)
   */
  async importQuestions(
    file: File,
  ): Promise<{ status: boolean; count: number }> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/question/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Export questions to JSON (Admin only)
   */
  async exportQuestions(levelId: string): Promise<Blob> {
    const response = await apiClient.get(`/question/export/${levelId}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Import questions from JSON payload (Admin only)
   * Uses the new import-json endpoint with detailed result feedback
   */
  async importQuestionsJson(
    data: ImportQuestionsJsonRequest,
  ): Promise<ImportQuestionsJsonResponse> {
    const response = await apiClient.post('/question/import-json', data);
    return response.data;
  },
};
