/**
 * AI React Query Hooks
 * Provides data fetching and mutations for AI functionality
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aiService } from '@/services/ai.service';
import {
    AIFeatureType,
    ChatRequest,
    GenerateFlashcardsRequest,
    SaveGeneratedFlashcardsRequest,
    TTSRequest,
} from '@/models/ai.model';
import { flashcardKeys } from './use-flashcard';

// ==================== Query Keys ====================

export const aiKeys = {
    all: ['ai'] as const,
    quota: () => [...aiKeys.all, 'quota'] as const,
    quotaByFeature: (featureType: AIFeatureType) =>
        [...aiKeys.quota(), featureType] as const,
    allQuota: () => [...aiKeys.quota(), 'all'] as const,
};

// ==================== Chat ====================

export function useAIChat() {
    return useMutation({
        mutationFn: (request: ChatRequest) => aiService.chat(request),
    });
}

// ==================== Flashcard Generation ====================

export function useGenerateFlashcards() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: GenerateFlashcardsRequest) =>
            aiService.generateFlashcards(request),
        onSuccess: () => {
            // Invalidate flashcard queries to show the new deck
            queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
            // Invalidate quota since we used one generation
            queryClient.invalidateQueries({ queryKey: aiKeys.quota() });
        },
    });
}

// ==================== Text-to-Speech ====================

export function useTextToSpeech() {
    return useMutation({
        mutationFn: (request: TTSRequest) => aiService.textToSpeech(request),
    });
}

// ==================== Quota ====================

export function useQuotaStatus(featureType: AIFeatureType, enabled = true) {
    return useQuery({
        queryKey: aiKeys.quotaByFeature(featureType),
        queryFn: () => aiService.getQuotaStatus(featureType),
        enabled,
    });
}

export function useAllQuotaStatus(enabled = true) {
    return useQuery({
        queryKey: aiKeys.allQuota(),
        queryFn: () => aiService.getAllQuotaStatus(),
        enabled,
    });
}

export function useSaveGeneratedFlashcards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SaveGeneratedFlashcardsRequest) =>
      aiService.saveGeneratedFlashcards(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.decks() });
      queryClient.invalidateQueries({ queryKey: aiKeys.quota() });
    },
  });
}
