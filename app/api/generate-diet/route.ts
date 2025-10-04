import { NextRequest, NextResponse } from 'next/server';
import foods from '@/data/foods.json';
import { Food, DietPlan, PrakritiType, PatientProfile } from '@/src/types';
import { getAgeGroup } from '@/src/lib/utils';
import { 
  filterFoodsByPrakriti, 
  filterFoodsByAgeGroup,
  filterFoodsByDigestibility,
  filterFoodsByCategory,
  filterFoodsByAllergies
} from '@/src/lib/dietHelpers';
import { 
  calculateNutritionalSummary, 
  getAyurvedicGuidelines,
  getMealTimings
} from '@/src/lib/nutritionHelpers';
import { calculateCaloricNeeds } from '@/src/lib/caloricCalculator';
import { 
  getCurrentSeason, 
  filterSeasonalFoods,
  getSeasonalGuidelines 
} from '@/src/lib/seasonalRecommendations';
import { generateWeeklyMealPlan } from '@/src/lib/weeklyPlanGenerator';

export async function POST(request: NextRequest) {
  try {
    const { age, prakriti, profile, generateWeekly } = await request.json();

    if (!prakriti || age === undefined) {
      return NextResponse.json(
        { error: 'Prakriti and age are required' },
        { status: 400 }
      );
    }
    
    // Determine the age group
    const ageGroup = getAgeGroup(age);
    
    // Get current season for seasonal recommendations
    const currentSeason = getCurrentSeason();

    // Filter foods based on prakriti, age group, and season
    let availableFoods = foods as unknown as Food[];
    
    // Apply allergen filtering first (safety critical)
    if (profile?.allergies && Array.isArray(profile.allergies) && profile.allergies.length > 0) {
      availableFoods = filterFoodsByAllergies(availableFoods, profile.allergies);
    }
    
    const prakritiFiltered = filterFoodsByPrakriti(availableFoods, prakriti as PrakritiType);
    const ageFiltered = filterFoodsByAgeGroup(prakritiFiltered, ageGroup);
    
    // Apply seasonal filtering for optimal recommendations
    const seasonalFoods = filterSeasonalFoods(ageFiltered, currentSeason);
    const filteredFoods = seasonalFoods.length > 10 ? seasonalFoods : ageFiltered; // Fallback if too few seasonal foods
    
    // If weekly plan requested and profile provided, generate weekly plan
    if (generateWeekly && profile) {
      const patientProfile = profile as PatientProfile;
      
      // Calculate caloric needs from profile
      const caloricNeeds = calculateCaloricNeeds(
        patientProfile.weight || 70, // default weight if not provided
        patientProfile.height || 170, // default height if not provided
        patientProfile.age,
        patientProfile.gender?.toLowerCase() as 'male' | 'female' || 'male',
        patientProfile.activityLevel?.toLowerCase() as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' || 'sedentary',
        'maintain' // default weight goal
      );
      
      const weeklyPlan = await generateWeeklyMealPlan(
        patientProfile,
        caloricNeeds,
        {
          considerSeasonal: true,
          avoidRepetition: true
        }
      );
      
      // Add seasonal guidelines
      const seasonalGuidelines = getSeasonalGuidelines(currentSeason);
      
      return NextResponse.json({
        ...weeklyPlan,
        seasonalGuidelines,
        currentSeason
      });
    }

    // Create diet plan
    const dietPlan: DietPlan = {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    // Breakfast: Easy to digest items
    const easyDigestFoods = filterFoodsByDigestibility(filteredFoods, 'Easy');
    if (easyDigestFoods.length > 0) {
      dietPlan.breakfast.push(easyDigestFoods[0]);
      if (easyDigestFoods.length > 1) {
        dietPlan.breakfast.push(easyDigestFoods[1]);
      }
    }

    // Lunch: Grains, Proteins, and Vegetables
    const lunchGrains = filterFoodsByCategory(filteredFoods, 'Grain');
    const lunchProteins = filteredFoods.filter(food => 
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

    // Calculate nutritional summary
    const allFoods = [...dietPlan.breakfast, ...dietPlan.lunch, ...dietPlan.dinner];
    const patientProfile = profile as PatientProfile | undefined;
    dietPlan.nutritionalSummary = calculateNutritionalSummary(allFoods, patientProfile);

    // Add guidelines and meal timings if profile provided
    if (patientProfile) {
      dietPlan.guidelines = getAyurvedicGuidelines(patientProfile);
      dietPlan.mealTimings = getMealTimings();
      dietPlan.generatedAt = new Date();
      
      // Add seasonal information
      const seasonalGuidelines = getSeasonalGuidelines(currentSeason);
      (dietPlan as any).seasonalInfo = {
        currentSeason,
        guidelines: seasonalGuidelines,
        seasonalFoodsUsed: seasonalFoods.length
      };
    }

    return NextResponse.json(dietPlan);

  } catch (error) {
    console.error('Error generating diet plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}