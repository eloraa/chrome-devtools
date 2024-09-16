import { create, type StateCreator } from 'zustand';
import { createSelectors } from './selectors';
import { UIState } from '@/types/ui';

type UIStore = Pick<UIState, 'settingState' | 'devtoolsState' | 'consoleDock' | 'proxyMode' | 'url'> & {
  setSettingState: (state: boolean) => void;
  setDevtoolsState: (state: boolean) => void;
  setConsoleDock: (dock: 'left' | 'right' | 'bottom' | 'popout') => void;
  setProxyMode: (mode: boolean) => void;
  setUrl: (url: string) => void;
  isIframeLoaded: boolean;
  setIsIframeLoaded: (loaded: boolean) => void;
};

const createUIStore: StateCreator<UIStore> = set => ({
  settingState: false,
  setSettingState: (state: boolean) => set({ settingState: state }),
  devtoolsState: false,
  setDevtoolsState: (state: boolean) => set({ devtoolsState: state }),
  consoleDock: 'right',
  setConsoleDock: (dock: 'left' | 'right' | 'bottom' | 'popout') => set({ consoleDock: dock }),
  proxyMode: false,
  setProxyMode: (mode: boolean) => set({ proxyMode: mode }),
  url: '',
  setUrl: (url: string) => set({ url: url }),
  isIframeLoaded: false,
  setIsIframeLoaded: (loaded: boolean) => set({ isIframeLoaded: loaded }),
});

const UIStoreBase = create<UIStore>()(createUIStore);

export const UIStore = createSelectors(UIStoreBase);
