/**
 * Dashboard data management helpers
 */

import { 
  DietHistoryEntry, 
  WeeklyNutritionData, 
  ComplianceMetrics,
  DashboardStats,
  CalorieTrend
} from '@/types/dashboard';
import { DietPlan, NutritionalSummary } from '@/types';

const DIET_HISTORY_KEY = 'ayurbytes_diet_history';
const COMPLIANCE_KEY = 'ayurbytes_compliance';

/**
 * Save diet plan to history
 */
export function saveDietToHistory(
  dietPlan: DietPlan,
  nutritionalSummary: NutritionalSummary,
  compliance?: number
): void {
  if (typeof window === 'undefined') return;

  const history = getDietHistory();
  const entry: DietHistoryEntry = {
    id: Date.now().toString(),
    date: new Date(),
    dietPlan,
    nutritionalSummary,
    compliance
  };

  history.unshift(entry);
  
  // Keep only last 30 entries
  const trimmedHistory = history.slice(0, 30);
  
  localStorage.setItem(DIET_HISTORY_KEY, JSON.stringify(trimmedHistory));
}

/**
 * Get diet history from localStorage
 */
export function getDietHistory(): DietHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(DIET_HISTORY_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored);
    // Convert date strings back to Date objects
    return history.map((entry: any) => ({
      ...entry,
      date: new Date(entry.date)
    }));
  } catch (error) {
    console.error('Error loading diet history:', error);
    return [];
  }
}

/**
 * Get weekly nutrition data for charts
 */
export function getWeeklyNutritionData(): WeeklyNutritionData[] {
  const history = getDietHistory();
  const last7Days = history.slice(0, 7);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return last7Days.map(entry => ({
    day: dayNames[entry.date.getDay()],
    date: entry.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    calories: entry.nutritionalSummary.totalCalories,
    protein: entry.nutritionalSummary.totalProtein,
    carbs: entry.nutritionalSummary.totalCarbs,
    fats: entry.nutritionalSummary.totalFats,
    fiber: entry.nutritionalSummary.totalFiber
  })).reverse(); // Oldest to newest for chart
}

/**
 * Get calorie trend data
 */
export function getCalorieTrend(targetCalories: number): CalorieTrend[] {
  const history = getDietHistory();
  const last14Days = history.slice(0, 14);
  
  return last14Days.map(entry => ({
    date: entry.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    calories: entry.nutritionalSummary.totalCalories,
    target: targetCalories
  })).reverse();
}

/**
 * Calculate compliance metrics
 */
export function calculateComplianceMetrics(): ComplianceMetrics {
  const history = getDietHistory();
  
  if (history.length === 0) {
    return {
      overallCompliance: 0,
      mealsFollowed: 0,
      totalMeals: 0,
      daysTracked: 0,
      currentStreak: 0,
      longestStreak: 0
    };
  }

  // Calculate overall compliance
  const entriesWithCompliance = history.filter(e => e.compliance !== undefined);
  const avgCompliance = entriesWithCompliance.length > 0
    ? entriesWithCompliance.reduce((sum, e) => sum + (e.compliance || 0), 0) / entriesWithCompliance.length
    : 0;

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const sortedHistory = [...history].sort((a, b) => b.date.getTime() - a.date.getTime());
  
  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    
    if (i === 0) {
      // Check if today or yesterday
      const daysDiff = Math.floor((Date.now() - entry.date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 1 && (entry.compliance || 0) >= 70) {
        currentStreak = 1;
        tempStreak = 1;
      }
    } else {
      const prevEntry = sortedHistory[i - 1];
      const daysDiff = Math.floor((prevEntry.date.getTime() - entry.date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1 && (entry.compliance || 0) >= 70) {
        tempStreak++;
        if (i === currentStreak) currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = (entry.compliance || 0) >= 70 ? 1 : 0;
      }
    }
  }
  
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return {
    overallCompliance: Math.round(avgCompliance),
    mealsFollowed: history.reduce((sum, e) => sum + (e.compliance || 0) / 100 * 3, 0), // Assume 3 meals/day
    totalMeals: history.length * 3,
    daysTracked: history.length,
    currentStreak,
    longestStreak
  };
}

/**
 * Get dashboard statistics
 */
export function getDashboardStats(): DashboardStats {
  const history = getDietHistory();
  const compliance = calculateComplianceMetrics();
  
  if (history.length === 0) {
    return {
      totalDaysTracked: 0,
      averageDailyCalories: 0,
      averageCompliance: 0,
      totalMealsLogged: 0,
      currentStreak: 0
    };
  }

  const avgCalories = history.reduce((sum, e) => sum + e.nutritionalSummary.totalCalories, 0) / history.length;

  return {
    totalDaysTracked: history.length,
    averageDailyCalories: Math.round(avgCalories),
    averageCompliance: compliance.overallCompliance,
    totalMealsLogged: Math.round(compliance.mealsFollowed),
    currentStreak: compliance.currentStreak
  };
}

/**
 * Update compliance for a specific entry
 */
export function updateCompliance(entryId: string, compliance: number): void {
  if (typeof window === 'undefined') return;

  const history = getDietHistory();
  const updated = history.map(entry => 
    entry.id === entryId ? { ...entry, compliance } : entry
  );
  
  localStorage.setItem(DIET_HISTORY_KEY, JSON.stringify(updated));
}

/**
 * Clear all diet history
 */
export function clearDietHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(DIET_HISTORY_KEY);
}
