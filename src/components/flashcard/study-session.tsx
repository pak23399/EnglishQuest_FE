import { useState, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
    X,
    RotateCcw,
    ThumbsDown,
    ThumbsUp,
    Zap,
    Trophy,
    Clock,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FlashcardCard } from './flashcard-card';
import {
    StudySession as StudySessionType,
    FlashcardRating,
} from '@/models/flashcard.model';

interface StudySessionProps {
    session: StudySessionType;
    onSubmitAnswer: (flashcardId: string, rating: FlashcardRating) => void;
    onComplete: () => void;
    onExit: () => void;
    isSubmitting?: boolean;
}

const ratingConfig: Record<
    FlashcardRating,
    {
        label: string;
        description: string;
        icon: React.ElementType;
        className: string;
        shortcut: string;
    }
> = {
    [FlashcardRating.Again]: {
        label: 'Again',
        description: 'Forgot',
        icon: RotateCcw,
        className: 'bg-red-500 hover:bg-red-600 text-white',
        shortcut: '1',
    },
    [FlashcardRating.Hard]: {
        label: 'Hard',
        description: 'Difficult',
        icon: ThumbsDown,
        className: 'bg-orange-500 hover:bg-orange-600 text-white',
        shortcut: '2',
    },
    [FlashcardRating.Good]: {
        label: 'Good',
        description: 'Correct',
        icon: ThumbsUp,
        className: 'bg-green-500 hover:bg-green-600 text-white',
        shortcut: '3',
    },
    [FlashcardRating.Easy]: {
        label: 'Easy',
        description: 'Too easy',
        icon: Zap,
        className: 'bg-blue-500 hover:bg-blue-600 text-white',
        shortcut: '4',
    },
};

export function StudySession({
    session,
    onSubmitAnswer,
    onComplete,
    onExit,
    isSubmitting = false,
}: StudySessionProps) {
    const intl = useIntl();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const currentCard = session.cards[currentIndex];
    const totalCards = session.cards.length;
    const progress = totalCards > 0 ? ((answeredCount) / totalCards) * 100 : 0;
    const isComplete = currentIndex >= totalCards;

    const handleFlip = useCallback(() => {
        setIsFlipped(true);
    }, []);

    const handleRate = useCallback(
        (rating: FlashcardRating) => {
            if (isSubmitting || !currentCard) return;

            // Track correct answers (Good or Easy)
            if (rating === FlashcardRating.Good || rating === FlashcardRating.Easy) {
                setCorrectCount((prev) => prev + 1);
            }

            onSubmitAnswer(currentCard.flashcardId, rating);
            setAnsweredCount((prev) => prev + 1);

            // Move to next card
            setIsFlipped(false);
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 300);
        },
        [currentCard, isSubmitting, onSubmitAnswer],
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFlipped) {
                if (e.code === 'Space' || e.code === 'Enter') {
                    e.preventDefault();
                    handleFlip();
                }
            } else {
                if (e.key === '1') handleRate(FlashcardRating.Again);
                if (e.key === '2') handleRate(FlashcardRating.Hard);
                if (e.key === '3') handleRate(FlashcardRating.Good);
                if (e.key === '4') handleRate(FlashcardRating.Easy);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFlipped, handleFlip, handleRate]);

    // Completion screen
    if (isComplete) {
        const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] space-y-8">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold">{intl.formatMessage({ id: 'FLASHCARD.STUDY.SESSION_COMPLETE' })}</h2>
                    <p className="text-muted-foreground">{intl.formatMessage({ id: 'FLASHCARD.STUDY.GREAT_JOB' }, { deckTitle: session.deckTitle })}</p>
                </div>

                <Card className="w-full max-w-sm">
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="text-3xl font-bold text-primary">{answeredCount}</p>
                                <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'FLASHCARD.STUDY.CARDS_REVIEWED' })}</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-green-500">{accuracy}%</p>
                                <p className="text-sm text-muted-foreground">{intl.formatMessage({ id: 'FLASHCARD.STUDY.ACCURACY' })}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4">
                    <Button variant="outline" onClick={onExit}>
                        <X className="h-4 w-4 mr-2" />
                        {intl.formatMessage({ id: 'COMMON.EXIT' })}
                    </Button>
                    <Button onClick={onComplete}>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {intl.formatMessage({ id: 'COMMON.DONE' })}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold">{session.deckTitle}</h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {answeredCount} / {totalCards} {intl.formatMessage({ id: 'FLASHCARD.CARDS' }, { count: '' }).replace('{count} ', '')}
                        </span>
                        <Badge variant="outline">
                            {session.newCards} {intl.formatMessage({ id: 'FLASHCARD.STUDY.NEW' })} • {session.learningCards} {intl.formatMessage({ id: 'FLASHCARD.LEARNING' })} •{' '}
                            {session.reviewCards} {intl.formatMessage({ id: 'FLASHCARD.STUDY.REVIEW' })}
                        </Badge>
                    </div>
                </div>

                <Button variant="ghost" size="icon" onClick={onExit}>
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
                <Progress value={progress} className="h-2" />
            </div>

            {/* Card */}
            {currentCard && (
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-full max-w-xl">
                        <FlashcardCard
                            card={currentCard}
                            isFlipped={isFlipped}
                            onFlip={handleFlip}
                            showStatus={true}
                        />
                    </div>
                </div>
            )}

            {/* Rating buttons */}
            <div className="mt-6">
                {!isFlipped ? (
                    <div className="text-center">
                        <Button
                            size="lg"
                            onClick={handleFlip}
                            className="px-12"
                            disabled={isSubmitting}
                        >
                            {intl.formatMessage({ id: 'FLASHCARD.STUDY.SHOW_ANSWER' })}
                            <span className="ml-2 text-xs opacity-70">(Space)</span>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-center text-sm text-muted-foreground">
                            {intl.formatMessage({ id: 'FLASHCARD.STUDY.HOW_WELL' })}
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(ratingConfig).map(([rating, config]) => {
                                const Icon = config.icon;
                                return (
                                    <Button
                                        key={rating}
                                        onClick={() => handleRate(Number(rating) as FlashcardRating)}
                                        disabled={isSubmitting}
                                        className={cn(
                                            'flex flex-col h-auto py-3 gap-1',
                                            config.className,
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{config.label}</span>
                                        <span className="text-xs opacity-80">{config.shortcut}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Keyboard hints */}
            <div className="mt-4 text-center text-xs text-muted-foreground">
                <span>{intl.formatMessage({ id: 'FLASHCARD.STUDY.KEYBOARD' })} </span>
                {!isFlipped ? (
                    <span>{intl.formatMessage({ id: 'FLASHCARD.STUDY.KEYBOARD_FLIP' })}</span>
                ) : (
                    <span>{intl.formatMessage({ id: 'FLASHCARD.STUDY.KEYBOARD_RATE' })}</span>
                )}
            </div>
        </div>
    );
}
