import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Users,
    Trophy,
    Clock,
    Target,
    TrendingUp,
    TrendingDown,
    Eye,
    Check,
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    useExamParticipants,
    useExamStatistics,
    useParticipantAttempt,
    useAdminExam,
} from '@/hooks/admin/use-admin-exams';
import { ContentLoader } from '@/components/common/content-loader';

// ==================== Statistics Card ====================

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'destructive';
}

function StatCard({ title, value, subtitle, icon, variant = 'default' }: StatCardProps) {
    const variantStyles = {
        default: 'bg-muted/50',
        success: 'bg-green-500/10 text-green-600',
        warning: 'bg-yellow-500/10 text-yellow-600',
        destructive: 'bg-red-500/10 text-red-600',
    };

    return (
        <Card className={variantStyles[variant]}>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50">{icon}</div>
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// ==================== Attempt Detail Dialog ====================

interface AttemptDetailDialogProps {
    attemptId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

function AttemptDetailDialog({ attemptId, open, onOpenChange }: AttemptDetailDialogProps) {
    const { data: attempt, isLoading } = useParticipantAttempt(attemptId || '', !!attemptId);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Attempt Details</DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <ContentLoader className="min-h-[200px]" />
                ) : attempt ? (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">User</p>
                                <p className="font-semibold">{attempt.userName}</p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Score</p>
                                <p className="font-semibold">{attempt.score}%</p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Accuracy</p>
                                <p className="font-semibold">
                                    {attempt.correctAnswers}/{attempt.totalQuestions}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">Time</p>
                                <p className="font-semibold">{formatTime(attempt.timeTakenSeconds)}</p>
                            </div>
                        </div>

                        {/* Pass/Fail Badge */}
                        <div className="flex justify-center">
                            <Badge
                                variant={attempt.passed ? 'success' : 'destructive'}
                                className="text-lg px-4 py-1"
                            >
                                {attempt.passed ? 'PASSED' : 'FAILED'}
                            </Badge>
                        </div>

                        {/* Questions */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Answers</h3>
                            {attempt.answers.map((answer) => (
                                <div
                                    key={answer.questionId}
                                    className={`p-4 rounded-lg border ${answer.isCorrect
                                        ? 'bg-green-500/5 border-green-500/30'
                                        : 'bg-red-500/5 border-red-500/30'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div
                                            className={`p-1 rounded-full ${answer.isCorrect
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
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                Q{answer.questionOrder}: {answer.questionText}
                                            </p>
                                            <div className="mt-2 grid gap-1 text-sm">
                                                <p>
                                                    <span className="text-muted-foreground">User's Answer:</span>{' '}
                                                    <span
                                                        className={
                                                            answer.isCorrect
                                                                ? 'text-green-600 font-medium'
                                                                : 'text-red-600 font-medium'
                                                        }
                                                    >
                                                        {answer.userAnswer || '(No answer)'}
                                                    </span>
                                                </p>
                                                {!answer.isCorrect && (
                                                    <p>
                                                        <span className="text-muted-foreground">
                                                            Correct Answer:
                                                        </span>{' '}
                                                        <span className="text-green-600 font-medium">
                                                            {answer.correctAnswer}
                                                        </span>
                                                    </p>
                                                )}
                                                {answer.explanation && (
                                                    <p className="text-muted-foreground mt-1">
                                                        💡 {answer.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-center py-8 text-muted-foreground">
                        No attempt data found
                    </p>
                )}
            </DialogContent>
        </Dialog>
    );
}

// ==================== Main Page ====================

export function AdminExamParticipantsPage() {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    // State
    const [page] = useState(1);
    const [passedFilter, setPassedFilter] = useState<boolean | undefined>(undefined);
    const [sortBy, setSortBy] = useState<'score' | 'completedAt'>('completedAt');
    const [sortDesc, setSortDesc] = useState(true);
    const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);

    // Data fetching
    const { data: exam } = useAdminExam(examId || '', !!examId);
    const { data: stats, isLoading: isLoadingStats } = useExamStatistics(examId || '', !!examId);
    const { data: participantsData, isLoading: isLoadingParticipants } = useExamParticipants(
        examId || '',
        {
            page,
            limit: 50,
            passed: passedFilter,
            sortBy,
            sortDesc,
        },
        !!examId
    );

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString();
    };

    if (!examId) {
        return <div className="p-6">Invalid exam ID</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        Exam Participants
                    </h1>
                    {exam && (
                        <p className="text-muted-foreground">{exam.title}</p>
                    )}
                </div>
            </div>

            {/* Statistics */}
            {isLoadingStats ? (
                <ContentLoader className="min-h-[150px]" />
            ) : stats ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <StatCard
                        title="Total Participants"
                        value={stats.totalParticipants}
                        icon={<Users className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Pass Rate"
                        value={`${stats.passRate.toFixed(1)}%`}
                        subtitle={`${stats.passedCount} passed`}
                        icon={<Target className="h-5 w-5" />}
                        variant={stats.passRate >= 70 ? 'success' : stats.passRate >= 50 ? 'warning' : 'destructive'}
                    />
                    <StatCard
                        title="Average Score"
                        value={`${stats.averageScore.toFixed(1)}%`}
                        icon={<Trophy className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Avg Time"
                        value={formatTime(stats.averageTimeTakenSeconds)}
                        icon={<Clock className="h-5 w-5" />}
                    />
                    <StatCard
                        title="Highest Score"
                        value={`${stats.highestScore}%`}
                        icon={<TrendingUp className="h-5 w-5" />}
                        variant="success"
                    />
                    <StatCard
                        title="Lowest Score"
                        value={`${stats.lowestScore}%`}
                        icon={<TrendingDown className="h-5 w-5" />}
                        variant="destructive"
                    />
                </div>
            ) : null}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Status:</span>
                            <Select
                                value={passedFilter === undefined ? 'all' : passedFilter ? 'passed' : 'failed'}
                                onValueChange={(value) =>
                                    setPassedFilter(value === 'all' ? undefined : value === 'passed')
                                }
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="passed">Passed</SelectItem>
                                    <SelectItem value="failed">Failed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sort by:</span>
                            <Select
                                value={sortBy}
                                onValueChange={(value: 'score' | 'completedAt') => setSortBy(value)}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="score">Score</SelectItem>
                                    <SelectItem value="completedAt">Date</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSortDesc(!sortDesc)}
                        >
                            {sortDesc ? '↓ Descending' : '↑ Ascending'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Participants Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        Participants ({participantsData?.meta?.totalItems || 0})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoadingParticipants ? (
                        <ContentLoader className="min-h-[200px]" />
                    ) : participantsData?.items?.length ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Score</TableHead>
                                    <TableHead>Correct</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Completed</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {participantsData.items.map((participant) => (
                                    <TableRow key={participant.attemptId}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                {participant.avatar ? (
                                                    <img
                                                        src={participant.avatar}
                                                        alt=""
                                                        className="h-8 w-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                )}
                                                {participant.userName}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">{participant.score}%</span>
                                        </TableCell>
                                        <TableCell>
                                            {participant.correctAnswers}/{participant.totalQuestions}
                                        </TableCell>
                                        <TableCell>{formatTime(participant.timeTakenSeconds)}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={participant.passed ? 'success' : 'destructive'}
                                            >
                                                {participant.passed ? 'Passed' : 'Failed'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatDate(participant.completedAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setSelectedAttemptId(participant.attemptId)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No participants yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Attempt Detail Dialog */}
            <AttemptDetailDialog
                attemptId={selectedAttemptId}
                open={!!selectedAttemptId}
                onOpenChange={(open) => !open && setSelectedAttemptId(null)}
            />
        </div>
    );
}
