'use client';

import { LottieAnimation } from '@/components/ui/lottie-animation';
import BookLoading from '@/assets/lottie/Book loading.json';

export function ScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-700 ease-in-out">
      <div className="w-[300px] h-[300px]">
        <LottieAnimation animationData={BookLoading} />
      </div>
    </div>
  );
}
