import { Level } from '@/models/content.model';
import { Difficulty } from '@/models/quiz.model';
import { CheckCircle2, Circle, Lock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface LevelCardProps {
  level: Level;
  isLocked?: boolean;
  isCompleted?: boolean;
  bestScore?: number;
  onStart?: (levelId: string) => void;
  className?: string;
}

const difficultyConfig = {
  [Difficulty.Beginner]: {
    label: 'Beginner',
    color: 'bg-green-500/10 text-green-700 border-green-500/20',
  },
  [Difficulty.Intermediate]: {
    label: 'Intermediate',
    color: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
  },
  [Difficulty.Advanced]: {
    label: 'Advanced',
    color: 'bg-red-500/10 text-red-700 border-red-500/20',
  },
};

export function LevelCard({
  level,
  isLocked = false,
  isCompleted = false,
  bestScore,
  onStart,
  className,
}: LevelCardProps) {
  const diffConfig = difficultyConfig[level.difficulty];

  const handleStart = () => {
    if (!isLocked && onStart) {
      onStart(level.id);
    }
  };

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-md relative overflow-hidden',
        isLocked && 'opacity-60',
        isCompleted && 'border-green-500/50',
        className,
      )}
    >
      {/* Completion Badge */}
      {isCompleted && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-100" />
        </div>
      )}

      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute top-2 right-2 z-10">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Order Badge */}
            {level.order && (
              <Badge variant="outline" className="mb-2 text-xs">
                Lesson {level.order}
              </Badge>
            )}

            {/* Title */}
            <h3
              className={cn(
                'font-semibold text-base line-clamp-2 mb-1',
                isLocked && 'text-muted-foreground',
              )}
            >
              {level.title}
            </h3>

            {/* Description */}
            {level.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {level.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {/* Difficulty */}
          <Badge variant="outline" className={cn('text-xs', diffConfig.color)}>
            {diffConfig.label}
          </Badge>

          {/* Questions */}
          <div className="flex items-center gap-1">
            <Circle className="h-3 w-3" />
            <span>{level.config.totalQuestions} questions</span>
          </div>

          {/* XP Reward */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{level.config.xpReward} XP</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{level.config.estimatedMinutes} min</span>
          </div>
        </div>

        {/* Best Score */}
        {isCompleted && bestScore !== undefined && (
          <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950/20 rounded-md">
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              Best Score
            </span>
            <span className="text-sm font-bold text-green-700 dark:text-green-400">
              {bestScore}/{level.config.totalQuestions}
            </span>
          </div>
        )}

        {/* Prerequisites Warning */}
        {isLocked && level.prerequisiteIds.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2 bg-muted/50 rounded-md">
            <Lock className="h-3 w-3" />
            <span>Complete previous lessons to unlock</span>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={handleStart}
          disabled={isLocked}
          className="w-full"
          variant={isCompleted ? 'outline' : 'primary'}
        >
          {isLocked ? (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Locked
            </>
          ) : isCompleted ? (
            'Practice Again'
          ) : (
            'Start Lesson'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
