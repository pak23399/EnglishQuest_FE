import { Question } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface PatternRecognitionQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    correctAnswer?: string;
}

// Pattern data structure from API (typeData with PascalCase fields)
interface PatternTypeData {
    BaseSentence?: string;
    ExampleSentence?: string;
    Pattern?: string; // The question sentence with blank (e.g., "They ___ students.")
    AudioText?: string | null;
    WordBank?: string[] | null;
    PlaybackSpeed?: number | null;
    MaxReplays?: number | null;
    MatchPairs?: unknown | null;
    ItemsToOrder?: unknown | null;
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
} as const;

const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 24,
        },
    },
};

const optionVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 400,
            damping: 25,
        },
    },
};

export function PatternRecognitionQuestion({
    question,
    selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showResult = false,
    isCorrect,
    correctAnswer,
}: PatternRecognitionQuestionProps) {
    // Parse pattern data from typeData (API uses PascalCase)
    const typeData = question.typeData as PatternTypeData | undefined;
    const baseSentence = typeData?.BaseSentence;
    const exampleSentence = typeData?.ExampleSentence;
    const patternSentence = typeData?.Pattern; // This is the question sentence with blank

    // Format sentence with blank indicator styling
    const formatSentence = (text: string) => {
        return text.replace(/_{2,}|___+/g, '<span class="px-3 py-0.5 mx-1 bg-primary/20 border-b-2 border-primary rounded font-bold">?</span>');
    };

    return (
        <div className="space-y-6">
            {/* Pattern Examples */}
            <motion.div
                className="space-y-3 max-w-lg mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.p
                    className="text-sm font-medium text-muted-foreground text-center mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    Learn the pattern:
                </motion.p>

                {/* Base Sentence */}
                {baseSentence && (
                    <motion.div variants={cardVariants}>
                        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                                    Example 1
                                </span>
                            </div>
                            <p className="text-lg font-medium mt-2">
                                {baseSentence}
                            </p>
                        </Card>
                    </motion.div>
                )}

                {/* Example Sentence */}
                {exampleSentence && (
                    <motion.div variants={cardVariants}>
                        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                                    Example 2
                                </span>
                            </div>
                            <p className="text-lg font-medium mt-2">
                                {exampleSentence}
                            </p>
                        </Card>
                    </motion.div>
                )}
            </motion.div>

            {/* Question */}
            <motion.div
                className="text-center py-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                <p className="text-sm text-muted-foreground mb-2">{question.text}</p>
                {patternSentence && (
                    <h2
                        className="text-xl md:text-2xl font-semibold leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatSentence(patternSentence) }}
                    />
                )}
            </motion.div>

            {/* Options - now options is string[] */}
            <motion.div
                className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const isThisCorrect = showResult && correctAnswer === option;

                    return (
                        <motion.div
                            key={index}
                            variants={optionVariants}
                            whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
                            whileTap={!disabled ? { scale: 0.95 } : {}}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => !disabled && onSelectAnswer(option)}
                                disabled={disabled}
                                className={cn(
                                    'w-full h-auto p-4 rounded-xl border-2 transition-all duration-200',
                                    'font-semibold text-lg',
                                    'hover:shadow-md',
                                    !isSelected && !showResult && 'border-border hover:border-primary/50 bg-card',
                                    isSelected && !showResult && 'border-primary bg-primary/10 shadow-md',
                                    showResult && isSelected && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                    showResult && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                    disabled && 'cursor-not-allowed opacity-75'
                                )}
                            >
                                {option}
                            </Button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
