import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { debounce } from '@/lib/helpers';
import { Button } from '../button';
import { Input, InputProps } from '../input';

interface Props extends InputProps {
  searchQuery: string | undefined;
  setSearchQuery?: (value: string) => void;
}

export function SearchInput({ searchQuery, setSearchQuery, ...props }: Props) {
  const debouncedRef = useRef<
    (((v: string) => void) & { cancel?: () => void }) | null
  >(null);
  const [localInput, setLocalInput] = useState<string>(searchQuery ?? '');

  // Keep local input in sync when parent-driven search changes
  useEffect(() => {
    setLocalInput(searchQuery ?? '');
  }, [searchQuery]);

  // Create debounced setter once
  useEffect(() => {
    if (setSearchQuery) {
      debouncedRef.current = debounce(
        ((v: string) => setSearchQuery(v)) as (...args: unknown[]) => unknown,
        300,
      ) as unknown as ((v: string) => void) & { cancel?: () => void };
    }
    return () => {
      // cancel pending debounce on unmount
      (debouncedRef.current as any)?.cancel?.();
      debouncedRef.current = null;
    };
  }, [setSearchQuery]);

  return (
    <div className="relative">
      <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
      <Input
        value={localInput}
        onChange={(val) => {
          const v = val ?? '';
          setLocalInput(v);
          debouncedRef.current?.(v);
        }}
        className="ps-9 w-60"
        {...props}
      />
      {localInput && localInput.length > 0 && (
        <Button
          mode="icon"
          variant="ghost"
          className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
          onClick={() => {
            // cancel any pending debounce and clear both local and server search
            (debouncedRef.current as any)?.cancel?.();
            setLocalInput('');
            setSearchQuery?.('');
          }}
        >
          <X />
        </Button>
      )}
    </div>
  );
}
