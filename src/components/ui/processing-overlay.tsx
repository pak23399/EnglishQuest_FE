import { LottieAnimation } from './lottie-animation';
import BookLoading from '@/assets/lottie/Book loading.json';

export function ProcessingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-[300px] h-[300px]">
        <LottieAnimation animationData={BookLoading} />
      </div>
    </div>
  );
}
