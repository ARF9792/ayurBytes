import { Food, PrakritiType, AgeGroup } from '@/src/types';

/**
 * Filters foods based on Prakriti type
 * @param foods - Array of all foods
 * @param prakriti - The Prakriti type
 * @returns Filtered array of foods suitable for the Prakriti
 */
export function filterFoodsByPrakriti(foods: Food[], prakriti: PrakritiType): Food[] {
  switch (prakriti) {
    case 'Pitta':
      return foods.filter(food => food.ayurvedic.virya === 'Cooling');
    
    case 'Vata':
      return foods.filter(food => food.ayurvedic.virya === 'Heating');
    
    case 'Kapha':
      return foods.filter(food => 
        food.ayurvedic.guna.includes('Light') || 
        food.ayurvedic.guna.includes('Dry')
      );
    
    default:
      return foods;
  }
}

/**
 * Filters foods based on age group
 * @param foods - Array of foods
 * @param ageGroup - The age group
 * @returns Filtered array of foods suitable for the age group
 */
export function filterFoodsByAgeGroup(foods: Food[], ageGroup: AgeGroup): Food[] {
  return foods.filter(food => food.ayurvedic.suitableFor.includes(ageGroup));
}

/**
 * Filters foods by digestibility
 * @param foods - Array of foods
 * @param digestibility - The digestibility level
 * @returns Filtered foods
 */
export function filterFoodsByDigestibility(foods: Food[], digestibility: string): Food[] {
  return foods.filter(food => food.ayurvedic.digestibility === digestibility);
}

/**
 * Filters foods by category
 * @param foods - Array of foods
 * @param category - The food category
 * @returns Filtered foods
 */
export function filterFoodsByCategory(foods: Food[], category: string): Food[] {
  return foods.filter(food => food.category === category);
}

/**
 * Filters out foods based on allergies
 * @param foods - Array of foods
 * @param allergies - Array of allergen strings
 * @returns Filtered foods without allergens
 */
export function filterFoodsByAllergies(foods: Food[], allergies: string[]): Food[] {
  if (!allergies || allergies.length === 0) return foods;
  
  return foods.filter(food => {
    const foodNameLower = food.name.toLowerCase();
    const categoryLower = food.category.toLowerCase();
    
    // Check if any allergen matches food name or category
    return !allergies.some(allergen => {
      const allergenLower = allergen.toLowerCase().trim();
      return foodNameLower.includes(allergenLower) || 
             categoryLower.includes(allergenLower) ||
             allergenLower.includes(categoryLower);
    });
  });
}

/**
 * Calculates total calories from an array of foods
 * @param foods - Array of foods
 * @returns Total calorie count
 */
export function calculateTotalCalories(foods: Food[]): number {
  return foods.reduce((total, food) => total + food.calories, 0);
}
