'use client';

import * as React from 'react';

import { UIStore } from '@/store';
import { eventEmitter } from '@/lib/utils';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../drawer/drawer';
import { Button } from '../button/button';
import { Toggle } from '../toggle/toggle';
import { Check, Globe, Palette, Terminal } from 'lucide-react';
import { Dropdown, Option } from '../dropdown/dropdown';
import { UIState } from '@/types/ui';
import { COLORS } from '@/constant/colors';
import Image from 'next/image';

import hehe from './hehe.png';
import flower from './flower.png';
import sad from './sad.png';

export const Settings = () => {
  const { settingState, setSettingState, proxyMode, setProxyMode, consoleDock, setConsoleDock, color, setColor } = UIStore();
  const handleOpenChange = (open: boolean) => {
    setSettingState(open);
    eventEmitter.emit('setting:toggle', open);
  };

  type State = 'general' | 'appearance' | 'about';

  const [state, setState] = React.useState<State>('general');

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as UIState['consoleDock'];
    setConsoleDock(value);
    document.cookie = `dock:position=${value};path=/`;
  };

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
          <div className="w-full">
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
                      Console Position
                    </h1>
                    <p>Console position when opening the console.</p>
                  </div>
                  <Dropdown onChange={handleDropdownChange} value={consoleDock} className="w-28">
                    <Option value="bottom">Bottom</Option>
                    <Option value="left">Left</Option>
                    <Option value="right">Right</Option>
                    <Option value="popout">Popout</Option>
                  </Dropdown>
                </div>
              </div>
            )}
            {state === 'appearance' && (
              <div className="space-y-4 pb-10">
                <div className="text-xs min-w-0">
                  <h1 className="text-sm font-medium flex items-center gap-1">
                    <Palette className="w-4 h-4 inline-block" />
                    Theme
                  </h1>
                  <p>Choose a theme for the website.</p>
                </div>
                <div className="w-full border border-primary/20" />
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(_color => (
                    <div
                      key={_color}
                      className="w-6 h-6 rounded-full border-2 border-foreground flex items-center justify-center"
                      style={{ backgroundColor: `hsl(${_color})` }}
                      onClick={() => {
                        setColor(_color);
                        eventEmitter.emit('color:change', _color);
                      }}
                    >
                      {_color === color && <Check className="w-3 h-3" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {state === 'about' && (
              <div className="space-y-4 pb-10">
                <h1 className="font-medium text-sm">
                  This simple debug tool debugs your website directly in the browser based on{' '}
                  <a href="https://github.com/liriliri/chii" target="_blank">
                    Chii
                  </a>{' '}
                  and{' '}
                  <a href="https://chromium.googlesource.com/devtools/devtools-frontend" target="_blank">
                    Chrome Devtools
                  </a>
                  . Built for fun and learning.{' '}
                  <span className="w-3.5 inline-block align-middle">
                    <Image src={hehe} alt="hehe" width={20} height={20} />
                  </span>
                </h1>

                <div className="space-y-6 mt-10 text-sm">
                  <div>
                    <div className="w-[46px] h-4 text-primary">
                      <svg className="w-full h-full">
                        <use xlinkHref="/symbol.svg#design" />
                      </svg>
                      <span className="sr-only">Design</span>
                    </div>
                    <h4 className="font-bold mt-1">
                      <span className="font-normal">by</span>{' '}
                      <a href="https://dribbble.com/_neon" rel="norefferer" target="_blank">
                        Me
                      </a>{' '}
                      <span className="w-3.5 inline-block">
                        <Image className="w-full h-full" src={sad} alt="" />
                      </span>
                    </h4>
                  </div>
                  <div>
                    <div className="w-[94px] h-4 text-primary">
                      <svg className="w-full h-full">
                        <use xlinkHref="/symbol.svg#development" />
                      </svg>
                      <span className="sr-only">Development</span>
                    </div>
                    <h4 className="font-bold mt-1">
                      <span className="font-normal">by</span>{' '}
                      <a href="https://github.com/eloraa" rel="norefferer" target="_blank">
                        Neon
                      </a>{' '}
                      <span className="w-3.5 inline-block">
                        <Image className="w-full h-full" src={flower} alt="" />
                      </span>
                    </h4>
                  </div>
                  <div className="mt-8">
                    <a href="https://github.com/eloraa/chrome-devtools" target="_blank">
                      <div className="w-40 h-5 text-foreground">
                        <svg className="w-full h-full">
                          <use xlinkHref="/symbol.svg#download"></use>
                        </svg>
                        <span className="sr-only">Get the source code</span>
                      </div>
                    </a>
                  </div>

                  <div className="mt-16">
                    <a href="https://github.com/eloraa" rel="norefferer" target="_blank" className="group inline-block border-none hover:border-none focus:border-none focus-within:border-none">
                      <div className="w-12 h-10">
                        <svg className="w-full h-full" viewBox="0 0 39 28">
                          <foreignObject x="5" y="0" width="28" height="28">
                            <div className="w-full h-full">
                              <div className="scale-110 w-full h-full bg-[url('/heart.png')] bg-no-repeat bg-[length:2900%] bg-left group-hover:bg-right transition-none group-hover:[transition:background-position_800ms_steps(28)]"></div>
                            </div>
                          </foreignObject>

                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.0156 7.64771C10.0156 7.27437 10.2023 7.08771 10.5756 7.08771H10.9756C11.3489 7.08771 11.5356 7.27437 11.5356 7.64771V18.3677C11.5356 18.741 11.3489 18.9277 10.9756 18.9277H10.5756C10.2023 18.9277 10.0156 18.741 10.0156 18.3677V7.64771ZM4.319 19.0877C3.11367 19.0877 2.16967 18.709 1.487 17.9517C0.815004 17.1837 0.479004 16.069 0.479004 14.6077C0.479004 13.157 0.815004 12.0477 1.487 11.2797C2.159 10.5117 3.09234 10.1277 4.287 10.1277C5.46034 10.1277 6.383 10.501 7.055 11.2477C7.727 11.9837 8.07367 13.061 8.095 14.4797C8.095 14.853 7.903 15.0397 7.519 15.0397H1.999C1.999 15.893 2.207 16.5543 2.623 17.0237C3.04967 17.493 3.615 17.7277 4.319 17.7277C5.03367 17.7277 5.62034 17.4717 6.079 16.9597C6.303 16.7143 6.56434 16.613 6.863 16.6557C7.183 16.6983 7.391 16.8157 7.487 17.0077C7.583 17.1997 7.54567 17.4184 7.375 17.6637C6.735 18.613 5.71634 19.0877 4.319 19.0877ZM26.3438 10.8477C26.3438 10.4744 26.5305 10.2877 26.9038 10.2877H27.3038C27.6772 10.2877 27.8638 10.4744 27.8638 10.8477V11.2957C28.3438 10.6237 29.1171 10.2397 30.1838 10.1437C30.5571 10.1117 30.7438 10.2931 30.7438 10.6877V10.9277C30.7438 11.2691 30.5571 11.4664 30.1838 11.5197C28.6371 11.7224 27.8638 12.6717 27.8638 14.3677V18.3677C27.8638 18.741 27.6772 18.9277 27.3038 18.9277H26.9038C26.5305 18.9277 26.3438 18.741 26.3438 18.3677V10.8477ZM34.9386 19.0877C33.936 19.0877 33.168 18.8477 32.6346 18.3677C32.112 17.8877 31.8506 17.1677 31.8506 16.2077C31.8506 15.2477 32.112 14.5277 32.6346 14.0477C33.168 13.5677 33.936 13.3277 34.9386 13.3277C35.3013 13.3277 35.664 13.4023 36.0266 13.5517C36.4 13.6903 36.6986 13.8877 36.9226 14.1437V13.0717C36.9226 12.5703 36.72 12.181 36.3146 11.9037C35.9093 11.6263 35.4826 11.4877 35.0346 11.4877C34.4373 11.4877 33.8293 11.6317 33.2106 11.9197C33.0826 11.973 32.976 11.9997 32.8906 11.9997C32.7306 11.9997 32.5973 11.8983 32.4906 11.6957L32.4106 11.5357C32.24 11.173 32.3093 10.901 32.6186 10.7197C33.312 10.325 34.1013 10.1277 34.9866 10.1277C35.6266 10.1277 36.1813 10.2183 36.6506 10.3997C37.1306 10.5703 37.4933 10.805 37.7386 11.1037C37.984 11.3917 38.16 11.6903 38.2666 11.9997C38.384 12.309 38.4426 12.629 38.4426 12.9597V17.3277C38.4426 17.669 38.464 18.0157 38.5066 18.3677C38.56 18.741 38.4 18.9277 38.0266 18.9277H37.5146C37.1946 18.9277 36.9973 18.7144 36.9226 18.2877C36.4533 18.821 35.792 19.0877 34.9386 19.0877Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
