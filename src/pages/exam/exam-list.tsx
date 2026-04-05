import { useNavigate } from 'react-router-dom';
import { Home, Clock, FileQuestion, Trophy, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAvailableExams } from '@/hooks/use-exam';
import { ExamListItem } from '@/models/exam.model';
import { ROUTE_PATHS } from '@/routing/paths';
import { ContentLoader } from '@/components/common/content-loader';

const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return 'Beginner';
        case 2:
            return 'Intermediate';
        case 3:
            return 'Advanced';
        case 4:
            return 'Expert';
        case 5:
            return 'Master';
        default:
            return 'Unknown';
    }
};

const getDifficultyVariant = (difficulty: number) => {
    switch (difficulty) {
        case 1:
            return 'success';
        case 2:
            return 'secondary';
        case 3:
            return 'warning';
        case 4:
        case 5:
            return 'destructive';
        default:
            return 'secondary';
    }
};

export function ExamListPage() {
    const navigate = useNavigate();
    const { data: exams, isLoading, isError } = useAvailableExams();

    const formatSchedule = (exam: ExamListItem) => {
        if (!exam.scheduleStart) return 'Always available';
        const start = new Date(exam.scheduleStart);
        const end = exam.scheduleEnd ? new Date(exam.scheduleEnd) : null;
        if (end) {
            return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
        }
        return `Starts ${start.toLocaleDateString()}`;
    };

    const isExamAvailable = (exam: ExamListItem) => {
        const now = new Date();
        if (exam.scheduleStart && new Date(exam.scheduleStart) > now) return false;
        if (exam.scheduleEnd && new Date(exam.scheduleEnd) < now) return false;
        return true;
    };

    if (isLoading) {
        return <ContentLoader className="min-h-screen" />;
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">Failed to load exams. Please try again.</p>
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-background">
            <div className="container mx-auto p-6 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Exam Mode</h1>
                        <p className="text-muted-foreground mt-1">
                            Select an exam to begin your timed assessment
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(ROUTE_PATHS.HOME)}>
                        <Home className="h-4 w-4 mr-2" />
                        Home
                    </Button>
                </div>

                {/* Exam Grid */}
                {exams && exams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => {
                            const available = isExamAvailable(exam);
                            return (
                                <Card
                                    key={exam.id}
                                    className={`transition-all hover:shadow-lg ${!available ? 'opacity-60' : 'cursor-pointer hover:border-primary'}`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <CardTitle className="text-lg">{exam.title}</CardTitle>
                                            <Badge variant={getDifficultyVariant(exam.difficulty) as any}>
                                                {getDifficultyLabel(exam.difficulty)}
                                            </Badge>
                                        </div>
                                        {exam.description && (
                                            <CardDescription className="line-clamp-2">
                                                {exam.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="h-4 w-4" />
                                                <span>{exam.durationMinutes} min</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <FileQuestion className="h-4 w-4" />
                                                <span>{exam.totalQuestions} questions</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Trophy className="h-4 w-4" />
                                                <span>{exam.xpReward} XP</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span className="truncate">{formatSchedule(exam)}</span>
                                            </div>
                                        </div>

                                        {/* Passing Score */}
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Passing Score</span>
                                            <span className="font-semibold">{exam.passingScore}%</span>
                                        </div>

                                        {/* Start Button */}
                                        <Button
                                            className="w-full"
                                            onClick={() => navigate(ROUTE_PATHS.EXAM_SESSION(exam.id))}
                                            disabled={!available}
                                        >
                                            {available ? 'Start Exam' : 'Not Available'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <FileQuestion className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                            <h2 className="text-lg font-semibold mb-2">No Exams Available</h2>
                            <p className="text-muted-foreground">
                                There are no exams available at this time. Please check back later.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
