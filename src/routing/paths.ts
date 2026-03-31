export const ROUTE_PATHS = {
  // Main Routes
  LANDING: '/',
  HOME: '/dashboard',

  // Learning Routes
  LEARN: '/learn',
  LEARN_SECTION: (sectionId: string = ':sectionId') => `/learn/${sectionId}`,

  // Quiz Routes
  QUIZ: (levelId: string = ':levelId') => `/quiz/${levelId}`,

  // Exam Routes
  EXAM: '/exam',
  EXAM_SESSION: (examId: string = ':examId') => `/exam/${examId}`,
  EXAM_RESULTS: (submissionId: string = ':submissionId') =>
    `/exam/results/${submissionId}`,
  EXAM_HISTORY: '/exam/history',
  EXAM_REVIEW: (attemptId: string = ':attemptId') =>
    `/exam/review/${attemptId}`,

  // Progress & Stats
  PROGRESS: '/progress',

  LEADERBOARD: '/leaderboard',

  // User Routes
  PROFILE: '/profile',
  SUBSCRIPTION: '/subscription',

  // Admin Routes
  ADMIN_SECTIONS: '/admin/sections',
  ADMIN_LEVELS: '/admin/levels',
  ADMIN_LEVEL_SECTION: (sectionId: string = ':sectionId') =>
    `/admin/levels/${sectionId}`,
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_QUESTION_LEVEL: (levelId: string = ':levelId') =>
    `/admin/questions/${levelId}`,
  ADMIN_EXAMS: '/admin/exams',
  ADMIN_EXAM_QUESTIONS: (examId: string = ':examId') =>
    `/admin/exams/${examId}/questions`,
  ADMIN_EXAM_PARTICIPANTS: (examId: string = ':examId') =>
    `/admin/exams/${examId}/participants`,

  // Auth Routes

  AUTH: '/auth',

  // Error Routes
  ERROR: '/error',
  ERROR_403: '/error/403',
  ERROR_404: '/error/404',
  ERROR_500: '/error/500',
} as const;
