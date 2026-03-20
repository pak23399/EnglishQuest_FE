import { format } from 'date-fns';

export function formatDateServer(date: Date) {
  return format(date, 'yyyy-MM-dd');
}
