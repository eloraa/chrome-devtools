'use client';

import * as React from 'react';

import { UIStore } from '@/store';
import { eventEmitter } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../drawer/drawer';
import { Button } from '../button/button';
import { Toggle } from '../toggle/toggle';
import { Globe, Terminal } from 'lucide-react';

export const Settings = () => {
  const { settingState, setSettingState, proxyMode, setProxyMode } = UIStore();
  const handleOpenChange = (open: boolean) => {
    setSettingState(open);
    eventEmitter.emit('setting:toggle', open);
  };

  type State = 'general' | 'appearance' | 'about';

  const [state, setState] = React.useState<State>('general');

  return (
    <Drawer open={settingState} onOpenChange={handleOpenChange}>
      <DrawerContent className="md:max-w-lg mx-auto" aria-describedby="settings-drawer">
        <DrawerHeader>
          <DrawerTitle>Settings</DrawerTitle>
        </DrawerHeader>

        <div className="flex gap-4 p-2">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" className="py-1 h-auto flex items-center justify-start px-2" onClick={() => setState('general')}>
              General
            </Button>
            <Button variant="ghost" size="sm" className="py-1 h-auto flex items-center justify-start px-2" onClick={() => setState('appearance')}>
              Appearance
            </Button>
            <Button variant="ghost" size="sm" className="py-1 h-auto flex items-center justify-start px-2" onClick={() => setState('about')}>
              About
            </Button>
          </div>
          <div>
            {state === 'general' && (
              <div className="space-y-4 pb-10">
                <div className="flex items-center justify-between">
                  <div className="text-xs min-w-0 max-w-[80%]">
                    <h1 className="text-sm font-medium flex items-center gap-1">
                      <Globe className="w-4 h-4 inline-block" />
                      Proxy Mode
                    </h1>
                    <p>You can turn on the proxy mode if you can&apos;t change the script of the website.</p>
                    <p className="font-medium">Note: Site may not work properly.</p>
                    <p className="font-semibold text-red-500">Not available yet. :)</p>
                  </div>
                  <Toggle
                    checked={proxyMode}
                    onChange={checked => {
                      if (typeof checked === 'boolean') {
                        setProxyMode(checked);
                      }
                    }}
                  />
                </div>
                <div className="w-full border border-primary/20" />

                <div className="flex items-center justify-between">
                  <div className="text-xs min-w-0 max-w-[80%]">
                    <h1 className="text-sm font-medium flex items-center gap-1">
                      <Terminal className="w-4 h-4 inline-block" />
                      Default Console Position
                    </h1>
                    <p>Default console position when opening the console.</p>
                  </div>
                </div>
              </div>
            )}
            {state === 'appearance' && <div>Appearance</div>}
            {state === 'about' && <div>About</div>}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
