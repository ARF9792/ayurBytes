/**
 * Recipe nutrition calculation helpers
 */

import { Recipe, RecipeIngredient } from '@/types/recipe';
import { Food, NutritionalInfo } from '@/types';

/**
 * Calculate total nutrition from recipe ingredients
 */
export function calculateRecipeNutrition(
  ingredients: RecipeIngredient[],
  foodDatabase: Food[]
): { nutrition: NutritionalInfo; totalCalories: number } {
  const nutrition: NutritionalInfo = {
    macronutrients: {
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      vitamins: {
        vitaminA: 0,
        vitaminC: 0,
        vitaminD: 0,
        vitaminB12: 0
      },
      minerals: {
        calcium: 0,
        iron: 0,
        magnesium: 0,
        potassium: 0,
        zinc: 0
      }
    }
  };

  let totalCalories = 0;

  ingredients.forEach(ingredient => {
    const food = foodDatabase.find(f => f.id === ingredient.foodId);
    if (!food || !food.nutrition) return;

    // Convert ingredient quantity to standard serving (100g or 100ml)
    const multiplier = convertToStandardServing(ingredient.quantity, ingredient.unit);

    // Calculate calories
    totalCalories += (food.calories || 0) * multiplier;

    // Handle both old (flat) and new (nested) nutrition structure
    const foodNutrition = food.nutrition as any;

    if (foodNutrition.macronutrients) {
      // New structure
      nutrition.macronutrients.protein += (foodNutrition.macronutrients.protein || 0) * multiplier;
      nutrition.macronutrients.carbohydrates += (foodNutrition.macronutrients.carbohydrates || 0) * multiplier;
      nutrition.macronutrients.fats += (foodNutrition.macronutrients.fats || 0) * multiplier;
      nutrition.macronutrients.fiber += (foodNutrition.macronutrients.fiber || 0) * multiplier;
      nutrition.macronutrients.sugar += (foodNutrition.macronutrients.sugar || 0) * multiplier;

      // Micronutrients - vitamins
      if (foodNutrition.micronutrients?.vitamins) {
        nutrition.micronutrients.vitamins.vitaminA += (foodNutrition.micronutrients.vitamins.vitaminA || 0) * multiplier;
        nutrition.micronutrients.vitamins.vitaminC += (foodNutrition.micronutrients.vitamins.vitaminC || 0) * multiplier;
        nutrition.micronutrients.vitamins.vitaminD += (foodNutrition.micronutrients.vitamins.vitaminD || 0) * multiplier;
        nutrition.micronutrients.vitamins.vitaminB12 += (foodNutrition.micronutrients.vitamins.vitaminB12 || 0) * multiplier;
      }

      // Micronutrients - minerals
      if (foodNutrition.micronutrients?.minerals) {
        nutrition.micronutrients.minerals.calcium += (foodNutrition.micronutrients.minerals.calcium || 0) * multiplier;
        nutrition.micronutrients.minerals.iron += (foodNutrition.micronutrients.minerals.iron || 0) * multiplier;
        nutrition.micronutrients.minerals.magnesium += (foodNutrition.micronutrients.minerals.magnesium || 0) * multiplier;
        nutrition.micronutrients.minerals.potassium += (foodNutrition.micronutrients.minerals.potassium || 0) * multiplier;
        nutrition.micronutrients.minerals.zinc += (foodNutrition.micronutrients.minerals.zinc || 0) * multiplier;
      }
    } else {
      // Old flat structure (current foods.json format)
      nutrition.macronutrients.protein += (foodNutrition.protein || 0) * multiplier;
      nutrition.macronutrients.carbohydrates += (foodNutrition.carbohydrates || 0) * multiplier;
      nutrition.macronutrients.fats += (foodNutrition.fats || 0) * multiplier;
      nutrition.macronutrients.fiber += (foodNutrition.fiber || 0) * multiplier;
      nutrition.macronutrients.sugar += (foodNutrition.sugar || 0) * multiplier;

      // Old structure vitamins/minerals (flat)
      nutrition.micronutrients.vitamins.vitaminA += (foodNutrition.vitaminA || 0) * multiplier;
      nutrition.micronutrients.vitamins.vitaminC += (foodNutrition.vitaminC || 0) * multiplier;
      nutrition.micronutrients.vitamins.vitaminD += (foodNutrition.vitaminD || 0) * multiplier;
      nutrition.micronutrients.vitamins.vitaminB12 += (foodNutrition.vitaminB12 || 0) * multiplier;
      
      nutrition.micronutrients.minerals.calcium += (foodNutrition.calcium || 0) * multiplier;
      nutrition.micronutrients.minerals.iron += (foodNutrition.iron || 0) * multiplier;
      nutrition.micronutrients.minerals.magnesium += (foodNutrition.magnesium || 0) * multiplier;
      nutrition.micronutrients.minerals.potassium += (foodNutrition.potassium || 0) * multiplier;
      nutrition.micronutrients.minerals.zinc += (foodNutrition.zinc || 0) * multiplier;
    }
  });

  // Round all values to 2 decimal places
  nutrition.macronutrients.protein = Math.round(nutrition.macronutrients.protein * 100) / 100;
  nutrition.macronutrients.carbohydrates = Math.round(nutrition.macronutrients.carbohydrates * 100) / 100;
  nutrition.macronutrients.fats = Math.round(nutrition.macronutrients.fats * 100) / 100;
  nutrition.macronutrients.fiber = Math.round(nutrition.macronutrients.fiber * 100) / 100;
  nutrition.macronutrients.sugar = Math.round(nutrition.macronutrients.sugar * 100) / 100;

  totalCalories = Math.round(totalCalories);

  return { nutrition, totalCalories };
}

