'use client';

import { TranslationProvider } from '@/src/contexts/TranslationContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <TranslationProvider>
      {children}
    </TranslationProvider>
  );
}
