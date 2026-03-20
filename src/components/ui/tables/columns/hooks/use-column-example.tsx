import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataGridColumnHeader } from '@/components/ui/tables/data-grid-column-header';
import { ColumnActionMultiSelect } from '../../header-actions/multi-select';

//
// ============================================================================
// FILE PURPOSE
// ============================================================================
//
// This file is a **reference/example** for implementing reusable `useColumn`
// hooks when working with TanStack Table + custom DataGrid components.
//
// ✅ Intended for AI assistants (Copilot/LLM) to learn the pattern and generate
//    new `useColumn` hooks automatically.
//
// ✅ Each `useColumn` hook should:
//   - Have a clear name: `use<Name>Column`
//   - Return a `ColumnDef<T>`
//   - Use `useMemo` to memoize column definition
//   - Define `id`, `accessorFn`, `header`, `cell`, and `meta`
//   - (Optional) Add `filterFn` and `options` for filtering support
//
// ============================================================================
//
// EXAMPLE USAGE:
//
// ```tsx
// const columns = [
//   useNameColumn<Person>({ getName: (row) => row.name }),
//   useJobColumn<Person>({ jobs, getJob: (row) => row.job }),
// ];
//
// const table = useReactTable({ data, columns });
// ```
//
// ============================================================================
//

// --------------------------------------
// Data Models
// --------------------------------------

/** Example entity: Job */
interface Job {
  id: string;
  name: string;
  shortName?: string;
}

/** Example entity: Person */
interface Person {
  name: string;
  job: Job;
}

// --------------------------------------
// Column Hook: Name
// --------------------------------------

/**
 * useNameColumn
 *
 * A simple string-based column.
 *
 * - Input:
 *   - `getName`: function to extract name from row
 * - Output:
 *   - ColumnDef<T> with accessor, header, cell, and meta
 *
 * ✅ No filtering logic
 * ✅ Useful as minimal template for other simple string columns
 */
function useNameColumn<T>({
  getName,
  id = 'name',
  title = 'Name',
}: {
  getName: (row: T) => string;
  id?: string;
  title?: string;
}): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => getName(row),
      header: ({ column }) => (
        <DataGridColumnHeader title={title} column={column} />
      ),
      cell: ({ row }) => getName(row.original),
      meta: { headerTitle: title },
    }),
    [],
  );
}

// --------------------------------------
// Column Hook: Job
// --------------------------------------

/**
 * useJobColumn
 *
 * A relation-based column with **filtering** and **global search** support.
 *
 * @template T - Type of the row data
 *
 * @param jobs   - List of available jobs (for filter dropdown)
 * @param getJob - Function to extract Job object from row
 * @param id     - Column id (default: "job")
 * @param title  - Column header (default: "Job")
 *
 * Features:
 * - **Cell rendering**: shows `job.name` only
 * - **Filtering**: filter dropdown by `job.id`
 * - **Global search (globalFilter)**:
 *   - `accessorFn` returns both `job.name` and `job.shortName`
 *   - → global search matches either value
 *
 * Example:
 * ```ts
 * const jobColumn = useJobColumn<Person>({
 *   jobs,
 *   getJob: (row) => row.job,
 * });
 *
 * // "Software Engineer" with shortName "SE"
 * // Global filter will match both "Software Engineer" and "SE"
 * ```
 */
function useJobColumn<T>({
  jobs,
  getJob,
  id = 'job',
  title = 'Job',
}: {
  jobs: Job[];
  getJob: (row: T) => Job;
  id?: string;
  title?: string;
}): ColumnDef<T> {
  return useMemo<ColumnDef<T>>(
    () => ({
      id,
      accessorFn: (row) => `${getJob(row).name} ${getJob(row).shortName}`,
      header: ({ column }) => (
        <DataGridColumnHeader
          title={title}
          column={column}
          filter={
            <ColumnActionMultiSelect
              options={jobs.map((a) => ({
                label: a.name,
                value: a.id,
              }))}
            />
          }
        />
      ),
      filterFn: (row, _, filterValue) => {
        if (!filterValue || filterValue.length === 0) return true;
        const jobId = getJob(row.original).id;

        // NOTE:
        // jobId is defined as a string in the Job model.
        // However, if the actual data type differs (e.g. number 0 from API),
        // calling filterValue.includes(0) will NOT match filterValue.includes("0").
        // To avoid this mismatch, cast non-string values to string before comparing.
        return filterValue.includes(jobId);
      },
      cell: ({ row }) => getJob(row.original).name,
      meta: { headerTitle: title },
    }),
    [jobs],
  );
}
