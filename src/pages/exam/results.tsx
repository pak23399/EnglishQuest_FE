import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExamResults } from '@/hooks/use-exam';
import { ROUTE_PATHS } from '@/routing/paths';
import { ContentLoader } from '@/components/common/content-loader';

export function ExamResultsPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const { data: result, isLoading, isError } = useExamResults(submissionId || '', !!submissionId);

  // Loading state
  if (isLoading || !result || result.sessionId === '00000000-0000-0000-0000-000000000000') {
    return <ContentLoader className="min-h-screen" />;
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load exam results.</p>
          <Button onClick={() => navigate(ROUTE_PATHS.EXAM)}>
            Back to Exams
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-4xl">
        {/* Results Summary */}
        <Card className={result.passed ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              {result.passed ? '🎉 Congratulations!' : '📚 Keep Practicing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Circle */}
            <div className="flex justify-center">
              <div className={`relative w-48 h-48 rounded-full flex items-center justify-center ${result.passed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                }`}>
                <div className="text-center">
                  <p className={`text-6xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {Math.round(result.accuracy)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {result.passed ? 'Passed' : 'Not Passed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.totalQuestions}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-2xl font-bold text-red-600">
                  {result.totalQuestions - result.correctAnswers}
                </p>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {formatTime(result.timeTakenSeconds)}
                </p>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>

            {/* XP Earned */}
            {result.xpEarned > 0 && (
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">+{result.xpEarned} XP</p>
                <p className="text-sm text-muted-foreground">Experience Earned</p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Accuracy</p>
              <Progress value={result.accuracy} className="h-3" />
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.EXAM)}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Retake Exam
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate(ROUTE_PATHS.HOME)}
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Question-by-Question Review */}
        {result.questionResults && result.questionResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Question Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.questionResults.map((qr, index) => (
                <div
                  key={qr.questionId}
                  className={`p-4 rounded-lg border ${qr.isCorrect
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                    }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {qr.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <Badge variant={qr.isCorrect ? 'primary' : 'destructive'}>
                          {qr.points} pts
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-2">{qr.questionText}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Your answer: </span>
                          <span className={qr.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                            {qr.userAnswer || '(No answer)'}
                          </span>
                        </div>
                        {!qr.isCorrect && (
                          <div>
                            <span className="text-muted-foreground">Correct answer: </span>
                            <span className="text-green-600 font-medium">{qr.correctAnswer}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
