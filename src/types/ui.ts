export interface UIState {
  settingState: boolean;
  devtoolsState: boolean;
  consoleDock: 'left' | 'right' | 'bottom' | 'popout';
  proxyMode: boolean;
  url: string;
  isIframeLoaded: boolean;
}

export interface ChildParams {
  defaultlayout?: number[];
}
