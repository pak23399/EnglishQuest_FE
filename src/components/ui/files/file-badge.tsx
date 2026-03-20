import { IFile } from '@/models/file.model';
import { LoaderCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDownloadFileMutation } from '@/hooks/queries/system/use-file-query';
import { Card } from '../card';
import { FileIcon } from './file-icon';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  file: Partial<IFile> | undefined | null;
}

export function FileBadge({ file, className, ...props }: Props) {
  const { mutate: downloadFile, isLoading } = useDownloadFileMutation();

  if (!file) return null;

  return (
    <Card
      className={cn(
        'shadow-none flex items-center flex-row gap-1.5 p-2.5 rounded-lg bg-muted/70 max-w-fit',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <LoaderCircleIcon className="animate-spin text-secondary-foreground" />
      ) : (
        <FileIcon fileType={file.type} />
      )}
      <span
        className={cn(
          'hover:text-primary font-medium text-secondary-foreground text-xs me-1',
          !isLoading && 'cursor-pointer',
        )}
        onClick={() => file.id && !isLoading && downloadFile(file.id)}
      >
        {file.name}
      </span>
      {/* <span className="font-medium text-muted-foreground text-xs">
      Edited 39 mins ago
    </span> */}
    </Card>
  );
}
