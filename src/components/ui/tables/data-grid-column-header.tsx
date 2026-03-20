import { HTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, PinOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { type MultiOption } from '@/components/ui/multi-select';
import { useDataGrid } from '@/components/ui/tables/data-grid';
import { ColumnHeaderProvider } from './providers/column-header-provider';

interface DataGridColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title?: string;
  icon?: ReactNode;
  pinnable?: boolean;
  filter?: ReactNode;
  options?: MultiOption[];
  visibility?: boolean;
}

function DataGridColumnHeader<TData, TValue>({
  column,
  title = '',
  icon,
  className,
  filter,
  visibility = false,
  options,
}: DataGridColumnHeaderProps<TData, TValue>) {
  const { isLoading, props, recordCount } = useDataGrid();

  // Column move/pinning helpers were part of the previous dropdown UI.
  // If needed in future, reintroduce move/visibility controls here.

  const headerLabel = () => {
    return (
      <div
        className={cn(
          'flex-1 text-accent-foreground font-normal flex items-center gap-1.5 min-w-0 text-[0.8125rem] leading-[calc(1.125/0.8125)] [&_svg]:size-3.5 [&_svg]:opacity-60',
          className,
        )}
      >
        {icon && <span className="me-2 shrink-0">{icon}</span>}
        <span className="truncate">{title}</span>
      </div>
    );
  };

  // Sort button: cycles between default -> asc -> desc -> default
  const SortButton = () => {
    const handleClick = () => {
      const isSorted = column.getIsSorted();
      if (isSorted === 'asc') {
        column.toggleSorting(true);
      } else if (isSorted === 'desc') {
        column.clearSorting();
      } else {
        column.toggleSorting(false);
      }
    };

    return (
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className="size-7"
        title={`Sắp xếp ${title}`}
        aria-label={`Sắp xếp ${title}`}
        disabled={isLoading || recordCount === 0 || !column.getCanSort()}
        onClick={handleClick}
      >
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ArrowDown className="size-3.5 ! text-primary" />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowUp className="size-3.5 ! text-primary" />
          ) : (
            <ChevronsUpDown className="!size-3.5" />
          ))}
      </Button>
    );
  };

  const headerPin = () => {
    return (
      <Button
        mode="icon"
        size="sm"
        variant="ghost"
        className="-me-1 size-7 rounded-md"
        onClick={() => column.pin(false)}
        aria-label={`Unpin ${title} column`}
        title={`Unpin ${title} column`}
      >
        <PinOff className="!size-3.5! opacity-50" aria-hidden="true" />
      </Button>
    );
  };

  const headerControls = () => {
    const [open, setOpen] = useState(false);

    const selectedOptions = useMemo(() => {
      return column.getFilterValue() as string[];
    }, [column.getFilterValue()]);

    return (
      <div className="flex items-center h-full gap-1.5">
        {headerLabel()}

        <div className="flex gap-x-0">
          {/* Sort button */}
          <SortButton />
          {filter}
        </div>

        {props.tableLayout?.columnsPinnable &&
          column.getCanPin() &&
          column.getIsPinned() &&
          headerPin()}
      </div>
    );
  };

  const getContent = () => {
    if (
      props.tableLayout?.columnsMovable ||
      (props.tableLayout?.columnsVisibility && visibility) ||
      (props.tableLayout?.columnsPinnable && column.getCanPin()) ||
      filter
    ) {
      return headerControls();
    }

    if (
      column.getCanSort() ||
      (props.tableLayout?.columnsResizable && column.getCanResize())
    ) {
      return (
        <div className="flex items-center h-full gap-1.5">
          {headerLabel()}
          <SortButton />
          {props.tableLayout?.columnsPinnable &&
            column.getCanPin() &&
            column.getIsPinned() &&
            headerPin()}
        </div>
      );
    }

    return headerLabel();
  };

  return (
    <ColumnHeaderProvider column={column} title={title}>
      {getContent()}
    </ColumnHeaderProvider>
  );
}

export { DataGridColumnHeader, type DataGridColumnHeaderProps };
