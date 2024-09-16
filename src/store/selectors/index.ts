import { type StoreApi, type UseBoundStore } from 'zustand';

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

type WithSelectors<S extends UseBoundStore<StoreApi<object>>> = S & {
  use: {
    [K in keyof ExtractState<S>]: () => ExtractState<S>[K];
  };
};

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(_store: S): WithSelectors<S> {
  const store = _store as WithSelectors<S>;
  store.use = {} as WithSelectors<S>['use'];

  const state = store.getState();
  for (const key of Object.keys(state) as Array<keyof typeof state>) {
    (store.use as Record<string, () => unknown>)[key as string] = () => store(s => s[key]);
  }

  return store;
}
