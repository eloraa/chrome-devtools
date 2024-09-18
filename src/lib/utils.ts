import { ClassValue, clsx } from 'clsx';

import { extendTailwindMerge } from 'tailwind-merge';
import { EventEmitter } from './eventEmitter';
import { Emitter } from '@/types/events';
import { ConsoleLogParams, LogType, StackTrace } from '@/types';

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

export function getStackTrace(): StackTrace {
  try {
    throw new Error();
  } catch (e) {
    if (e instanceof Error && e.stack) {
      return {
        callFrames: e.stack
          .split('\n')
          .slice(1)
          .map((line: string, index: number) => ({
            functionName: line.trim(),
            lineNumber: index,
          })),
      };
    }
    return { callFrames: [] };
  }
}

export function formatLogs(type: LogType, args: unknown[], stackTrace: StackTrace | null = null): string {
  const logParams: ConsoleLogParams = {
    type: type,
    args: args.map(arg => {
      if (arg instanceof Error) {
        return {
          type: 'object',
          subtype: 'error',
          description: arg.stack || arg.message,
          className: arg.name,
        };
      }
      return {
        type: typeof arg,
        value: arg,
      };
    }),
    stackTrace: stackTrace || { callFrames: [] },
    timestamp: Date.now(),
  };

  return JSON.stringify({ method: 'Runtime.consoleAPICalled', params: logParams }, null, 2);
}

export const adjustHSL = (hsl: string, lightnessAdjustment: number, hueAdjustment?: number): string => {
  const [h, s, l] = hsl.split(' ');
  let hue = parseFloat(h);
  const saturation = parseFloat(s);
  let lightness = parseFloat(l.replace('%', ''));

  if (hueAdjustment !== undefined) {
    hue = (hue + hueAdjustment) % 360;
    if (hue < 0) hue += 360;
  }

  if (lightnessAdjustment >= 1) {
    lightness = 100;
  } else if (lightnessAdjustment <= -1) {
    lightness = 0;
  } else {
    lightness += lightnessAdjustment * 100;
    lightness = Math.max(0, Math.min(100, lightness));
  }

  return `${Math.round(hue)} ${Math.round(saturation)}% ${lightness.toFixed(2)}%`;
};
