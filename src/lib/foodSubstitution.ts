import { Food, Rasa } from '@/types';
import { FoodSubstitute } from '@/types/advancedDiet';

/**
 * Calculate nutritional similarity score between two foods (0-100)
 */
function calculateNutritionalSimilarity(food1: Food, food2: Food): number {
  // Get nutrition from either nested or flat structure
  const getNutrition = (food: Food) => {
    if (!food.nutrition) {
      return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
    }
    
    if ('macronutrients' in food.nutrition) {
      return {
        calories: food.calories || 0,
        protein: food.nutrition.macronutrients.protein,
        carbs: food.nutrition.macronutrients.carbohydrates,
        fat: food.nutrition.macronutrients.fats,
        fiber: food.nutrition.macronutrients.fiber,
      };
    } else {
      const flatNutrition = food.nutrition as any;
      return {
        calories: flatNutrition.calories || food.calories || 0,
        protein: flatNutrition.protein || 0,
        carbs: flatNutrition.carbohydrates || 0,
        fat: flatNutrition.fats || 0,
        fiber: flatNutrition.fiber || 0,
      };
    }
  };

  const n1 = getNutrition(food1);
  const n2 = getNutrition(food2);

  // Calculate percentage differences
  const caloriesDiff = Math.abs(n1.calories - n2.calories) / Math.max(n1.calories, n2.calories, 1);
  const proteinDiff = Math.abs(n1.protein - n2.protein) / Math.max(n1.protein, n2.protein, 1);
  const carbsDiff = Math.abs(n1.carbs - n2.carbs) / Math.max(n1.carbs, n2.carbs, 1);
  const fatDiff = Math.abs(n1.fat - n2.fat) / Math.max(n1.fat, n2.fat, 1);
  const fiberDiff = Math.abs(n1.fiber - n2.fiber) / Math.max(n1.fiber, n2.fiber, 1);

  // Weighted average (calories and protein more important)
  const avgDiff = (
    caloriesDiff * 0.30 +
    proteinDiff * 0.25 +
    carbsDiff * 0.20 +
    fatDiff * 0.15 +
    fiberDiff * 0.10
  );

  // Convert to similarity score (inverse of difference)
  return Math.round((1 - avgDiff) * 100);
}

/**
 * Check if food matches category or subcategory
 */
function matchesCategory(food: Food, category: string): boolean {
  return food.category.toLowerCase() === category.toLowerCase();
}

/**
 * Get substitution reason based on similarity and attributes
 */
function getSubstitutionReason(
  original: Food,
  substitute: Food,
  similarityScore: number
): string {
  const reasons: string[] = [];

  // Category match
  if (original.category === substitute.category) {
    reasons.push(`Same category (${substitute.category})`);
  }

  // Prakriti compatibility
  const originalPrakriti = original.ayurvedic.suitableFor || [];
  const substitutePrakriti = substitute.ayurvedic.suitableFor || [];
  const commonPrakriti = originalPrakriti.filter(p => substitutePrakriti.includes(p));
  
  if (commonPrakriti.length > 0) {
    reasons.push(`Suitable for ${commonPrakriti.join(', ')} prakriti`);
  }

  // Taste similarity (rasa)
  const originalTastes = original.ayurvedic.rasa || [];
  const substituteTastes = substitute.ayurvedic.rasa || [];
  const commonTastes = originalTastes.filter((t: Rasa) => substituteTastes.includes(t));
  
  if (commonTastes.length > 0) {
    reasons.push(`Similar tastes: ${commonTastes.join(', ')}`);
  }

  // Nutritional similarity
  if (similarityScore >= 80) {
    reasons.push('Very similar nutritional profile');
  } else if (similarityScore >= 60) {
    reasons.push('Similar nutritional profile');
  }

  // Digestibility
  if (original.ayurvedic.digestibility === substitute.ayurvedic.digestibility) {
    reasons.push(`Same digestibility (${substitute.ayurvedic.digestibility})`);
  }

  return reasons.length > 0 ? reasons.join('; ') : 'Alternative option';
}

/**
 * Find substitute foods for a given food item
 */
export function findFoodSubstitutes(
  originalFood: Food,
  allFoods: Food[],
  options: {
    minSimilarity?: number;      // Minimum similarity score (0-100)
    maxResults?: number;          // Maximum number of substitutes
    sameCategoryOnly?: boolean;   // Only suggest from same category
    matchPrakriti?: boolean;      // Match prakriti suitability
  } = {}
): FoodSubstitute {
  const {
    minSimilarity = 50,
    maxResults = 5,
    sameCategoryOnly = false,
    matchPrakriti = true,
  } = options;

  // Filter potential substitutes
  let candidates = allFoods.filter(food => {
    // Exclude the original food
    if (food.id === originalFood.id) return false;

    // Category filter
    if (sameCategoryOnly && food.category !== originalFood.category) {
      return false;
    }

    // Prakriti filter
    if (matchPrakriti) {
      const originalPrakriti = originalFood.ayurvedic.suitableFor || [];
      const foodPrakriti = food.ayurvedic.suitableFor || [];
      const hasCommonPrakriti = originalPrakriti.some(p => foodPrakriti.includes(p));
      
      if (!hasCommonPrakriti && originalPrakriti.length > 0) {
        return false;
      }
    }

    return true;
  });

  // Calculate similarity scores
  const scoredSubstitutes = candidates.map(food => ({
    food,
    nutritionalMatch: calculateNutritionalSimilarity(originalFood, food),
    reason: '',
  }));

  // Filter by minimum similarity and sort by score
  const filteredSubstitutes = scoredSubstitutes
    .filter(sub => sub.nutritionalMatch >= minSimilarity)
    .sort((a, b) => b.nutritionalMatch - a.nutritionalMatch)
    .slice(0, maxResults);

  // Add substitution reasons
  filteredSubstitutes.forEach(sub => {
    sub.reason = getSubstitutionReason(originalFood, sub.food, sub.nutritionalMatch);
  });

  return {
    originalFood,
    substitutes: filteredSubstitutes,
  };
}

