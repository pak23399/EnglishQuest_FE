/**
 * Exam API Models
 * Based on API documentation - Base path: /api/exams
 */

// ============ Request Types ============

export interface StartExamRequest {
    examId: string;
}

export interface AutosaveRequest {
    answers: Record<string, string>; // questionId -> answer
    sequenceNumber: number;
}

export interface SubmitExamRequest {
    answers: Record<string, string>; // questionId -> answer
}

// ============ Response Types ============

export interface ExamQuestion {
    id: string;
    text: string;
    options: string[];
    points: number;
    order: number;
}

export interface ExamSession {
    sessionId: string;
    startedAt: string;
    expiresAt: string;
    durationMinutes: number;
    totalQuestions: number;
    questions: ExamQuestion[];
    savedAnswers?: Record<string, string>; // Previously saved answers when resuming
    isResumed?: boolean; // Whether this is a resumed session
}

export interface AutosaveResponse {
    savedAt: string;
    sequenceNumber: number;
    answerCount: number;
}

export interface SubmitExamResponse {
    submissionId: string;
    status: 'Processing' | 'Completed';
    message: string;
}

export interface QuestionResult {
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    timeSpentSeconds: number;
}

export interface ExamResult {
    sessionId: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    passed: boolean;
    timeTakenSeconds: number;
    completedAt: string;
    xpEarned: number;
    questionResults: QuestionResult[];
}

// ============ Exam Session Status ============

export enum ExamSessionStatus {
    Active = 'Active',
    SubmittedPendingGrading = 'SubmittedPendingGrading',
    Completed = 'Completed',
    Abandoned = 'Abandoned',
}

// ============ Local State Types ============

export interface ExamState {
    sessionId: string;
    currentQuestionIndex: number;
    answers: Record<string, string>;
    sequenceNumber: number;
    startedAt: Date;
    expiresAt: Date;
}

// ============ Admin Exam Types ============

export interface ReviewSettings {
    allowReview?: boolean;
    showUserAnswers?: boolean;
    showPassFail?: boolean;
    reviewAvailableAfterMinutes?: number;
}

export interface CreateExamRequest {
    title: string;
    description?: string;
    durationMinutes: number;
    passingScore: number;
    xpReward: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number; // 0 = unlimited
    scheduleStart?: string;
    scheduleEnd?: string;
    difficulty: number;
    reviewSettings?: ReviewSettings;
}

export interface UpdateExamRequest {
    id: string;
    title?: string;
    description?: string;
    durationMinutes?: number;
    passingScore?: number;
    xpReward?: number;
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    maxAttempts?: number;
    scheduleStart?: string;
    scheduleEnd?: string;
    difficulty?: number;
    clearSchedule?: boolean;
    reviewSettings?: ReviewSettings;
}

export interface AdminExam {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    passingScore: number;
    xpReward: number;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number;
    scheduleStart?: string;
    scheduleEnd?: string;
    difficulty: number;
    totalQuestions: number;
    isActive: boolean;
    createdDate: string;
    reviewSettings?: ReviewSettings;
}

export interface ExamListItem {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    passingScore: number;
    xpReward: number;
    difficulty: number;
    scheduleStart?: string;
    scheduleEnd?: string;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    maxAttempts: number;
    totalQuestions: number;
    isActive: boolean;
    createdDate: string;
    reviewSettings?: ReviewSettings;
}

export interface ExamListRequest {
    page: number;
    limit: number;
    searchText?: string;
    difficulty?: number;
    isActive?: boolean;
}

export interface ExamListMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

export interface ExamListResponse {
    items: ExamListItem[];
    meta: ExamListMeta;
}



// ============ Admin Exam Question Types ============

export interface AdminExamQuestion {
    id: string;
    text: string;
    options: string[];
    correctAnswer: string;
    points: number;
    explanation?: string;
    order: number;
    isActive: boolean;
}

export interface CreateExamQuestionRequest {
    text: string;
    options: string[];
    correctAnswer: string;
    points?: number; // Optional - scores now calculated as CorrectAnswers/TotalQuestions
    explanation?: string;
    order?: number;
}

export interface AddExamQuestionsRequest {
    questions: CreateExamQuestionRequest[];
}

export interface UpdateExamQuestionRequest {
    text?: string;
    options?: string[];
    correctAnswer?: string;
    points?: number;
    explanation?: string;
    order?: number;
}

export interface ReorderQuestionsRequest {
    questionIds: string[];
}

// ============ Admin Exam Participants Types ============

export interface ExamParticipant {
    attemptId: string;
    userId: string;
    userName: string;
    avatar?: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    passed: boolean;
    timeTakenSeconds: number;
    completedAt: string;
}

export interface ExamParticipantsRequest {
    page: number;
    limit: number;
    passed?: boolean; // Filter by pass/fail status
    sortBy?: 'score' | 'accuracy' | 'timeTakenSeconds' | 'completedAt';
    sortDesc?: boolean;
}

export interface ExamParticipantsResponse {
    items: ExamParticipant[];
    meta: {
        totalItems: number;
        currentPage: number;
    };
}

export interface ExamStatistics {
    examId: string;
    examTitle: string;
    totalParticipants: number;
    totalAttempts: number;
    passedCount: number;
    failedCount: number;
    passRate: number;
    averageScore: number;
    averageAccuracy: number;
    averageTimeTakenSeconds: number;
    highestScore: number;
    lowestScore: number;
}

// Participant attempt answer detail
export interface AttemptAnswerDetail {
    questionId: string;
    questionOrder: number;
    questionText: string;
    options: string[];
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation?: string;
}

export interface ParticipantAttemptDetail {
    attemptId: string;
    examId: string;
    examTitle: string;
    userId: string;
    userName: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    passed: boolean;
    timeTakenSeconds: number;
    startedAt: string;
    completedAt: string;
    answers: AttemptAnswerDetail[];
}

// ============ User Exam History Types ============

export interface ExamHistoryItem {
    attemptId: string;
    examId: string;
    examTitle: string;
    score: number;
    accuracy: number;
    passed: boolean;
    timeTakenSeconds: number;
    completedAt: string;
    canReview: boolean;
    xpEarned: number;
}

// User exam review (respects admin visibility settings)
export interface ExamReviewAnswer {
    questionId: string;
    questionOrder: number;
    questionText: string;
    options: string[];
    userAnswer: string | null; // null if admin set ShowUserAnswers = false
    correctAnswer: string;
    isCorrect: boolean;
}

export interface ExamReview {
    attemptId: string;
    examId: string;
    examTitle: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    passed: boolean | null; // null if admin set ShowPassFail = false
    timeTakenSeconds: number;
    completedAt: string;
    answers: ExamReviewAnswer[];
}

// ============ Import Questions Types ============

export interface ImportQuestionItem {
    text: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export interface ImportQuestionsRequest {
    replaceExisting: boolean;
    questions: ImportQuestionItem[];
}

export interface ImportQuestionsResponse {
    importedCount: number;
    failedCount: number;
    totalQuestions: number;
    errors: string[];
    isSuccess: boolean;
}

