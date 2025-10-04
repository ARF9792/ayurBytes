import { 
  ActivityLevel, 
  WeightGoal, 
  CaloricNeeds, 
  BMICategory 
} from '@/types/advancedDiet';

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / height (m)²
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * Classify BMI into categories
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

/**
 * Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
 * BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + s
 * where s = +5 for males and -161 for females
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number {
  const baseCalc = (10 * weightKg) + (6.25 * heightCm) - (5 * age);
  const genderFactor = gender === 'male' ? 5 : -161;
  return Math.round(baseCalc + genderFactor);
}

/**
 * Activity level multipliers for TDEE calculation
 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,      // Little or no exercise
  light: 1.375,        // Light exercise 1-3 days/week
  moderate: 1.55,      // Moderate exercise 3-5 days/week
  active: 1.725,       // Heavy exercise 6-7 days/week
  very_active: 1.9,    // Very heavy exercise, physical job
};

/**
 * Calculate Total Daily Energy Expenditure (TDEE)
 * TDEE = BMR × Activity Multiplier
 */
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

/**
 * Weight goal caloric adjustments
 */
const WEIGHT_GOAL_ADJUSTMENTS: Record<WeightGoal, number> = {
  lose_weight: -500,   // 500 calorie deficit for ~0.5 kg/week loss
  maintain: 0,         // No adjustment
  gain_weight: 300,    // 300 calorie surplus for healthy weight gain
};

/**
 * Calculate target calories based on weight goal
 */
export function calculateTargetCalories(
  tdee: number,
  weightGoal: WeightGoal,
  bmiCategory: BMICategory
): number {
  let adjustment = WEIGHT_GOAL_ADJUSTMENTS[weightGoal];

  // Adjust deficit/surplus based on BMI category
  if (weightGoal === 'lose_weight') {
    if (bmiCategory === 'obese') {
      adjustment = -750; // Larger deficit for obese category
    } else if (bmiCategory === 'normal') {
      adjustment = -300; // Smaller deficit for normal weight
    }
  }

  if (weightGoal === 'gain_weight' && bmiCategory === 'obese') {
    adjustment = 0; // Don't add surplus if already obese
  }

  const target = tdee + adjustment;
  
  // Ensure minimum safe calories
  const minCalories = 1200; // General minimum for health
  return Math.max(target, minCalories);
}

/**
 * Calculate macronutrient targets in grams
 * Using balanced Ayurvedic ratios:
 * - Protein: 20-25% of calories (4 cal/g)
 * - Carbs: 45-55% of calories (4 cal/g)
 * - Fat: 25-30% of calories (9 cal/g)
 */
export function calculateMacroTargets(
  targetCalories: number,
  bmiCategory: BMICategory,
  weightGoal: WeightGoal
): { protein: number; carbs: number; fat: number } {
  let proteinPercent = 0.22;  // 22% default
  let carbsPercent = 0.50;    // 50% default
  let fatPercent = 0.28;      // 28% default

  // Adjust for weight goals
  if (weightGoal === 'lose_weight') {
    proteinPercent = 0.30;    // Higher protein for satiety
    carbsPercent = 0.40;      // Lower carbs
    fatPercent = 0.30;        // Moderate fat
  } else if (weightGoal === 'gain_weight') {
    proteinPercent = 0.25;    // Moderate protein
    carbsPercent = 0.50;      // Higher carbs for energy
    fatPercent = 0.25;        // Moderate fat
  }

  // Adjust for BMI category
  if (bmiCategory === 'obese') {
    proteinPercent = 0.30;    // Higher protein
    carbsPercent = 0.40;      // Lower carbs
    fatPercent = 0.30;
  } else if (bmiCategory === 'underweight') {
    proteinPercent = 0.25;
    carbsPercent = 0.50;      // Higher carbs
    fatPercent = 0.25;
  }

  return {
    protein: Math.round((targetCalories * proteinPercent) / 4),
    carbs: Math.round((targetCalories * carbsPercent) / 4),
    fat: Math.round((targetCalories * fatPercent) / 9),
  };
}

/**
 * Main function to calculate complete caloric needs
 */
export function calculateCaloricNeeds(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: ActivityLevel,
  weightGoal: WeightGoal
): CaloricNeeds {
  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const targetCalories = calculateTargetCalories(tdee, weightGoal, bmiCategory);
  const macros = calculateMacroTargets(targetCalories, bmiCategory, weightGoal);

  return {
    bmr,
    tdee,
    targetCalories,
    bmi,
    bmiCategory,
    proteinGrams: macros.protein,
    carbsGrams: macros.carbs,
    fatGrams: macros.fat,
  };
}

/**
 * Get Ayurvedic recommendations based on BMI category
 */
export function getAyurvedicBMIRecommendations(bmiCategory: BMICategory): string {
  switch (bmiCategory) {
    case 'underweight':
      return 'Vata imbalance likely. Focus on grounding, nourishing foods. Increase healthy fats, warm cooked meals, and sweet/sour/salty tastes.';
    case 'normal':
      return 'Good balance of doshas. Maintain with seasonal eating, proper meal timing, and balanced six tastes in diet.';
    case 'overweight':
      return 'Kapha imbalance indicated. Emphasize light, warm foods with pungent/bitter/astringent tastes. Reduce heavy, oily foods.';
    case 'obese':
      return 'Significant Kapha excess. Prioritize detoxifying foods, bitter vegetables, and regular exercise. Minimize sweets and heavy foods.';
  }
}
