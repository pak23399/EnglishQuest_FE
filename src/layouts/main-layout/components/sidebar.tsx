import { useRef } from 'react';
import { ChevronFirst } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings } from '@/providers/settings-provider';
import { Button } from '@/components/ui/button';
import { SidebarHeader } from './sidebar-header';
// import { SidebarMenu } from './sidebar-menu';

export function Sidebar() {
  const parentRef = useRef<HTMLDivElement>(null);
  const { settings, storeOption } = useSettings();

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  return (
    <div
      ref={parentRef}
      className="relative sidebar bg-background lg:border-e lg:border-border lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:flex flex-col items-stretch shrink-0 gap-y-7.5 py-5 px-5"
    >
      <SidebarHeader />
      {/* <SidebarMenu /> */}
      <Button
        onClick={handleToggleClick}
        size="sm"
        mode="icon"
        variant="outline"
        className={cn(
          'size-7 absolute start-full top-7.5 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4',
          settings.layouts.demo1.sidebarCollapse
            ? 'ltr:rotate-180'
            : 'rtl:rotate-180',
        )}
      >
        <ChevronFirst className="!size-4" />
      </Button>
    </div>
  );
}
