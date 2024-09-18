import { create, type StateCreator } from 'zustand';
import { createSelectors } from './selectors';
import { UIState } from '@/types/ui';

type UIStore = Pick<UIState, 'settingState' | 'devtoolsState' | 'consoleDock' | 'proxyState' | 'url' | 'isIframeLoaded' | 'color' | 'docsState' | 'popupType'> & {
  setSettingState: (state: boolean) => void;
  setDevtoolsState: (state: boolean) => void;
  setConsoleDock: (dock: 'left' | 'right' | 'bottom' | 'popout') => void;
  setProxyState: (mode: boolean) => void;
  setDocsState: (mode: boolean) => void;
  setUrl: (url: string) => void;
  setIsIframeLoaded: (loaded: boolean) => void;
  setColor: (color: string) => void;
  setPopupType: (type: 'popup' | 'tab' | 'pip') => void;
};

const createUIStore: StateCreator<UIStore> = set => ({
  settingState: false,
  setSettingState: (state: boolean) => set({ settingState: state }),
  devtoolsState: false,
  setDevtoolsState: (state: boolean) => set({ devtoolsState: state }),
  consoleDock: 'right',
  setConsoleDock: (dock: 'left' | 'right' | 'bottom' | 'popout') => set({ consoleDock: dock }),
  proxyState: false,
  setProxyState: (mode: boolean) => set({ proxyState: mode }),
  url: '',
  setUrl: (url: string) => set({ url: url }),
  isIframeLoaded: false,
  setIsIframeLoaded: (loaded: boolean) => set({ isIframeLoaded: loaded }),
  color: '',
  setColor: (color: string) => set({ color: color }),
  docsState: false,
  setDocsState: (mode: boolean) => set({ docsState: mode }),
  popupType: 'pip',
  setPopupType: (type: 'popup' | 'tab' | 'pip') => set({ popupType: type }),
});

const UIStoreBase = create<UIStore>()(createUIStore);

export const UIStore = createSelectors(UIStoreBase);
