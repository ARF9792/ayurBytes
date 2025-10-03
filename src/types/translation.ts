/**
 * Translation system types
 */

/**
 * Supported language codes
 * en - English
 * hi - Hindi (हिन्दी)
 * bn - Bengali (বাংলা)
 * te - Telugu (తెలుగు)
 * mr - Marathi (मराठी)
 * ta - Tamil (தமிழ்)
 * sa - Sanskrit (संस्कृतम्)
 */
export type Language = 'en' | 'hi' | 'bn' | 'te' | 'mr' | 'ta' | 'sa';

/**
 * Language configuration
 */
export interface LanguageConfig {
  code: Language;
  label: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

/**
 * Translation dictionary structure
 */
export interface TranslationDictionary {
  [key: string]: string;
}

/**
 * Translation context type
 */
export interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
