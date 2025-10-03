import { PrakritiType } from '@/src/types';

/**
 * Prakriti configurations with their properties
 */
export const PRAKRITI_CONFIG = {
  Vata: {
    value: 'Vata' as PrakritiType,
    translationKey: 'prakriti.vata',
    color: 'from-blue-400 via-cyan-400 to-sky-400',
    bgColor: 'from-blue-50/80 to-cyan-50/80',
    borderColor: 'border-blue-200/50',
    element: ['Air', 'Space'],
  },
  Pitta: {
    value: 'Pitta' as PrakritiType,
    translationKey: 'prakriti.pitta',
    color: 'from-orange-400 via-red-400 to-pink-400',
    bgColor: 'from-orange-50/80 to-red-50/80',
    borderColor: 'border-orange-200/50',
    element: ['Fire', 'Water'],
  },
  Kapha: {
    value: 'Kapha' as PrakritiType,
    translationKey: 'prakriti.kapha',
    color: 'from-green-400 via-emerald-400 to-teal-400',
    bgColor: 'from-green-50/80 to-emerald-50/80',
    borderColor: 'border-green-200/50',
    element: ['Earth', 'Water'],
  },
} as const;

/**
 * Age group thresholds
 */
export const AGE_GROUPS = {
  CHILD_MAX: 12,
  ADULT_MIN: 13,
  ADULT_MAX: 59,
  ELDERLY_MIN: 60,
} as const;

/**
 * Meal type configurations
 */
export const MEAL_CONFIG = {
  breakfast: {
    translationKey: 'diet.breakfast',
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    bgGradient: 'from-amber-50/80 via-yellow-50/60 to-orange-50/80',
  },
  lunch: {
    translationKey: 'diet.lunch',
    gradient: 'from-orange-400 via-red-400 to-pink-400',
    bgGradient: 'from-orange-50/80 via-red-50/60 to-pink-50/80',
  },
  dinner: {
    translationKey: 'diet.dinner',
    gradient: 'from-indigo-400 via-purple-400 to-violet-400',
    bgGradient: 'from-indigo-50/80 via-purple-50/60 to-violet-50/80',
  },
} as const;

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  GENERATE_DIET: '/api/generate-diet',
  TRANSLATE: '/api/translate',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  LANGUAGE: 'ayurveda_language_preference',
  THEME: 'ayurveda_theme_preference',
} as const;
