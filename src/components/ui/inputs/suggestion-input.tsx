'use client';

import { ReactNode, useEffect, useState } from 'react';
import { advancedSearch } from '@/lib/string/string';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input, type InputProps } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Option {
  value: string;
  label: string;
  data?: any;
}

interface SuggestionInputProps extends InputProps {
  options?: Array<Option>;
  buildItem?: (option: Option) => ReactNode;
  searchPlaceholder?: string;
  emptyMessage?: string;
  modal?: boolean;
}

export function SuggestionInput({
  options = [],
  buildItem = (option) => option.label,
  value,
  onChange,
  placeholder,
  emptyMessage = 'Không tìm thấy giá trị',
  modal,
  ...props
}: SuggestionInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState<string>(
    value ? String(value) : '',
  );

  useEffect(() => {
    const newSelected = value ? String(value) : '';
    const label =
      options.find((o) => o.value === newSelected)?.label || newSelected;
    setInputValue(label);
  }, [value, options]);

  const filteredOptions = options.filter((option) =>
    advancedSearch(option.label, inputValue),
  );

  const onInputBlur = () => {
    // Don't close immediately - let setTimeout handle it to allow for command list interaction
    setTimeout(() => {
      // Check if focus has moved to the command list
      if (!document.activeElement?.closest('[cmdk-list]')) {
        setOpen(false);

        // Reset value only if it's not a valid option
        if (!options.some((o) => o.label === inputValue)) {
          onChange?.('');
          setInputValue('');
        }
      }
    }, 150);
  };

  const onSelectItem = (selectedLabel: string) => {
    const option = options.find((o) => o.label === selectedLabel);
    if (option) {
      setInputValue(selectedLabel);
      onChange?.(option.value);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            placeholder={placeholder}
            value={inputValue}
            onChange={(val) => {
              setInputValue(val || '');
              onChange?.(val || '');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false);
              } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                setOpen(true);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            onFocus={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            onBlur={onInputBlur}
            {...props}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <Command shouldFilter={false}>
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onSelect={onSelectItem}
                >
                  {buildItem(option)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