/**
 * Find substitutes for multiple foods at once
 */
export function findMultipleFoodSubstitutes(
  foods: Food[],
  allFoods: Food[],
  options?: Parameters<typeof findFoodSubstitutes>[2]
): FoodSubstitute[] {
  return foods.map(food => findFoodSubstitutes(food, allFoods, options));
}

/**
 * Find substitute for allergy/intolerance
 */
export function findAllergySubstitute(
  allergyFood: Food,
  allFoods: Food[],
  allergyType: string
): FoodSubstitute {
  // More lenient options for allergy substitutes
  const substitute = findFoodSubstitutes(allergyFood, allFoods, {
    minSimilarity: 30,  // Lower threshold for allergies
    maxResults: 10,     // More options
    sameCategoryOnly: true,  // Try to stay in same category
    matchPrakriti: true,
  });

  // Update reasons to mention allergy
  substitute.substitutes.forEach(sub => {
    sub.reason = `Allergen-free alternative (${allergyType}); ` + sub.reason;
  });

  return substitute;
}

/**
 * Suggest protein alternatives (for vegetarian/vegan diets)
 */
export function findProteinAlternatives(
  allFoods: Food[],
  dietType: 'vegetarian' | 'vegan' | 'any' = 'vegetarian'
): Food[] {
  const proteinSources = allFoods.filter(food => {
    // Get protein content from either structure
    let proteinContent = 0;
    if (food.nutrition && 'macronutrients' in food.nutrition) {
      proteinContent = food.nutrition.macronutrients.protein;
    } else {
      const flatNutrition = food.nutrition as any;
      proteinContent = flatNutrition.protein || 0;
    }

    // Must have at least 10g protein per serving
    if (proteinContent < 10) return false;

    // Filter by diet type
    const category = food.category.toLowerCase();
    
    if (dietType === 'vegan') {
      // Exclude all animal products
      return !['dairy', 'egg', 'meat', 'fish', 'protein'].includes(category) ||
             category === 'lentil' || category === 'grain';
    } else if (dietType === 'vegetarian') {
      // Exclude meat and fish
      return !['meat', 'fish'].includes(category);
    }

    return true;
  });

  // Sort by protein content (descending)
  return proteinSources.sort((a, b) => {
    const getProtein = (food: Food) => {
      if (food.nutrition && 'macronutrients' in food.nutrition) {
        return food.nutrition.macronutrients.protein;
      } else {
        return (food.nutrition as any).protein || 0;
      }
    };
    return getProtein(b) - getProtein(a);
  });
}

/**
 * Get substitute suggestions based on patient preferences
 */
export function getPreferenceBasedSubstitutes(
  dietPlanFoods: Food[],
  allFoods: Food[],
  preferences: {
    avoidCategories?: string[];
    preferCategories?: string[];
    allergies?: string[];
    dietType?: 'vegetarian' | 'vegan' | 'any';
  }
): Map<string, FoodSubstitute> {
  const substitutesMap = new Map<string, FoodSubstitute>();

  dietPlanFoods.forEach(food => {
    let needsSubstitute = false;
    let substituteType = 'preference';

    // Check if food should be avoided
    if (preferences.avoidCategories?.includes(food.category)) {
      needsSubstitute = true;
      substituteType = 'category preference';
    }

    // Check allergies
    if (preferences.allergies?.some(allergen => 
      food.name.toLowerCase().includes(allergen.toLowerCase())
    )) {
      needsSubstitute = true;
      substituteType = 'allergy';
    }

    // Check diet type
    if (preferences.dietType === 'vegan') {
      const nonVeganCategories = ['dairy', 'egg', 'meat', 'fish'];
      if (nonVeganCategories.includes(food.category.toLowerCase())) {
        needsSubstitute = true;
        substituteType = 'vegan diet';
      }
    } else if (preferences.dietType === 'vegetarian') {
      const nonVegCategories = ['meat', 'fish'];
      if (nonVegCategories.includes(food.category.toLowerCase())) {
        needsSubstitute = true;
        substituteType = 'vegetarian diet';
      }
    }

    // Find substitute if needed
    if (needsSubstitute) {
      const substitute = substituteType === 'allergy'
        ? findAllergySubstitute(food, allFoods, preferences.allergies?.join(', ') || 'unknown')
        : findFoodSubstitutes(food, allFoods, {
            minSimilarity: 40,
            maxResults: 5,
            sameCategoryOnly: false,
            matchPrakriti: true,
          });

      substitutesMap.set(food.id.toString(), substitute);
    }
  });

  return substitutesMap;
}
