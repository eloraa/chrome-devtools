'use client';

import * as React from 'react';
import { cls } from '@/lib/utils';
import { UIStore } from '@/store';

interface WrapperProps {
  children: React.ReactNode;
  color: string;
}

export const Wrapper: React.FC<WrapperProps> = ({ children, color }) => {
  const { settingState, setColor } = UIStore();
  const [loaded, setLoaded] = React.useState(false);
  const [isIframe, setIsIframe] = React.useState(false);

  React.useEffect(() => {
    if (window.self !== window.top) {
      setIsIframe(true);
      window.location.href = 'https://sample-devtools.vercel.app/';
    }

    if (color) {
      setColor(color);
    }

    window.addEventListener('message', event => {
      if (event.data.type === 'color:change') {
        setColor(event.data.color);
        document.documentElement.style.setProperty('--primary', event.data.color);
        document.cookie = `__color=${event.data.color};path=/`;
      }
    });
    setLoaded(true);
  }, [settingState, setColor]);

  if (!loaded || isIframe) {
    return null;
  }

  return <div className={cls('transition-[transform,border-radius] h-full w-full overflow-hidden', settingState && 'scale-[0.975] rounded-md')}>{children}</div>;
};
