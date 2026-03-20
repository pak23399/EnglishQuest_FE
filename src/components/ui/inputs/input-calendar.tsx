import { useEffect, useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input, InputGroup } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePickerInput } from './time-picker';

interface InputCalendarProps
  extends Omit<
    React.ComponentProps<'input'>,
    'value' | 'onChange' | 'defaultValue'
  > {
  value?: Date | string;
  onChange?: (value: string | null | undefined) => void;
  defaultNull?: boolean;
  startMonth?: Date;
  endMonth?: Date;
  /** Show the time picker input next to the date input. Default: false */
  showTimePicker?: boolean;
}

export function InputCalendar({
  value,
  onChange,
  className,
  defaultNull = true,
  placeholder = 'dd/mm/yyyy',
  disabled,
  readOnly,
  startMonth,
  endMonth,
  showTimePicker = false,
  ...props
}: InputCalendarProps) {
  const [selected, setSelected] = useState<Date | null | undefined>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isIconHover, setIsIconHover] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [timeValue, setTimeValue] = useState('00:00:00');

  useEffect(() => {
    if (value instanceof Date && !isNaN(value.getTime())) {
      setSelected(value);
      setInputValue(format(value, 'dd/MM/yyyy'));
      setTimeValue(format(value, 'HH:mm:ss'));
    } else if (typeof value === 'string') {
      // If server returns an ISO datetime string (e.g. 2025-01-01T17:00:00Z),
      // convert it to a Date and show the local date part. Otherwise, if
      // the value is in dd/MM/yyyy form keep the existing behavior.
      // Keep the original string in the input value so user's custom formats
      // are preserved when appropriate.
      // First try ISO parse
      const isoCandidate = new Date(value);
      if (!Number.isNaN(isoCandidate.getTime()) && /T/.test(value)) {
        // It's an ISO-like string. Use the Date object and display local date.
        setSelected(isoCandidate);
        setInputValue(format(isoCandidate, 'dd/MM/yyyy'));
        setTimeValue(format(isoCandidate, 'HH:mm:ss'));
      } else {
        setInputValue(value);
        // Try to parse the string to set selected using dd/MM/yyyy
        const parsed = parse(value, 'dd/MM/yyyy', new Date());
        if (isValid(parsed) && format(parsed, 'dd/MM/yyyy') === value) {
          setSelected(parsed);
          // No explicit time in dd/MM/yyyy input -> default to 00:00:00
          setTimeValue('00:00:00');
        } else {
          setSelected(undefined);
          setTimeValue('00:00:00');
        }
      }
    } else {
      setSelected(undefined);
      setInputValue('');
      setTimeValue('00:00:00');
    }
  }, [value]);

  // Handle changes coming from the time input. Update the selected date/time
  const handleTimeChange = (timeStr: string) => {
    const t = timeStr || '00:00:00';
    setTimeValue(t);

    const parts = t.split(':').map((p) => parseInt(p, 10) || 0);
    const [h, m, s] = [parts[0] || 0, parts[1] || 0, parts[2] || 0];

    // If no date selected, default to today
    let base = selected as Date | null | undefined;
    if (!base) base = new Date();

    const newDate = new Date(base as Date);
    newDate.setHours(h, m, s, 0);

    setSelected(newDate);
    setInputValue(format(newDate, 'dd/MM/yyyy'));

    // Emit ISO datetime so parent can preserve time information. The
    // component accepts both dd/MM/yyyy strings and ISO datetime strings
    // (see useEffect which parses ISO strings containing 'T').
    onChange?.(newDate.toISOString());
  };

  // Khi chọn ngày từ calendar
  const handleSelect = (date?: Date) => {
    setSelected(date);
    setInputValue(date ? format(date, 'dd/MM/yyyy') : '');
    if (onChange) {
      onChange(
        date ? format(date, 'dd/MM/yyyy') : defaultNull ? null : undefined,
      );
    }
    setIsPopoverOpen(false);
  };

  // Xử lý khi người dùng nhập trực tiếp vào DateField
  const handleInputChange = (text: string) => {
    setInputValue(text);

    if (!text || text.trim() === '') {
      setSelected(defaultNull ? null : undefined);
      onChange?.(defaultNull ? null : undefined);
      return;
    }

    onChange?.(text);

    // Try to parse using dd/MM/yyyy
    const parsed = parse(text, 'dd/MM/yyyy', new Date());
    // Ensure parsed is valid and formatting it back matches input (to avoid partial parsing)
    if (isValid(parsed) && format(parsed, 'dd/MM/yyyy') === text) {
      setSelected(parsed);
    } else {
      // For partial or invalid text, keep the local input display and selected
      // state cleared, but avoid calling onChange(undefined) on every keystroke.
      // Calling onChange(undefined) causes the parent to clear the controlled
      // `value` prop which then forces this input's display to reset to empty.
      // Instead we only update local state and let the parent value remain
      // until the user finishes typing or a valid date is entered.
      setSelected(undefined);
    }
  };

  // Value shown in the plain input (dd/MM/yyyy)
  // const inputValue state holds this value

  // Xác định trạng thái active cho icon
  const iconActive = isIconHover || isPopoverOpen;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <div className="flex gap-x-2.5">
        {showTimePicker && (
          <TimePickerInput
            className="w-fit"
            value={timeValue}
            onChange={(val) => handleTimeChange(val ?? '')}
          />
        )}
        <InputGroup className="grow">
          <Input
            value={inputValue}
            onChange={(val) => handleInputChange(val ?? '')}
            className={cn(
              !readOnly &&
                'rounded-r-none border-r-0 focus:ring-0 focus:ring-offset-0 flex-1',
              className,
            )}
            aria-label="Date Input"
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            {...props}
          />
          {!readOnly && (
            <PopoverTrigger asChild>
              <Button
                variant="secondary"
                className="rounded-l-none border-l-0"
                type="button"
                tabIndex={-1}
                disabled={disabled}
                onMouseEnter={() => setIsIconHover(true)}
                onMouseLeave={() => setIsIconHover(false)}
              >
                <CalendarDays
                  className={`transition-colors duration-200 ${
                    iconActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              </Button>
            </PopoverTrigger>
          )}
        </InputGroup>
      </div>

      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          mode="single"
          defaultMonth={selected ?? undefined}
          numberOfMonths={1}
          selected={selected ?? undefined}
          onSelect={(date) => {
            // date can be Date | undefined
            handleSelect(date as Date | undefined);
            // inputValue will be updated via selected effect
          }}
          captionLayout="dropdown"
          startMonth={startMonth}
          endMonth={endMonth}
        />
      </PopoverContent>
    </Popover>
  );
}
