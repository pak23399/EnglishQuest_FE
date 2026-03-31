import { Snowflake } from 'lucide-react';
import Lottie from 'lottie-react';
import fireAnimation from '@/assets/lottie/Fire.json';
import { useStreakInfo, useFreezeStreak } from '@/hooks/use-streak';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StreakTrackerProps {
  className?: string;
  showFreezeButton?: boolean;
  variant?: 'compact' | 'detailed';
}

export function StreakTracker({
  className,
  showFreezeButton = true,
  variant = 'compact'
}: StreakTrackerProps) {
  const { data: streakInfo, isLoading } = useStreakInfo();
  const { mutate: freezeStreak, isPending: isFreezing } = useFreezeStreak();

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Skeleton className="h-6 w-24" />
      </div>
    );
  }

  if (!streakInfo) return null;

  const isCompact = variant === 'compact';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Current Streak */}
      <div className="flex items-center gap-1 ">
        <Lottie
          animationData={fireAnimation}
          loop={streakInfo.currentStreak > 0}
          autoplay={streakInfo.currentStreak > 0}
          className={cn(
            isCompact ? 'h-8 w-8 -mt-4' : 'h-10 w-10 -mt-4',
            streakInfo.currentStreak === 0 && 'opacity-30 grayscale -mt-4'
          )}
        />
        <div className="flex flex-col">
          <span className={cn('font-bold', isCompact ? 'text-lg' : 'text-xl')}>
            {streakInfo.currentStreak}
          </span>
          {!isCompact && (
            <span className="text-xs text-muted-foreground -mt-1">
              day streak
            </span>
          )}
        </div>
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-2">
        {streakInfo.isAtRisk && (
          <Badge variant="destructive" className="text-xs">
            At !Risk
          </Badge>
        )}

        {!streakInfo.canEarnToday && streakInfo.currentStreak > 0 && (
          <Badge variant="secondary" className="text-xs">
            ✓ Earned Today
          </Badge>
        )}
      </div>

      {/* Longest Streak (detailed only) */}
      {!isCompact && streakInfo.longestStreak > streakInfo.currentStreak && (
        <div className="text-sm text-muted-foreground">
          Best: {streakInfo.longestStreak} 🏆
        </div>
      )}

      {/* Freeze Button */}
      {showFreezeButton && streakInfo.streakFreezeCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => freezeStreak()}
          disabled={isFreezing}
          className="h-7 text-xs gap-1"
        >
          <Snowflake className="h-3 w-3" />
          Freeze ({streakInfo.streakFreezeCount})
        </Button>
      )}
    </div>
  );
}
