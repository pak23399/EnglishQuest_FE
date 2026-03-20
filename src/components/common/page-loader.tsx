import { LottieAnimation } from '@/components/ui/lottie-animation';
import BookLoading from '@/assets/lottie/Book loading.json';
import { cn } from '@/lib/utils';

export function PageLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center grow w-full h-full pb-[var(--header-height)]',
        className,
      )}
    >
      <div className="w-[200px] h-[200px]">
        <LottieAnimation animationData={BookLoading} />
      </div>
    </div>
  );
}
