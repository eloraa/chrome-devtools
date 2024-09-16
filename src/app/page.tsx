import { Iframe } from '@/components/iframe/iframe';
import { UIState } from '@/types/ui';
import { cookies } from 'next/headers';

export default function Home() {
  const layout = cookies().get('react-resizable-panels:layout');
  const dockPositionCookie = cookies().get('dock:position');
  const dockPosition = (dockPositionCookie?.value as UIState['consoleDock']) || 'right';
  const defaultlayout = layout ? JSON.parse(layout.value) : undefined;

  return <Iframe defaultlayout={defaultlayout} dockPosition={dockPosition} />;
}
