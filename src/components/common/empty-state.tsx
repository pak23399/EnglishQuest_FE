import { toAbsoluteUrl } from '@/lib/helpers';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  description?: string;
}

export function EmptyState({
  src,
  description = 'Không có dữ liệu!',
  ...props
}: Props) {
  return (
    <div
      className="flex flex-col gap-y-5 text-muted-foreground px-6 py-10 items-center"
      {...props}
    >
      <img
        src={toAbsoluteUrl(`/media/illustrations/empty-states/${src}`)}
        className="max-h-illustration"
        alt="image"
      />
      <div>{description}</div>
    </div>
  );
}
