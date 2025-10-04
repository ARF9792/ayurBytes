import { Food, DietPlan, PatientProfile, PrakritiType } from '@/types';
import { 
  WeeklyMealPlan, 
  FoodUsageTracker, 
  CaloricNeeds,
  MealTiming 
} from '@/types/advancedDiet';
import { filterSeasonalFoods, getCurrentSeason } from './seasonalRecommendations';
import { getAgeGroup } from './utils';
import { 
  filterFoodsByPrakriti, 
  filterFoodsByAgeGroup,
  filterFoodsByDigestibility,
  filterFoodsByCategory 
} from './dietHelpers';
import { 
  calculateNutritionalSummary, 
  getAyurvedicGuidelines,
  getMealTimings
} from './nutritionHelpers';

/**
 * Get day name from day number (1-7)
 */
function getDayName(dayNumber: number): string {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return days[dayNumber - 1] || 'Monday';
}

/**
 * Get date for a specific day in the week
 */
function getDateForDay(startDate: Date, dayOffset: number): Date {
  const date = new Date(startDate);
  date.setDate(date.getDate() + dayOffset);
  return date;
}

/**
 * Ayurvedic meal timing recommendations
 */
export const AYURVEDIC_MEAL_TIMINGS: MealTiming[] = [
  {
    mealName: 'Early Morning',
    idealTime: '6:00 AM - 7:00 AM',
    ayurvedicRationale: 'Light beverage or soaked nuts to awaken digestive fire',
    doshaBalance: 'Prepares Agni (digestive fire)',
  },
  {
    mealName: 'Breakfast',
    idealTime: '7:30 AM - 9:00 AM',
    ayurvedicRationale: 'Kapha time - lighter meal, warm and nourishing',
    doshaBalance: 'Balances Kapha',
  },
  {
    mealName: 'Mid-Morning',
    idealTime: '10:30 AM - 11:00 AM',
    ayurvedicRationale: 'Light snack if needed, preferably fruits or nuts',
    doshaBalance: 'Maintains energy as Pitta rises',
  },
  {
    mealName: 'Lunch',
    idealTime: '12:00 PM - 1:00 PM',
    ayurvedicRationale: 'Largest meal when digestive fire is strongest',
    doshaBalance: 'Peak Pitta time - strongest digestion',
  },
  {
    mealName: 'Evening Snack',
    idealTime: '4:00 PM - 5:00 PM',
    ayurvedicRationale: 'Light snack to bridge to dinner, preferably warm',
    doshaBalance: 'Sustains energy during Vata time',
  },
  {
    mealName: 'Dinner',
    idealTime: '6:30 PM - 7:30 PM',
    ayurvedicRationale: 'Lighter than lunch, easy to digest, eaten before sunset ideally',
    doshaBalance: 'Balances Vata, allows proper digestion before sleep',
  },
];

/**
 * Track food usage to avoid repetition across the week
 */
class FoodVarietyManager {
  private tracker: Map<string, FoodUsageTracker> = new Map();
  
  trackUsage(food: Food, dayNumber: number, mealType: string): void {
    const existing = this.tracker.get(String(food.id));
    
    if (existing) {
      existing.usageCount++;
      existing.lastUsedDay = dayNumber;
      existing.mealTypes.push(mealType);
    } else {
      this.tracker.set(String(food.id), {
        foodId: String(food.id),
        foodName: food.name,
        usageCount: 1,
        lastUsedDay: dayNumber,
        mealTypes: [mealType],
      });
    }
  }
  
  getUsageCount(food: Food): number {
    return this.tracker.get(String(food.id))?.usageCount || 0;
  }
  
  wasRecentlyUsed(food: Food, currentDay: number, withinDays: number = 2): boolean {
    const usage = this.tracker.get(String(food.id));
    if (!usage) return false;
    return (currentDay - usage.lastUsedDay) < withinDays;
  }
  
  getTotalVariety(): number {
    return this.tracker.size;
  }
}

/**
 * Filter foods to avoid recent repetition
 */
