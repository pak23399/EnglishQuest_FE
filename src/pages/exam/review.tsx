import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Trophy,
    Clock,
    Target,
    Check,
    X,
    AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExamReview } from '@/hooks/use-exam';
import { ROUTE_PATHS } from '@/routing/paths';
import { ContentLoader } from '@/components/common/content-loader';

export function ExamReviewPage() {
    const { attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();
    const { data: review, isLoading, isError } = useExamReview(attemptId || '', !!attemptId);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!attemptId) {
        return (
            <div className="container mx-auto p-6 text-center">
                <p className="text-destructive">Invalid attempt ID</p>
                <Button className="mt-4" onClick={() => navigate(ROUTE_PATHS.EXAM_HISTORY)}>
                    Back to History
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return <ContentLoader className="min-h-screen" />;
    }

    if (isError || !review) {
        return (
            <div className="container mx-auto p-6 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <p className="text-destructive mb-4">
                    Failed to load exam review. It may not be available for review yet.
                </p>
                <Button onClick={() => navigate(ROUTE_PATHS.EXAM_HISTORY)}>
                    Back to History
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(ROUTE_PATHS.EXAM_HISTORY)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">{review.examTitle}</h1>
                    <p className="text-muted-foreground">
                        Completed {formatDate(review.completedAt)}
                    </p>
                </div>
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Score */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Trophy className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm text-muted-foreground">Score</span>
                            </div>
                            <p className="text-3xl font-bold">{review.score}%</p>
                        </div>

                        {/* Accuracy */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Target className="h-5 w-5 text-blue-500" />
                                <span className="text-sm text-muted-foreground">Correct</span>
                            </div>
                            <p className="text-3xl font-bold">
                                {review.correctAnswers}/{review.totalQuestions}
                            </p>
                        </div>

                        {/* Time */}
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Clock className="h-5 w-5 text-green-500" />
                                <span className="text-sm text-muted-foreground">Time</span>
                            </div>
                            <p className="text-3xl font-bold">{formatTime(review.timeTakenSeconds)}</p>
                        </div>

                        {/* Pass/Fail */}
                        <div className="text-center">
                            <span className="text-sm text-muted-foreground block mb-1">Status</span>
                            {review.passed !== null ? (
                                <Badge
                                    variant={review.passed ? 'success' : 'destructive'}
                                    className="text-lg px-4 py-1"
                                >
                                    {review.passed ? 'PASSED' : 'FAILED'}
                                </Badge>
                            ) : (
                                <Badge variant="secondary" className="text-lg px-4 py-1">
                                    Hidden
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Questions Review */}
            <Card>
                <CardHeader>
                    <CardTitle>Question Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {review.answers.map((answer) => (
                        <div
                            key={answer.questionId}
                            className={`p-4 rounded-lg border transition-all ${answer.isCorrect
                                ? 'bg-green-500/5 border-green-500/30'
                                : 'bg-red-500/5 border-red-500/30'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* Status Icon */}
                                <div
                                    className={`p-1.5 rounded-full flex-shrink-0 ${answer.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {answer.isCorrect ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <X className="h-4 w-4" />
                                    )}
                                </div>

                                {/* Question Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium mb-3">
                                        <span className="text-muted-foreground">
                                            Q{answer.questionOrder}.
                                        </span>{' '}
                                        {answer.questionText}
                                    </p>

                                    {/* Options */}
                                    <div className="grid gap-2">
                                        {answer.options.map((option, optIndex) => {
                                            const isUserAnswer = answer.userAnswer === option;
                                            const isCorrectAnswer = answer.correctAnswer === option;
                                            let optionClass = 'bg-muted/50 border-transparent';

                                            if (isCorrectAnswer) {
                                                optionClass = 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-300';
                                            } else if (isUserAnswer && !answer.isCorrect) {
                                                optionClass = 'bg-red-500/10 border-red-500/50 text-red-700 dark:text-red-300';
                                            }

                                            return (
                                                <div
                                                    key={optIndex}
                                                    className={`p-3 rounded-lg border text-sm flex items-center gap-2 ${optionClass}`}
                                                >
                                                    {isCorrectAnswer && (
                                                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                    )}
                                                    {isUserAnswer && !answer.isCorrect && (
                                                        <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                                                    )}
                                                    <span>{option}</span>
                                                    {isUserAnswer && (
                                                        <Badge variant="outline" className="ml-auto text-xs">
                                                            Your answer
                                                        </Badge>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* No answer provided */}
                                    {answer.userAnswer === null && (
                                        <p className="text-sm text-muted-foreground mt-2 italic">
                                            (Answer not shown by administrator)
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.EXAM_HISTORY)}>
                    Back to History
                </Button>
                <Button onClick={() => navigate(ROUTE_PATHS.EXAM)}>
                    Take Another Exam
                </Button>
            </div>
        </div>
    );
}
