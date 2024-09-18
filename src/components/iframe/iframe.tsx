'use client';
import * as React from 'react';
import { cls, eventEmitter, formatLogs, isJson, isValidURL, requestPopup } from '@/lib/utils';
import { UIStore } from '@/store';
import { env } from '@/constant/env';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../resizable/resizable';
import { Header } from '../header/header';
import { getPanelElement, ImperativePanelHandle } from 'react-resizable-panels';
import type { UIState } from '@/types/ui';
import { StackTrace } from '@/types';

interface MainPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  submittedUrl: string;
  notFound?: boolean;
  setIsIframeLoaded: (loaded: boolean) => void;
  setIsMainIframeLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  layout: number[];
}

const MainPanel: React.FC<MainPanelProps & { order: number }> = React.memo(({ iframeRef, submittedUrl, notFound, setIsIframeLoaded, setIsMainIframeLoaded, layout, order }) => (
  <ResizablePanel id="main-panel" className="relative" defaultSize={layout[0]} order={order}>
    <iframe
      ref={iframeRef}
      allow="clipboard-read; clipboard-write;"
      allowFullScreen
      src={submittedUrl ? submittedUrl : notFound ? `${env.NEXT_PUBLIC_IFRAME_URL}/404` : env.NEXT_PUBLIC_IFRAME_URL}
      className="w-full h-full border-0 absolute top-0 left-0"
      onLoad={() => {
        setIsIframeLoaded(true);
        setIsMainIframeLoaded(true);
      }}
    />
  </ResizablePanel>
));

interface DevtoolsPanelProps {
  devtoolsRef: React.RefObject<HTMLIFrameElement>;
  isMainIframeLoaded: boolean;
  origin: string;
  layout: number[];
  devtoolsPanelRef: React.RefObject<ImperativePanelHandle>;
}

const DevtoolsPanel: React.FC<DevtoolsPanelProps & { order: number }> = React.memo(({ devtoolsRef, isMainIframeLoaded, origin, layout, devtoolsPanelRef, order }) => (
  <ResizablePanel id="devtools" defaultSize={layout[1]} className="overflow-hidden relative" ref={devtoolsPanelRef} order={order}>
    <div className="w-full h-full bg-black relative">
      {isMainIframeLoaded && <iframe ref={devtoolsRef} className="absolute bottom-0 left-0 w-full h-full" src={`/lib/devtools/elora-devtools#?embedded=${origin}`}></iframe>}
    </div>
  </ResizablePanel>
));

interface IframeProps {
  notFound?: boolean;
  defaultlayout?: number[];
  dockPosition?: UIState['consoleDock'];
}

