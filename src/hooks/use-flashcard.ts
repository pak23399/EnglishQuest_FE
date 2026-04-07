/**
 * Flashcard React Query Hooks
 * Provides data fetching and mutations for flashcard functionality
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flashcardService } from '@/services/flashcard.service';
import {
    BatchSubmitRequest,
    BulkCreateFlashcardsRequest,
    CopyDeckRequest,
    CreateDeckRequest,
    CreateFlashcardRequest,
    DeckPagedRequest,
    FlashcardPagedRequest,
    FlashcardRating,
    UpdateDeckRequest,
    UpdateFlashcardRequest,
} from '@/models/flashcard.model';

// ==================== Query Keys ====================

export const flashcardKeys = {
    all: ['flashcard'] as const,
    decks: () => [...flashcardKeys.all, 'decks'] as const,
    decksPaged: (params: DeckPagedRequest) =>
        [...flashcardKeys.decks(), 'paged', params] as const,
    deck: (id: string) => [...flashcardKeys.decks(), id] as const,
    deckWithCards: (id: string) => [...flashcardKeys.deck(id), 'cards'] as const,
    flashcards: () => [...flashcardKeys.all, 'flashcards'] as const,
    flashcardsByDeck: (deckId: string) =>
        [...flashcardKeys.flashcards(), 'deck', deckId] as const,
    flashcardsPaged: (params: FlashcardPagedRequest) =>
        [...flashcardKeys.flashcards(), 'paged', params] as const,
    flashcard: (id: string) => [...flashcardKeys.flashcards(), id] as const,
    studySession: (deckId: string) =>
        [...flashcardKeys.all, 'study', deckId] as const,
    progress: () => [...flashcardKeys.all, 'progress'] as const,
    overallProgress: () => [...flashcardKeys.progress(), 'overall'] as const,
    deckProgress: (deckId: string) =>
        [...flashcardKeys.progress(), 'deck', deckId] as const,
    cardProgress: (deckId: string) =>
        [...flashcardKeys.progress(), 'cards', deckId] as const,
};

// ==================== Deck Queries ====================

export function useDecks(params: DeckPagedRequest = { page: 1, limit: 20 }) {
    return useQuery({
        queryKey: flashcardKeys.decksPaged(params),
        queryFn: () => flashcardService.getDecksPaged(params),
    });
}

export function useDeckById(id: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.deck(id),
        queryFn: () => flashcardService.getDeckById(id),
        enabled: enabled && !!id,
    });
}

export function useDeckWithCards(id: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.deckWithCards(id),
        queryFn: () => flashcardService.getDeckWithCards(id),
        enabled: enabled && !!id,
    });
}

// ==================== Flashcard Queries ====================

export function useFlashcardsByDeck(deckId: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.flashcardsByDeck(deckId),
        queryFn: () => flashcardService.getFlashcardsByDeck(deckId),
        enabled: enabled && !!deckId,
    });
}

export function useFlashcardsPaged(params: FlashcardPagedRequest) {
    return useQuery({
        queryKey: flashcardKeys.flashcardsPaged(params),
        queryFn: () => flashcardService.getFlashcardsPaged(params),
    });
}

export function useFlashcardById(id: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.flashcard(id),
        queryFn: () => flashcardService.getFlashcardById(id),
        enabled: enabled && !!id,
    });
}

// ==================== Study Session ====================

export function useStudySession(
    deckId: string,
    maxCards?: number,
    enabled = true,
) {
    return useQuery({
        queryKey: flashcardKeys.studySession(deckId),
        queryFn: () => flashcardService.getStudySession(deckId, maxCards),
        enabled: enabled && !!deckId,
    });
}

export function useSubmitAnswer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            flashcardId,
            rating,
        }: {
            flashcardId: string;
            rating: FlashcardRating;
        }) => flashcardService.submitAnswer({ flashcardId, rating }),
        onSuccess: () => {
            // Invalidate study sessions and progress
            queryClient.invalidateQueries({ queryKey: flashcardKeys.progress() });
        },
    });
}

export function useBatchSubmitAnswers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BatchSubmitRequest) =>
            flashcardService.batchSubmitAnswers(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.progress() });
        },
    });
}

// ==================== Progress ====================

export function useOverallProgress() {
    return useQuery({
        queryKey: flashcardKeys.overallProgress(),
        queryFn: () => flashcardService.getOverallProgress(),
    });
}

export function useDeckProgress(deckId: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.deckProgress(deckId),
        queryFn: () => flashcardService.getDeckProgress(deckId),
        enabled: enabled && !!deckId,
    });
}

export function useCardProgress(deckId: string, enabled = true) {
    return useQuery({
        queryKey: flashcardKeys.cardProgress(deckId),
        queryFn: () => flashcardService.getPerCardProgress(deckId),
        enabled: enabled && !!deckId,
    });
}

// ==================== Deck Mutations ====================

export function useCreateDeck() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateDeckRequest) => flashcardService.createDeck(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
        },
    });
}

export function useUpdateDeck() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDeckRequest) => flashcardService.updateDeck(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
            queryClient.invalidateQueries({
                queryKey: flashcardKeys.deck(variables.id),
            });
        },
    });
}

export function useDeleteDeck() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => flashcardService.deleteDeck(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
        },
    });
}

export function useCopyDeck() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CopyDeckRequest) => flashcardService.copyDeck(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
        },
    });
}

// ==================== Flashcard Mutations ====================

export function useCreateFlashcard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateFlashcardRequest) =>
            flashcardService.createFlashcard(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: flashcardKeys.flashcardsByDeck(variables.deckId),
            });
            queryClient.invalidateQueries({
                queryKey: flashcardKeys.deckWithCards(variables.deckId),
            });
        },
    });
}

export function useBulkCreateFlashcards() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BulkCreateFlashcardsRequest) =>
            flashcardService.bulkCreateFlashcards(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.flashcards() });
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
        },
    });
}

export function useUpdateFlashcard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateFlashcardRequest) =>
            flashcardService.updateFlashcard(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: flashcardKeys.flashcard(variables.id),
            });
            queryClient.invalidateQueries({ queryKey: flashcardKeys.flashcards() });
        },
    });
}

export function useDeleteFlashcard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => flashcardService.deleteFlashcard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: flashcardKeys.flashcards() });
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
        },
    });
}
