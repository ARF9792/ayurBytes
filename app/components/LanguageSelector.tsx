'use client';

import { useTranslation } from '@/src/contexts/TranslationContext';
import { Language } from '@/src/types/translation';
import { Languages } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage, t } = useTranslation();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: t('language.english') },
    { code: 'hi', label: t('language.hindi') },
    { code: 'bn', label: t('language.bengali') },
    { code: 'te', label: t('language.telugu') },
    { code: 'mr', label: t('language.marathi') },
    { code: 'ta', label: t('language.tamil') },
    { code: 'sa', label: t('language.sanskrit') },
  ];

  return (
    <div className="relative group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
          <Languages className="w-5 h-5 text-white" />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="px-4 py-2.5 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 font-semibold bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg cursor-pointer appearance-none pr-10"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
