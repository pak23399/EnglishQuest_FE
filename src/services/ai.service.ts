/**
 * AI API Service
 * Based on EnglishQuest API Documentation - AI API section
 */

import apiClient from '@/lib/api-client';
import {
    AIFeatureType,
    ChatRequest,
    ChatResponse,
    GenerateFlashcardsRequest,
    GenerateFlashcardsResponse,
    SaveGeneratedFlashcardsRequest,
    SaveGeneratedFlashcardsResponse,
    QuotaStatus,
    TTSRequest,
    TTSResponse,
} from '@/models/ai.model';

export const aiService = {
    /**
     * Chat with AI English learning assistant
     */
    async chat(request: ChatRequest): Promise<ChatResponse> {
        const response = await apiClient.post('/ai/chat', request);
        return response.data;
    },

    /**
     * Generate flashcards using AI
     * Creates a deck with AI-generated English-Vietnamese flashcards
     */
    async generateFlashcards(
        request: GenerateFlashcardsRequest,
    ): Promise<GenerateFlashcardsResponse> {
        const response = await apiClient.post('/ai/generate-flashcards', request);
        return response.data;
    },

    /**
     * Convert text to speech
     */
    async textToSpeech(request: TTSRequest): Promise<TTSResponse> {
        const response = await apiClient.post('/ai/tts', request);
        return response.data;
    },

    /**
     * Get quota status for a specific AI feature
     */
    async getQuotaStatus(featureType: AIFeatureType): Promise<QuotaStatus> {
        const response = await apiClient.get(`/ai/quota/${featureType}`);
        return response.data;
    },

    /**
     * Get quota status for all AI features
     */
    async getAllQuotaStatus(): Promise<QuotaStatus[]> {
        const response = await apiClient.get('/ai/quota');
        return response.data;
    },
    async saveGeneratedFlashcards(request: SaveGeneratedFlashcardsRequest): Promise<SaveGeneratedFlashcardsResponse> {
        const response = await apiClient.post('/ai/save-generated-flashcards', request);
        return response.data;
    }
};
