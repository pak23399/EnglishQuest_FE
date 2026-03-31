export const DATA_CODES = {
  EMPTY: '__NULL__',
} as const;

export function isEmpty(value: any) {
  return (
    value === null ||
    value === undefined ||
    value === DATA_CODES.EMPTY ||
    (typeof value === 'string' && value.trim() === '')
  );
}

export function wrapEmptyCodeString(value: string | null | undefined) {
  if (isEmpty(value)) return DATA_CODES.EMPTY;
  return value as string;
}
