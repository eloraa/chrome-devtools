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

export const isJson = (data: string) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

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

const style = typeof document !== 'undefined' ? document.createElement('style') : null;
style &&
  (style.textContent = `

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  border: 0;
}
html,
body {
  height: 100%;
  width: 100%;
  background-color: hsl(var(--primary));
  padding: 2px;
}
`);

const openPopup = (url: string) => {
  const screenTop = window.screenTop ?? window.screenY;

  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

  const popupWidth = 500;
  const popupHeight = height - 20;

  const left = width - popupWidth;
  const top = (height - 650) / 2 / screenTop;

  const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;
  const popup = window.open(url, '_blank', features);
  if (popup) {
    popup.focus();

    eventEmitter.on('color:change', (color: string) => {
      popup.document.documentElement.style.setProperty('--primary', color);
    });
  }

  return popup;
};

const newTab = (url: string) => {
  const tab = window.open(url, '_blank');
  if (tab) {
    tab.focus();

    eventEmitter.on('color:change', (color: string) => {
      tab.document.documentElement.style.setProperty('--primary', color);
    });
  }
  return tab;
};

const pip = async (url: string, color: string) => {
  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;
  const title = 'Elora Devtools';

  try {
    const pipWindow = await (
      window as Window & typeof globalThis & { documentPictureInPicture: { requestWindow: (options: { width: number; height: number }) => Promise<Window> } }
    ).documentPictureInPicture.requestWindow({
      width: 400,
      height: height - 40,
    });

    if (style) pipWindow.document.head.appendChild(style);
    // if (script) pipWindow.document.head.appendChild(script);
    pipWindow.document.title = title;
    pipWindow.document.documentElement.style.setProperty('--primary', color);

    eventEmitter.on('color:change', (color: string) => {
      pipWindow.document.documentElement.style.setProperty('--primary', color);
    });

    return pipWindow;
  } catch (error) {
    console.error('Error entering Picture-in-Picture:', error);
  }
};

export const requestPopup = (url: string, type: 'popup' | 'tab' | 'pip', color: string) => {
  switch (type) {
    case 'popup':
      return openPopup(url);
    case 'tab':
      return newTab(url);
    case 'pip':
      if ('documentPictureInPicture' in window) {
        return pip(url, color);
      }
      return openPopup(url);
    default:
      return null;
  }
};

export function isMacOS(): boolean {
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}
