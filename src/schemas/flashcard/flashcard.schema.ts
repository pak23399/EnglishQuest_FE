import { z } from 'zod';

// ==================== Deck Schema ====================

export const deckFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    difficulty: z.number().min(0).max(2),
    isPublic: z.boolean(),
});

export type DeckFormValues = z.infer<typeof deckFormSchema>;

// ==================== Flashcard Schema ====================

export const flashcardFormSchema = z.object({
    englishTerm: z.string().min(1, 'English term is required').max(200),
    vietnameseTerm: z
        .string()
        .min(1, 'Vietnamese translation is required')
        .max(200),
    englishExample: z.string().max(500).optional(),
    vietnameseExample: z.string().max(500).optional(),
    pronunciation: z.string().max(100).optional(),
    audioUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    imageUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    difficulty: z.number().min(0).max(2),
    partOfSpeech: z.string().max(50).optional(),
    notes: z.string().max(500).optional(),
});

export type FlashcardFormValues = z.infer<typeof flashcardFormSchema>;

// ==================== Constants ====================

export const partsOfSpeech = [
    'noun',
    'verb',
    'adjective',
    'adverb',
    'pronoun',
    'preposition',
    'conjunction',
    'interjection',
    'phrase',
    'idiom',
] as const;

export type PartOfSpeech = (typeof partsOfSpeech)[number];
