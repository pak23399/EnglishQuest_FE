import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { wrapEmptyCodeString } from '@/lib/codes/data_codes';
import { UseTableColumnProps } from '@/components/ui/tables/columns/table-column.config';
import { DataGridColumnHeader } from '@/components/ui/tables/data-grid-column-header';
import { CheckBooleanCell } from '../../cells/boolean-cells';
import { ColumnActionMultiSelect } from '../../header-actions/multi-select';

interface Props<T> extends UseTableColumnProps {
  getBoolean: (row: T) => boolean | undefined | null;
  renderCell?: (row: boolean | undefined | null) => React.ReactNode;
  trueLabel?: string;
  falseLabel?: string;
}

export function useBooleanColumn<T>({
  getBoolean,
  id = 'boolean',
  headerTitle = 'Boolean',
  size = 160,
  renderCell = (row) => <CheckBooleanCell value={row} />,
  trueLabel = 'Có',
  falseLabel = 'Không',
}: Props<T>): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => (getBoolean(row) ? 'true' : 'false'),
      header: ({ column }) => (
        <DataGridColumnHeader
          title={headerTitle}
          column={column}
          filter={
            <ColumnActionMultiSelect
              options={[
                { value: 'true', label: trueLabel },
                { value: 'false', label: falseLabel },
              ]}
            />
          }
        />
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        const booleanValue = getBoolean(row.original);
        if (booleanValue === null || booleanValue === undefined) {
          return filterValue.includes(wrapEmptyCodeString(null));
        }
        return filterValue.includes(booleanValue ? 'true' : 'false');
      },
      cell: ({ row }) => renderCell(getBoolean(row.original)),
      meta: {
        headerTitle,
      },
      size: size,
    }),
    [],
  );
}
