import { useAuth } from '@/auth/context/auth-context';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { useAvailableSections } from '@/hooks/use-content';
import { useAllProgress } from '@/hooks/use-progress';
import { useQueries } from '@tanstack/react-query';
import { contentService } from '@/services/content.service';
import { Card, CardContent } from '@/components/ui/card';
import { UnitSection, LearningPathSkeleton } from '@/components/learn';
import { Level } from '@/models/content.model';

export function HomeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const intl = useIntl();

  // Fetch all sections
  const { data: sections, isLoading: sectionsLoading } = useAvailableSections();

  // Fetch all user progress
  const { data: allProgress, isLoading: progressLoading } = useAllProgress();

  // Fetch levels for all sections
  const levelsQueries = useQueries({
    queries: (sections || []).map((section) => ({
      queryKey: ['content', 'levels', 'section', section.id],
      queryFn: () => contentService.getLevelsBySection(section.id),
      enabled: !!sections?.length,
      staleTime: 300000,
    })),
  });

  const isLoading = sectionsLoading || progressLoading || levelsQueries.some(q => q.isLoading);

  // Create a set of completed level IDs for quick lookup
  const completedLevelIds = new Set<string>(
    (allProgress || [])
      .filter(p => p.isCompleted)  // Use isCompleted boolean instead of status enum
      .map(p => p.levelId)
  );

  // Create a map of section ID to levels
  const sectionLevelsMap = new Map<string, Level[]>();
  sections?.forEach((section, index) => {
    const queryResult = levelsQueries[index];
    if (queryResult?.data) {
      sectionLevelsMap.set(section.id, queryResult.data);
    }
  });

  const handleLevelClick = (levelId: string) => {
    navigate(`/quiz/${levelId}`);
  };

  // Sort sections by order
  const sortedSections = [...(sections || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {intl.formatMessage({ id: 'HOME.WELCOME_BACK' }, { username: user?.username || 'Learner' })}
        </h1>
        <p className="text-muted-foreground mt-1">
          {intl.formatMessage({ id: 'HOME.SUBTITLE' })}
        </p>
      </div>

      {/* Learning Path */}
      <div className="space-y-2">
        {isLoading ? (
          <LearningPathSkeleton />
        ) : sortedSections.length > 0 ? (
          sortedSections.map((section, index) => {
            const levels = sectionLevelsMap.get(section.id) || [];
            return (
              <UnitSection
                key={section.id}
                section={section}
                levels={levels}
                completedLevelIds={completedLevelIds}
                onLevelClick={handleLevelClick}
                isFirst={index === 0}
              />
            );
          })
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-semibold mb-2">{intl.formatMessage({ id: 'HOME.NO_LESSONS' })}</h3>
              <p className="text-muted-foreground">
                {intl.formatMessage({ id: 'HOME.CHECK_BACK' })}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
