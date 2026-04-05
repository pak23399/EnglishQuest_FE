/**
 * AI API Types
 * Based on EnglishQuest API Documentation - AI API section
 */

// ==================== Chat ====================

export interface ChatMessageHistory {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    conversationHistory?: ChatMessageHistory[];
}

export interface ChatResponse {
    response: string;
    tokensUsed: number;
}

// ==================== Flashcard Generation ====================

export interface GenerateFlashcardsRequest {
    topic: string;
    count: number;
    difficulty?: number; // 1 = easy, 2 = medium, 3 = hard
    deckTitle?: string;
    deckDescription?: string;
    isPublic?: boolean;
}

export interface SaveGeneratedFlashcardsRequest {
  deckTitle: string;
  deckDescription?: string | null;
  isPublic: boolean;
  flashcards: {
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string | null;
    vietnameseExample?: string | null;
    pronunciation?: string | null;
    audioUrl?: string | null;
    tags?: string[];
    partOfSpeech?: string | null;
  }[];
}
export interface SaveGeneratedFlashcardsResponse {
  deckId: string;
  deckTitle: string;
  importedCount: number;
  flashcards?: {
    id: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string | null;
    vietnameseExample?: string | null;
    pronunciation?: string | null;
    audioUrl?: string | null;
    tags?: string[];
    partOfSpeech?: string | null;
  }[];
}


export interface GeneratedFlashcard {
    id: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string;
    vietnameseExample?: string;
    pronunciation?: string;
}

export interface GenerateFlashcardsResponse {
    deckId: string;
    deckTitle: string;
    importedCount: number;
    flashcards: GeneratedFlashcard[];
    tokensUsed: number;
}

// ==================== Text-to-Speech ====================

export interface TTSRequest {
    text: string;
    voiceStyle?: string;
}

export interface TTSResponse {
    audioBase64: string;
    format: string;
    durationSeconds: number;
}

// ==================== Quota ====================

export enum AIFeatureType {
    Chat = 1,
    TextToSpeech = 2,
    FlashcardGeneration = 3,
}

export interface QuotaStatus {
    featureType: AIFeatureType;
    usedToday: number;
    dailyLimit: number; // -1 = unlimited
    remainingToday: number; // -1 = unlimited
    canMakeRequest: boolean;
    currentPlan: number; // 0 = Free, 1 = Support, 2 = Premium
}
