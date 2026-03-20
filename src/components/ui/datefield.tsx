'use client';

import type { VariantProps } from 'class-variance-authority';
import {
  composeRenderProps,
  DateFieldProps,
  DateField as DateFieldRa,
  DateInputProps as DateInputPropsRa,
  DateInput as DateInputRa,
  DateSegmentProps,
  DateSegment as DateSegmentRa,
  DateValue as DateValueRa,
  TimeFieldProps,
  TimeField as TimeFieldRa,
  TimeValue as TimeValueRa,
} from 'react-aria-components';
import { cn } from '@/lib/utils';
import { inputVariants } from '@/components/ui/input';

//
// DateField wrapper
//
function DateField<T extends DateValueRa>({
  className,
  children,
  ...props
}: DateFieldProps<T>) {
  return (
    <DateFieldRa
      className={composeRenderProps(className, (className) =>
        cn('flex flex-col gap-1', className),
      )}
      data-slot="datefield"
      {...props}
    >
      {children}
    </DateFieldRa>
  );
}

//
// TimeField wrapper (optional, nếu cần input giờ phút)
//
function TimeField<T extends TimeValueRa>({
  className,
  children,
  ...props
}: TimeFieldProps<T>) {
  return (
    <TimeFieldRa
      className={composeRenderProps(className, (className) =>
        cn('flex flex-col gap-1', className),
      )}
      data-slot="timefield"
      {...props}
    >
      {children}
    </TimeFieldRa>
  );
}

//
// DateSegment (mỗi phần ngày / tháng / năm)
//
function DateSegment({ className, ...props }: DateSegmentProps) {
  return (
    <DateSegmentRa
      className={composeRenderProps(className, (className) =>
        cn(
          `
          text-foreground inline-flex rounded px-0.5 caret-transparent outline-hidden
          data-[type=literal]:text-muted-foreground/70 data-[type=literal]:px-0
          data-placeholder:text-muted-foreground/70
          data-invalid:data-focused:bg-destructive data-invalid:text-destructive
          data-invalid:data-placeholder:text-destructive
          data-focused:bg-accent data-focused:text-foreground
          data-disabled:cursor-not-allowed data-disabled:opacity-50
        `,
          className,
        ),
      )}
      {...props}
    />
  );
}

//
// Styles cho DateInput
//
const dateInputStyles = `
  relative inline-flex items-center overflow-hidden whitespace-nowrap
  data-focus-within:ring-ring/30 data-focus-within:border-ring data-focus-within:outline-none data-focus-within:ring-[3px] 
  data-focus-within:has-aria-invalid:ring-destructive/20 dark:data-focus-within:has-aria-invalid:ring-destructive/40 
  data-focus-within:has-aria-invalid:border-destructive
`;

//
// DateInput wrapper
//
interface DateInputProps
  extends DateInputPropsRa,
    VariantProps<typeof inputVariants> {
  className?: string;
  variant?: VariantProps<typeof inputVariants>['variant'];
}

function DateInput({
  className,
  variant = 'md',
  ...props
}: Omit<DateInputProps, 'children'>) {
  return (
    <DateInputRa
      data-slot="input"
      className={composeRenderProps(className, (className) =>
        cn(inputVariants({ variant }), dateInputStyles, className),
      )}
      {...props}
    >
      {(segment) => <DateSegment segment={segment} />}
    </DateInputRa>
  );
}

//
// Exports
//
export { DateField, DateInput, DateSegment, TimeField, dateInputStyles };
export type { DateInputProps };
