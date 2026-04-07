import { cn } from '@/lib/utils';
import { Section, Level } from '@/models/content.model';
import { LessonNode, LessonState } from './lesson-node';
import { LessonConnector } from './lesson-connector';

interface UnitSectionProps {
    section: Section;
    levels: Level[];
    completedLevelIds: Set<string>;
    onLevelClick: (levelId: string) => void;
    isFirst?: boolean;
    isAdmin?: boolean;
}

// Local illustrations from public/media/illustrations/sections
const defaultImages = [
    '/media/illustrations/sections/family-1.svg',
    '/media/illustrations/sections/food.svg',
    '/media/illustrations/sections/travel.svg',
    '/media/illustrations/sections/family-2.svg',
];

export function UnitSection({
    section,
    levels,
    completedLevelIds,
    onLevelClick,
    isFirst = false,
    isAdmin = false,
}: UnitSectionProps) {
    // Sort levels by order
    const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

    // Helper function to check if a level is unlocked based on prerequisites
    const isLevelUnlocked = (level: Level): boolean => {
        // Level with no prerequisites is always unlocked
        if (!level.prerequisiteIds || level.prerequisiteIds.length === 0) {
            return true;
        }
        // Level is unlocked if ALL prerequisites are completed
        return level.prerequisiteIds.every(prereqId => completedLevelIds.has(prereqId));
    };

    // Determine which level is active (first uncompleted level that's unlocked)
    const activeLevelIndex = sortedLevels.findIndex(
        (level) => !completedLevelIds.has(level.id) && isLevelUnlocked(level)
    );

    const getLevelState = (index: number): LessonState => {
        const level = sortedLevels[index];

        // If completed, always show as completed (Check icon)
        if (completedLevelIds.has(level.id)) return 'completed';

        // Override for Admin: Only show as active if not completed
        if (isAdmin) return 'active';

        // Check if level is unlocked based on prerequisites
        const unlocked = isLevelUnlocked(level);

        if (unlocked) {
            // Level is unlocked - show as active if it's the first uncompleted one
            return index === activeLevelIndex ? 'active' : 'locked';
        }

        return 'locked';
    };

    const unitImage = section.imageUrl || defaultImages[(section.order - 1) % defaultImages.length];

    if (sortedLevels.length === 0) return null;

    return (
        <div className={cn('py-6', !isFirst && 'border-t border-border')}>
            {/* Unit Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                        Section {section.order}: {section.title}
                    </h2>
                    {section.description && (
                        <p className="text-sm text-muted-foreground mt-1 max-w-md line-clamp-2">
                            {section.description}
                        </p>
                    )}
                </div>
                {/* Unit Illustration */}
                <div className="hidden md:block">
                    <img
                        src={unitImage}
                        alt={section.title}
                        className="w-[400px] h-[250px] object-contain shrink-0 absolute -mx-72"
                    />
                </div>
            </div>

            {/* Horizontal Learning Path */}
            <div className="overflow-clip pb-4 -mx-4 px-4 py-10">
                <div className="flex items-center gap-0 min-w-max">
                    {sortedLevels.map((level, index) => {
                        const state = getLevelState(index);
                        const prevState = index > 0 ? getLevelState(index - 1) : 'completed';

                        return (
                            <div key={level.id} className="flex items-center">
                                {index > 0 && (
                                    <LessonConnector isCompleted={prevState === 'completed'} />
                                )}
                                <LessonNode
                                    level={level}
                                    state={state}
                                    lessonNumber={index + 1}
                                    onClick={() => onLevelClick(level.id)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
