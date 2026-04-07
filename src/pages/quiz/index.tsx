import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartsDisplay } from '@/components/gamification';
import {
  FeedbackDrawer,
  QuestionTimer,
  MultipleChoiceQuestion,
  PatternRecognitionQuestion,
  ListeningQuestion,
  OrderingQuestion,
  MatchingQuestion,
} from '@/components/quiz';
import {
  useActiveQuizSession,
  useStartQuiz,
  useCurrentQuestion,
  useSubmitAnswer,
  useCompleteQuiz,
  useAbandonQuiz,
} from '@/hooks/use-quiz-session';
import { QuestionType } from '@/models/quiz.model';
import { showToast } from '@/lib/toast';

export function QuizPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();

  // Quiz session state
  const { data: session, isLoading: sessionLoading, refetch: refetchSession } = useActiveQuizSession();
  const { mutate: startQuiz, isPending: starting } = useStartQuiz();
  const { mutate: submitAnswer, isPending: submitting } = useSubmitAnswer(session?.id || '');
  const { mutate: completeQuiz, isPending: isCompleting } = useCompleteQuiz();
  const { mutate: abandonQuiz } = useAbandonQuiz();

  // UI state
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
  } | null>(null);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [isQuizFinishing, setIsQuizFinishing] = useState(false);
  const [isAbandoning, setIsAbandoning] = useState(false);

  // Calculate if this is the last question based on session data
  const isLastQuestion = session
    ? session.currentQuestionIndex + 1 >= session.totalQuestions
    : false;

  // Disable question query when quiz is finishing or abandoning to prevent unnecessary API calls
  const { data: question, isLoading: questionLoading, refetch: refetchQuestion } = useCurrentQuestion(
    (isQuizFinishing || isAbandoning) ? undefined : session?.id
  );

  // Start quiz session when component mounts (if no active session or session is for different level)
  // Don't start if we're in the middle of completing the quiz or abandoning
  useEffect(() => {
    if (sessionLoading || !levelId || starting || isQuizFinishing || isCompleting || isAbandoning) return;

    // If there's an active session for a DIFFERENT level, abandon it first
    if (session && session.levelId !== levelId) {
      setIsAbandoning(true);
      abandonQuiz(session.id, {
        onSuccess: () => {
          setIsAbandoning(false);
          // After abandoning, start quiz for the requested level
          startQuiz(levelId, {
            onError: (error) => {
              console.error('Failed to start quiz:', error);
              navigate(-1);
            },
          });
        },
        onError: () => {
          setIsAbandoning(false);
          // If abandon fails, just try to start new quiz anyway
          startQuiz(levelId);
        },
      });
      return;
    }

    // If no active session, start a new one
    if (!session) {
      startQuiz(levelId, {
        onError: (error) => {
          console.error('Failed to start quiz:', error);
          // Check for insufficient hearts error
          const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
          if (errorMessage === 'INSUFFICIENT_HEARTS_ERROR') {
            showToast({
              mode: 'destructive',
              message: 'You don\'t have enough hearts to start this lesson. Wait for hearts to regenerate or watch an ad to restore one.',
            });
          }
          navigate(-1);
        },
      });
    }
  }, [sessionLoading, session, levelId, startQuiz, starting, navigate, isQuizFinishing, isCompleting, isAbandoning, abandonQuiz]);

  // Handle answer submission
  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer || !session || !question) return;

    setIsTimerPaused(true);

    // Mark quiz as finishing if this is the last question to prevent further question fetches
    if (isLastQuestion) {
      setIsQuizFinishing(true);
    }

    submitAnswer(
      {
        questionId: question.id,
        UserAnswer: selectedAnswer, // API expects PascalCase
      },
      {
        onSuccess: (result) => {
          setFeedbackData({
            isCorrect: result.isCorrect,
            correctAnswer: result.correctAnswer,
            explanation: result.explanation,
          });
          setShowFeedback(true);
        },
        onError: (error) => {
          console.error('Failed to submit answer:', error);
          setIsTimerPaused(false);
          setIsQuizFinishing(false); // Reset on error
        },
      }
    );
  }, [selectedAnswer, session, question, submitAnswer, isLastQuestion]);

  // Handle timer expiry (auto-submit with wrong answer)
  const handleTimeUp = useCallback(() => {
    if (!question) return;

    // Auto-submit empty answer when time runs out
    setSelectedAnswer('');
    handleSubmitAnswer();
  }, [question, handleSubmitAnswer]);

  // Handle continue after feedback
  const handleContinue = useCallback(() => {
    // Prevent action if already completing
    if (isCompleting) return;

    setShowFeedback(false);
    setFeedbackData(null);
    setSelectedAnswer(null);
    setIsTimerPaused(false);

    if (isLastQuestion && session) {
      // Complete the quiz - don't refetch anything
      completeQuiz(session.id, {
        onSuccess: (result) => {
          navigate(`/quiz/results/${session.id}`, { state: { result } });
        },
      });
      // Return early to prevent any refetching
      return;
    }

    // Only fetch next question if NOT the last question
    refetchQuestion();
    refetchSession();
  }, [isLastQuestion, isCompleting, session, completeQuiz, navigate, refetchQuestion, refetchSession]);

  // Handle abandon quiz
  const handleAbandon = () => {
    if (session) {
      setIsAbandoning(true);
      abandonQuiz(session.id, {
        onSuccess: () => {
          navigate('/dashboard');
        },
        onError: () => {
          setIsAbandoning(false);
        },
      });
    } else {
      navigate('/dashboard');
    }
  };

  // Loading state
  if (sessionLoading || starting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // No session state
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">Starting quiz...</h3>
            <p className="text-muted-foreground mb-4">
              Please wait while we prepare your lesson.
            </p>
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate progress
  const progressPercent = ((session.currentQuestionIndex + 1) / session.totalQuestions) * 100;

  // Render question based on type
  const renderQuestion = () => {
    if (questionLoading || !question) {
      return (
        <div className="space-y-4 py-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      );
    }

    const commonProps = {
      question,
      selectedAnswer,
      onSelectAnswer: setSelectedAnswer,
      disabled: showFeedback || submitting,
      showResult: showFeedback,
      isCorrect: feedbackData?.isCorrect,
      correctAnswer: feedbackData?.correctAnswer, // Pass correct answer for highlighting
    };

    // Determine question type - use numeric enum values
    const questionType = Number(question.type);

    // Type 8: Ordering question - reorder items
    if (questionType === QuestionType.Ordering) {
      return <OrderingQuestion {...commonProps} />;
    }

    // Type 7: Matching question - match pairs (only if options have pair format)
    if (questionType === QuestionType.Matching) {
      // Check if options have pair format (e.g., "Hello → Xin chào")
      const hasPairFormat = question.options.some(opt => opt.includes('→'));
      if (hasPairFormat) {
        return <MatchingQuestion {...commonProps} />;
      }
      // Fall through to multiple choice if no pair format
    }

    // Type 5: Listening question - uses word bank to form sentences
    if (questionType === QuestionType.Listening || question.audioUrl) {
      return <ListeningQuestion {...commonProps} />;
    }

    // Type 4: Pattern question - fill in the blank with pattern examples
    if (questionType === QuestionType.Pattern) {
      return <PatternRecognitionQuestion {...commonProps} />;
    }

    // Default to multiple choice (covers fill-in-blank, vocabulary, correct sentence, etc.)
    return <MultipleChoiceQuestion {...commonProps} />;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            {/* Exit Button */}
            <Button variant="ghost" onClick={handleAbandon} className="gap-2">
              <X className="h-4 w-4" />
              Exit
            </Button>

            {/* Timer */}
            {!showFeedback && question && (
              <QuestionTimer
                duration={15}
                onTimeUp={handleTimeUp}
                isPaused={isTimerPaused || showFeedback}
                key={question.id} // Reset timer for each question
              />
            )}

            {/* Hearts */}
            <HeartsDisplay size="sm" />
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
              </span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardContent className="p-6 md:p-8">
            {renderQuestion()}

            {/* Submit Button */}
            {!showFeedback && (
              <Button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitting}
                className="w-full mt-8"
                size="lg"
              >
                {submitting ? 'Checking...' : 'Check Answer'}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feedback Drawer */}
      {feedbackData && (
        <FeedbackDrawer
          isOpen={showFeedback}
          isCorrect={feedbackData.isCorrect}
          correctAnswer={feedbackData.correctAnswer}
          explanation={feedbackData.explanation}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
}
