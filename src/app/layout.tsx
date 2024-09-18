import * as React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Wrapper } from '@/components/wrapper/wrapper';
import { headers } from 'next/headers';
import { Settings } from '@/components/settings/settings';
import { Docs } from '@/components/docs/docs';

import './globals.css';
import './markdown.css';
import { COLORS } from '@/constant/colors';
import { doc } from '@/components/docs/doc';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Devtools | Elora',
  description: 'A Browser Based Devtools made by Elora',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const color = headers()
    .get('cookie')
    ?.split(';')
    .find(cookie => cookie.includes('__color'));

  return (
    <html lang="en" style={{ '--primary': color?.split('=')[1] } as React.CSSProperties} className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Wrapper color={color?.split('=')[1] ?? COLORS[0]}>{children}</Wrapper>
        <Settings />
        <Docs docs={decodeURIComponent(doc)} />
      </body>
    </html>
  );
}
