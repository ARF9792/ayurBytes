import { DietPlan, Food, PatientProfile } from './index';

/**
 * Activity levels for caloric needs calculation
 */
export type ActivityLevel = 
  | 'sedentary'      // Little or no exercise
  | 'light'          // Light exercise 1-3 days/week
  | 'moderate'       // Moderate exercise 3-5 days/week
  | 'active'         // Heavy exercise 6-7 days/week
  | 'very_active';   // Very heavy exercise, physical job

/**
 * Weight goals for caloric adjustment
 */
export type WeightGoal = 
  | 'lose_weight'    // Caloric deficit
  | 'maintain'       // Maintenance calories
  | 'gain_weight';   // Caloric surplus

/**
 * Seasons for seasonal food recommendations
 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * BMI classification
 */
export type BMICategory = 
  | 'underweight'    // BMI < 18.5
  | 'normal'         // BMI 18.5-24.9
  | 'overweight'     // BMI 25-29.9
  | 'obese';         // BMI >= 30

/**
 * Caloric requirements calculation result
 */
export interface CaloricNeeds {
  bmr: number;                    // Basal Metabolic Rate
  tdee: number;                   // Total Daily Energy Expenditure
  targetCalories: number;         // Adjusted for weight goal
  bmi: number;                    // Body Mass Index
  bmiCategory: BMICategory;       // BMI classification
  proteinGrams: number;           // Daily protein target (g)
  carbsGrams: number;             // Daily carbs target (g)
  fatGrams: number;               // Daily fat target (g)
}

/**
 * Weekly meal plan - 7 days of diet plans
 */
export interface WeeklyMealPlan {
  weekStartDate: Date;
  weekEndDate: Date;
  patientProfile: PatientProfile;
  caloricNeeds: CaloricNeeds;
  dailyPlans: {
    dayNumber: number;            // 1-7
    dayName: string;              // Monday, Tuesday, etc.
    date: Date;
    plan: DietPlan;
  }[];
  weeklyNutritionSummary: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
    totalVariety: number;         // Unique foods used across week
  };
}

/**
 * Food substitution suggestion
 */
export interface FoodSubstitute {
  originalFood: Food;
  substitutes: {
    food: Food;
    reason: string;              // Why this is a good substitute
    nutritionalMatch: number;    // 0-100 similarity score
  }[];
}

/**
 * Seasonal food availability
 */
export interface SeasonalFood {
  food: Food;
  seasons: Season[];
  isPeakSeason: boolean;         // Currently in peak season
  ayurvedicBenefit: string;      // Seasonal benefit description
}

/**
 * Advanced diet generation options
 */
export interface AdvancedDietOptions {
  profile: PatientProfile;
  activityLevel: ActivityLevel;
  weightGoal: WeightGoal;
  generateWeekly?: boolean;      // Generate 7-day plan
  considerSeasonal?: boolean;    // Apply seasonal filtering
  avoidRepetition?: boolean;     // Minimize food repetition
  maxMealsPerDay?: number;       // Default: 6 (breakfast, mid-morning, lunch, evening, dinner, bedtime)
}

/**
 * Meal timing recommendations based on Ayurveda
 */
export interface MealTiming {
  mealName: string;
  idealTime: string;             // e.g., "7:00 AM - 8:00 AM"
  ayurvedicRationale: string;    // Why this timing is beneficial
  doshaBalance: string;          // Which dosha is balanced
}

/**
 * Food variety tracking for avoiding repetition
 */
export interface FoodUsageTracker {
  foodId: string;
  foodName: string;
  usageCount: number;
  lastUsedDay: number;           // Day number (1-7)
  mealTypes: string[];           // Meals where it was used
}
