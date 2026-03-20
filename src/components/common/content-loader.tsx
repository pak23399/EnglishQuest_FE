import { LottieAnimation } from '@/components/ui/lottie-animation';
import BookLoading from '@/assets/lottie/Book loading.json';
import { cn } from '@/lib/utils';

export function ContentLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center justify-center grow w-full', className)}
    >
      <div className="w-[150px] h-[150px]">
        <LottieAnimation animationData={BookLoading} />
      </div>
    </div>
  );
}
