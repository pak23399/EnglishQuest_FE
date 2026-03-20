import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '../checkbox';
import { Label } from '../label';

export interface CheckboxOptionProps<T = unknown> {
  value: T;
  label: string;
  tooltip?: string;
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean, value: T) => void;
}

export interface CheckboxInputProps<T = unknown> {
  options?: Array<CheckboxOptionProps<T>>;
  renderOption?: (option: CheckboxOptionProps<T>) => ReactNode;
  value?: T[];
  onChange?: (value?: T[]) => void;
  className?: string;
}

export function CheckboxInput<T>({
  options,
  value,
  onChange,
  className,
  renderOption = (option) => <CheckboxOption {...option} />,
}: CheckboxInputProps) {
  return (
    <div role="group" className={cn('flex gap-x-7.5', className)}>
      {options?.map((option) =>
        renderOption({
          ...option,
          checked: value?.includes(option.value),
          onCheckedChange: (checked, selectedValue) => {
            return checked
              ? onChange?.([...(value || []), selectedValue])
              : onChange?.(value?.filter((value) => value !== selectedValue));
          },
        }),
      )}
    </div>
  );
}

export function CheckboxOption<T>({
  value,
  label,
  tooltip,
  disabled,
  checked,
  onCheckedChange,
}: CheckboxOptionProps<T>) {
  return (
    <div className="flex items-center gap-x-1" title={tooltip}>
      <Checkbox
        checked={checked}
        onCheckedChange={(checked: boolean) =>
          onCheckedChange?.(checked, value)
        }
        disabled={disabled}
      />
      <Label className="font-normal">{label}</Label>
    </div>
  );
}
