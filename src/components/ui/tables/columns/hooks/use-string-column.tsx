import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { UseTableColumnProps } from '@/components/ui/tables/columns/table-column.config';
import { DataGridColumnHeader } from '@/components/ui/tables/data-grid-column-header';

interface Props<T> extends UseTableColumnProps {
  getString: (row: T) => string | undefined | null;
  renderCell?: (row: string | undefined | null) => React.ReactNode;
}

export function useStringColumn<T>({
  getString,
  id = 'string',
  headerTitle = 'String',
  renderCell = (row) => row?.toString(),
}: Props<T>): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => getString(row),
      header: ({ column }) => (
        <DataGridColumnHeader title={headerTitle} column={column} />
      ),
      cell: ({ row }) => renderCell(getString(row.original)),
      meta: {
        headerTitle,
      },
    }),
    [],
  );
}
