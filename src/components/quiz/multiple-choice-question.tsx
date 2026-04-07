import { Question } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface MultipleChoiceQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    correctAnswer?: string; // Passed from submit response
}

// Animation variants for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 24,
        },
    },
};

export function MultipleChoiceQuestion({
    question,
    selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showResult = false,
    isCorrect,
    correctAnswer,
}: MultipleChoiceQuestionProps) {
    // Format text with blank indicator styling
    const formatQuestionText = (text: string) => {
        // Replace ___ or blank indicators with styled span
        return text.replace(/_{2,}|___+/g, '<span class="px-2 py-0.5 mx-1 bg-primary/10 border-b-2 border-primary rounded">______</span>');
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
                <h2
                    className="text-xl md:text-2xl font-semibold leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatQuestionText(question.text) }}
                />
            </motion.div>

            {/* Audio Player (if has audio) */}
            {question.audioUrl && (
                <div className="flex justify-center">
                    <audio
                        controls
                        src={question.audioUrl}
                        className="w-full max-w-md"
                    />
                </div>
            )}

            {/* Image (if has image) */}
            {question.imageUrl && (
                <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <img
                        src={question.imageUrl}
                        alt="Question"
                        className="max-h-48 rounded-lg shadow-md"
                    />
                </motion.div>
            )}

            {/* Options - now options is string[] */}
            <motion.div
                className="grid gap-3 max-w-lg mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {question.options.map((option, index) => {
                    const isSelected = selectedAnswer === option;
                    const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
                    const isThisCorrect = showResult && correctAnswer === option;

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={!disabled ? { scale: 1.02, x: 4 } : {}}
                            whileTap={!disabled ? { scale: 0.98 } : {}}
                        >
                            <Button
                                variant="ghost"
                                onClick={() => !disabled && onSelectAnswer(option)}
                                disabled={disabled}
                                className={cn(
                                    'w-full h-auto p-4 rounded-xl border-2 transition-all duration-200',
                                    'relative flex items-center justify-center',
                                    'hover:shadow-md',
                                    !isSelected && !showResult && 'border-border hover:border-primary/50 bg-card',
                                    isSelected && !showResult && 'border-primary bg-primary/10 shadow-md',
                                    showResult && isSelected && isCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                    showResult && isSelected && !isCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                    showResult && isThisCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                    disabled && 'cursor-not-allowed opacity-75'
                                )}
                            >
                                {/* Option Letter Badge - Positioned on the left */}
                                <motion.div
                                    className={cn(
                                        'absolute left-4 h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0',
                                        'border-2 transition-colors',
                                        !isSelected && 'border-muted-foreground/30 text-muted-foreground',
                                        isSelected && !showResult && 'border-primary bg-primary text-primary-foreground',
                                        showResult && isSelected && isCorrect && 'border-green-500 bg-green-500 text-white',
                                        showResult && isSelected && !isCorrect && 'border-red-500 bg-red-500 text-white',
                                        showResult && isThisCorrect && !isSelected && 'border-green-500 bg-green-500 text-white'
                                    )}
                                    animate={isSelected && !showResult ? { scale: [1, 1.1, 1] } : {}}
                                    transition={{ duration: 0.3 }}
                                >
                                    {optionLetter}
                                </motion.div>

                                {/* Option Text - Centered */}
                                <span className="font-medium text-base">{option}</span>
                            </Button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
