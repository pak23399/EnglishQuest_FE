import { createContext, ReactNode, useContext } from 'react';
import { Column } from '@tanstack/react-table';

interface ColumnHeaderContextType<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
}

const ColumnHeaderContext = createContext<ColumnHeaderContextType<
  any,
  any
> | null>(null);

interface ColumnHeaderProviderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  children: ReactNode;
}

function ColumnHeaderProvider<TData, TValue>({
  column,
  title,
  children,
}: ColumnHeaderProviderProps<TData, TValue>) {
  return (
    <ColumnHeaderContext.Provider value={{ column, title }}>
      {children}
    </ColumnHeaderContext.Provider>
  );
}

function useColumnHeader<TData, TValue>(): ColumnHeaderContextType<
  TData,
  TValue
> {
  const context = useContext(ColumnHeaderContext);
  if (!context) {
    throw new Error(
      'useColumnHeader must be used within a ColumnHeaderProvider',
    );
  }
  return context;
}

export { ColumnHeaderProvider, useColumnHeader, type ColumnHeaderContextType };
