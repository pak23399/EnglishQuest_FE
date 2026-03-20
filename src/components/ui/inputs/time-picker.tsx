import { cn } from '@/lib/utils';
import { Input, InputProps } from '../input';

interface Props extends InputProps {
  /**
   * When false, hide the native browser time picker (clock/calendar icon).
   * Default: true
   */
  showPicker?: boolean;
}

export function TimePickerInput({
  showPicker = false,
  className,
  onChange,
  ...props
}: Props) {
  // If showPicker is false, add the rule to hide the native picker indicator.
  const hidePickerClass =
    '[&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none';

  return (
    <Input
      type="time"
      // step is in seconds; 60s => only hours + minutes (no seconds)
      step="60"
      // prefer numeric keyboard on mobile
      inputMode="numeric"
      // pattern enforces HH:MM entry
      pattern="[0-2][0-9]:[0-5][0-9]"
      // hint the browser to use 24h controls where locale allows
      lang="vi-VN"
      className={cn(!showPicker && hidePickerClass, className)}
      onChange={(val) => {
        // Normalize values such as "13:30:00" -> "13:30"
        if (val == null || val === '') {
          onChange?.(val as any);
          return;
        }

        const s = String(val);
        const m = s.match(/^(\d{1,2}:\d{2})(?::\d{2})?$/);
        if (m) onChange?.(m[1]);
        else onChange?.(s);
      }}
      {...props}
    />
  );
}
