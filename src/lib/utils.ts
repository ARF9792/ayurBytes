import { AgeGroup } from '@/src/types';
import { AGE_GROUPS } from '@/src/constants';

/**
 * Determines the age group based on the given age
 * @param age - The age of the person
 * @returns The corresponding age group
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age <= AGE_GROUPS.CHILD_MAX) {
    return 'Child';
  } else if (age >= AGE_GROUPS.ELDERLY_MIN) {
    return 'Elderly';
  } else {
    return 'Adult';
  }
}

/**
 * Validates if the age is within acceptable range
 * @param age - The age to validate
 * @returns true if age is valid, false otherwise
 */
export function isValidAge(age: number): boolean {
  return age > 0 && age <= 120;
}

/**
 * Formats calorie count with unit
 * @param calories - The calorie count
 * @returns Formatted string with unit
 */
export function formatCalories(calories: number): string {
  return `${calories} kcal`;
}

/**
 * Truncates text to specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}
