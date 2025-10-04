/**
 * Dashboard and Analytics types
 */

import { DietPlan, NutritionalSummary } from './index';

/**
 * Diet history entry
 */
export interface DietHistoryEntry {
  id: string;
  date: Date;
  dietPlan: DietPlan;
  nutritionalSummary: NutritionalSummary;
  compliance?: number; // 0-100 percentage
  notes?: string;
}

/**
 * Weekly nutrition data point
 */
export interface WeeklyNutritionData {
  day: string; // e.g., "Mon", "Tue", etc.
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

/**
 * Nutrient distribution for pie chart
 */
export interface NutrientDistribution {
  name: string;
  value: number;
  color: string;
}

/**
 * Six taste balance for radar chart
 */
export interface TasteBalance {
  taste: string;
  value: number;
  fullMark: number;
}

/**
 * Compliance metrics
 */
export interface ComplianceMetrics {
  overallCompliance: number; // 0-100
  mealsFollowed: number;
  totalMeals: number;
  daysTracked: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * Calorie trend data
 */
export interface CalorieTrend {
  date: string;
  calories: number;
  target: number;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalDaysTracked: number;
  averageDailyCalories: number;
  averageCompliance: number;
  totalMealsLogged: number;
  currentStreak: number;
}
