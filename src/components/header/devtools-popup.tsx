'use client';
import * as React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../popover/popover';
import { DropdownMenuItem, DropdownMenuSeparator } from '../dropdown-menu/dropdown-menu';
import { AppWindow, ExternalLink, PanelBottom, PanelLeft, PanelRight, PanelRightDashed } from 'lucide-react';
import { useBreakpoints } from '@/lib/hooks';
import { UIStore } from '@/store';
import { cls } from '@/lib/utils';

type DevtoolsPopupProps = {
  open?: boolean;
  children?: React.ReactNode;
  popoverRef?: React.RefObject<HTMLDivElement>;
  handleMouseEnter?: () => void;
  handleMouseLeave?: () => void;
  Wrapper?: React.ComponentType<React.PropsWithChildren<unknown>>;
  WrapperProps?: React.ComponentProps<typeof PopoverContent>;
};

const DevtoolsPopup: React.FC<DevtoolsPopupProps> = ({ open, children, popoverRef, handleMouseEnter, handleMouseLeave, Wrapper, WrapperProps }) => {
  const breakpoint = useBreakpoints();
  const { consoleDock, setConsoleDock, devtoolsState, setDevtoolsState, setPopupType, popupType } = UIStore();

  const content = (
    <>
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('right');
          document.cookie = 'dock:position=right;path=/';
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'right' && 'bg-primary/20')}
      >
        <PanelRight className="mr-2 h-4 w-4" />
        <span>Dock to right</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('left');
          document.cookie = 'dock:position=left;path=/';
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'left' && 'bg-primary/20')}
      >
        <PanelLeft className="mr-2 h-4 w-4" />
        <span>Dock to left</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('bottom');
          document.cookie = 'dock:position=bottom;path=/';
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'bottom' && 'bg-primary/20')}
      >
        <PanelBottom className="mr-2 h-4 w-4" />
        <span>Dock to bottom</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('popout');
          setPopupType('pip');
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'popout' && popupType === 'pip' && 'bg-primary/20')}
      >
        <PanelRightDashed className="mr-2 h-4 w-4" />
        <span>Unlock into popout</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('popout');
          setPopupType('popup');
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'popout' && popupType === 'popup' && 'bg-primary/20')}
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        <span>Open in a popup</span>
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          setConsoleDock('popout');
          setPopupType('tab');
          !devtoolsState && setDevtoolsState(true);
        }}
        className={cls(devtoolsState && consoleDock === 'popout' && popupType === 'tab' && 'bg-primary/20')}
      >
        <AppWindow className="mr-2 h-4 w-4" />
        <span>Open in new tab</span>
      </DropdownMenuItem>
    </>
  );

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      {Wrapper ? (
        <Wrapper {...WrapperProps}>{content}</Wrapper>
      ) : (
        <PopoverContent
          className="p-0 w-48 rounded"
          sideOffset={0}
          alignOffset={breakpoint === 'sm' ? 146 : 0}
          align={breakpoint === 'sm' ? 'start' : 'start'}
          side={breakpoint === 'sm' ? 'bottom' : 'right'}
          ref={popoverRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {content}
        </PopoverContent>
      )}
    </Popover>
  );
};

export { DevtoolsPopup };
