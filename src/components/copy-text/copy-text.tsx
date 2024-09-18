'use client';
import * as React from 'react';
import { Button } from '../button/button';
import { Check, Files } from 'lucide-react';
import { cls } from '@/lib/utils';

export const CopyText = ({ text, className }: { text: string; className?: string }) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [timeoutValue, setTimeoutValue] = React.useState<NodeJS.Timeout | undefined>(undefined);
  const copyToClipboard = async () => {
    clearTimeout(timeoutValue);
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeoutValue(setTimeout(() => setIsCopied(false), 2000));
  };
  return (
    <Button onClick={copyToClipboard} className={cls('flex items-center w-6 h-6 text-background', className)}>
      <div className="flex items-center w-4 h-4">{isCopied ? <Check /> : <Files />}</div>
      <span className="sr-only">{isCopied ? 'Copied' : 'Copy'}</span>
    </Button>
  );
};
