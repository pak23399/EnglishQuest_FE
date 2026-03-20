import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { UseTableColumnProps } from '@/components/ui/tables/columns/table-column.config';
import { DataGridColumnHeader } from '@/components/ui/tables/data-grid-column-header';

interface Props<T> extends UseTableColumnProps {
  getNumber: (row: T) => number | undefined | null;
  renderCell?: (row: number | undefined | null) => React.ReactNode;
}

export function useNumberColumn<T>({
  getNumber,
  id = 'number',
  headerTitle = 'Number',
  renderCell = (row) => row?.toString(),
  ...props
}: Props<T>): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => getNumber(row),
      header: ({ column }) => (
        <DataGridColumnHeader title={headerTitle} column={column} />
      ),
      cell: ({ row }) => renderCell(getNumber(row.original)),
      meta: {
        headerTitle,
      },
      ...props,
    }),
    [],
  );
}
