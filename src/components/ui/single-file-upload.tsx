'use client';

import * as React from 'react';
import { IFile } from '@/models/file.model';
import { Download, LoaderCircleIcon, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { formatBytes } from '@/lib/byte';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { downloadFileApi } from '@/services/file.service';
import { Button } from './button';
import { FileIcon } from './files/file-icon';

interface Props
  extends Omit<React.ComponentProps<'div'>, 'value' | 'onChange'> {
  maxSize?: number;
  value?: File | IFile | null;
  onChange?: (file: File | null) => void;
  onDownload?: (file: IFile) => void;
  readOnly?: boolean;
}

export function SingleFileUpload({
  className,
  maxSize,
  value,
  onChange,
  readOnly = false,
}: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      if (readOnly) return;
      if (files && files.length > 0) {
        const f = files[0];
        onChange?.(f);
      }
    },
    disabled: readOnly,
  });

  const hasFile = value !== null && value !== undefined;

  const { mutate: downloadFile, status: downloadFileStatus } = useMutation({
    mutationFn: downloadFileApi,
    onSuccess: () => {
      console.log('Mutation Success'); // Log success
      showToast({
        mode: 'success',
        message: 'Tải file thành công!',
      });
    },
    onError: (error) => {
      console.error('Mutation Error:', error); // Log error
      showToast({
        mode: 'destructive',
        message: 'Tải file thất bại!',
      });
    },
  });

  const buildFileInputContent = () => {
    if (hasFile) {
      return (
        <>
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors',
              isDragActive
                ? 'border-primary bg-primary/10'
                : 'border-muted-foreground/25',
            )}
          >
            <div className="not-[]:size-8 flex items-center justify-center">
              <FileIcon fileType={value.type} />
              {}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm flex items-center gap-x-1">
              <span className="font-medium truncate">{value.name} </span>
              <span className="">({formatBytes(value.size)})</span>
              {!(value instanceof File) && (
                <Button
                  mode="icon"
                  variant="outline"
                  size="sm"
                  className="ml-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault(); // quan trọng khi dropzone lắng nghe cả click
                    downloadFile(value.id);
                  }}
                  onMouseDown={(e) => e.stopPropagation()} // chặn ngay từ đầu
                  disabled={downloadFileStatus === 'loading'}
                >
                  {downloadFileStatus === 'loading' ? (
                    <LoaderCircleIcon
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Download />
                  )}
                </Button>
              )}
            </p>

            {/* {maxSize && (
              <p className="text-xs text-muted-foreground">
                Maximum file size: {formatBytes(maxSize)}
              </p>
            )} */}
          </div>
        </>
      );
    }

    return (
      <>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors',
            isDragActive
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25',
          )}
        >
          <Upload className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Nhấn để chọn hoặc kéo thả file vào đây
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Tối đa: {formatBytes(maxSize)}
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <div
      {...getRootProps({
        onClick: (e: React.MouseEvent) => {
          if (readOnly) {
            e.stopPropagation();
            e.preventDefault();
          }
        },
      })}
      className={cn(
        'relative rounded-lg border border-dashed p-6 text-center transition-colors',
        // only show hover and pointer when editable
        isDragActive
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25',
        hasFile ? 'border-success' : '',
        readOnly
          ? 'border-muted-foreground/50 cursor-not-allowed'
          : 'hover:border-primary cursor-pointer',
        className,
      )}
    >
      <input {...getInputProps()} className="sr-only" disabled={readOnly} />

      <div className="flex flex-col items-center gap-4">
        {buildFileInputContent()}
      </div>
    </div>
  );
}
