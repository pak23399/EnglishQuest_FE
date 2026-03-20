import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BooleanCellProps extends React.HTMLAttributes<HTMLDivElement> {
  value: boolean | undefined | null;
}

export function CheckBooleanCell({
  value,
  className,
  ...props
}: BooleanCellProps) {
  if (!value) return null;

  return (
    <div {...props}>
      <Check className={cn('size-5 text-primary', className)} />
    </div>
  );
}

export function CrossBooleanCell({
  value,
  className,
  ...props
}: BooleanCellProps) {
  if (!value) return null;

  return (
    <div {...props}>
      <X className={cn('size-5 text-destructive', className)} />
    </div>
  );
}
