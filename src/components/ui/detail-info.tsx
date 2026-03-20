import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const labelVariants = cva('text-sm text-secondary-foreground', {
  variants: {
    size: {
      lg: 'w-[160px]',
      md: 'w-[120px]',
      sm: 'w-[80px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function DetailInfo({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex gap-x-2 max-w-full', className)} {...props} />
  );
}

function DetailInfoLabel({
  className,
  size,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof labelVariants>) {
  return <div className={cn(labelVariants({ size }), className)} {...props} />;
}

function DetailInfoContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('text-sm text-mono font-medium', className)}
      {...props}
    />
  );
}

export { DetailInfo, DetailInfoLabel, DetailInfoContent };
