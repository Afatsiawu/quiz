// eslint-disable-next-line import/no-unresolved
import { clsx } from "clsx";
// eslint-disable-next-line import/no-unresolved
import { twMerge } from "tailwind-merge";

/*
 * Merges Tailwind CSS classes with proper type checking
 * @param inputs - Array of class values to merge
 * @returns Merged class string
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return twMerge(clsx(inputs));
}