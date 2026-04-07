import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    History,
    Trophy,
    Clock,
    Eye,
    Check,
    X,
    Sparkles,
    Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useExamHistory } from '@/hooks/use-exam';
import { ROUTE_PATHS } from '@/routing/paths';
import { ContentLoader } from '@/components/common/content-loader';

export function ExamHistoryPage() {
    const navigate = useNavigate();
    const { data: history, isLoading, isError } = useExamHistory();

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

    return (
        <div className="container mx-auto p-6 max-w-4xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(ROUTE_PATHS.EXAM)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="h-6 w-6" />
                        Exam History
                    </h1>
                    <p className="text-muted-foreground">
                        View your past exam attempts and results
                    </p>
                </div>
            </div>

            {/* Content */}
            {isLoading ? (
                <ContentLoader className="min-h-[300px]" />
            ) : isError ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-destructive mb-4">Failed to load history</p>
                        <Button onClick={() => window.location.reload()}>Retry</Button>
                    </CardContent>
                </Card>
            ) : history && history.length > 0 ? (
                <div className="space-y-4">
                    {history.map((item) => (
                        <Card
                            key={item.attemptId}
                            className="hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    {/* Exam Info */}
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold">
                                            {item.examTitle}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {formatDate(item.completedAt)}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-wrap items-center gap-4">
                                        {/* Score */}
                                        <div className="flex items-center gap-2">
                                            <Trophy className="h-5 w-5 text-yellow-500" />
                                            <span className="font-bold text-lg">
                                                {item.score}%
                                            </span>
                                        </div>

                                        {/* Accuracy */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Target className="h-4 w-4" />
                                            <span>{item.accuracy.toFixed(1)}%</span>
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>{formatTime(item.timeTakenSeconds)}</span>
                                        </div>

                                        {/* XP */}
                                        <div className="flex items-center gap-2 text-yellow-600">
                                            <Sparkles className="h-4 w-4" />
                                            <span>+{item.xpEarned} XP</span>
                                        </div>

                                        {/* Pass/Fail Badge */}
                                        <Badge
                                            variant={item.passed ? 'success' : 'destructive'}
                                            className="flex items-center gap-1"
                                        >
                                            {item.passed ? (
                                                <Check className="h-3 w-3" />
                                            ) : (
                                                <X className="h-3 w-3" />
                                            )}
                                            {item.passed ? 'Passed' : 'Failed'}
                                        </Badge>

                                        {/* Review Button */}
                                        {item.canReview && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    navigate(ROUTE_PATHS.EXAM_REVIEW(item.attemptId))
                                                }
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Review
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                        <h2 className="text-lg font-semibold mb-2">No Exam History</h2>
                        <p className="text-muted-foreground mb-4">
                            You haven't completed any exams yet.
                        </p>
                        <Button onClick={() => navigate(ROUTE_PATHS.EXAM)}>
                            Browse Exams
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

