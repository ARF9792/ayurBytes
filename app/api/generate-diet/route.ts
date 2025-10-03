import { NextRequest, NextResponse } from 'next/server';
import foods from '@/data/foods.json';
import { Food, DietPlan, PrakritiType, PatientProfile } from '@/src/types';
import { getAgeGroup } from '@/src/lib/utils';
import { 
  filterFoodsByPrakriti, 
  filterFoodsByAgeGroup,
  filterFoodsByDigestibility,
  filterFoodsByCategory 
} from '@/src/lib/dietHelpers';
import { 
  calculateNutritionalSummary, 
  getAyurvedicGuidelines,
  getMealTimings
} from '@/src/lib/nutritionHelpers';

export async function POST(request: NextRequest) {
  try {
    const { age, prakriti, profile } = await request.json();

    if (!prakriti || age === undefined) {
      return NextResponse.json(
        { error: 'Prakriti and age are required' },
        { status: 400 }
      );
    }
    
    // Determine the age group
    const ageGroup = getAgeGroup(age);

    // Filter foods based on prakriti and age group
    const prakritiFiltered = filterFoodsByPrakriti(foods as Food[], prakriti as PrakritiType);
    const filteredFoods = filterFoodsByAgeGroup(prakritiFiltered, ageGroup);

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