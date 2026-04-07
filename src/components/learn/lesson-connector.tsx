import { cn } from '@/lib/utils';

interface LessonConnectorProps {
    isCompleted?: boolean;
}

export function LessonConnector({ isCompleted = false }: LessonConnectorProps) {
    return (
        <div
            className={cn(
                'h-1 w-8 md:w-12 mx-1.25 -mt-6 rounded-full transition-all duration-300',
                isCompleted ? 'bg-green-500' : 'bg-gray-300'
            )}
        />
    );
}
