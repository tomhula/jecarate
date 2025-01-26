import '@/app/ui/global.css';
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Jecarate',
    default: 'Jecarate',
  },
  description: 'Jecna rating web app for our food in canteen.',
};

export default function RootLayout(
    { children }: { children: React.ReactNode; }
) {
  return (
    <html lang="en">
    <body>{children}</body>
    </html>
  );
}
