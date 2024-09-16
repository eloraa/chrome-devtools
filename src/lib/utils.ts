import { ClassValue, clsx } from 'clsx';

import { extendTailwindMerge } from 'tailwind-merge';
import { EventEmitter } from './eventEmitter';
import { Emitter } from '@/types/events';

export const twMerge = extendTailwindMerge({
  prefix: '',
});

/**
 * Concatenates and merges the given input class names using tailwindcss utilities.
 *
 * @param {...string} inputs - The input class names to concatenate and merge.
 * @return {string} The concatenated and merged class names.
 */
export function cls(...inputs: string[] | ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  return debounced;
}

export const isValidURL = (url: string) =>
  /^(https?:\/\/)?(([a-z\d]([a-z\d-]*[a-z\d])*\.?)+[a-z]{2,}|(((\d{1,3}\.){3}\d{1,3})))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d]*)?$/i.test(url);

export const eventEmitter: Emitter = new EventEmitter();
