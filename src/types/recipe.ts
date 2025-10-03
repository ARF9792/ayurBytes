// Recipe-related type definitions

import { Food, NutritionalInfo, Season, PrakritiType, AgeGroup } from './index';

/**
 * Recipe ingredient with quantity
 */
export interface RecipeIngredient {
  foodId: number;
  foodName: string;
  quantity: number;
  unit: string; // g, ml, cup, tbsp, tsp, piece, etc.
}

/**
 * Cooking instruction step
 */
export interface CookingStep {
  stepNumber: number;
  instruction: string;
  duration?: number; // minutes
}

/**
 * Complete recipe structure
 */
export interface Recipe {
  id: number;
  name: string;
  nameSanskrit?: string;
  nameHindi?: string;
  description: string;
  category: RecipeCategory;
  servings: number;
  prepTime: number; // minutes
  cookTime: number; // minutes
  totalTime: number; // minutes
  difficulty: DifficultyLevel;
  
  // Ingredients
  ingredients: RecipeIngredient[];
  
  // Instructions
  steps: CookingStep[];
  
  // Nutritional info (auto-calculated from ingredients)
  nutrition: NutritionalInfo;
  totalCalories: number;
  
  // Ayurvedic properties
  suitableFor: AgeGroup[];
  bestForPrakriti: PrakritiType[];
  bestSeasons: Season[];
  mealType: MealType[];
  
  // Additional info
  region: string;
  tags: string[];
  healthBenefits?: string[];
  ayurvedicNotes?: string;
}

/**
 * Recipe categories
 */
export type RecipeCategory = 
  | 'Breakfast'
  | 'Main Course'
  | 'Side Dish'
  | 'Snack'
  | 'Beverage'
  | 'Dessert'
  | 'Soup'
  | 'Salad';

/**
 * Difficulty levels
 */
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

/**
 * Meal type for recipes
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';
