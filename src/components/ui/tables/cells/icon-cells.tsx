import React from 'react';
import { cn } from '@/lib/utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactElement<{ className?: string }>;
}

export function IconCell({ icon, className, children, ...props }: Props) {
  return (
    <div {...props} className={cn('flex items-center gap-x-2', className)}>
      {icon &&
        React.cloneElement(icon, {
          className: cn(
            'size-4 shrink-0 text-muted-foreground',
            icon.props.className,
          ),
        })}
      {children}
    </div>
  );
}
