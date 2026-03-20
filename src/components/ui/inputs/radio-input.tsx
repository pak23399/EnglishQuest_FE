import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from '../label';
import { RadioGroup, RadioGroupItem } from '../radio-group';

export interface RadioOptionProps {
  value: string;
  label: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface RadioInputProps {
  options?: Array<RadioOptionProps>;
  renderOption?: (option: RadioOptionProps) => ReactNode;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function RadioInput({
  options,
  value,
  onChange,
  className,
  renderOption = (option) => <RadioOption {...option} />,
}: RadioInputProps) {
  return (
    <RadioGroup
      value={value}
      className={cn('flex items-center gap-5', className)}
      onValueChange={onChange}
    >
      {options?.map((option) => renderOption(option))}
    </RadioGroup>
  );
}

export function RadioOption({
  value,
  label,
  tooltip,
  disabled,
}: RadioOptionProps) {
  return (
    <div className="flex items-center gap-x-2" title={tooltip}>
      <RadioGroupItem value={value} id={value} disabled={disabled} />
      <Label htmlFor={value}>{label}</Label>
    </div>
  );
}
