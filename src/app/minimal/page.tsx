'use client';
import * as React from 'react';
export default function Home() {
  React.useEffect(() => {
    const targetIframe = document.getElementById('target') as HTMLIFrameElement;
    const devtoolsIframe = document.getElementById('devtools') as HTMLIFrameElement;
    window.addEventListener('message', event => {
      if (devtoolsIframe.contentWindow && targetIframe && targetIframe.contentWindow) {
        if (event.data.type === 'TO_DEVTOOLS') {
          devtoolsIframe.contentWindow.postMessage(event.data.message, '*');
        }
      }
      console.log(event.data);

      if (targetIframe && targetIframe.contentWindow) {
        targetIframe.contentWindow.postMessage(event.data, '*');
      }
    });
  });
  return (
    <div className="h-screen w-screen">
      <iframe id="target" className="h-1/2 w-full" src="http://localhost:5174/target.html"></iframe>
      <iframe className="h-1/2 w-full" id="devtools" src="/lib/devtools/elora-devtools.html#?embedded=http://localhost:3000"></iframe>
    </div>
  );
}
