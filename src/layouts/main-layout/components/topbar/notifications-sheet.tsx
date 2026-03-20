import { ReactNode } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function NotificationsSheet({ trigger }: { trigger: ReactNode }) {
  // TODO: Implement EnglishQuest notifications system
  const notis: any[] = [];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="p-0 gap-0 sm:w-[500px] inset-5 start-auto h-sheet flex flex-col rounded-lg sm:max-w-none [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="mb-0">
          <SheetTitle className="flex px-5 py-3 gap-x-4 items-center">
            <span>Notifications</span>
          </SheetTitle>
        </SheetHeader>
        <SheetBody className="flex h-full w-full items-center justify-center pb-12 p-0 border-t border-border">
          <div className="flex flex-col justify-center gap-y-5 font-medium text-muted-foreground">
            <img
              src={toAbsoluteUrl(
                '/media/illustrations/empty-states/empty-notifications.svg',
              )}
              className="max-h-illustration"
              alt="No notifications"
            />
            <div>No notifications !yet</div>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
