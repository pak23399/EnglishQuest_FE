import { useMemo, useState } from 'react';
import { Funnel } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MultiSelect, type MultiOption } from '@/components/ui/multi-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge, BadgeContainer, BadgeIndicator } from '../../badge';
import { useColumnHeader } from '../providers/column-header-provider';

interface Props {
  options?: MultiOption[];
}

export function ColumnActionMultiSelect({ options }: Props) {
  const { title, column } = useColumnHeader();

  const [open, setOpen] = useState(false);

  // read filter value directly from column. Use a memo that depends on the
  // actual filter value to ensure the UI updates when the filter changes.
  // read the raw filter value once so we can reference it in hook deps
  const rawFilterValue = column.getFilterValue();

  const selectedOptions = useMemo(() => {
    return rawFilterValue as string[] | undefined;
  }, [rawFilterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <BadgeContainer>
          <Button
            mode="icon"
            size="sm"
            variant="ghost"
            className="size-7"
            title={`Lọc ${title}`}
            aria-label={`Lọc ${title}`}
          >
            {/** show funnel in primary color when a filter is active */}
            <Funnel className={cn(selectedOptions ? 'text-primary' : '')} />
            {selectedOptions && (
              <BadgeIndicator align="bottom-right" className="bottom-2">
                <Badge size="xs" shape="circle" variant="destructive">
                  {selectedOptions.length}
                </Badge>
              </BadgeIndicator>
            )}
          </Button>
        </BadgeContainer>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="end">
        <MultiSelect
          title={title}
          options={options ?? []}
          value={selectedOptions}
          open={open}
          onChange={(values) =>
            column.setFilterValue(values?.length ? values : undefined)
          }
        />
      </PopoverContent>
    </Popover>
  );
}
