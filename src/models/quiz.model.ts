export interface QuizSession {
  id: string;
  userId: string;
  levelId: string;
  level: QuizLevel;
  status: SessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  questionIds: string[];
  answers: QuizAnswer[];
  score: number;
  correctCount: number;
  startedAt: string;
  expiresAt: string;
  completedAt?: string;
}

export interface QuizLevel {
  id: string;
  title: string;
  sectionId: string;
}

export enum SessionStatus {
  Active = 'Active',
  Completed = 'Completed',
  Abandoned = 'Abandoned',
  Expired = 'Expired',
}

export interface Question {
  id: string;
  levelId: string;
  type: QuestionType;
  text: string;
  difficulty: Difficulty;
  order: number;
  points: number;
  options: string[]; // Array of option strings
  hasMedia: boolean;
  // Flat media fields from API
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
  // Optional fields
  explanation?: string | null;
  correctAnswer?: string;
  typeData?: Record<string, unknown>;
}

export enum QuestionType {
  MultipleChoice = 0,
  FillInTheBlank = 1,
  Meaning = 2,
  CorrectSentence = 3,
  Pattern = 4,
  Listening = 5,
  TrueFalse = 6,
  Matching = 7,
  Ordering = 8,
}

export enum Difficulty {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  mediaUrl?: string | null;
  explanation?: string | null;
}

export interface QuestionMedia {
  audioUrl?: string | null;
  imageUrl?: string | null;
  videoUrl?: string | null;
}

export interface QuizAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface SubmitAnswerRequest {
  questionId: string;
  UserAnswer: string; // API expects PascalCase
}

export interface SubmitAnswerResponse {
  isCorrect: boolean;
  correctAnswer: string;
  explanation?: string;
  pointsEarned: number;
  currentScore: number;
  currentStreak: number;
  totalQuestions: number;
  answeredCount: number;
  nextQuestion?: Question;
  isLastQuestion: boolean;
}

export interface QuizResult {
  sessionId: string;
  attemptId: string;
  levelId: string;
  levelTitle: string;
  sectionTitle: string;
  status: 'Passed' | 'Failed';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  xpEarned: number;
  heartsUsed: number;
  timeTaken: string; // Format: "HH:MM:SS"
  passed: boolean;
  isNewBestScore: boolean;
  completedAt: string;
  streakEarned: boolean;
  currentStreak: number;
  unlockedNextLevel: boolean;
  nextLevelId?: string;
  nextLevelTitle?: string;
  progressUpdate: {
    previousBestScore: number;
    newBestScore: number;
    totalXp: number;
    totalAttempts: number;
  };
}

export interface QuizSessionHistory {
  id: string;
  levelId: string;
  status: SessionStatus;
  score: number;
  totalQuestions: number;
  startedAt: string;
  completedAt?: string;
}
