'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, TranslationContextType, TranslationDictionary } from '@/src/types/translation';

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<TranslationDictionary>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load translations when language changes
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        const data = await response.json();
        setTranslations(data);
        setIsLoaded(true);
      } catch (error) {
        console.error(`Failed to load translations for ${language}:`, error);
        setIsLoaded(true);
      }
    };

    loadTranslations();
  }, [language]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};
