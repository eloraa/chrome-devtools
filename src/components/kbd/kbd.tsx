import { cls } from '@/lib/utils';
import * as React from 'react';

const Kbd = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<'kbd'>>(({ className, ...props }, ref) => (
  <kbd className={cls('px-1 py-0.5 border border-primary/20 bg-primary/10 font-mono text-xs inline-flex items-center gap-1', className)} ref={ref} {...props} />
));

Kbd.displayName = 'Kbd';

export { Kbd };
