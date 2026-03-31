import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Gets the display name for a subscription plan.
 *
 * @param planNumber - The plan number (0 = Free, 1 = Support, 2 = Premium)
 * @returns The display name of the plan
 */
export function getPlanDisplayName(planNumber: number): string {
  switch (planNumber) {
    case 0:
      return 'Free';
    case 1:
      return 'Support';
    case 2:
      return 'Premium';
    default:
      return `Plan ${planNumber}`;
  }
}
