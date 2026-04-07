import { Section } from '@/models/content.model';
import { CheckCircle2, Lock, Play } from 'lucide-react';
import { cn, getPlanDisplayName } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SectionCardProps {
  section: Section;
  progress?: {
    completedLevels: number;
    totalLevels: number;
    progressPercentage: number;
  };
  isLocked?: boolean;
  onSelect?: (sectionId: string) => void;
  className?: string;
}

export function SectionCard({
  section,
  progress,
  isLocked = false,
  onSelect,
  className,
}: SectionCardProps) {
  const handleClick = () => {
    if (!isLocked && onSelect) {
      onSelect(section.id);
    }
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-300 hover:shadow-lg',
        isLocked && 'opacity-60 cursor-not-allowed',
        className,
      )}
      onClick={handleClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={cn(
                  'font-semibold text-lg line-clamp-1',
                  isLocked && 'text-muted-foreground',
                )}
              >
                {section.title}
              </h3>

              {section.isFreeAccess && (
                <Badge variant="secondary" className="text-xs">
                  Free
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {section.description}
            </p>
          </div>

          {isLocked ? (
            <Lock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          ) : progress && progress.completedLevels === progress.totalLevels ? (
            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          ) : (
            <Play className="h-5 w-5 text-primary flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        {progress && !isLocked && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {progress.completedLevels} / {progress.totalLevels} levels
              </span>
              <span className="font-medium">
                {Math.round(progress.progressPercentage)}%
              </span>
            </div>
            <Progress value={progress.progressPercentage} className="h-2" />
          </div>
        )}

        {isLocked && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Unlock with {getPlanDisplayName(section.requiredPlan)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground w-full">
          <div className="flex items-center gap-1">
            <span>📚</span>
            <span>{section.totalLevels || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{section.estimatedMinutes} min</span>
          </div>
          {section.order && (
            <div className="ml-auto">
              <Badge variant="outline" className="text-xs">
                #{section.order}
              </Badge>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
