import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  icon?: React.ReactElement<{ className?: string }>;
  label: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  line: boolean;
  removeSpace?: boolean;
}

export function TimelineItem({
  line,
  icon,
  label,
  description,
  children,
  removeSpace,
}: TimelineItemProps) {
  return (
    <div className="flex items-start relative">
      {line && (
        <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>
      )}
      <div className="flex items-center justify-center shrink-0 rounded-full bg-accent/60 border border-input size-9 text-secondary-foreground">
        {icon &&
          React.cloneElement(icon, {
            className: cn('size-4 text-base', icon.props.className),
          })}
      </div>
      <div
        className={`flex flex-col gap-y-2.5 ps-2.5 ${!removeSpace ? 'mb-7' : ''} text-base grow`}
      >
        <div className="flex flex-col">
          <div className="text-sm text-foreground font-medium">{label}</div>
          <span className="text-xs text-secondary-foreground">
            {description}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