export const Iframe: React.FC<IframeProps> = React.memo(({ notFound, defaultlayout = [75, 25], dockPosition = 'right' }) => {
  const { setIsIframeLoaded, settingState, devtoolsState, setDevtoolsState, consoleDock, setConsoleDock, setProxyState, setDocsState, setColor, color, popupType } = UIStore();
  const [submittedUrl, setSubmittedUrl] = React.useState('');
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const devtoolsRef = React.useRef<HTMLIFrameElement>(null);
  const devtoolsPanelRef = React.useRef<ImperativePanelHandle>(null);
  const consoleMessageHistory = React.useRef<string[]>([]);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const [isMainIframeLoaded, setIsMainIframeLoaded] = React.useState(false);
  const [layout, setLayout] = React.useState(defaultlayout);
  const [isDragging, setIsDragging] = React.useState(false);
  const popupWindow = React.useRef<Window | null | undefined>(null);

  const [pipWindow, setPipWindow] = React.useState<Window | null | undefined>(null);

  const isVertical = React.useMemo(() => consoleDock === 'bottom', [consoleDock]);
  const isReversed = React.useMemo(() => consoleDock === 'left', [consoleDock]);

  const reloadDevtool = React.useCallback(
    (force = false) => {
      if (force && devtoolsRef.current) {
        devtoolsRef.current.src = 'about:blank';
        setTimeout(() => {
          if (devtoolsRef.current) {
            devtoolsRef.current.src = `/lib/devtools/elora-devtools#?embedded=${origin}`;
          }
          setTimeout(() => {
            if (devtoolsRef.current) {
              consoleMessageHistory.current.forEach(data => {
                devtoolsRef.current?.contentWindow?.postMessage(data, '*');
              });
            }
          }, 500);
        }, 50);
      }
      if (!force && devtoolsRef.current) {
        consoleMessageHistory.current = [];
        devtoolsRef.current.contentWindow?.location.reload();
      }
    },
    [origin]
  );

  type Methods = 'Runtime.consoleAPICalled' | 'Runtime.enable' | 'Runtime.discardConsoleEntries' | 'Unknown';

  type Return = { method?: Methods; data: string };

  const refreshFrame = React.useCallback(
    (realoadDevtool = true) => {
      consoleMessageHistory.current = [];
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = submittedUrl || env.NEXT_PUBLIC_IFRAME_URL;
          }
        }, 50);
      }
      if (realoadDevtool) {
        reloadDevtool(true);

        if (pipWindow) {
          const iframe = pipWindow.document.querySelector('iframe') as HTMLIFrameElement;

          console.log(pipWindow, 'pipWindow');
          console.log(iframe, 'iframe');

          iframe.src = 'about:blank';
          setTimeout(() => {
            if (iframe) {
              iframe.src = `/lib/devtools/elora-devtools#?embedded=${origin}`;
            }
          }, 100);
        }
      }
      setIsIframeLoaded(false);
    },
    [submittedUrl, reloadDevtool, setIsIframeLoaded, pipWindow, origin]
  );

  React.useEffect(() => {
    const translateProtocolMessage = (data: string | { data: string; type: string; uri?: string }): Return => {
      if (!data) {
        return { method: 'Unknown', data: '' };
      }

      const payload = typeof data === 'string' ? data : data.data;

      if (isJson(payload)) {
        const json = JSON.parse(payload);

        return { method: json['method'] as Methods, data: payload };
      }

      return { data: payload };
    };

    const listener = (event: MessageEvent<{ type: string; data: string } | string>) => {
      if (typeof event.data === 'object' && 'type' in event.data && event.data.type === 'TO_DEVTOOLS' && devtoolsRef.current) {
        devtoolsRef.current.contentWindow?.postMessage(event.data.data, '*');
      }

      if (typeof event.data === 'object' && 'type' in event.data && 'stack' in event.data) {
        const { type, stack } = event.data as { type: string; stack: StackTrace };
        const data = event.data.data as unknown as unknown[];
        switch (type) {
          case 'debug': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'error': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'log': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'warning': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'info': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'trace': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs(type, data, stack)];
            break;
          }
          case 'unhandledError': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs('error', data, stack)];
            break;
          }
          case 'unhandledRejection': {
            consoleMessageHistory.current = [...consoleMessageHistory.current, formatLogs('error', data, stack)];
            break;
          }
        }
      }

      if (typeof event.data === 'object' && 'type' in event.data) {
        const { type } = event.data;

        switch (type) {
          case 'open-console': {
            setDevtoolsState(true);
            break;
          }
          case 'open-proxy': {
            setProxyState(true);
            break;
          }
          case 'open-docs': {
            setDocsState(true);
            break;
          }
        }
      }

      if (typeof event.data === 'string' && event.data.includes('"id"') && isJson(event.data)) {
        iframeRef.current?.contentWindow?.postMessage({ type: 'FROM_DEVTOOLS', data: event.data }, '*');
      }

      const { method, data } = translateProtocolMessage(event.data);
      switch (method) {
        case 'Runtime.consoleAPICalled': {
          consoleMessageHistory.current = [...consoleMessageHistory.current, data];

          break;
        }

        case 'Runtime.enable': {
          setTimeout(() => {
            consoleMessageHistory.current.forEach(data => {
              devtoolsRef.current?.contentWindow?.postMessage(data, '*');
            });
          }, 500);

          break;
        }

        case 'Runtime.discardConsoleEntries': {
          consoleMessageHistory.current = [];

          break;
        }
      }
    };
    try {
      window.addEventListener('message', listener);
    } catch (error) {
      console.warn(error);
    }

    const handleUrlSubmit = (newUrl: string) => {
      if (isValidURL(newUrl) && newUrl !== submittedUrl) {
        consoleMessageHistory.current = [];
        setSubmittedUrl(newUrl);
        setIsIframeLoaded(false);
        reloadDevtool(true);
      } else {
        console.error('Invalid URL submitted:', newUrl);
      }
    };

    const handleSettingToggle = (isOpen: boolean) => {
      if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({ type: 'setting:toggle', data: isOpen }, '*');
      }
    };

    const handleColorChange = (color: string) => {
      setColor(color);
      document.documentElement.style.setProperty('--primary', color);
      document.cookie = `__color=${color};path=/`;
      iframeRef.current?.contentWindow?.postMessage({ type: 'color:change', data: color }, '*');
      if (pipWindow) {
        pipWindow.document.documentElement.style.setProperty('--primary', color);
      }
    };

    eventEmitter.on('load:frame', handleUrlSubmit);
    eventEmitter.on('refresh:frame', refreshFrame);
    eventEmitter.on('setting:toggle', handleSettingToggle);
    eventEmitter.on('color:change', handleColorChange);

    return () => {
      eventEmitter.removeListener('load:frame', handleUrlSubmit);
      eventEmitter.removeListener('refresh:frame', refreshFrame);
      eventEmitter.removeListener('setting:toggle', handleSettingToggle);
      eventEmitter.removeListener('color:change', handleColorChange);
      window.removeEventListener('message', listener);
    };
  }, [refreshFrame, submittedUrl, reloadDevtool, setIsIframeLoaded, setProxyState, setDocsState, setDevtoolsState, setColor]);

  const onDrag = React.useCallback(
    (isDragging: boolean) => {
      setIsDragging(isDragging);
      if (!isDragging) {
        const devtoolsPanel = getPanelElement('devtools');

        if (devtoolsPanel?.offsetWidth && devtoolsPanel.offsetWidth < 100) {
          setDevtoolsState(false);
          devtoolsPanelRef.current?.resize(0);
        }
      }
    },
    [setDevtoolsState]
  );

  React.useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'toggle:devtools', data: devtoolsState }, '*');
    }
    if (devtoolsState) {
      const devtoolsPanel = getPanelElement('devtools');
      const devtoolsPanelWidth = devtoolsPanel?.offsetWidth;
      const devtoolsPanelLayout = layout[1];

      if (!isDragging) {
        if ((devtoolsPanelWidth && devtoolsPanelWidth < 100) || devtoolsPanelLayout < 25 || !devtoolsPanelLayout) {
          devtoolsPanelRef.current?.resize(25);
        }
      }
    }
  }, [devtoolsState, layout, isDragging]);

  React.useEffect(() => {
    if (dockPosition) {
      setConsoleDock(dockPosition);
    }
  }, [dockPosition, setConsoleDock]);

  const [isPopup, setIsPopup] = React.useState(false);
  const [isSetPipEvent, setIsSetPipEvent] = React.useState(false);

  React.useEffect(() => {
    if (!devtoolsState || consoleDock !== 'popout') {
      popupWindow.current?.close();
      setIsPopup(false);
      return;
    }
    setIsPopup(true);
    if (isPopup) return;
    const listener = (e: MessageEvent) => {
      if (e.data.type === 'TO_DEVTOOLS') {
        if (popupWindow.current) {
          popupWindow.current.window.postMessage({ type: 'TO_DEVTOOLS', data: e.data.data }, '*');
        }
      }
    };

    const pageHide = () => {
      setIsPopup(false);
      setPipWindow(null);
      setDevtoolsState(false);
    };

    const pipListener = (e?: Event & { window: Window }) => {
      const pipWindow = e ? e.window : popupWindow.current?.window;
      const pipDocument = pipWindow?.document as Document;
      setPipWindow(pipWindow);

      pipDocument.body.innerHTML = '';
      pipWindow?.document && (pipWindow.document.body.innerHTML = '');
      console.log('pipDocument', pipDocument);

      const iframe = document.createElement('iframe');
      iframe.src = `/lib/devtools/elora-devtools#?embedded=${origin}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      pipDocument.body.appendChild(iframe);

      iframe?.addEventListener('load', () => {
        setTimeout(() => {
          consoleMessageHistory.current.forEach(data => {
            if (iframe) {
              iframe.contentWindow?.postMessage(data, '*');
            }
          });
        }, 500);
      });
      pipWindow?.addEventListener('message', event => {
        if (event.data.type === 'TO_DEVTOOLS') {
          iframe.contentWindow?.postMessage(event.data.data, '*');
        }
        if (typeof event.data !== 'object' && event.data.type !== 'TO_DEVTOOLS') {
          if (typeof event.data === 'string' && event.data.includes('"id"') && isJson(event.data)) {
            pipWindow.opener.postMessage(event.data, '*');
          }
        }
      });
    };

    const createPopup = async () => {
      if (consoleDock === 'popout') {
        popupWindow.current = await requestPopup('/lib/devtools-popup', popupType, color);
        if (popupType === 'pip') popupWindow.current?.addEventListener('pagehide', pageHide);

        if ('documentPictureInPicture' in window && !isSetPipEvent && popupType === 'pip') {
          setIsSetPipEvent(true);
          pipListener();
          (
            window.documentPictureInPicture as {
              addEventListener: (event: string, listener: () => void) => void;
              removeEventListener: (event: string, listener: () => void) => void;
            }
          ).addEventListener('enter', pipListener);
        }

        window.addEventListener('message', listener);
      }
    };

    createPopup();

    return () => {
      popupWindow.current?.removeEventListener('pagehide', pageHide);
      window.removeEventListener('message', listener);
    };
  }, [consoleDock, submittedUrl, color, origin, isPopup, devtoolsState, popupType, setDevtoolsState, isSetPipEvent]);

  const panelOrder = React.useMemo(() => {
    const mainPanelElement = (
      <MainPanel
        key="main"
        iframeRef={iframeRef}
        submittedUrl={submittedUrl}
        notFound={notFound}
        setIsIframeLoaded={setIsIframeLoaded}
        setIsMainIframeLoaded={setIsMainIframeLoaded}
        layout={layout}
        order={isReversed ? 1 : 0}
      />
    );

    const devtoolsPanelElement = devtoolsState && consoleDock !== 'popout' && (
      <DevtoolsPanel key="devtools" devtoolsRef={devtoolsRef} isMainIframeLoaded={isMainIframeLoaded} origin={origin} layout={layout} devtoolsPanelRef={devtoolsPanelRef} order={isReversed ? 0 : 1} />
    );

    const handleElement = devtoolsState && consoleDock !== 'popout' && <ResizableHandle key="handle" withHandle onDragging={onDrag} />;

    const panels = [mainPanelElement, handleElement, devtoolsPanelElement].filter(Boolean);

    return isReversed ? panels.reverse() : panels;
  }, [isReversed, devtoolsState, submittedUrl, notFound, layout, isMainIframeLoaded, origin, setIsIframeLoaded, onDrag, consoleDock]);

  return (
    <div className="h-full w-full">
      <Header />
      <div className={cls('bg-primary h-[calc(100%-46px)] mt-1 overflow-hidden w-full relative', !settingState && 'px-1')}>
        <ResizablePanelGroup
          id="main"
          direction={isVertical ? 'vertical' : 'horizontal'}
          onLayout={sizes => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}; path=/`;

            if (sizes[1]) setLayout(sizes);
          }}
        >
          {panelOrder}
        </ResizablePanelGroup>
      </div>
    </div>
  );
});

MainPanel.displayName = 'MainPanel';
DevtoolsPanel.displayName = 'DevtoolsPanel';
Iframe.displayName = 'Iframe';
