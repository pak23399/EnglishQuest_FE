import Lottie from 'lottie-react';
import heartAnimation from '@/assets/lottie/Heart.json';
import { useHeartStatus } from '@/hooks/use-hearts';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface HeartsDisplayProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function HeartsDisplay({
  className,
  size = 'md'
}: HeartsDisplayProps) {
  const { data: heartStatus, isLoading } = useHeartStatus();

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (!heartStatus) return null;

  const lottieSizes = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Single Heart Lottie */}
      <Lottie
        animationData={heartAnimation}
        loop={heartStatus.currentHearts > 0}
        autoplay={heartStatus.currentHearts > 0}
        className={cn(
          lottieSizes[size],
          heartStatus.currentHearts === 0 && 'opacity-30 grayscale'
        )}
      />

      {/* Heart Count */}
      <span className={cn('font-semibold', size === 'sm' ? 'text-sm' : 'text-base')}>
        {heartStatus.currentHearts}/{heartStatus.maxHearts}
      </span>
    </div>
  );
}
