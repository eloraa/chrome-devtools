'use client';
import * as React from 'react';
import { Logo } from './logo';
import Link from 'next/link';
import { Button } from '../button/button';
import { UrlBar } from './url-bar';
import { Asterisk, ChevronDown, Globe, PictureInPicture2, Settings, Terminal } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../tooltip/tooltip';
import { Kbd } from '../kbd/kbd';
import { Dropdown } from './dropdown';
import { DevtoolsPopup } from './devtools-popup';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../dropdown-menu/dropdown-menu';
import { UIStore } from '@/store';
import { eventEmitter } from '@/lib/utils';
import { useBreakpoints } from '@/lib/hooks';

export const Header = () => {
  const { setSettingState, setDevtoolsState, devtoolsState, proxyState, setProxyState } = UIStore();
  const breakpoint = useBreakpoints();

  return (
    <header className="py-1 bg-white text-foreground">
      <div className="container flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Dropdown>
            <Button variant="ghost" asChild className="p-0 w-6 h-6 text-foreground">
              <Link href="/">
                <Logo />
              </Link>
            </Button>
          </Dropdown>
        </div>
        <UrlBar />
        <TooltipProvider>
          <div className="flex items-center gap-2">
            {breakpoint !== 'sm' && (
              <>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button variant={proxyState ? 'default' : 'ghost'} className="w-6 h-6 p-1 text-foreground" onClick={() => setProxyState(!proxyState)}>
                      <Globe />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <h1>Proxy Mode</h1>
                      <p className="flex items-center gap-0.5">
                        <Asterisk className="w-4 h-4" /> Not available yet.
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-6 h-6 p-1 text-foreground"
                      onClick={() => {
                        setSettingState(true);
                        eventEmitter.emit('setting:toggle', true);
                      }}
                    >
                      <Settings />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </>
            )}
            <div className="flex items-center hover:bg-primary/10 rounded">
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant={devtoolsState ? 'default' : 'ghost'} className="w-6 h-6 p-1 text-foreground" onClick={() => setDevtoolsState(!devtoolsState)}>
                    <Terminal />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Devtools</TooltipContent>
              </Tooltip>
              <DropdownMenu>
                <DevtoolsPopup Wrapper={DropdownMenuContent} WrapperProps={{ collisionPadding: 4 }}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-3 h-6 text-foreground">
                      <span className="w-4 h-4">
                        <ChevronDown />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                </DevtoolsPopup>
              </DropdownMenu>
            </div>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="w-6 h-6 p-1 text-foreground">
                  <PictureInPicture2 />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <h1>Open in a new tab</h1>
                <p>
                  Or use{' '}
                  <span className="inline-flex items-center gap-1">
                    <Kbd>Ctrl</Kbd>
                    <Kbd>Click</Kbd> to open in a popup
                  </span>
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </header>
  );
};
