'use client';
import * as React from 'react';
import { File, LogOut, Settings, Terminal, User } from 'lucide-react';
import { useClickOutside } from '@/lib/hooks';
import { debounce, eventEmitter } from '@/lib/utils';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import { DevtoolsPopup } from './devtools-popup';
import { UIStore } from '@/store';

export function Dropdown({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const { setSettingState, setDocsState } = UIStore();

  useClickOutside(popoverRef, () => setOpen(false));

  const debouncedClose = React.useMemo(() => debounce(() => setOpen(false), 300), []);

  const handleMouseEnter = () => {
    debouncedClose.cancel();
    setOpen(true);
  };

  const handleMouseLeave = () => {
    debouncedClose();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" collisionPadding={2}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSettingState(true);
              eventEmitter.emit('setting:toggle', true);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setDocsState(true);
            }}
          >
            <File className="mr-2 h-4 w-4" />
            <span>Documentation</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DevtoolsPopup popoverRef={popoverRef} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} open={open}>
              <DropdownMenuSubTrigger onClick={handleMouseEnter} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Terminal className="mr-2 h-4 w-4" />
                <span>Devtools</span>
              </DropdownMenuSubTrigger>
            </DevtoolsPopup>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
