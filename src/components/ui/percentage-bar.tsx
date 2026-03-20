'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { BadgeDot } from './badge';

export interface PercentageBarItem {
  label: string;
  value: number; // 0 - 100
  color?: string; // Optional color for the bar
}

const Context = React.createContext<{
  items: PercentageBarItem[];
  total: number;
}>({ items: [], total: 0 });

interface PercentageBarProps {
  items: PercentageBarItem[];
  showZeroValues?: boolean;
  emptyState?: React.ReactNode;
}

export function PercentageBar({
  items,
  className,
  showZeroValues = false,
  emptyState = 'Không có dữ liệu',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & PercentageBarProps) {
  const filteredItems = React.useMemo(() => {
    if (showZeroValues) return items;
    return items.filter((item) => item.value > 0);
  }, [items, showZeroValues]);

  if (filteredItems.length === 0) {
    return (
      <div className="flex-1 items-center justify-center text-center text-secondary-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <Context.Provider
      value={{
        items: filteredItems,
        total: filteredItems.reduce((acc, item) => acc + item.value, 0),
      }}
    >
      <div className={cn('flex-1 flex flex-col gap-4', className)} {...props}>
        <div className="flex items-stretch space-x-1 h-2">
          {filteredItems.map((item, index) => (
            <PercentageBarElement key={index} index={index} />
          ))}
        </div>
        <div className="flex items-start gap-7.5">
          {filteredItems.map((item, index) => (
            <PercentageBarLabel key={index} index={index} />
          ))}
        </div>
      </div>
    </Context.Provider>
  );
}

export function PercentageBarElement({ index }: { index: number }) {
  const { items, total } = React.useContext(Context);
  const { value, color } = items[index];
  const percent = (value / total) * 100;

  return (
    <div
      className={`w-full max-w-[${percent}%] rounded-xs ${color}`}
      style={{ flexBasis: `${percent}%` }}
    />
  );
}

export function PercentageBarLabel({ index }: { index: number }) {
  const { items, total } = React.useContext(Context);
  const { label, color, value } = items[index];
  const percent = (value / total) * 100;

  return (
    <div key={index} className="flex items-baseline gap-1.5">
      <BadgeDot className={cn('size-2', color)} />
      <span className="text-sm font-normal text-foreground">
        <span className="font-medium">{value}</span> {label} (
        {percent.toFixed(0)}%)
      </span>
    </div>
  );
}
