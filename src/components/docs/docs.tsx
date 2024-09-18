'use client';
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../dialog/dialog';
import { UIStore } from '@/store';
import { MarkdownPreview } from '../markdown/markdown';

export const Docs = ({ docs }: { docs: string }) => {
  const { docsState, setDocsState, color } = UIStore();

  const codeColor = React.useMemo(() => {
    const match = color.match(/\d+/g);
    if (match && match.length === 3) {
      const [hue, saturation, lightness] = match.map(Number);
      const newSaturation = Math.max(saturation * 0.1, 30); // Reduce saturation by 40%, min 30%
      const newLightness = Math.min(lightness + (100 - lightness) * 0.8, 95); // Increase lightness, max 95%
      return `${hue} ${newSaturation.toFixed(0)}% ${newLightness.toFixed(0)}%`;
    }
    return color;
  }, [color]);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--code-foreground', codeColor);
  }, [codeColor]);

  return (
    <Dialog open={docsState} onOpenChange={setDocsState}>
      <DialogContent aria-describedby="docs-description">
        <DialogHeader>
          <DialogTitle>Documentation</DialogTitle>
        </DialogHeader>
        <div className="w-full overflow-hidden">
          <MarkdownPreview code={docs} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
