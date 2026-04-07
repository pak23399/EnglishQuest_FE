import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Clock, Target, ArrowRight, Home, RotateCcw } from 'lucide-react';
import { QuizResult } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import trophyAnimation from '@/assets/lottie/Trophy.json';
import targetAnimation from '@/assets/lottie/Target.json';

// Sound effect imports
import completeSound from '@/assets/sound/complete.mp3';
import failSound from '@/assets/sound/Fail.wav';

export function QuizResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const hasPlayedSound = useRef(false);

    // Get result from navigation state
    const result = location.state?.result as QuizResult | undefined;

    // Play sound effect on result
    useEffect(() => {
        if (result && !hasPlayedSound.current) {
            hasPlayedSound.current = true;

            const soundSrc = result.passed ? completeSound : failSound;
            const audio = new Audio(soundSrc);
            audio.play().catch((error) => {
                console.warn('Failed to play sound:', error);
            });
        }
    }, [result]);

    if (!result) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-lg font-semibold mb-2">No results found</h3>
                        <p className="text-muted-foreground mb-4">
                            The quiz results are not available.
                        </p>
                        <Button onClick={() => navigate('/')}>
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-primary/5 to-background py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                {/* Result Header */}
                <div className="text-center mb-8">
                    <div
                        className={cn(
                            'inline-flex items-center justify-center rounded-full mb-4',
                            result.passed
                                ? 'bg-green-100 dark:bg-green-950/30'
                                : 'bg-red-100 dark:bg-red-950/30'
                        )}
                    >
                        {result.passed ? (
                            <Lottie animationData={trophyAnimation} loop={true} className="h-48 w-48 shrink-0" />
                        ) : (
                            <Lottie animationData={targetAnimation} loop={true} className="h-48 w-48 shrink-0" />
                        )}
                    </div>

                    <h1 className={cn(
                        'text-3xl font-bold mb-2',
                        result.passed ? 'text-green-600' : 'text-red-600'
                    )}>
                        {result.passed ? 'Congratulations!' : 'Keep Practicing!'}
                    </h1>

                    <p className="text-muted-foreground">
                        {result.passed
                            ? 'You passed this lesson!'
                            : "Don't give up! Try again to improve your score."}
                    </p>
                </div>

                {/* Score Card */}
                <Card className="mb-6 overflow-hidden">
                    <div className={cn(
                        'p-6 text-white text-center',
                        result.passed
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                            : 'bg-gradient-to-r from-amber-500 to-orange-600'
                    )}>
                        <p className="text-white/80 text-sm mb-1">Your Score</p>
                        <p className="text-5xl font-bold">
                            {result.correctAnswers}/{result.totalQuestions}
                        </p>
                        <p className="text-white/80 text-sm mt-2">
                            {result.accuracy.toFixed(0)}% Accuracy
                        </p>
                    </div>

                    <CardContent className="p-6">
                        <Progress
                            value={result.accuracy}
                            className="h-3 mb-4"
                        />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">XP Earned</p>
                                    <p className="font-bold text-lg">{result.xpEarned}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Time Taken</p>
                                    <p className="font-bold text-lg">
                                        {result.timeTaken}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Streak Bonus */}
                {result.streakEarned && (
                    <Card className="mb-6 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-4xl">🔥</div>
                            <div>
                                <p className="font-semibold text-orange-800 dark:text-orange-200">
                                    Streak Continued!
                                </p>
                                <p className="text-sm text-orange-700 dark:text-orange-300">
                                    {result.currentStreak} days in a row
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Next Level Unlocked */}
                {result.unlockedNextLevel && result.nextLevelTitle && (
                    <Card className="mb-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-4xl">🔓</div>
                            <div className="flex-1">
                                <p className="font-semibold text-green-800 dark:text-green-200">
                                    New Level Unlocked!
                                </p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {result.nextLevelTitle}
                                </p>
                            </div>
                            <Button
                                size="sm"
                                onClick={() => navigate(`/quiz/${result.nextLevelId}`)}
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* New Best Score */}
                {result.isNewBestScore && (
                    <Card className="mb-6 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="text-4xl">🏆</div>
                            <div>
                                <p className="font-semibold text-purple-800 dark:text-purple-200">
                                    New Personal Best!
                                </p>
                                <p className="text-sm text-purple-700 dark:text-purple-300">
                                    Previous best: {result.progressUpdate.previousBestScore}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    {result.unlockedNextLevel && result.nextLevelId && (
                        <Button
                            onClick={() => navigate(`/quiz/${result.nextLevelId}`)}
                            size="lg"
                            className="w-full"
                        >
                            Continue to Next Lesson
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}

                    <Button
                        onClick={() => navigate(`/quiz/${result.levelId}`)}
                        variant={result.passed ? 'outline' : 'primary'}
                        size="lg"
                        className="w-full"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {result.passed ? 'Practice Again' : 'Try Again'}
                    </Button>

                    <Button
                        onClick={() => navigate('/dashboard')}
                        variant="ghost"
                        size="lg"
                        className="w-full"
                    >
                        <Home className="h-4 w-4 mr-2" />
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
