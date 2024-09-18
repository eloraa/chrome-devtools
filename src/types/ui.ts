export interface UIState {
  settingState: boolean;
  devtoolsState: boolean;
  consoleDock: 'left' | 'right' | 'bottom' | 'popout';
  popupType: 'popup' | 'tab' | 'pip';
  proxyState: boolean;
  docsState: boolean;
  url: string;
  isIframeLoaded: boolean;
  color: string;
}

export interface ChildParams {
  defaultlayout?: number[];
}
