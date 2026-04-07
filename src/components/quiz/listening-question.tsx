import { useState, useRef, useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Question } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTextToSpeech } from '@/hooks/use-ai';
import { useQuestionById } from '@/hooks/admin/use-admin-questions';
import { toast } from 'sonner';

// Helper function to convert base64 to Blob
function base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

interface ListeningQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
} as const;

const wordVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.15 },
    },
};

const selectedWordVariants = {
    initial: { opacity: 0, scale: 0.5, y: -20 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 500,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.5,
        y: 20,
        transition: { duration: 0.15 },
    },
};

export function ListeningQuestion({
    question,
    selectedAnswer: _selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showResult = false,
    isCorrect,
}: ListeningQuestionProps) {
    const intl = useIntl();
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>(
        question.options // Options is now directly string[]
    );
    const audioRef = useRef<HTMLAudioElement>(null);
    const ttsAudioUrlRef = useRef<string | null>(null);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

    const ttsMutation = useTextToSpeech();

    // Fetch full question data including correctAnswer for TTS
    const { data: fullQuestion } = useQuestionById(question.id);

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (ttsAudioUrlRef.current) {
                URL.revokeObjectURL(ttsAudioUrlRef.current);
            }
        };
    }, []);

    // Play audio - always generates TTS for listening questions
    const playAudio = useCallback(async () => {
        // If we already generated TTS audio, play it from cache
        if (ttsAudioUrlRef.current && audioRef.current) {
            audioRef.current.src = ttsAudioUrlRef.current;
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            return;
        }

        // Get the correct answer text to speak from the fetched question
        const textToSpeak = fullQuestion?.correctAnswer;

        if (!textToSpeak) {
            toast.error(intl.formatMessage({ id: 'quiz.listening.ttsError' }));
            return;
        }

        setIsGeneratingAudio(true);
        try {
            const response = await ttsMutation.mutateAsync({
                text: textToSpeak,
                voiceStyle: 'friendly',
            });

            // Convert base64 to blob URL
            const audioBlob = base64ToBlob(response.audioBase64, `audio/${response.format}`);
            const audioUrl = URL.createObjectURL(audioBlob);
            ttsAudioUrlRef.current = audioUrl;

            // Play the generated audio
            if (audioRef.current) {
                audioRef.current.src = audioUrl;
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } catch (error) {
            console.error('[TTS Error]', error);
            toast.error(intl.formatMessage({ id: 'quiz.listening.ttsError' }));
        } finally {
            setIsGeneratingAudio(false);
        }
    }, [fullQuestion?.correctAnswer, ttsMutation, intl]);

    // Add word to sentence
    const addWord = (word: string, index: number) => {
        if (disabled) return;

        const newSelected = [...selectedWords, word];
        const newAvailable = availableWords.filter((_, i) => i !== index);

        setSelectedWords(newSelected);
        setAvailableWords(newAvailable);

        // Update the answer
        onSelectAnswer(newSelected.join(' '));
    };

    // Remove word from sentence
    const removeWord = (word: string, index: number) => {
        if (disabled) return;

        const newSelected = selectedWords.filter((_, i) => i !== index);
        const newAvailable = [...availableWords, word];

        setSelectedWords(newSelected);
        setAvailableWords(newAvailable);

        // Update the answer
        onSelectAnswer(newSelected.join(' '));
    };

    // Reset all words
    const resetWords = () => {
        if (disabled) return;

        setSelectedWords([]);
        setAvailableWords([...question.options]); // Options is now string[]
        onSelectAnswer('');
    };

    return (
        <div className="space-y-6">
            {/* Question Text */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <h2 className="text-xl md:text-2xl font-semibold mb-2">
                    {question.text}
                </h2>
                <p className="text-muted-foreground text-sm">
                    {intl.formatMessage({ id: 'quiz.listening.instruction' })}
                </p>
            </motion.div>

            {/* Audio Player */}
            <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <audio ref={audioRef} className="hidden" />
                <motion.div
                    whileHover={isGeneratingAudio ? {} : { scale: 1.05 }}
                    whileTap={isGeneratingAudio ? {} : { scale: 0.95 }}
                >
                    <Button
                        onClick={playAudio}
                        variant="outline"
                        size="lg"
                        className="gap-2 px-8"
                        disabled={isGeneratingAudio}
                    >
                        {isGeneratingAudio ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                {intl.formatMessage({ id: 'quiz.listening.generating' })}
                            </>
                        ) : (
                            <>
                                <Volume2 className="h-5 w-5" />
                                {intl.formatMessage({ id: 'quiz.listening.playAudio' })}
                            </>
                        )}
                    </Button>
                </motion.div>
            </motion.div>

            {/* Answer Drop Zone */}
            <div className="relative">
                <motion.div
                    className={cn(
                        'min-h-24 p-4 rounded-xl border-2 border-dashed transition-all',
                        'flex flex-wrap items-center justify-center gap-2',
                        !showResult && 'border-primary/50 bg-primary/5',
                        showResult && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                        showResult && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30'
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <AnimatePresence mode="popLayout">
                        {selectedWords.length === 0 ? (
                            <motion.p
                                className="text-muted-foreground text-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {intl.formatMessage({ id: 'quiz.listening.placeholder' })}
                            </motion.p>
                        ) : (
                            selectedWords.map((word, index) => (
                                <motion.div
                                    key={`selected-${word}-${index}`}
                                    variants={selectedWordVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    layout
                                    whileHover={!disabled ? { scale: 1.1, y: -2 } : {}}
                                    whileTap={!disabled ? { scale: 0.9 } : {}}
                                >
                                    <Button
                                        onClick={() => removeWord(word, index)}
                                        disabled={disabled}
                                        className={cn(
                                            'h-auto px-4 py-2 rounded-lg font-medium transition-all',
                                            'bg-primary text-primary-foreground shadow-md',
                                            'hover:bg-primary/90',
                                            disabled && 'cursor-not-allowed opacity-75'
                                        )}
                                    >
                                        {word}
                                        {!disabled && (
                                            <X className="h-3 w-3 ml-1 inline-block opacity-60" />
                                        )}
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Reset Button */}
                <AnimatePresence>
                    {selectedWords.length > 0 && !disabled && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute -top-2 -right-2"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: -180 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    onClick={resetWords}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 rounded-full bg-muted"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Word Bank */}
            <motion.div
                className="bg-muted/50 p-4 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="popLayout">
                        {availableWords.map((word, index) => (
                            <motion.div
                                key={`available-${word}-${index}`}
                                variants={wordVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                layout
                                whileHover={!disabled ? { scale: 1.1, y: -4 } : {}}
                                whileTap={!disabled ? { scale: 0.9 } : {}}
                            >
                                <Button
                                    variant="outline"
                                    onClick={() => addWord(word, index)}
                                    disabled={disabled}
                                    className={cn(
                                        'h-auto px-4 py-2 rounded-lg font-medium transition-all',
                                        'bg-card border-2 border-border shadow-sm',
                                        'hover:border-primary hover:shadow-md',
                                        disabled && 'cursor-not-allowed opacity-75'
                                    )}
                                >
                                    {word}
                                </Button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {availableWords.length === 0 && (
                    <motion.p
                        className="text-center text-muted-foreground text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        {intl.formatMessage({ id: 'quiz.listening.allWordsUsed' })}
                    </motion.p>
                )}
            </motion.div>

            {/* Show correct answer when wrong */}
            <AnimatePresence>
                {showResult && !isCorrect && question.correctAnswer && (
                    <motion.div
                        className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                            {intl.formatMessage({ id: 'quiz.correctAnswer' })}
                        </p>
                        <p className="text-lg font-semibold mt-1">
                            {question.correctAnswer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
