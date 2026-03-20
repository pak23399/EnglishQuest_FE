import { useCallback, useEffect, useRef } from 'react';
import {
  getCoreRowModel as defaultGetCoreRowModel,
  FilterFn,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  RowModel,
  Table,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { wrapEmptyCodeString } from '@/lib/codes/data_codes';
import { advancedSearch } from '@/lib/string/string';

interface DefaultTableOptions<TData>
  extends Omit<TableOptions<TData>, 'getCoreRowModel'> {
  getCoreRowModel?: (table: Table<unknown>) => () => RowModel<unknown>;
  filterFns?: {
    multiSelectOr: FilterFn<TData>;
    [key: string]: FilterFn<TData>;
  };
}

// Hook bọc callback để tránh gọi setState sau khi component đã unmount
function useSafeCallback<T extends (...args: any[]) => void>(
  cb?: T,
): T | undefined {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return useCallback(
    ((...args: any[]) => {
      if (mounted.current && cb) {
        cb(...args);
      }
    }) as T,
    [cb],
  );
}

export function useDefaultTable<TData extends RowData>({
  data,
  columns,
  state,
  filterFns,
  onPaginationChange,
  onRowSelectionChange,
  onGlobalFilterChange,
  getCoreRowModel,
  ...options
}: DefaultTableOptions<TData>) {
  const table = useReactTable<TData>({
    data,
    columns,
    state,
    defaultColumn: {
      size: 200,
      minSize: 50,
      enableResizing: true,
    },
    autoResetPageIndex: false, // Không tự động reset page index khi data thay đổi
    enableSorting: true,
    enableColumnResizing: true,
    enableRowSelection: !!onRowSelectionChange,
    enableGlobalFilter: !!onGlobalFilterChange,
    globalFilterFn: vietnameseIncludesString,
    filterFns: {
      multiSelectOr,
      vietnameseIncludesString,
      ...filterFns,
    },
    columnResizeMode: 'onChange',
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: useSafeCallback(onPaginationChange),
    onRowSelectionChange: useSafeCallback(onRowSelectionChange),
    onGlobalFilterChange: useSafeCallback(onGlobalFilterChange),
    getCoreRowModel: getCoreRowModel ?? defaultGetCoreRowModel(),
    ...options,
  });

  // Reset page to 0 when column filters change
  // Track both external state and internal state
  const prevColumnFilters = useRef(state?.columnFilters);
  const prevInternalColumnFilters = useRef(table.getState().columnFilters);

  // Extract table column filters to a variable to avoid complex expression in deps
  const tableColumnFilters = table.getState().columnFilters;

  useEffect(() => {
    // Check external columnFilters state first
    const currentColumnFilters = state?.columnFilters;
    const prevFilters = prevColumnFilters.current;

    if (currentColumnFilters !== undefined) {
      // If external columnFilters is managed, use that
      const hasFiltersChanged =
        JSON.stringify(prevFilters) !== JSON.stringify(currentColumnFilters);

      if (hasFiltersChanged && onPaginationChange) {
        const hasActiveFilters = currentColumnFilters.length > 0;
        const hadActiveFilters = prevFilters && prevFilters.length > 0;

        if (hasActiveFilters || hadActiveFilters) {
          onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
        }
      }

      prevColumnFilters.current = currentColumnFilters;
    } else {
      // If external columnFilters is not managed, check internal state
      const currentInternalFilters = tableColumnFilters;
      const prevInternalFilters = prevInternalColumnFilters.current;

      const hasInternalFiltersChanged =
        JSON.stringify(prevInternalFilters) !==
        JSON.stringify(currentInternalFilters);

      if (hasInternalFiltersChanged && onPaginationChange) {
        const hasActiveFilters = currentInternalFilters.length > 0;
        const hadActiveFilters =
          prevInternalFilters && prevInternalFilters.length > 0;

        if (hasActiveFilters || hadActiveFilters) {
          onPaginationChange((prev) => ({ ...prev, pageIndex: 0 }));
        }
      }

      prevInternalColumnFilters.current = currentInternalFilters;
    }
  }, [state?.columnFilters, tableColumnFilters, onPaginationChange]);

  return table;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const multiSelectOr: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue || filterValue.length === 0) return true;
  const cellValue = wrapEmptyCodeString(
    row.getValue<string | undefined | null>(columnId),
  );
  return filterValue.some((v: string) => advancedSearch(cellValue, v));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const vietnameseIncludesString: FilterFn<any> = (
  row,
  columnId,
  filterValue,
) => {
  const value = row.getValue<string>(columnId);
  return advancedSearch(value, filterValue);
};
