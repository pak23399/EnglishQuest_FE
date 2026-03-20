import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

interface Props {
  title?: string;
  className?: string;
}

export function PageContentNotFound({
  title = 'Không tìm thấy dữ liệu!',
  className,
}: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-center grow w-full h-full pb-[var(--header-height)]',
        className,
      )}
    >
      <div className="flex flex-col gap-y-5 text-secondary-foreground px-6 py-10 items-center">
        <img
          src={toAbsoluteUrl(
            '/media/illustrations/empty-states/empty-result.svg',
          )}
          className="max-h-illustration"
          alt="image"
        />
        <div>{title}</div>
      </div>
    </div>
  );
}
