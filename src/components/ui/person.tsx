import React from 'react';
import { Link } from 'react-router-dom';
import { getAvatarFallback } from '@/lib/string/avatar-fallback';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

interface PersonProps {
  imageUrl: string;
  name: string;
  link?: string | null;
  description?: React.ReactNode;
  openInNewTab?: boolean;
}

export function Person({
  imageUrl,
  name,
  description,
  link,
  openInNewTab = false,
}: PersonProps) {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="rounded-full size-9 shrink-0">
        <AvatarImage src={imageUrl} />
        <AvatarFallback>{getAvatarFallback(name)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <span className="text-sm font-medium text-mono hover:text-primary mb-px block w-full truncate">
          <Link
            to={link || '#'}
            target={openInNewTab ? '_blank' : undefined}
            rel={openInNewTab ? 'noopener noreferrer' : undefined}
          >
            {name}
          </Link>
        </span>

        {description && (
          <div className="text-sm text-secondary-foreground font-normal block w-full truncate">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}
