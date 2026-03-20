import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns/format';
import { UseTableColumnProps } from '@/components/ui/tables/columns/table-column.config';
import { DataGridColumnHeader } from '@/components/ui/tables/data-grid-column-header';

interface Props<T> extends UseTableColumnProps {
  getDate: (row: T) => Date | undefined | null;
  renderCell?: (row: Date | undefined | null) => React.ReactNode;
}

const DefaultCell = ({ row }: { row: Date | undefined | null }) => {
  const date = row ? format(row, 'dd/MM/yyyy') : '';
  return <span>{date}</span>;
};

export function useDateColumn<T>({
  getDate,
  id = 'date',
  headerTitle = 'Date',
  renderCell = (row) => <DefaultCell row={row} />,
}: Props<T>): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => getDate(row),
      header: ({ column }) => (
        <DataGridColumnHeader title={headerTitle} column={column} />
      ),
      cell: ({ row }) => renderCell(getDate(row.original)),
      meta: {
        headerTitle,
      },
    }),
    [],
  );
}
