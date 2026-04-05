import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useStartExam, useAutosaveAnswers, useSubmitExam } from '@/hooks/use-exam';
import { ExamSession } from '@/models/exam.model';
import { ROUTE_PATHS } from '@/routing/paths';
import { ContentLoader } from '@/components/common/content-loader';

const AUTOSAVE_INTERVAL = 5000; // 5 seconds

interface ExamSessionPageProps {
    examId: string;
}

export function ExamSessionPage({ examId }: ExamSessionPageProps) {
    const navigate = useNavigate();

    // Exam state
    const [examSession, setExamSession] = useState<ExamSession | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [sequenceNumber, setSequenceNumber] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Refs for autosave
    const answersRef = useRef(answers);
    const sequenceRef = useRef(sequenceNumber);

    // Mutations
    const startExamMutation = useStartExam();
    const autosaveMutation = useAutosaveAnswers();
    const submitExamMutation = useSubmitExam();

    // Keep refs updated
    useEffect(() => {
        answersRef.current = answers;
        sequenceRef.current = sequenceNumber;
    }, [answers, sequenceNumber]);

    // Timer countdown
    useEffect(() => {
        if (!examSession) return;

        const updateTimer = () => {
            const now = new Date().getTime();
            const expiresAt = new Date(examSession.expiresAt).getTime();
            const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
            setTimeRemaining(remaining);

            // Auto-submit when time expires
            if (remaining <= 0 && !isSubmitting) {
                handleSubmitExam();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [examSession, isSubmitting]);

    // Autosave every 5 seconds
    useEffect(() => {
        if (!examSession) return;

        const interval = setInterval(() => {
            if (Object.keys(answersRef.current).length > 0) {
                autosaveMutation.mutate({
                    sessionId: examSession.sessionId,
                    data: {
                        answers: answersRef.current,
                        sequenceNumber: sequenceRef.current,
                    },
                });
                setSequenceNumber(prev => prev + 1);
            }
        }, AUTOSAVE_INTERVAL);

        return () => clearInterval(interval);
    }, [examSession]);

    // Start exam when component mounts
    useEffect(() => {
        if (examId && !examSession) {
            startExamMutation.mutate(examId, {
                onSuccess: (session) => {
                    setExamSession(session);
                    // Load saved answers if resuming an exam
                    if (session.isResumed && session.savedAnswers) {
                        setAnswers(session.savedAnswers);
                    }
                },
            });
        }
    }, [examId]);

    const handleAnswerSelect = useCallback((questionId: string, answer: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
    }, []);

    const handleQuestionNav = useCallback((index: number) => {
        setCurrentQuestionIndex(index);
    }, []);

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (examSession && currentQuestionIndex < examSession.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmitExam = async () => {
        if (!examSession || isSubmitting) return;

        const unansweredCount = examSession.questions.filter(q => !answers[q.id]).length;

        if (unansweredCount > 0 && timeRemaining > 0) {
            const confirmed = window.confirm(
                `You have ${unansweredCount} unanswered questions. Submit anyway?`
            );
            if (!confirmed) return;
        }

        setIsSubmitting(true);

        try {
            const response = await submitExamMutation.mutateAsync({
                sessionId: examSession.sessionId,
                data: { answers },
            });
            navigate(ROUTE_PATHS.EXAM_RESULTS(response.submissionId));
        } catch (error) {
            setIsSubmitting(false);
            alert('Failed to submit exam. Please try again.');
        }
    };

    const handleSaveAndExit = async () => {
        if (!examSession) return;

        try {
            await autosaveMutation.mutateAsync({
                sessionId: examSession.sessionId,
                data: {
                    answers: answersRef.current,
                    sequenceNumber: sequenceRef.current + 1,
                },
            });
        } catch (error) {
            console.error('Failed to save progress:', error);
        }

        navigate(ROUTE_PATHS.EXAM);
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Loading state
    if (startExamMutation.isPending || !examSession) {
        return <ContentLoader className="min-h-screen" />;
    }

    // Error state
    if (startExamMutation.isError) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive mb-4">Failed to start exam. Please try again.</p>
                    <Button onClick={() => navigate(ROUTE_PATHS.EXAM)}>
                        Back to Exams
                    </Button>
                </div>
            </div>
        );
    }

    const currentQuestion = examSession.questions[currentQuestionIndex];
    const answeredCount = Object.keys(answers).length;
    const isTimeWarning = timeRemaining < 300;

    return (
        <div className="min-h-screen w-full bg-background flex flex-col font-sans">
            {/* Header */}
            <header className="sticky top-0 z-10 flex items-center justify-between border-b px-6 sm:px-10 py-3 bg-background/80 backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="w-5 h-5 text-primary">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold tracking-tight">
                        English Quest Exam
                    </h2>
                </div>
                <div className="flex gap-2">
                    <Badge
                        variant={isTimeWarning ? 'destructive' : 'primary'}
                        className="h-10 px-4 text-sm font-bold"
                    >
                        {formatTime(timeRemaining)} Remaining
                    </Badge>
                    <Badge variant="secondary" className="h-10 px-4 text-sm font-bold">
                        {answeredCount}/{examSession.totalQuestions} Answered
                    </Badge>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 w-full max-w-screen-2xl mx-auto p-6 sm:p-10">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Question */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="flex flex-col gap-6">
                            {/* Question Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="flex min-w-72 flex-col gap-3">
                                    <p className="text-3xl font-bold tracking-tight">
                                        Question {currentQuestionIndex + 1}
                                    </p>
                                    <p className="text-muted-foreground text-base">
                                        {currentQuestion.text}
                                    </p>
                                </div>
                            </div>

                            {/* Options */}
                            <RadioGroup
                                value={answers[currentQuestion.id] || ''}
                                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                                className="flex flex-col gap-3"
                            >
                                {currentQuestion.options.map((option, index) => {
                                    const isSelected = answers[currentQuestion.id] === option;
                                    return (
                                        <Label
                                            key={index}
                                            htmlFor={`option-${index}`}
                                            className={`flex items-center gap-4 rounded-xl border p-4 cursor-pointer transition-all ${isSelected
                                                ? 'border-primary bg-primary/10'
                                                : 'border-border hover:border-primary'
                                                }`}
                                        >
                                            <RadioGroupItem
                                                value={option}
                                                id={`option-${index}`}
                                            />
                                            <div className="flex grow flex-col">
                                                <span className="text-sm font-medium">
                                                    {option}
                                                </span>
                                            </div>
                                        </Label>
                                    );
                                })}
                            </RadioGroup>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex flex-1 gap-3 flex-wrap justify-between mt-auto">
                            <Button
                                variant="secondary"
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous Question
                            </Button>
                            <Button
                                onClick={handleNext}
                                disabled={currentQuestionIndex === examSession.questions.length - 1}
                            >
                                Next Question
                            </Button>
                        </div>
                    </div>

                    {/* Right Column: Navigation */}
                    <aside className="lg:col-span-1 flex flex-col gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="text-lg font-bold tracking-tight mb-4">
                                    All Questions
                                </h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {examSession.questions.map((question, index) => {
                                        const isAnswered = !!answers[question.id];
                                        const isCurrent = index === currentQuestionIndex;

                                        return (
                                            <Button
                                                key={question.id}
                                                variant={isCurrent ? 'primary' : isAnswered ? 'outline' : 'secondary'}
                                                size="icon"
                                                className={`size-10 text-sm font-bold ${isCurrent
                                                    ? 'ring-2 ring-primary'
                                                    : isAnswered
                                                        ? 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50'
                                                        : ''
                                                    }`}
                                                onClick={() => handleQuestionNav(index)}
                                            >
                                                {index + 1}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </aside>
                </div>
            </main>

            {/* Footer */}
            <footer className="sticky bottom-0 z-10 mt-auto flex justify-end gap-4 border-t px-6 sm:px-10 py-4 bg-background/80 backdrop-blur-sm">
                <Button
                    variant="secondary"
                    onClick={handleSaveAndExit}
                    disabled={isSubmitting}
                >
                    Save &amp; Exit
                </Button>
                <Button
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Exam'
                    )}
                </Button>
            </footer>
        </div>
    );
}
