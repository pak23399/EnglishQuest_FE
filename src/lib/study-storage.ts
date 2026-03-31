/**
 * Local Storage Utilities for Study Features
 * Handles persistence for flashcard progress, exam sessions, and chat history
 */

const STORAGE_KEYS = {
    FLASHCARD_PROGRESS: 'englishquest-flashcard-progress',
    LEARNED_CARDS: 'englishquest-learned-cards',
    EXAM_SESSIONS: 'englishquest-exam-sessions',
    CHAT_HISTORY: 'englishquest-chat-history',
} as const;

// Flashcard Progress
export interface FlashcardProgress {
    levelId: string;
    currentIndex: number;
    learnedCardIds: string[];
    lastUpdated: string;
}

export const saveFlashcardProgress = (progress: FlashcardProgress): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.FLASHCARD_PROGRESS, JSON.stringify(progress));
    } catch (error) {
        console.error('Failed to save flashcard progress:', error);
    }
};

export const loadFlashcardProgress = (levelId: string): FlashcardProgress | null => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
        if (!data) return null;

        const progress: FlashcardProgress = JSON.parse(data);
        return progress.levelId === levelId ? progress : null;
    } catch (error) {
        console.error('Failed to load flashcard progress:', error);
        return null;
    }
};

export const markCardAsLearned = (questionId: string): void => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.LEARNED_CARDS);
        const learnedCards: string[] = data ? JSON.parse(data) : [];

        if (!learnedCards.includes(questionId)) {
            learnedCards.push(questionId);
            localStorage.setItem(STORAGE_KEYS.LEARNED_CARDS, JSON.stringify(learnedCards));
        }
    } catch (error) {
        console.error('Failed to mark card as learned:', error);
    }
};

export const getLearnedCards = (): string[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.LEARNED_CARDS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get learned cards:', error);
        return [];
    }
};

// Exam Sessions
export interface ExamSession {
    id: string;
    questionIds: string[];
    answers: Record<string, string>;
    startTime: string;
    endTime?: string;
    score?: number;
    totalQuestions: number;
}

export const saveExamSession = (session: ExamSession): void => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS);
        const sessions: ExamSession[] = data ? JSON.parse(data) : [];

        // Update existing or add new
        const index = sessions.findIndex(s => s.id === session.id);
        if (index >= 0) {
            sessions[index] = session;
        } else {
            sessions.push(session);
        }

        // Keep only last 10 sessions
        const recentSessions = sessions.slice(-10);
        localStorage.setItem(STORAGE_KEYS.EXAM_SESSIONS, JSON.stringify(recentSessions));
    } catch (error) {
        console.error('Failed to save exam session:', error);
    }
};

export const loadExamSession = (sessionId: string): ExamSession | null => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS);
        if (!data) return null;

        const sessions: ExamSession[] = JSON.parse(data);
        return sessions.find(s => s.id === sessionId) || null;
    } catch (error) {
        console.error('Failed to load exam session:', error);
        return null;
    }
};

export const getRecentExamSessions = (): ExamSession[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EXAM_SESSIONS);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to get exam sessions:', error);
        return [];
    }
};

// Chat History
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

export const saveChatHistory = (messages: ChatMessage[]): void => {
    try {
        localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch (error) {
        console.error('Failed to save chat history:', error);
    }
};

export const loadChatHistory = (): ChatMessage[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Failed to load chat history:', error);
        return [];
    }
};

export const addChatMessage = (message: ChatMessage): void => {
    try {
        const messages = loadChatHistory();
        messages.push(message);
        saveChatHistory(messages);
    } catch (error) {
        console.error('Failed to add chat message:', error);
    }
};

export const clearChatHistory = (): void => {
    try {
        localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    } catch (error) {
        console.error('Failed to clear chat history:', error);
    }
};
