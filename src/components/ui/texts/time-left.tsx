import { useEffect, useMemo } from 'react';
import { calculateDaysLeft } from '@/lib/date';
import { cn } from '@/lib/utils';

interface Props {
  startDate?: Date | null;
  endDate?: Date | null;
}

export function TimeLeft({
  startDate,
  endDate,
  className,
  ...props
}: React.ComponentProps<'div'> & Props) {
  const daysLeft = calculateDaysLeft({ startDate, endDate });

  const defaultClass = useMemo(() => {
    if (daysLeft === null) return '';
    return daysLeft > 0 ? 'text-success' : 'text-destructive';
  }, [daysLeft]);

  return (
    <div
      className={cn('ext-sm text-mono font-medium', defaultClass, className)}
      {...props}
    >
      {daysLeft === null ? '--' : `${daysLeft} ngày`}
    </div>
  );
}