function filterByVariety(
  foods: Food[],
  varietyManager: FoodVarietyManager,
  currentDay: number,
  maxUsage: number = 2
): Food[] {
  return foods.filter(food => {
    const usageCount = varietyManager.getUsageCount(food);
    const recentlyUsed = varietyManager.wasRecentlyUsed(food, currentDay, 2);
    
    // Allow if not used too many times and not used in last 2 days
    return usageCount < maxUsage && !recentlyUsed;
  });
}

/**
 * Generate a diet plan from filtered foods
 */
function generateDietPlan(
  profile: PatientProfile,
  foods: Food[],
  targetCalories?: number
): DietPlan {
  const ageGroup = getAgeGroup(profile.age);
  
  // Filter foods
  const prakritiFiltered = filterFoodsByPrakriti(foods, profile.prakriti as PrakritiType);
  const filteredFoods = filterFoodsByAgeGroup(prakritiFiltered, ageGroup);
  
  const dietPlan: DietPlan = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };
  
  // Breakfast: Easy to digest items
  const easyDigestFoods = filterFoodsByDigestibility(filteredFoods, 'Easy');
  if (easyDigestFoods.length > 0) dietPlan.breakfast.push(easyDigestFoods[0]);
  if (easyDigestFoods.length > 1) dietPlan.breakfast.push(easyDigestFoods[1]);
  
  // Lunch: Grains, Proteins, Vegetables
  const lunchGrains = filterFoodsByCategory(filteredFoods, 'Grain');
  const lunchProteins = filteredFoods.filter((food: Food) => 
    food.category === 'Lentil' || food.category === 'Protein'
  );
  const lunchVegetables = filterFoodsByCategory(filteredFoods, 'Vegetable');
  
  if (lunchGrains.length > 0) dietPlan.lunch.push(lunchGrains[0]);
  if (lunchProteins.length > 0) dietPlan.lunch.push(lunchProteins[0]);
  if (lunchVegetables.length > 0) dietPlan.lunch.push(lunchVegetables[0]);
  if (lunchVegetables.length > 1) dietPlan.lunch.push(lunchVegetables[1]);
  
  // Dinner: Lighter meal
  const dinnerGrains = lunchGrains.length > 1 ? lunchGrains.slice(1) : lunchGrains;
  const dinnerLentils = filterFoodsByCategory(filteredFoods, 'Lentil');
  
  if (dinnerGrains.length > 0) dietPlan.dinner.push(dinnerGrains[0]);
  if (dinnerLentils.length > 0) dietPlan.dinner.push(dinnerLentils[0]);
  
  // Snacks: Fruits or light items
  const fruits = filterFoodsByCategory(filteredFoods, 'Fruit');
  if (fruits.length > 0) dietPlan.snacks?.push(fruits[0]);
  
  // Calculate nutritional summary
  const allFoods = [
    ...dietPlan.breakfast,
    ...dietPlan.lunch,
    ...dietPlan.dinner,
    ...(dietPlan.snacks || [])
  ];
  
  dietPlan.nutritionalSummary = calculateNutritionalSummary(allFoods, profile);
  dietPlan.guidelines = getAyurvedicGuidelines(profile);
  dietPlan.mealTimings = getMealTimings();
  dietPlan.patientProfile = profile;
  dietPlan.generatedAt = new Date();
  
  return dietPlan;
}

/**
 * Generate a single day's diet plan with variety constraints
 */
