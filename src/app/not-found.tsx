import { Iframe } from '@/components/iframe/iframe';
import { cookies } from 'next/headers';

export default function NotFound() {
  const layout = cookies().get('react-resizable-panels:layout');
  const defaultlayout = layout ? JSON.parse(layout.value) : undefined;

  return <Iframe notFound defaultlayout={defaultlayout} />;
}
