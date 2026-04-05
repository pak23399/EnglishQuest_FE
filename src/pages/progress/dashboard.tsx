import { useAllProgress, useTotalXP, useCompletedLevelsCount } from '@/hooks/use-progress';
import { useAllSections } from '@/hooks/use-content';
import { XPProgress } from '@/components/gamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, TrendingUp, Award } from 'lucide-react';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Level } from '@/models/content.model';
import { ProgressStatus } from '@/models/progress.model';

export function ProgressPage() {
  const { data: allProgress, isLoading } = useAllProgress();
  const { data: totalXP } = useTotalXP();
  const { data: completedLevels } = useCompletedLevelsCount();
  const { data: sections } = useAllSections();

  // Create a map of levelId -> level info for quick lookup
  const levelMap = useMemo(() => {
    const map = new Map<string, { title: string; sectionTitle: string }>();
    if (sections) {
      sections.forEach((section) => {
        if (section.levels) {
          section.levels.forEach((level: Level) => {
            map.set(level.id, {
              title: level.title,
              sectionTitle: section.title,
            });
          });
        }
      });
    }
    return map;
  }, [sections]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalLevels = allProgress?.length || 0;
  const completed = completedLevels || 0;
  const inProgress = allProgress?.filter((p) => p.status === ProgressStatus.InProgress).length || 0;

  // Calculate average accuracy only for items with attempts
  const progressWithAttempts = allProgress?.filter((p) => p.stats?.totalAttempts > 0) || [];
  const averageAccuracy = progressWithAttempts.length > 0
    ? progressWithAttempts.reduce((sum, p) => sum + (p.stats?.bestAccuracy || 0), 0) / progressWithAttempts.length
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          <FormattedMessage id="PROGRESS.TITLE" defaultMessage="Your Progress" />
        </h1>
        <p className="text-muted-foreground">
          <FormattedMessage id="PROGRESS.SUBTITLE" defaultMessage="Track your learning journey" />
        </p>
      </div>

      {/* XP Progress */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="PROGRESS.LEVEL_PROGRESS" defaultMessage="Level Progress" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <XPProgress showLevel />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalXP?.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage id="PROGRESS.TOTAL_XP" defaultMessage="Total XP" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{completed}</p>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage id="PROGRESS.COMPLETED_LESSONS" defaultMessage="Completed Lessons" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Target className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{inProgress}</p>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage id="PROGRESS.IN_PROGRESS" defaultMessage="In Progress" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold">{averageAccuracy.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">
                  <FormattedMessage id="PROGRESS.AVG_ACCURACY" defaultMessage="Avg Accuracy" />
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="PROGRESS.OVERALL_PROGRESS" defaultMessage="Overall Progress" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                <FormattedMessage id="PROGRESS.LESSONS_COMPLETED" defaultMessage="Lessons Completed" />
              </span>
              <span className="font-medium">{completed} / {totalLevels}</span>
            </div>
            <Progress
              value={totalLevels > 0 ? (completed / totalLevels) * 100 : 0}
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Progress */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="PROGRESS.RECENT_ACTIVITY" defaultMessage="Recent Activity" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {allProgress && allProgress.length > 0 ? (
            <div className="space-y-3">
              {allProgress
                .filter((p) => p.lastAttemptAt) // Only show items with attempts
                .sort((a, b) =>
                  new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime()
                )
                .slice(0, 10)
                .map((progress) => {
                  const levelInfo = levelMap.get(progress.levelId);
                  const levelName = levelInfo?.title || `Level ${progress.levelId.slice(0, 8)}`;
                  const sectionName = levelInfo?.sectionTitle;

                  return (
                    <div
                      key={progress.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${progress.isCompleted
                          ? 'bg-green-500/10'
                          : 'bg-yellow-500/10'
                          }`}>
                          <BookOpen className={`h-4 w-4 ${progress.isCompleted
                            ? 'text-green-600'
                            : 'text-yellow-600'
                            }`} />
                        </div>
                        <div>
                          <p className="font-medium">{levelName}</p>
                          {sectionName && (
                            <p className="text-xs text-muted-foreground">
                              {sectionName} • {new Date(progress.lastAttemptAt).toLocaleDateString()}
                            </p>
                          )}
                          {!sectionName && (
                            <p className="text-xs text-muted-foreground">
                              {new Date(progress.lastAttemptAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={progress.isCompleted ? 'success' : 'secondary'}>
                          {progress.isCompleted ? (
                            <FormattedMessage id="PROGRESS.STATUS_COMPLETED" defaultMessage="Completed" />
                          ) : progress.status === ProgressStatus.InProgress ? (
                            <FormattedMessage id="PROGRESS.STATUS_IN_PROGRESS" defaultMessage="In Progress" />
                          ) : (
                            <FormattedMessage id="PROGRESS.STATUS_NOT_STARTED" defaultMessage="Not Started" />
                          )}
                        </Badge>
                        {progress.stats?.bestAccuracy !== undefined && progress.stats.bestAccuracy > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {progress.stats.bestAccuracy.toFixed(0)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-6">
              <FormattedMessage id="PROGRESS.EMPTY_STATE" defaultMessage="Start learning to see your progress here" />
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
