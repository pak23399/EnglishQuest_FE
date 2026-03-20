import * as React from 'react';
import { Check } from 'lucide-react';
import { DATA_CODES } from '@/lib/codes/data_codes';
import { getNodeString } from '@/lib/react-node-to-string';
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

type MultiOption = {
  label: React.ReactNode;
  // leaf value. If present, this option is selectable.
  value?: string;
  searchableValue?: string;
  icon?: React.ComponentType<{ className?: string }>;
  tooltip?: string;
  // optional count (similar to faceted counts in DataGridColumnFilter)
  count?: number;
  // nested child options for grouping. If present, this option acts as a group
  // header and is not directly selectable. Groups may be nested to multiple levels.
  options?: MultiOption[];
};

interface MultiSelectProps {
  title?: string;
  placeholder?: string;
  options: MultiOption[];
  value?: string[];
  onChange?: (values: string[] | undefined) => void;
  showEmptyOption?: boolean;
  open?: boolean;
}

/**
 * Helper: collect tất cả label từ node và các con của nó.
 */
function collectLabels(opt: MultiOption): string[] {
  let out: string[] = [getNodeString(opt.label)];
  if (opt.options) {
    for (const c of opt.options) {
      out = out.concat(collectLabels(c));
    }
  }
  return out;
}

/**
 * A reusable MultiSelect component powered by the Command + Popover UI used in
 * DataGridColumnFilter. Labels are ReactNode so consumers can pass rich nodes.
 */
function MultiSelect({
  title,
  placeholder,
  options,
  value,
  onChange,
  showEmptyOption = true,
  open,
}: MultiSelectProps) {
  const selectedValues = new Set(value ?? []);

  // Auto scroll to first selected option when popover opens
  React.useEffect(() => {
    if (open && selectedValues.size > 0) {
      // Wait for the next tick to ensure the DOM is rendered
      setTimeout(() => {
        // Find all command items in the document
        const commandItems = document.querySelectorAll('[cmdk-item]');
        let firstSelectedElement: HTMLElement | null = null;

        // Find the first selected item by checking for bg-primary on the check div
        for (const item of commandItems) {
          const checkDiv = item.querySelector(
            '.flex.h-4.w-4.items-center.justify-center.rounded-sm.border.border-primary.bg-primary',
          );
          if (checkDiv) {
            firstSelectedElement = item as HTMLElement;
            break;
          }
        }

        if (firstSelectedElement) {
          // Find the parent scrollable container
          const commandList = firstSelectedElement.closest(
            '[cmdk-list]',
          ) as HTMLElement;
          if (commandList) {
            // Calculate the scroll position to center the selected item
            const scrollTop =
              firstSelectedElement.offsetTop -
              commandList.clientHeight / 2 +
              firstSelectedElement.offsetHeight / 2;

            commandList.scrollTo({
              top: Math.max(0, scrollTop),
            });
          }
        }
      }, 100);
    }
  }, [open, selectedValues.size]);

  const finalOptions = [
    ...options,
    ...(showEmptyOption
      ? [{ label: '(Không có dữ liệu)', value: DATA_CODES.EMPTY }]
      : []),
  ];

  // Render an option tree recursively.
  const renderOption = (
    option: MultiOption,
    level = 0,
    path: string[] = [],
  ): React.ReactNode => {
    let searchableValue = getNodeString(option.label);
    if (option.searchableValue) {
      searchableValue += ' ' + option.searchableValue;
    }

    const newPath = [...path, searchableValue];
    const filterValue = newPath.join(' ');

    if (option.options && option.options.length > 0) {
      // collect all descendant leaf values
      const collectLeafValues = (opt: MultiOption): string[] => {
        let out: string[] = [];
        if (opt.value) out.push(opt.value);
        if (opt.options) {
          for (const c of opt.options) out = out.concat(collectLeafValues(c));
        }
        return out;
      };

      const leaves = collectLeafValues(option);
      const allSelected =
        leaves.length > 0 && leaves.every((v) => selectedValues.has(v));

      // collect all labels from this node + descendants
      const allLabels = collectLabels(option);

      return (
        <React.Fragment key={filterValue}>
          <MultiSelectItem
            keywords={allLabels}
            option={option}
            isSelected={allSelected}
            level={level}
            value={filterValue}
            onToggle={() => {
              if (leaves.length === 0) return;
              const next = new Set(selectedValues);
              if (allSelected) {
                // remove all descendant leaves
                for (const v of leaves) next.delete(v);
              } else {
                for (const v of leaves) next.add(v);
              }
              const arr = Array.from(next);
              onChange?.(arr.length ? arr : undefined);
            }}
          />
          {option.options.map((child) =>
            renderOption(child, level + 1, newPath),
          )}
        </React.Fragment>
      );
    }

    // leaf node
    const isSelected = option.value ? selectedValues.has(option.value) : false;
    return (
      <MultiSelectItem
        key={filterValue}
        keywords={newPath}
        option={option}
        isSelected={isSelected}
        level={level}
        value={filterValue}
        onToggle={() => {
          if (!option.value) return;
          const next = new Set(selectedValues);
          if (isSelected) next.delete(option.value);
          else next.add(option.value);
          const arr = Array.from(next);
          onChange?.(arr.length ? arr : undefined);
        }}
      />
    );
  };

  return (
    <Command
      filter={(value, search, keywords) => {
        if (advancedSearch(value, search)) return 1;
        if (keywords?.some((k) => advancedSearch(k, search))) return 1;
        return 0;
      }}
    >
      <CommandInput placeholder={placeholder ?? title} />
      <CommandList>
        <CommandEmpty>Không tìm thấy</CommandEmpty>
        <CommandGroup>
          {finalOptions.map((option) => renderOption(option, 0))}
        </CommandGroup>
      </CommandList>

      {selectedValues.size > 0 && (
        <>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              onSelect={() => onChange?.(undefined)}
              className="justify-center text-center text-destructive"
            >
              Xóa Lọc
            </CommandItem>
          </CommandGroup>
        </>
      )}
    </Command>
  );
}

/**
 * Một item hiển thị trong MultiSelect
 */
interface MultiSelectItemProps {
  option: MultiOption;
  isSelected?: boolean;
  onToggle?: () => void;
  level?: number;
  value?: string;
  keywords: string[];
}

function MultiSelectItem({
  option,
  keywords,
  isSelected = false,
  onToggle,
  level = 0,
  value,
}: MultiSelectItemProps) {
  return (
    <CommandItem
      keywords={keywords}
      value={value}
      onSelect={onToggle}
      title={option.tooltip ?? getNodeString(option.label)}
    >
      <div
        style={{ paddingLeft: level * 12 }}
        className="flex w-full items-center"
      >
        <div
          className={cn(
            'me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
            isSelected
              ? 'bg-primary text-primary-foreground'
              : 'opacity-50 [&_svg]:invisible',
          )}
        >
          <Check className="h-4 w-4" />
        </div>
        {option.icon && (
          <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
        )}
        <span className="truncate">{option.label}</span>
        {typeof option.count === 'number' && (
          <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {option.count}
          </span>
        )}
      </div>
    </CommandItem>
  );
}

export { MultiSelect, MultiSelectItem };
export type { MultiSelectProps, MultiOption };