/**
 * Convert various units to multiplier for 100g/100ml standard serving
 */
export function convertToStandardServing(quantity: number, unit: string): number {
  const unitLower = unit.toLowerCase();

  // Weight conversions (to 100g)
  if (unitLower === 'g' || unitLower === 'grams') {
    return quantity / 100;
  }
  if (unitLower === 'kg' || unitLower === 'kilograms') {
    return (quantity * 1000) / 100;
  }

  // Volume conversions (to 100ml)
  if (unitLower === 'ml' || unitLower === 'milliliters') {
    return quantity / 100;
  }
  if (unitLower === 'l' || unitLower === 'liters') {
    return (quantity * 1000) / 100;
  }

  // Common Indian measures
  if (unitLower === 'cup') {
    return (quantity * 240) / 100; // 1 cup = 240ml
  }
  if (unitLower === 'tbsp' || unitLower === 'tablespoon') {
    return (quantity * 15) / 100; // 1 tbsp = 15ml
  }
  if (unitLower === 'tsp' || unitLower === 'teaspoon') {
    return (quantity * 5) / 100; // 1 tsp = 5ml
  }
  if (unitLower === 'katori' || unitLower === 'bowl') {
    return (quantity * 150) / 100; // 1 katori = 150ml
  }

  // Count-based (approximate weights)
  if (unitLower === 'piece' || unitLower === 'pieces') {
    return quantity * 0.5; // Assume 50g per piece (adjust based on food)
  }
  if (unitLower === 'small') {
    return quantity * 0.3; // 30g
  }
  if (unitLower === 'medium') {
    return quantity * 0.5; // 50g
  }
  if (unitLower === 'large') {
    return quantity * 1.0; // 100g
  }

  // Default fallback
  return quantity / 100;
}

/**
 * Calculate nutrition per serving
 */
export function calculatePerServingNutrition(
  recipe: Recipe
): { nutrition: NutritionalInfo; calories: number } {
  const servings = recipe.servings || 1;

  // Return empty nutrition if recipe.nutrition is undefined
  if (!recipe.nutrition) {
    return {
      nutrition: {
        macronutrients: {
          protein: 0,
          carbohydrates: 0,
          fats: 0,
          fiber: 0,
          sugar: 0
        },
        micronutrients: {
          vitamins: {
            vitaminA: 0,
            vitaminC: 0,
            vitaminD: 0,
            vitaminB12: 0
          },
          minerals: {
            calcium: 0,
            iron: 0,
            magnesium: 0,
            potassium: 0,
            zinc: 0
          }
        }
      },
      calories: 0
    };
  }

  const nutrition: NutritionalInfo = {
    macronutrients: {
      protein: Math.round((recipe.nutrition.macronutrients?.protein || 0) / servings * 100) / 100,
      carbohydrates: Math.round((recipe.nutrition.macronutrients?.carbohydrates || 0) / servings * 100) / 100,
      fats: Math.round((recipe.nutrition.macronutrients?.fats || 0) / servings * 100) / 100,
      fiber: Math.round((recipe.nutrition.macronutrients?.fiber || 0) / servings * 100) / 100,
      sugar: Math.round((recipe.nutrition.macronutrients?.sugar || 0) / servings * 100) / 100
    },
    micronutrients: {
      vitamins: {
        vitaminA: Math.round((recipe.nutrition.micronutrients?.vitamins?.vitaminA || 0) / servings * 100) / 100,
        vitaminC: Math.round((recipe.nutrition.micronutrients?.vitamins?.vitaminC || 0) / servings * 100) / 100,
        vitaminD: Math.round((recipe.nutrition.micronutrients?.vitamins?.vitaminD || 0) / servings * 100) / 100,
        vitaminB12: Math.round((recipe.nutrition.micronutrients?.vitamins?.vitaminB12 || 0) / servings * 100) / 100
      },
      minerals: {
        calcium: Math.round((recipe.nutrition.micronutrients?.minerals?.calcium || 0) / servings * 100) / 100,
        iron: Math.round((recipe.nutrition.micronutrients?.minerals?.iron || 0) / servings * 100) / 100,
        magnesium: Math.round((recipe.nutrition.micronutrients?.minerals?.magnesium || 0) / servings * 100) / 100,
        potassium: Math.round((recipe.nutrition.micronutrients?.minerals?.potassium || 0) / servings * 100) / 100,
        zinc: Math.round((recipe.nutrition.micronutrients?.minerals?.zinc || 0) / servings * 100) / 100
      }
    }
  };

  const calories = Math.round((recipe.totalCalories || 0) / servings);

  return { nutrition, calories };
}

/**
 * Format time duration (minutes) to human-readable string
 */
export function formatCookingTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}