async function generateDailyPlan(
  profile: PatientProfile,
  caloricNeeds: CaloricNeeds,
  dayNumber: number,
  varietyManager: FoodVarietyManager,
  considerSeasonal: boolean
): Promise<DietPlan> {
  // Import foods data
  const foodsModule = await import('@/data/foods.json');
  let availableFoods = (foodsModule.default || foodsModule) as unknown as Food[];
  
  // Apply seasonal filtering if requested
  if (considerSeasonal) {
    availableFoods = filterSeasonalFoods(availableFoods);
  }
  
  // Filter by variety (avoid recent repetitions)
  availableFoods = filterByVariety(availableFoods, varietyManager, dayNumber, 3);
  
  // If too few foods left, relax variety constraints
  if (availableFoods.length < 20) {
    const foodsModule = await import('@/data/foods.json');
    availableFoods = (foodsModule.default || foodsModule) as unknown as Food[];
    if (considerSeasonal) {
      availableFoods = filterSeasonalFoods(availableFoods);
    }
  }
  
  // Generate diet plan with caloric target
  const plan = generateDietPlan(
    profile,
    availableFoods,
    caloricNeeds.targetCalories
  );
  
  // Track food usage from all meals
  const allMealFoods = [
    ...plan.breakfast,
    ...plan.lunch,
    ...plan.dinner,
    ...(plan.snacks || [])
  ];
  
  allMealFoods.forEach((food: Food) => {
    varietyManager.trackUsage(food, dayNumber, 'meal');
  });
  
  return plan;
}

/**
 * Generate a complete 7-day weekly meal plan
 */
export async function generateWeeklyMealPlan(
  profile: PatientProfile,
  caloricNeeds: CaloricNeeds,
  options: {
    considerSeasonal?: boolean;
    avoidRepetition?: boolean;
  } = {}
): Promise<WeeklyMealPlan> {
  const { considerSeasonal = true, avoidRepetition = true } = options;
  
  const varietyManager = new FoodVarietyManager();
  const weekStartDate = new Date();
  weekStartDate.setHours(0, 0, 0, 0);
  
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  
  const dailyPlans = [];
  
  // Generate plans for each day
  for (let day = 1; day <= 7; day++) {
    const dayPlan = await generateDailyPlan(
      profile,
      caloricNeeds,
      day,
      avoidRepetition ? varietyManager : new FoodVarietyManager(),
      considerSeasonal
    );
    
    dailyPlans.push({
      dayNumber: day,
      dayName: getDayName(day),
      date: getDateForDay(weekStartDate, day - 1),
      plan: dayPlan,
    });
  }
  
  // Calculate weekly nutrition summary
  const weeklyNutrition = calculateWeeklyNutritionSummary(dailyPlans);
  
  return {
    weekStartDate,
    weekEndDate,
    patientProfile: profile,
    caloricNeeds,
    dailyPlans,
    weeklyNutritionSummary: {
      ...weeklyNutrition,
      totalVariety: varietyManager.getTotalVariety(),
    },
  };
}

/**
 * Calculate average nutrition across the week
 */
function calculateWeeklyNutritionSummary(dailyPlans: any[]): {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
} {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  
  dailyPlans.forEach(({ plan }) => {
    const summary = plan.nutritionalSummary;
    if (summary) {
      totalCalories += summary.totalCalories || 0;
      if (summary.macronutrients) {
        totalProtein += summary.macronutrients.protein || 0;
        totalCarbs += summary.macronutrients.carbs || 0;
        totalFat += summary.macronutrients.fat || 0;
      }
    }
  });
  
  const days = dailyPlans.length;
  
  return {
    avgCalories: Math.round(totalCalories / days),
    avgProtein: Math.round(totalProtein / days),
    avgCarbs: Math.round(totalCarbs / days),
    avgFat: Math.round(totalFat / days),
  };
}

/**
 * Get variety score for a weekly plan (0-100)
 */
export function getVarietyScore(weeklyPlan: WeeklyMealPlan): number {
  const totalFoodSlots = weeklyPlan.dailyPlans.reduce(
    (sum, day) => {
      const plan = day.plan;
      return sum + 
        plan.breakfast.length + 
        plan.lunch.length + 
        plan.dinner.length + 
        (plan.snacks?.length || 0);
    },
    0
  );
  
  const uniqueFoods = weeklyPlan.weeklyNutritionSummary.totalVariety;
  
  // Calculate variety as percentage
  const varietyPercent = (uniqueFoods / totalFoodSlots) * 100;
  
  // Cap at 100
  return Math.min(Math.round(varietyPercent), 100);
}

/**
 * Generate meal timing recommendations for a day
 */
export function getMealTimingRecommendations(): MealTiming[] {
  return AYURVEDIC_MEAL_TIMINGS;
}
