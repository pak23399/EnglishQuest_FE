import { ReactNode } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Option {
  value: string;
  label: string;
  data?: any;
}

interface SimpleSelectProps {
  options?: Array<Option>;
  buildItem?: (option: Option) => ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function SimpleSelect({
  options,
  value,
  onChange,
  disabled,
  placeholder = 'Select an option',
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value.toString()}
            title={opt.label}
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
