'use client';

import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { advancedSearch } from '@/lib/string/string';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export interface SelectOption<T = unknown> {
  value: string;
  label: string;
  tooltip?: string;
  searchableValue?: string;
  data?: T;
}

export interface CustomSelectProps<T = unknown> {
  options?: Array<SelectOption<T>>;
  renderOption?: (option: SelectOption<T>) => ReactNode;
  value: string;
  onChange?: (value: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  enableSearch?: boolean;
  manualFilter?: boolean;
  onSelectOption?: (option: SelectOption<T> | undefined) => void;
  canDeselect?: boolean;
  bottomCommands?: ReactNode;
  open?: boolean;
}

export function CustomSelect<T>({
  options = [],
  renderOption = (option: SelectOption<T>) => option.label,
  value,
  onChange,
  searchPlaceholder = 'Tìm dữ liệu...',
  emptyMessage = 'Không có kết quả',
  enableSearch = true,
  manualFilter = false,
  onSelectOption,
  canDeselect = true,
  bottomCommands,
  open,
}: CustomSelectProps<T>) {
  const [searchValue, setSearchValue] = useState('');

  // Lazy option renderer: only mount heavy custom option UI when the option is visible
  const LazyOption = ({
    option,
    renderOption,
  }: {
    option: SelectOption<T>;
    renderOption: (option: SelectOption<T>) => ReactNode;
  }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      if (typeof IntersectionObserver === 'undefined') {
        setVisible(true);
        return;
      }

      // Use a generous rootMargin so off-screen items are prepared just before they appear
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setVisible(true);
              if (el) observer.unobserve(el);
              break;
            }
          }
        },
        { root: null, rootMargin: '400px' },
      );

      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref} className="w-full">
        {visible ? (
          renderOption(option)
        ) : (
          // lightweight fallback to avoid mounting heavy UIs
          <div className="truncate text-sm text-foreground">{option.label}</div>
        )}
      </div>
    );
  };

  const filteredOptions = useMemo(() => {
    if (manualFilter) return options;
    return options.filter((option) =>
      advancedSearch(
        option.searchableValue || option.label || option.value,
        searchValue,
      ),
    );
  }, [manualFilter, options, searchValue]);

  // Scroll to selected option when popover opens
  useEffect(() => {
    if (open && value) {
      // Wait for the next tick to ensure the DOM is rendered
      setTimeout(() => {
        // Find all command items in the document
        const commandItems = document.querySelectorAll('[cmdk-item]');
        let selectedElement: HTMLElement | null = null;

        // Find the selected item by checking the value
        for (const item of commandItems) {
          const element = item as HTMLElement;
          // Check if this item has the check icon visible (opacity-100)
          const checkIcon = element.querySelector('.text-primary.opacity-100');
          if (checkIcon) {
            selectedElement = element;
            break;
          }
        }

        if (selectedElement) {
          // Find the parent scrollable container
          const commandList = selectedElement.closest(
            '[cmdk-list]',
          ) as HTMLElement;
          if (commandList) {
            // Calculate the scroll position to center the selected item
            const scrollTop =
              selectedElement.offsetTop -
              commandList.clientHeight / 2 +
              selectedElement.offsetHeight / 2;

            commandList.scrollTo({
              top: Math.max(0, scrollTop),
            });
          }
        }
      }, 100);
    }
  }, [open, value]);

  return (
    <Command shouldFilter={false}>
      {enableSearch && (
        <CommandInput
          placeholder={searchPlaceholder}
          className="h-9"
          value={searchValue}
          onValueChange={setSearchValue}
        />
      )}
      <CommandList>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
        <CommandGroup>
          {filteredOptions?.map((option) => (
            <CommandItem
              key={option.value}
              value={option.searchableValue || option.label || option.value}
              onSelect={() => {
                const isSameValue = option.value === value;
                if (isSameValue && !canDeselect) return;
                onChange?.(isSameValue ? '' : option.value);
                onSelectOption?.(isSameValue ? undefined : option);
              }}
            >
              <Check
                className={cn(
                  'text-primary',
                  value === option.value ? 'opacity-100' : 'opacity-0',
                )}
              />
              {/* Render a lightweight placeholder and only mount heavy option UI when visible */}
              <LazyOption option={option} renderOption={renderOption} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      {bottomCommands && (
        <>
          <CommandSeparator />
          <CommandGroup>{bottomCommands}</CommandGroup>
        </>
      )}
    </Command>
  );
}
