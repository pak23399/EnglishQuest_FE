import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';

export const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return 'image.svg';
  if (type.startsWith('video/')) return 'video-1.svg';
  if (type.startsWith('audio/')) return 'music.svg';
  if (type.includes('pdf')) return 'pdf.svg';

  // office files
  if (type.includes('spreadsheetml')) return 'excel.svg';
  if (type.includes('wordprocessingml')) return 'word.svg';
  if (type.includes('presentationml')) return 'ppt.svg';

  if (type.includes('word') || type.includes('doc')) return 'word.svg';
  if (type.includes('excel') || type.includes('sheet')) return 'excel.svg';

  if (type.includes('zip') || type.includes('rar')) return 'zip.svg';
  if (type.includes('json')) return 'json.svg';
  if (type.includes('text')) return 'text.svg';

  return 'text.svg';
};

interface Props extends React.ComponentProps<'img'> {
  fileType: string | null | undefined;
}

export function FileIcon({ fileType, className, ...props }: Props) {
  if (!fileType) return null;

  return (
    <img
      src={toAbsoluteUrl(`/media/file-types/${getFileIcon(fileType)}`)}
      className={cn('h-5', className)}
      {...props}
    />
  );
}
