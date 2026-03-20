import { useLottie, LottieOptions } from 'lottie-react';
import { CSSProperties } from 'react';

type LottieAnimationProps = {
  animationData: unknown;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  className,
  style,
}: LottieAnimationProps) {
  const options: LottieOptions = {
    animationData,
    loop,
    autoplay,
  };

  const { View } = useLottie(options, style);

  return <div className={className}>{View}</div>;
}
