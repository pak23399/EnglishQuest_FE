import { Lock, Check } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Level } from '@/models/content.model';
import Lottie from 'lottie-react';
import playButtonAnimation from '@/assets/lottie/Play_Button_Pulse.json';

export type LessonState = 'completed' | 'active' | 'locked';

interface LessonNodeProps {
    level: Level;
    state: LessonState;
    lessonNumber: number;
    onClick?: () => void;
}

const stateStyles = {
    completed: {
        circle: 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30',
        icon: <Check className="h-6 w-6" strokeWidth={3} />,
    },
    active: {
        circle: 'bg-transparent border-transparent', // No styling - let Lottie be fully visible
        icon: null, // Will use Lottie instead
    },
    locked: {
        circle: 'bg-gray-200 border-gray-300 text-gray-400',
        icon: <Lock className="h-5 w-5" />,
    },
};

export function LessonNode({ level, state, lessonNumber, onClick }: LessonNodeProps) {
    const styles = stateStyles[state];
    const isClickable = state === 'active' || state === 'completed';

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-2">
                    <button
                        onClick={isClickable ? onClick : undefined}
                        disabled={state === 'locked'}
                        className={cn(
                            'w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all duration-300',
                            styles.circle,
                            state === 'completed' && 'cursor-pointer hover:scale-110',
                            state === 'active' && 'cursor-pointer',
                            state === 'locked' && 'cursor-not-allowed',
                        )}
                    >
                        {state === 'active' ? (
                            <Lottie
                                animationData={playButtonAnimation}
                                loop={true}
                                className="h-32 w-32 shrink-0 absolute"
                            />
                        ) : (
                            styles.icon
                        )}
                    </button>
                    <span className={cn(
                        'text-xs font-medium',
                        state === 'locked' ? 'text-gray-400' : 'text-foreground'
                    )}>
                        Lesson {lessonNumber}
                    </span>
                </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[200px]">
                <p className="font-medium">{level.title}</p>
                {level.description && (
                    <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                )}
                <p className="text-xs mt-1">
                    {state === 'completed' && '✓ Completed'}
                    {state === 'active' && '▶ Ready to start'}
                    {state === 'locked' && '🔒 Complete previous lessons'}
                </p>
            </TooltipContent>
        </Tooltip>
    );
}

