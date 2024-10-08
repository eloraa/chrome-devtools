'use client';

import { isJson } from '@/lib/utils';
import * as React from 'react';

export default function DevtoolsPopup() {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  React.useEffect(() => {
    if (!window.opener) {
      window.location.href = '/';
      return;
    }
    const listener = (event: MessageEvent) => {
      if (event.data.type === 'TO_DEVTOOLS') {
        console.log(event.data);
        iframeRef.current?.contentWindow?.postMessage(event.data.data, '*');
      }

      if (event.data.type === 'RELOAD_DEVTOOLS' && iframeRef.current) {
        iframeRef.current.src = 'about:blank';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = `/lib/devtools/elora-devtools#?embedded=${origin}`;
          }
        }, 100);
      }

      if (typeof event.data !== 'object' && event.data.type !== 'TO_DEVTOOLS') {
        if (typeof event.data === 'string' && event.data.includes('"id"') && isJson(event.data)) {
          window.opener.postMessage(event.data, '*');
        }
      }
    };

    const beforeUnload = () => {
      window.opener.postMessage({ type: 'UNLOAD_DEVTOOLS' }, '*');
      window.removeEventListener('message', listener);
      window.removeEventListener('beforeunload', beforeUnload);
    };

    window.addEventListener('message', listener);
    window.addEventListener('beforeunload', beforeUnload);
    return () => {
      window.removeEventListener('message', listener);
      window.removeEventListener('beforeunload', beforeUnload);
    };
  }, [origin]);

  const iframeLoad = () => {
    window.opener.postMessage({ type: 'IFRAME_LOADED' }, '*');
  };

  return (
    <div className="p-0.5 fixed inset-0">
      <iframe ref={iframeRef} className="w-full h-full" src={`/lib/devtools/elora-devtools#?embedded=${origin}`} onLoad={iframeLoad} />
    </div>
  );
}
