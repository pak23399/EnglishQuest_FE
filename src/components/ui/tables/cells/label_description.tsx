import { Link } from 'react-router-dom';

interface Props {
  label?: string | null;
  link?: string | null;
  description?: string | null;
}

export function LabelDescriptionTableCell({ label, description, link }: Props) {
  return (
    <div className="flex flex-col gap-0.5">
      <Link
        className="text-sm font-medium text-mono hover:text-primary mb-px truncate"
        to={link || '#'}
      >
        {label}
      </Link>
      {description && (
        <span className="text-sm text-secondary-foreground font-normal truncate">
          {description}
        </span>
      )}
    </div>
  );
}
