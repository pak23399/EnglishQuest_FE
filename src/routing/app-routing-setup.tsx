import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { RequireAdmin } from '@/auth/require-role';
import { ErrorRouting } from '@/errors/error-routing';
import { MainLayout } from '@/layouts/main-layout/layout';
import { ExamPage, ExamResultsPage, ExamHistoryPage, ExamReviewPage, FlashcardPage, HomeDashboard, LeaderboardPage, PaymentFailurePage, PaymentSuccessPage, ProfilePage, ProgressPage, QuizPage, QuizResultsPage, SubscriptionPage } from '@/pages';
import { AdminExamQuestionsPage, AdminExamParticipantsPage, AdminExamsPage, AdminLevelsPage, AdminQuestionsPage, AdminSectionsPage } from '@/pages/admin';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTE_PATHS } from './paths';



import { LandingPage } from '@/pages/landing-page';
export function AppRoutingSetup() {
  return (
    <Routes>
      <Route path={ROUTE_PATHS.LANDING} element={<LandingPage />} />
      {/* Error Routes */}
      <Route path={`${ROUTE_PATHS.ERROR}/*`} element={<ErrorRouting />} />

      {/* Auth Routes */}
      <Route path={`${ROUTE_PATHS.AUTH}/*`} element={<AuthRouting />} />

      {/* Protected Routes */}
      <Route element={<RequireAuth />}>
        {/* Routes WITHOUT MainLayout (no navbar/header/footer) */}
        {/* Quiz Route */}
        <Route path={ROUTE_PATHS.QUIZ()} element={<QuizPage />} />
        <Route path="/quiz/results/:sessionId" element={<QuizResultsPage />} />

        {/* Exam */}
        <Route path={ROUTE_PATHS.EXAM_SESSION()} element={<ExamPage />} />

        {/* Routes WITH MainLayout */}
        <Route element={<MainLayout />}>
          {/* Home Dashboard */}
          <Route path={ROUTE_PATHS.HOME} element={<HomeDashboard />} />

          {/* Flashcards */}
          <Route path="/flashcards" element={<FlashcardPage />} />

          {/* Exam List (keep in layout, only session is fullscreen) */}
          <Route path={ROUTE_PATHS.EXAM} element={<ExamPage />} />
          <Route path={ROUTE_PATHS.EXAM_RESULTS()} element={<ExamResultsPage />} />
          <Route path={ROUTE_PATHS.EXAM_HISTORY} element={<ExamHistoryPage />} />
          <Route path={ROUTE_PATHS.EXAM_REVIEW()} element={<ExamReviewPage />} />

          {/* Leaderboard */}
          <Route path={ROUTE_PATHS.LEADERBOARD} element={<LeaderboardPage />} />

          {/* Progress Dashboard */}
          <Route path={ROUTE_PATHS.PROGRESS} element={<ProgressPage />} />

          {/* Profile & Settings */}
          <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />

          {/* Subscription */}
          <Route
            path={ROUTE_PATHS.SUBSCRIPTION}
            element={<SubscriptionPage />}
          />

          {/* Payment Result Pages */}
          <Route
            path="/payment/success"
            element={<PaymentSuccessPage />}
          />
          <Route
            path="/payment/failed"
            element={<PaymentFailurePage />}
          />

          {/* Admin Routes - Only accessible by Admin role */}
          <Route
            path={ROUTE_PATHS.ADMIN_SECTIONS}
            element={
              <RequireAdmin>
                <AdminSectionsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_LEVELS}
            element={
              <RequireAdmin>
                <AdminLevelsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_LEVEL_SECTION()}
            element={
              <RequireAdmin>
                <AdminLevelsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_QUESTIONS}
            element={
              <RequireAdmin>
                <AdminQuestionsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_QUESTION_LEVEL()}
            element={
              <RequireAdmin>
                <AdminQuestionsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_EXAMS}
            element={
              <RequireAdmin>
                <AdminExamsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_EXAM_QUESTIONS()}
            element={
              <RequireAdmin>
                <AdminExamQuestionsPage />
              </RequireAdmin>
            }
          />
          <Route
            path={ROUTE_PATHS.ADMIN_EXAM_PARTICIPANTS()}
            element={
              <RequireAdmin>
                <AdminExamParticipantsPage />
              </RequireAdmin>
            }
          />
        </Route>



        {/* 404 fallback */}
        <Route path="*" element={<Navigate to={ROUTE_PATHS.ERROR_404} />} />
      </Route>
    </Routes>
  );
}
