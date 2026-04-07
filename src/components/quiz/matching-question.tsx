import { useState, useEffect } from 'react';
import { Question } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, RotateCcw, Check, X } from 'lucide-react';
import { useIntl } from 'react-intl';

interface MatchingQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    correctAnswer?: string;
}

interface MatchPair {
    left: string;
    right: string;
}

// Animation variants
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

export function MatchingQuestion({
    question,
    selectedAnswer: _selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showResult = false,
    isCorrect,
    correctAnswer,
}: MatchingQuestionProps) {
    const intl = useIntl();
    const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
    const [matches, setMatches] = useState<MatchPair[]>([]);
    const [leftItems, setLeftItems] = useState<string[]>([]);
    const [rightItems, setRightItems] = useState<string[]>([]);

    // Parse pairs from options (format: "left → right")
    useEffect(() => {
        const parsedLeft: string[] = [];
        const parsedRight: string[] = [];

        question.options.forEach(option => {
            const parts = option.split(/\s*→\s*/);
            if (parts.length === 2) {
                parsedLeft.push(parts[0].trim());
                parsedRight.push(parts[1].trim());
            }
        });

        // Shuffle right items
        const shuffledRight = [...parsedRight].sort(() => Math.random() - 0.5);
        setLeftItems(parsedLeft);
        setRightItems(shuffledRight);
        setMatches([]);
    }, [question.options]);

    // Select left item
    const handleLeftClick = (item: string) => {
        if (disabled) return;
        if (matches.find(m => m.left === item)) return; // Already matched
        setSelectedLeft(item === selectedLeft ? null : item);
    };

    // Select right item to match
    const handleRightClick = (item: string) => {
        if (disabled || !selectedLeft) return;
        if (matches.find(m => m.right === item)) return; // Already matched

        const newMatch: MatchPair = { left: selectedLeft, right: item };
        const newMatches = [...matches, newMatch];
        setMatches(newMatches);
        setSelectedLeft(null);

        // Update answer (format: "left1→right1|left2→right2|...")
        const answerString = newMatches.map(m => `${m.left}→${m.right}`).join('|');
        onSelectAnswer(answerString);
    };

    // Remove a match
    const removeMatch = (pair: MatchPair) => {
        if (disabled) return;
        const newMatches = matches.filter(m => m.left !== pair.left);
        setMatches(newMatches);

        const answerString = newMatches.map(m => `${m.left}→${m.right}`).join('|');
        onSelectAnswer(answerString);
    };

    // Reset all matches
    const resetMatches = () => {
        if (disabled) return;
        setMatches([]);
        setSelectedLeft(null);
        onSelectAnswer('');
    };

    // Check if item is matched
    const isLeftMatched = (item: string) => matches.some(m => m.left === item);
    const isRightMatched = (item: string) => matches.some(m => m.right === item);

    // Check if match is correct (for result display)
    const isMatchCorrect = (pair: MatchPair): boolean => {
        if (!correctAnswer) return false;
        // Parse correct answer to check
        const correctPairs = correctAnswer.split('|').map(p => {
            const parts = p.split('→');
            return { left: parts[0]?.trim(), right: parts[1]?.trim() };
        });
        return correctPairs.some(cp => cp.left === pair.left && cp.right === pair.right);
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
                    {intl.formatMessage({ id: 'quiz.matching.instruction', defaultMessage: 'Match items from left to right' })}
                </p>
            </motion.div>

            {/* Matching Area */}
            <div className="flex gap-4 md:gap-8 justify-center items-start max-w-2xl mx-auto">
                {/* Left Column */}
                <motion.div
                    className="flex flex-col gap-3 flex-1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {leftItems.map((item, index) => {
                        const isMatched = isLeftMatched(item);
                        const isSelected = selectedLeft === item;
                        const matchedPair = matches.find(m => m.left === item);
                        const matchCorrect = matchedPair ? isMatchCorrect(matchedPair) : false;

                        return (
                            <motion.div
                                key={`left-${index}`}
                                variants={itemVariants}
                                whileHover={!disabled && !isMatched ? { scale: 1.02, x: 4 } : {}}
                                whileTap={!disabled && !isMatched ? { scale: 0.98 } : {}}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => handleLeftClick(item)}
                                    disabled={disabled || isMatched}
                                    className={cn(
                                        'w-full h-auto p-3 md:p-4 rounded-xl border-2 transition-all duration-200',
                                        'font-medium text-sm md:text-base',
                                        'hover:shadow-md',
                                        !isSelected && !isMatched && 'border-border hover:border-primary/50 bg-card',
                                        isSelected && 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30',
                                        isMatched && !showResult && 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20',
                                        showResult && isMatched && matchCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                        showResult && isMatched && !matchCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                        (disabled || isMatched) && 'cursor-not-allowed opacity-75'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        {isMatched && (
                                            <Link2 className="h-4 w-4 text-green-500" />
                                        )}
                                        <span>{item}</span>
                                    </div>
                                </Button>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Connection Indicator */}
                <div className="flex items-center justify-center self-center">
                    <motion.div
                        className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center',
                            'bg-muted border-2 border-dashed border-muted-foreground/30',
                            selectedLeft && 'border-primary bg-primary/10'
                        )}
                        animate={selectedLeft ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 1 }}
                    >
                        <Link2 className={cn(
                            'h-4 w-4',
                            selectedLeft ? 'text-primary' : 'text-muted-foreground/50'
                        )} />
                    </motion.div>
                </div>

                {/* Right Column */}
                <motion.div
                    className="flex flex-col gap-3 flex-1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {rightItems.map((item, index) => {
                        const isMatched = isRightMatched(item);
                        const matchedPair = matches.find(m => m.right === item);
                        const matchCorrect = matchedPair ? isMatchCorrect(matchedPair) : false;

                        return (
                            <motion.div
                                key={`right-${index}`}
                                variants={itemVariants}
                                whileHover={!disabled && !isMatched && selectedLeft ? { scale: 1.02, x: -4 } : {}}
                                whileTap={!disabled && !isMatched && selectedLeft ? { scale: 0.98 } : {}}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={() => handleRightClick(item)}
                                    disabled={disabled || isMatched || !selectedLeft}
                                    className={cn(
                                        'w-full h-auto p-3 md:p-4 rounded-xl border-2 transition-all duration-200',
                                        'font-medium text-sm md:text-base',
                                        'hover:shadow-md',
                                        !isMatched && !selectedLeft && 'border-border bg-card opacity-60',
                                        !isMatched && selectedLeft && 'border-border hover:border-primary/50 bg-card',
                                        isMatched && !showResult && 'border-green-500/50 bg-green-50/50 dark:bg-green-950/20',
                                        showResult && isMatched && matchCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                        showResult && isMatched && !matchCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                        (disabled || isMatched) && 'cursor-not-allowed opacity-75'
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{item}</span>
                                        {showResult && isMatched && (
                                            matchCorrect
                                                ? <Check className="h-4 w-4 text-green-500" />
                                                : <X className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </Button>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            {/* Matched Pairs Display */}
            <AnimatePresence>
                {matches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="relative"
                    >
                        <Card className="p-4 bg-muted/50">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-muted-foreground">
                                    {intl.formatMessage({ id: 'quiz.matching.yourMatches', defaultMessage: 'Your matches' })} ({matches.length}/{leftItems.length})
                                </p>
                                {!disabled && (
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: -180 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button
                                            onClick={resetMatches}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 rounded-full"
                                        >
                                            <RotateCcw className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {matches.map((pair, index) => {
                                    const matchCorrect = isMatchCorrect(pair);
                                    return (
                                        <motion.div
                                            key={`match-${index}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className={cn(
                                                'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium',
                                                'border',
                                                !showResult && 'bg-primary/10 border-primary/30',
                                                showResult && matchCorrect && 'bg-green-100 dark:bg-green-950/30 border-green-500',
                                                showResult && !matchCorrect && 'bg-red-100 dark:bg-red-950/30 border-red-500'
                                            )}
                                        >
                                            <span>{pair.left}</span>
                                            <Link2 className="h-3 w-3" />
                                            <span>{pair.right}</span>
                                            {!disabled && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeMatch(pair)}
                                                    className="h-5 w-5 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Show correct answer when wrong */}
            <AnimatePresence>
                {showResult && !isCorrect && correctAnswer && (
                    <motion.div
                        className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">
                            {intl.formatMessage({ id: 'quiz.correctAnswer', defaultMessage: 'Correct answer:' })}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {correctAnswer.split('|').map((pair, index) => (
                                <span key={index} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded text-sm">
                                    {pair.replace('→', ' → ')}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
