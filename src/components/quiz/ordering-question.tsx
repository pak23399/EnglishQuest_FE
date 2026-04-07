import { useState, useEffect } from 'react';
import { Question } from '@/models/quiz.model';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { GripVertical, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';
import { useIntl } from 'react-intl';

interface OrderingQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onSelectAnswer: (answer: string) => void;
    disabled?: boolean;
    showResult?: boolean;
    isCorrect?: boolean;
    correctAnswer?: string;
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
    hidden: { opacity: 0, x: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: 'spring' as const,
            stiffness: 300,
            damping: 24,
        },
    },
};

export function OrderingQuestion({
    question,
    selectedAnswer: _selectedAnswer,
    onSelectAnswer,
    disabled = false,
    showResult = false,
    isCorrect,
    correctAnswer,
}: OrderingQuestionProps) {
    const intl = useIntl();
    const [orderedItems, setOrderedItems] = useState<string[]>([]);

    // Initialize with shuffled options
    useEffect(() => {
        const shuffled = [...question.options].sort(() => Math.random() - 0.5);
        setOrderedItems(shuffled);
    }, [question.options]);

    // Handle reorder
    const handleReorder = (newOrder: string[]) => {
        if (disabled) return;
        setOrderedItems(newOrder);
        onSelectAnswer(newOrder.join(' '));
    };

    // Move item up/down (for mobile/accessibility)
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if (disabled) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= orderedItems.length) return;

        const newOrder = [...orderedItems];
        [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
        setOrderedItems(newOrder);
        onSelectAnswer(newOrder.join(' '));
    };

    // Reset to original order
    const resetOrder = () => {
        if (disabled) return;
        const shuffled = [...question.options].sort(() => Math.random() - 0.5);
        setOrderedItems(shuffled);
        onSelectAnswer(shuffled.join(' '));
    };

    // Check if item is in correct position
    const isItemCorrect = (item: string, index: number): boolean => {
        if (!correctAnswer) return false;
        const correctOrder = correctAnswer.split(' ');
        return correctOrder[index] === item;
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
                    {intl.formatMessage({ id: 'quiz.ordering.instruction', defaultMessage: 'Drag to reorder items in the correct sequence' })}
                </p>
            </motion.div>

            {/* Reset Button */}
            <div className="flex justify-end max-w-lg mx-auto">
                <AnimatePresence>
                    {!disabled && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.05, rotate: -180 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                onClick={resetOrder}
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                            >
                                <RotateCcw className="h-4 w-4" />
                                {intl.formatMessage({ id: 'quiz.ordering.shuffle', defaultMessage: 'Shuffle' })}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Reorderable List */}
            <motion.div
                className="max-w-lg mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {disabled ? (
                    // Static display when disabled
                    <div className="space-y-2">
                        {orderedItems.map((item, index) => {
                            const itemCorrect = isItemCorrect(item, index);
                            return (
                                <motion.div
                                    key={`static-${item}-${index}`}
                                    variants={itemVariants}
                                    className={cn(
                                        'flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 transition-all',
                                        'bg-card',
                                        showResult && itemCorrect && 'border-green-500 bg-green-50 dark:bg-green-950/30',
                                        showResult && !itemCorrect && 'border-red-500 bg-red-50 dark:bg-red-950/30',
                                        !showResult && 'border-border'
                                    )}
                                >
                                    <div className={cn(
                                        'flex items-center justify-center h-8 w-8 rounded-lg font-bold text-sm',
                                        'border-2 shrink-0',
                                        showResult && itemCorrect && 'border-green-500 bg-green-500 text-white',
                                        showResult && !itemCorrect && 'border-red-500 bg-red-500 text-white',
                                        !showResult && 'border-muted-foreground/30 text-muted-foreground'
                                    )}>
                                        {index + 1}
                                    </div>
                                    <span className="font-medium flex-1">{item}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    // Draggable list when enabled
                    <Reorder.Group
                        axis="y"
                        values={orderedItems}
                        onReorder={handleReorder}
                        className="space-y-2"
                    >
                        {orderedItems.map((item, index) => (
                            <Reorder.Item
                                key={item}
                                value={item}
                                className="cursor-grab active:cursor-grabbing"
                            >
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.02, x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        'flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 transition-all',
                                        'bg-card border-border hover:border-primary/50 hover:shadow-md'
                                    )}
                                >
                                    {/* Drag Handle */}
                                    <div className="text-muted-foreground/50 hover:text-muted-foreground shrink-0">
                                        <GripVertical className="h-5 w-5" />
                                    </div>

                                    {/* Position Number */}
                                    <motion.div
                                        className={cn(
                                            'flex items-center justify-center h-8 w-8 rounded-lg font-bold text-sm',
                                            'border-2 border-primary bg-primary text-primary-foreground shrink-0'
                                        )}
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {index + 1}
                                    </motion.div>

                                    {/* Item Text */}
                                    <span className="font-medium flex-1">{item}</span>

                                    {/* Up/Down Buttons for accessibility */}
                                    <div className="flex flex-col gap-0.5 shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveItem(index, 'up');
                                            }}
                                            disabled={index === 0}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ArrowUp className="h-3 w-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                moveItem(index, 'down');
                                            }}
                                            disabled={index === orderedItems.length - 1}
                                            className="h-6 w-6 p-0"
                                        >
                                            <ArrowDown className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </motion.div>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                )}
            </motion.div>

            {/* Current Order Preview */}
            <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-sm text-muted-foreground mb-2">
                    {intl.formatMessage({ id: 'quiz.ordering.currentOrder', defaultMessage: 'Current order:' })}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                    {orderedItems.map((item, index) => (
                        <motion.span
                            key={`preview-${index}`}
                            className={cn(
                                'px-3 py-1 rounded-lg text-sm font-medium',
                                'bg-muted border border-border',
                                showResult && isItemCorrect(item, index) && 'bg-green-100 dark:bg-green-950/30 border-green-500',
                                showResult && !isItemCorrect(item, index) && 'bg-red-100 dark:bg-red-950/30 border-red-500'
                            )}
                            layout
                        >
                            {item}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

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
                            {intl.formatMessage({ id: 'quiz.correctAnswer', defaultMessage: 'Correct order:' })}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {correctAnswer.split(' ').map((item, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-sm font-medium"
                                >
                                    {index + 1}. {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
