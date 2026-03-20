'use client';

import React, { useMemo, useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CustomSelect, CustomSelectProps, SelectOption } from './custom-select';

export interface SelectSearchProps<T = unknown> extends CustomSelectProps<T> {
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  modal?: boolean;
  trigger?: (option: SelectOption<T> | undefined) => React.ReactNode;
  readOnly?: boolean;
}

export function SelectSearch<T>({
  options = [],
  value,
  placeholder,
  disabled = false,
  className,
  modal,
  onChange,
  trigger = (option) => option?.label,
  readOnly = false,
  ...props
}: SelectSearchProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedValue = options?.find((option) => option.value === value);

  // Memoize trigger node to avoid re-rendering heavy trigger UIs
  const triggerNode = useMemo(() => {
    try {
      return selectedValue ? trigger(selectedValue) : placeholder;
    } catch {
      // If custom trigger throws for undefined data, fall back to label
      return selectedValue?.label ?? placeholder;
    }
    // Only re-evaluate when value, options or trigger change
  }, [selectedValue, trigger, placeholder]);

  const handleChange = (val: string) => {
    onChange?.(val);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild data-slot="select-trigger">
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'justify-between text-foreground data-placeholder:text-muted-foreground font-normal',
            className,
          )}
          disabled={disabled || readOnly}
        >
          <div
            className={cn(
              'flex-1 flex gap-x-2 min-w-0 justify-start items-center truncate',
              !selectedValue && 'text-muted-foreground',
            )}
          >
            {triggerNode}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <CustomSelect
          value={value}
          options={options}
          onChange={handleChange}
          open={open}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
}
