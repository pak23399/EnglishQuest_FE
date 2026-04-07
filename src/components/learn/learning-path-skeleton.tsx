import { Skeleton } from '@/components/ui/skeleton';
export function LearningPathSkeleton() {
    return (
        <div className="space-y-8">
            {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-72" />
                        </div>
                        <Skeleton className="h-24 w-32 hidden md:block rounded-xl" />
                    </div>
                    <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((j) => (
                            <div key={j} className="flex items-center gap-3">
                                {j > 1 && <Skeleton className="h-1 w-8" />}
                                <div className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-14 w-14 rounded-full" />
                                    <Skeleton className="h-3 w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}