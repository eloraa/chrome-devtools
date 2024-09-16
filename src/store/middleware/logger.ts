import { env } from '@/constant/env';
import { type StateCreator } from 'zustand';

export const loggerMiddleware =
  <T extends object>(
    config: StateCreator<T>,
    options: {
      name?: string;
      enabled?: boolean | (() => boolean);
      log?: typeof console.log;
    } = {}
  ): StateCreator<T> =>
  (set, get, api) => {
    const { name = 'Store', enabled = env.NEXT_PUBLIC_NODE_ENV === 'development', log = console.log } = options;

    const isEnabled = typeof enabled === 'function' ? enabled : () => enabled;

    return config(
      args => {
        const previousState = get();
        set(args);
        const nextState = get();

        if (isEnabled()) {
          log(`%c${name} - State updated`, 'color: #3498db; font-weight: bold;');
          log('%cPrev State:', 'color: #e74c3c; font-weight: bold;', previousState);
          log('%cNext State:', 'color: #2ecc71; font-weight: bold;', nextState);
          log('%cAction:', 'color: #f39c12; font-weight: bold;', args);
          log('─'.repeat(50));
        }
      },
      get,
      api
    );
  };
