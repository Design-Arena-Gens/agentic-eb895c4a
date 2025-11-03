import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'ATS Resume Rewriter',
  description: 'Rephrase resumes to match job descriptions while preserving layout',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
