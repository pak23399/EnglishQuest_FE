/**
 * Flashcard API Service
 * Based on EnglishQuest API Documentation - Flashcard API section
 */

import apiClient from '@/lib/api-client';
import {
    BatchSubmitRequest,
    BulkCreateFlashcardsRequest,
    CardProgress,
    CopyDeckRequest,
    CreateDeckRequest,
    CreateFlashcardRequest,
    DeckPagedRequest,
    DeckProgress,
    DeckWithCards,
    Flashcard,
    FlashcardDeck,
    FlashcardPagedRequest,
    OverallProgress,
    PagedResponse,
    StatusResponse,
    StudySession,
    SubmitAnswerRequest,
    SubmitAnswerResponse,
    UpdateDeckRequest,
    UpdateFlashcardRequest,
} from '@/models/flashcard.model';

export const flashcardService = {
    // ==================== Flashcard CRUD ====================

    /**
     * Create a new flashcard
     */
    async createFlashcard(data: CreateFlashcardRequest): Promise<Flashcard> {
        const response = await apiClient.post('/flashcard', data);
        return response.data;
    },

    /**
     * Bulk create flashcards
     */
    async bulkCreateFlashcards(
        data: BulkCreateFlashcardsRequest,
    ): Promise<Flashcard[]> {
        const response = await apiClient.post('/flashcard/bulk', data);
        return response.data;
    },

    /**
     * Update a flashcard
     */
    async updateFlashcard(data: UpdateFlashcardRequest): Promise<Flashcard> {
        const response = await apiClient.put('/flashcard', data);
        return response.data;
    },

    /**
     * Delete a flashcard
     */
    async deleteFlashcard(id: string): Promise<StatusResponse> {
        const response = await apiClient.delete(`/flashcard/${id}`);
        return response.data;
    },

    /**
     * Get flashcard by ID [Public]
     */
    async getFlashcardById(id: string): Promise<Flashcard | null> {
        const response = await apiClient.get(`/flashcard/${id}`);
        return response.data;
    },

    /**
     * Get flashcards by deck [Public]
     */
    async getFlashcardsByDeck(deckId: string): Promise<Flashcard[]> {
        const response = await apiClient.get(`/flashcard/by-deck/${deckId}`);
        return response.data;
    },

    /**
     * Filter flashcards (paged) [Public]
     */
    async getFlashcardsPaged(
        params: FlashcardPagedRequest,
    ): Promise<PagedResponse<Flashcard>> {
        const response = await apiClient.post('/flashcard/paged', params);
        return response.data;
    },

    // ==================== Deck CRUD ====================

    /**
     * Create a new deck
     */
    async createDeck(data: CreateDeckRequest): Promise<FlashcardDeck> {
        const response = await apiClient.post('/flashcard/decks', data);
        return response.data;
    },

    /**
     * Update a deck
     */
    async updateDeck(data: UpdateDeckRequest): Promise<FlashcardDeck> {
        const response = await apiClient.put('/flashcard/decks', data);
        return response.data;
    },

    /**
     * Delete a deck
     */
    async deleteDeck(id: string): Promise<StatusResponse> {
        const response = await apiClient.delete(`/flashcard/decks/${id}`);
        return response.data;
    },

    /**
     * Get deck by ID [Public]
     */
    async getDeckById(id: string): Promise<FlashcardDeck | null> {
        const response = await apiClient.get(`/flashcard/decks/${id}`);
        return response.data;
    },

    /**
     * Get deck with cards [Public]
     */
    async getDeckWithCards(id: string): Promise<DeckWithCards | null> {
        const response = await apiClient.get(`/flashcard/decks/${id}/cards`);
        return response.data;
    },

    /**
     * Filter decks (paged) [Public]
     */
    async getDecksPaged(
        params: DeckPagedRequest,
    ): Promise<PagedResponse<FlashcardDeck>> {
        const response = await apiClient.post('/flashcard/decks/paged', params);
        return response.data;
    },

    /**
     * Copy a public deck to your collection
     */
    async copyDeck(data: CopyDeckRequest): Promise<FlashcardDeck> {
        const response = await apiClient.post('/flashcard/decks/copy', data);
        return response.data;
    },

    // ==================== Study Session ====================

    /**
     * Get study session - cards due for review based on SRS scheduling
     */
    async getStudySession(
        deckId: string,
        maxCards?: number,
    ): Promise<StudySession> {
        const response = await apiClient.get(`/flashcard/study/${deckId}`, {
            params: maxCards ? { maxCards } : undefined,
        });
        return response.data;
    },

    /**
     * Submit answer for a flashcard and update SRS scheduling
     */
    async submitAnswer(data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> {
        const response = await apiClient.post('/flashcard/study/answer', data);
        return response.data;
    },

    /**
     * Batch submit answers
     */
    async batchSubmitAnswers(
        data: BatchSubmitRequest,
    ): Promise<SubmitAnswerResponse[]> {
        const response = await apiClient.post('/flashcard/study/answers', data);
        return response.data;
    },

    // ==================== Progress ====================

    /**
     * Get user's learning progress for a specific deck
     */
    async getDeckProgress(deckId: string): Promise<DeckProgress> {
        const response = await apiClient.get(
            `/flashcard/progress/deck/${deckId}`,
        );
        return response.data;
    },

    /**
     * Get user's overall flashcard learning progress
     */
    async getOverallProgress(): Promise<OverallProgress> {
        const response = await apiClient.get('/flashcard/progress');
        return response.data;
    },

    /**
     * Get detailed progress for each flashcard in a deck
     */
    async getPerCardProgress(deckId: string): Promise<CardProgress[]> {
        const response = await apiClient.get(
            `/flashcard/progress/deck/${deckId}/cards`,
        );
        return response.data;
    },
};
