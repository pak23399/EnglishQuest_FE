import { useEffect, useMemo, useState } from 'react';
import { PaginationState, RowSelectionState } from '@tanstack/react-table';
import { useSearchParams } from 'react-router-dom';

type UseTableHelperResult<T> = {
  pagination: PaginationState;
  // Accept either a direct value or an updater function to match OnChangeFn<T>
  setPagination: (
    p: PaginationState | ((old: PaginationState) => PaginationState),
  ) => void;
  searchQuery: string;
  setSearchQuery: (s: string | ((old: string) => string)) => void;
  rowSelection: RowSelectionState;
  setRowSelection: (
    r: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) => void;
  data: T[]; // the paginated (and searched) slice
};

/**
 * useTableHelper
 * - manages pagination and search state for a client-side table
 * - optionally syncs state to URL query params: page, pageSize, search
 * - automatically corrects pageIndex when it falls outside the range of the data
 */
export function useTableHelper<T>({
  data,
  syncWithUrl = true,
  defaultPageSize = 5,
}: {
  data: T[] | undefined;
  syncWithUrl?: boolean;
  defaultPageSize?: number;
}): UseTableHelperResult<T> {
  const dataArray = useMemo(() => data || [], [data]);

  const [searchParams, setSearchParams] = useSearchParams();

  // init from URL when syncWithUrl is true - use lazy initialization to ensure these only run once
  const [pagination, setPaginationState] = useState<PaginationState>(() => {
    if (!syncWithUrl) {
      return { pageIndex: 0, pageSize: defaultPageSize };
    }
    const p = searchParams.get('page');
    const s = searchParams.get('pageSize');
    const pageIndex = p ? Math.max(0, Number.parseInt(p, 10) - 1) : 0;
    const pageSize = s ? Math.max(1, Number.parseInt(s, 10)) : defaultPageSize;
    return { pageIndex, pageSize };
  });

  const [searchQuery, setSearchState] = useState<string>(() => {
    if (!syncWithUrl) return '';
    return searchParams.get('search') || '';
  });

  const [rowSelection, setRowSelectionState] = useState<RowSelectionState>({});

  // helpers to update state (wrap to keep function identity stable)
  const setPagination = (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    setPaginationState((cur) => {
      const next =
        typeof updater === 'function'
          ? (updater as (old: PaginationState) => PaginationState)(cur)
          : updater;

      // Sync only this value to URL when requested
      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(next.pageIndex + 1));
        params.set('pageSize', String(next.pageSize));
        const nextStr = params.toString();
        if (nextStr !== searchParams.toString()) {
          setSearchParams(params, { replace: true });
        }
      }

      return next;
    });
  };

  const setSearchQuery = (s: string | ((old: string) => string)) => {
    setSearchState((cur) => {
      const next =
        typeof s === 'function' ? (s as (old: string) => string)(cur) : s;

      // Reset page về 0 khi search query thay đổi
      if (next !== cur) {
        setPaginationState((prevPagination) => ({
          ...prevPagination,
          pageIndex: 0,
        }));
      }

      if (syncWithUrl) {
        const params = new URLSearchParams(searchParams.toString());
        if (next) {
          params.set('search', next);
        } else {
          params.delete('search');
        }
        // Reset page về 1 trong URL khi search thay đổi
        if (next !== cur) {
          params.set('page', '1');
        }
        const nextStr = params.toString();
        if (nextStr !== searchParams.toString()) {
          setSearchParams(params, { replace: true });
        }
      }
      return next;
    });
  };

  const setRowSelection = (
    r: RowSelectionState | ((old: RowSelectionState) => RowSelectionState),
  ) => {
    setRowSelectionState((cur) =>
      typeof r === 'function'
        ? (r as (old: RowSelectionState) => RowSelectionState)(cur)
        : r,
    );
  };

  // URL sync is handled inside individual setters (setPagination/setSearch)

  // If the URL changes externally (back/forward navigation), sync state from URL
  // Track previous URL to detect external changes only
  const [prevUrl, setPrevUrl] = useState(() => searchParams.toString());

  useEffect(() => {
    if (!syncWithUrl) return;

    const currentUrl = searchParams.toString();

    // Only sync from URL if it changed externally (not by our setters)
    // Our setters use { replace: true } so navigation stack doesn't grow
    if (currentUrl === prevUrl) return;

    setPrevUrl(currentUrl);

    const p = searchParams.get('page');
    const s = searchParams.get('pageSize');
    const q = searchParams.get('search') || '';

    const pageIndex = p ? Math.max(0, Number.parseInt(p, 10) - 1) : 0;
    const pageSize = s ? Math.max(1, Number.parseInt(s, 10)) : defaultPageSize;

    // Only update when different to avoid loops
    setPaginationState((cur) => {
      if (cur.pageIndex !== pageIndex || cur.pageSize !== pageSize) {
        return { pageIndex, pageSize };
      }
      return cur;
    });
    setSearchState((cur) => (cur !== q ? q : cur));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), syncWithUrl]);

  // auto-correct pageIndex when out of range (based on raw data length).
  // Only run when data length actually changes to avoid resetting page on refetch.
  const [prevDataLength, setPrevDataLength] = useState(dataArray.length);
  const { pageIndex: currentPageIndex, pageSize: currentPageSize } = pagination;

  useEffect(() => {
    const currentLength = dataArray.length;

    // Only auto-correct if data length has actually changed
    if (currentLength !== prevDataLength) {
      setPrevDataLength(currentLength);

      const maxPageIndex = Math.max(
        0,
        Math.ceil(currentLength / currentPageSize) - 1,
      );

      // Only reset if current page is truly out of range
      if (currentPageIndex > maxPageIndex) {
        setPaginationState((cur) => ({ ...cur, pageIndex: maxPageIndex }));
      }
    }
  }, [dataArray.length, currentPageIndex, currentPageSize, prevDataLength]);

  return {
    pagination,
    setPagination,
    searchQuery,
    setSearchQuery,
    rowSelection,
    setRowSelection,
    data: dataArray,
  };
}

export default useTableHelper;
