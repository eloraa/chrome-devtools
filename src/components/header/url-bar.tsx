'use client';

import * as React from 'react';
import { Input } from '../input/input';
import { Button } from '../button/button';
import { ArrowRight, Asterisk, ChevronLeft, ChevronRight, Lock, RotateCw } from 'lucide-react';
import { UIStore } from '@/store';
import { cls, eventEmitter } from '@/lib/utils';
import { Spinner } from '../spinner/spinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip/tooltip';

export const UrlBar = () => {
  const { url, setUrl, isIframeLoaded, setIsIframeLoaded } = UIStore();
  const [isSecure, setIsSecure] = React.useState(false);
  const initialHistoryLength = React.useMemo(() => (typeof window !== 'undefined' ? window.history.length : 0), []);
  const [historyLength, setHistoryLength] = React.useState(initialHistoryLength);
  const [canGoBack, setCanGoBack] = React.useState(false);
  const [canGoForward, setCanGoForward] = React.useState(false);
  const [totalHistoryLength, setTotalHistoryLength] = React.useState(0);
  const [navigationCount, setNavigationCount] = React.useState(0);

  const handleURLSubmit = () => {
    eventEmitter.emit('load:frame', url);
    setIsSecure(url.startsWith('https://'));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleURLSubmit();
    }
  };

  const handleRefresh = () => {
    eventEmitter.emit('refresh:frame');
    setIsIframeLoaded(false);
  };

  const handleGoBack = () => {
    if (canGoBack) {
      window.history.back();
      setNavigationCount(prev => prev - 1);
    }
  };

  const handleGoForward = () => {
    if (canGoForward) {
      window.history.forward();
      setNavigationCount(prev => prev + 1);
    }
  };

  React.useEffect(() => {
    if (historyLength !== window.history.length) {
      setHistoryLength(window.history.length);
      setNavigationCount(prev => prev + 1);
      setTotalHistoryLength(prev => prev + 1);
    }

    if (navigationCount < totalHistoryLength) {
      setTotalHistoryLength(navigationCount + 1);
    }
  }, [typeof window !== 'undefined' ? window.history.length : 0, historyLength]);

  React.useEffect(() => {
    setCanGoBack(navigationCount > 0);
    setCanGoForward(navigationCount < totalHistoryLength);
  }, [historyLength, navigationCount, totalHistoryLength]);

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="w-5 h-5 text-foreground" onClick={handleGoBack} disabled={!canGoBack}>
          <ChevronLeft />
        </Button>
        <Button variant="ghost" className="w-5 h-5 text-foreground" onClick={handleGoForward} disabled={!canGoForward}>
          <ChevronRight />
        </Button>
        <Button variant="ghost" className="w-5 h-5 text-foreground" onClick={handleRefresh}>
          {isIframeLoaded ? <RotateCw className="w-4 h-4" /> : <Spinner className="w-4 h-4 text-primary" />}
        </Button>
      </div>
      <div className="relative flex items-center w-full group">
        <span className="absolute left-1 w-4 h-4 flex items-center justify-center">
          <Asterisk />
        </span>
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span
                className={cls('absolute left-6 w-5 h-5 flex items-center justify-center border border-purple-600 text-purple-600 transition-transform scale-0 rounded-sm', isSecure && 'scale-100')}
              >
                <Lock className="w-3 h-3" />
              </span>
            </TooltipTrigger>
            <TooltipContent>Connection is secure</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          placeholder="https://"
          className={cls('bg-white py-1 px-2 border-primary/5 pl-6 transition-[padding-left] pr-6', isSecure && 'pl-12')}
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleURLSubmit}
          variant="ghost"
          className={cls(
            'absolute right-1 w-4 h-4 flex items-center justify-center transition-transform scale-0',
            url.length > 0 ? 'group-hover:scale-100 group-focus-within:scale-100 group-focus:scale-100' : 'scale-0'
          )}
        >
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};
