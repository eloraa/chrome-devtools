import * as React from 'react';
import { cls } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cls('border p-2 bg-background border-primary/80 w-full disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-primary focus-within:outline-2 text-sm', className)}
      autoComplete="off"
      data-1p-ignore="true"
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
