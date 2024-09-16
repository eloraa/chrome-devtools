'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cls } from '@/lib/utils';

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const ToggleRoot = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>>(
  ({ className, variant, size, ...props }, ref) => <TogglePrimitive.Root ref={ref} className={cls(toggleVariants({ variant, size, className }))} {...props} />
);

ToggleRoot.displayName = TogglePrimitive.Root.displayName;

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> & {
      checked?: boolean;
      onChange?: (checked: boolean) => void;
    }
>(({ className, variant, size, checked, onChange, ...props }, ref) => (
  <ToggleRoot
    ref={ref}
    className={cls(
      toggleVariants({ variant, size, className }),
      'flex justify-start gap-1 p-1 rounded-full w-10 h-auto border border-primary/80 data-[state=on]:text-primary group'
    )}
    pressed={checked}
    onPressedChange={(pressed) => {
      if (onChange) {
        onChange(pressed);
      }
    }}
    {...props}
  >
    <span className="w-4 h-4 bg-current rounded-full group-data-[state=on]:translate-x-[.85rem] transition-transform"></span>
  </ToggleRoot>
));
Toggle.displayName = 'Toggle';

export { ToggleRoot, Toggle, toggleVariants };
