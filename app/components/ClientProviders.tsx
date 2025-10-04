'use client';

import { TranslationProvider } from '@/src/contexts/TranslationContext';
import { DarkModeProvider } from '@/src/contexts/DarkModeContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </DarkModeProvider>
  );
}
