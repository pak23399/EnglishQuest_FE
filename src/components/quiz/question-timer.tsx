import { useEffect, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface QuestionTimerProps {
    duration?: number; // seconds
    onTimeUp: () => void;
    isPaused?: boolean;
    className?: string;
}

export function QuestionTimer({
    duration = 15,
    onTimeUp,
    isPaused = false,
    className,
}: QuestionTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const progress = (timeLeft / duration) * 100;

    const handleTimeUp = useCallback(() => {
        onTimeUp();
    }, [onTimeUp]);

    useEffect(() => {
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPaused, handleTimeUp]);

    const getColor = () => {
        if (timeLeft <= 5) return 'text-red-500';
        if (timeLeft <= 10) return 'text-yellow-500';
        return 'text-primary';
    };

    const getStrokeColor = () => {
        if (timeLeft <= 5) return 'stroke-red-500';
        if (timeLeft <= 10) return 'stroke-yellow-500';
        return 'stroke-primary';
    };

    return (
        <div className={cn('relative inline-flex items-center justify-center', className)}>
            {/* Circular Progress */}
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    className={cn('transition-all duration-1000', getStrokeColor())}
                    strokeWidth="3"
                    strokeDasharray="97.39"
                    strokeDashoffset={97.39 - (97.39 * progress) / 100}
                    strokeLinecap="round"
                />
            </svg>
            {/* Time Text */}
            <span className={cn('absolute text-sm font-bold', getColor())}>
                {timeLeft}
            </span>
        </div>
    );
}
