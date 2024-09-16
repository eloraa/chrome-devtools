'use client';

import * as React from 'react';
import { cls } from '@/lib/utils';
import { UIStore } from '@/store';

interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  const { settingState } = UIStore();
  const [loaded, setLoaded] = React.useState(false);
  const [isIframe, setIsIframe] = React.useState(false);

  React.useEffect(() => {
    if (window.self !== window.top) {
      setIsIframe(true);
      window.location.href = 'https://sample-devtools.vercel.app/';
    }

    window.addEventListener('message', event => {
      if (event.data.type === 'color:change') {
        document.documentElement.style.setProperty('--primary', event.data.color);
        document.cookie = `__color=${event.data.color};path=/`;
      }
    });
    setLoaded(true);
  }, [settingState]);

  if (!loaded || isIframe) {
    return null;
  }

  return <div className={cls('transition-[transform,border-radius] h-full w-full overflow-hidden', settingState && 'scale-[0.975] rounded-md')}>{children}</div>;
};
