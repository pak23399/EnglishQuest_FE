/**
 * Flashcard API Models
 * Based on EnglishQuest API Documentation - Flashcard API section
 */

// ==================== Enums ====================

/**
 * Status of a flashcard in the SRS (Spaced Repetition System)
 */
export enum FlashcardStatus {
    New = 0, // Never studied
    Learning = 1, // Currently learning (short intervals)
    Review = 2, // In review cycle (longer intervals)
    Mastered = 3, // Well known (very long intervals)
}

/**
 * Rating for flashcard review
 */
export enum FlashcardRating {
    Again = 0, // Forgot completely - reset interval
    Hard = 1, // Difficult - reduce interval
    Good = 2, // Normal - standard interval increase
    Easy = 3, // Very easy - maximum interval increase
}

// ==================== Core Entities ====================

export interface Flashcard {
    id: string;
    deckId: string;
    deckTitle?: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string | null;
    vietnameseExample?: string | null;
    pronunciation?: string | null;
    audioUrl?: string | null;
    imageUrl?: string | null;
    difficulty: number;
    order: number;
    tags?: string[];
    partOfSpeech?: string | null;
    notes?: string | null;
    createdDate?: string;
    isActive?: boolean;
}

export interface FlashcardDeck {
    id: string;
    userId?: string;
    ownerUsername?: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    order: number;
    difficulty: number;
    isPublic: boolean;
    copyCount: number;
    cardCount: number;
    completedCards?: number | null;
    masteredCards?: number | null;
    isOwner?: boolean;
    createdDate?: string;
    isActive?: boolean;
}

export interface DeckWithCards extends FlashcardDeck {
    flashcards: Flashcard[];
}

// ==================== Study Session ====================

export interface StudyCard {
    flashcardId: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string | null;
    vietnameseExample?: string | null;
    pronunciation?: string | null;
    audioUrl?: string | null;
    imageUrl?: string | null;
    status: FlashcardStatus;
    repetitionCount: number;
    tags?: string[];
    partOfSpeech?: string | null;
}

export interface StudySession {
    deckId: string;
    deckTitle: string;
    cards: StudyCard[];
    totalDue: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
}

export interface SubmitAnswerRequest {
    flashcardId: string;
    rating: FlashcardRating;
}

export interface SubmitAnswerResponse {
    flashcardId: string;
    newStatus: FlashcardStatus;
    newIntervalDays: number;
    nextReviewAt: string;
    totalCorrect: number;
    totalIncorrect: number;
}

export interface BatchSubmitRequest {
    answers: SubmitAnswerRequest[];
}

// ==================== Progress ====================

export interface DeckProgress {
    deckId: string;
    deckTitle: string;
    deckImageUrl?: string | null;
    totalCards: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
    masteredCards: number;
    overallAccuracy: number;
    lastStudiedAt?: string | null;
    dueToday: number;
}

export interface DeckProgressSummary {
    deckId: string;
    deckTitle: string;
    totalCards: number;
    masteredCards: number;
    dueToday: number;
}

export interface OverallProgress {
    totalDecks: number;
    totalCards: number;
    totalMastered: number;
    totalLearning: number;
    totalDueToday: number;
    overallAccuracy: number;
    studyStreak: number;
    lastStudiedAt?: string | null;
    deckProgress: DeckProgressSummary[];
}

export interface CardProgress {
    flashcardId: string;
    englishTerm: string;
    vietnameseTerm: string;
    status: FlashcardStatus;
    repetitionCount: number;
    easeFactor: number;
    intervalDays: number;
    nextReviewAt?: string | null;
    lastReviewedAt?: string | null;
    correctCount: number;
    incorrectCount: number;
    accuracy: number;
}

// ==================== Request DTOs ====================

export interface CreateFlashcardRequest {
    deckId: string;
    englishTerm: string;
    vietnameseTerm: string;
    englishExample?: string;
    vietnameseExample?: string;
    pronunciation?: string;
    audioUrl?: string;
    imageUrl?: string;
    difficulty?: number;
    order?: number;
    tags?: string[];
    partOfSpeech?: string;
    notes?: string;
}

export interface UpdateFlashcardRequest {
    id: string;
    englishTerm?: string;
    vietnameseTerm?: string;
    englishExample?: string;
    vietnameseExample?: string;
    pronunciation?: string;
    audioUrl?: string;
    imageUrl?: string;
    difficulty?: number;
    tags?: string[];
    partOfSpeech?: string;
    notes?: string;
}

export interface BulkCreateFlashcardsRequest {
    flashcards: CreateFlashcardRequest[];
}

export interface CreateDeckRequest {
    title: string;
    description?: string;
    imageUrl?: string;
    difficulty?: number;
    isPublic?: boolean;
}

export interface UpdateDeckRequest {
    id: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    difficulty?: number;
    isPublic?: boolean;
}

export interface CopyDeckRequest {
    sourceDeckId: string;
    newTitle?: string;
}

export interface FlashcardPagedRequest {
    page: number;
    limit: number;
    deckId?: string;
    difficulty?: number;
    searchText?: string;
    tag?: string;
    partOfSpeech?: string;
}

export interface DeckPagedRequest {
    page: number;
    limit: number;
    difficulty?: number;
    searchText?: string;
    myDecksOnly?: boolean;
}

// ==================== Response DTOs ====================

export interface PagedMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface PagedResponse<T> {
    meta: PagedMeta;
    items: T[];
}

export interface StatusResponse {
    status: boolean;
}
