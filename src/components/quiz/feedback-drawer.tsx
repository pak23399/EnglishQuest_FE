import failAnimation from '@/assets/lottie/Fail.json';
import successAnimation from '@/assets/lottie/Success.json';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { useRef, useEffect, useCallback } from 'react';

// Sound effect imports
import successSound from '@/assets/sound/success.mp3';
import wrongSound from '@/assets/sound/wrong.mp3';
import completeSound from '@/assets/sound/complete.mp3';
import failSound from '@/assets/sound/Fail.wav';

interface FeedbackDrawerProps {
    isOpen: boolean;
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
    onContinue: () => void;
    /** Optional: Set to 'complete' when quiz is finished successfully, 'fail' when quiz failed */
    quizEndState?: 'complete' | 'fail';
}

// Audio cache to prevent recreating Audio objects
const audioCache: Record<string, HTMLAudioElement> = {};

const getAudio = (src: string): HTMLAudioElement => {
    if (!audioCache[src]) {
        audioCache[src] = new Audio(src);
    }
    return audioCache[src];
};

export function FeedbackDrawer({
    isOpen,
    isCorrect,
    correctAnswer,
    explanation,
    onContinue,
    quizEndState,
}: FeedbackDrawerProps) {
    const failLottieRef = useRef<LottieRefCurrentProps>(null);
    const hasPlayedSound = useRef(false);

    // Play sound effect
    const playSound = useCallback((src: string) => {
        try {
            const audio = getAudio(src);
            audio.currentTime = 0;
            audio.play().catch((error) => {
                console.warn('Failed to play sound:', error);
            });
        } catch (error) {
            console.warn('Failed to create audio:', error);
        }
    }, []);

    // Play sound effect when drawer opens
    useEffect(() => {
        if (isOpen && !hasPlayedSound.current) {
            hasPlayedSound.current = true;

            // Determine which sound to play
            if (quizEndState === 'complete') {
                playSound(completeSound);
            } else if (quizEndState === 'fail') {
                playSound(failSound);
            } else if (isCorrect) {
                playSound(successSound);
            } else {
                playSound(wrongSound);
            }
        }

        // Reset flag when drawer closes
        if (!isOpen) {
            hasPlayedSound.current = false;
        }
    }, [isOpen, isCorrect, quizEndState, playSound]);

    useEffect(() => {
        if (failLottieRef.current && !isCorrect) {
            failLottieRef.current.setSpeed(0.1);
        }
    }, [isCorrect, isOpen]);

    return (
        <Drawer open={isOpen}>
            <DrawerContent
                className={cn(
                    'border-t-4',
                    isCorrect
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-500'
                        : 'bg-red-50 dark:bg-red-950/30 border-red-500',
                )}
            >
                <div className="mx-auto w-full max-w-xl p-6 pt-16 relative">
                    {/* Lottie Animation - positioned to overflow above the drawer */}
                    <div className="absolute left-1/2 -translate-x-1/2 -top-20">
                        {isCorrect ? (
                            <Lottie
                                animationData={successAnimation}
                                loop={true}
                                className="h-16 w-16 mt-20"
                            />
                        ) : (
                            <Lottie
                                lottieRef={failLottieRef}
                                animationData={failAnimation}
                                loop={true}
                                className="h-40 w-40 mt-8"
                            />
                        )}
                    </div>

                    {/* Header */}
                    <div className="flex flex-col items-center justify-center gap-2 mb-4">
                        <h3 className={cn(
                            "text-2xl font-bold",
                            isCorrect
                                ? "text-green-700 dark:text-green-400"
                                : "text-red-700 dark:text-red-400"
                        )}>
                            {isCorrect ? "Correct!" : "Incorrect"}
                        </h3>
                    </div>

                    {/* Correct Answer (shown when wrong) */}
                    {!isCorrect && (
                        <div className="mb-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">
                                Correct answer:
                            </p>
                            <p className="font-semibold text-lg">{correctAnswer}</p>
                        </div>
                    )}

                    {/* Explanation */}
                    {explanation && (
                        <p className="text-sm text-muted-foreground mb-6">
                            {explanation}
                        </p>
                    )}

                    {/* Continue Button */}
                    <Button
                        onClick={onContinue}
                        size="lg"
                        className={cn(
                            'w-full',
                            isCorrect
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700',
                        )}
                    >
                        Continue
                    </Button>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
