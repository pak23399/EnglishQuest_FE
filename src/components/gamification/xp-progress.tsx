import { TrendingUp } from 'lucide-react';
import { useTotalXP } from '@/hooks/use-progress';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface XPProgressProps {
  className?: string;
  showLevel?: boolean;
  variant?: 'bar' | 'circle';
}

// XP thresholds for levels (example progression)
const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 300 },
  { level: 4, xpRequired: 600 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 1500 },
  { level: 7, xpRequired: 2100 },
  { level: 8, xpRequired: 2800 },
  { level: 9, xpRequired: 3600 },
  { level: 10, xpRequired: 4500 },
  { level: 11, xpRequired: 5500 },
  { level: 12, xpRequired: 6600 },
  { level: 13, xpRequired: 7800 },
  { level: 14, xpRequired: 9100 },
  { level: 15, xpRequired: 10500 },
  { level: 16, xpRequired: 12000 },
  { level: 17, xpRequired: 13600 },
  { level: 18, xpRequired: 15300 },
  { level: 19, xpRequired: 17100 },
  { level: 20, xpRequired: 19000 },
];

function calculateLevel(totalXP: number) {
  let currentLevel = 1;
  let xpForCurrentLevel = 0;
  let xpForNextLevel = 100;

  for (let i = XP_LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= XP_LEVELS[i].xpRequired) {
      currentLevel = XP_LEVELS[i].level;
      xpForCurrentLevel = XP_LEVELS[i].xpRequired;
      
      if (i < XP_LEVELS.length - 1) {
        xpForNextLevel = XP_LEVELS[i + 1].xpRequired;
      } else {
        // Max level reached
        xpForNextLevel = xpForCurrentLevel;
      }
      break;
    }
  }

  const xpInCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = xpNeededForNextLevel > 0 
    ? Math.min((xpInCurrentLevel / xpNeededForNextLevel) * 100, 100)
    : 100;

  return {
    currentLevel,
    totalXP,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    xpForNextLevel,
    progressPercentage,
    isMaxLevel: currentLevel === XP_LEVELS[XP_LEVELS.length - 1].level,
  };
}

export function XPProgress({ 
  className, 
  showLevel = true,
  variant = 'bar'
}: XPProgressProps) {
  const { data: totalXP, isLoading } = useTotalXP();

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-2 w-full" />
      </div>
    );
  }

  if (totalXP === undefined) return null;

  const levelInfo = calculateLevel(totalXP);

  if (variant === 'circle') {
    // Circular progress variant (simplified for now)
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className="relative h-16 w-16">
          <svg className="transform -rotate-90 h-16 w-16">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-200"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - levelInfo.progressPercentage / 100)}`}
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{levelInfo.currentLevel}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Level {levelInfo.currentLevel}</span>
          <span className="text-xs text-muted-foreground">
            {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP
          </span>
        </div>
      </div>
    );
  }

  // Bar variant (default)
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showLevel && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">
                Level {levelInfo.currentLevel}
              </span>
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {levelInfo.totalXP.toLocaleString()} Total XP
          </span>
        </div>
        
        {!levelInfo.isMaxLevel && (
          <span className="text-xs font-medium text-muted-foreground">
            {levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <Progress 
        value={levelInfo.progressPercentage} 
        className="h-2"
      />

      {/* Next Level Info */}
      {!levelInfo.isMaxLevel && (
        <p className="text-xs text-muted-foreground">
          {levelInfo.xpNeededForNextLevel - levelInfo.xpInCurrentLevel} XP to Level {levelInfo.currentLevel + 1}
        </p>
      )}

      {levelInfo.isMaxLevel && (
        <p className="text-xs font-semibold text-primary">
          🏆 Max Level !Reached
        </p>
      )}
    </div>
  );
}
