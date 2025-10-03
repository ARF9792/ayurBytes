/**
 * Script to process recipes and calculate nutrition from ingredients
 */

import recipesData from '../data/recipes.json';
import foodsData from '../data/foods.json';
import { Recipe } from '@/types/recipe';
import { Food } from '@/types';
import { calculateRecipeNutrition } from '@/lib/recipeHelpers';
import * as fs from 'fs';
import * as path from 'path';

// Load the data
const recipes: Recipe[] = recipesData as Recipe[];
const foods: Food[] = foodsData as unknown as Food[];

// Process each recipe
const processedRecipes = recipes.map(recipe => {
  const { nutrition, totalCalories } = calculateRecipeNutrition(recipe.ingredients, foods);
  
  return {
    ...recipe,
    nutrition,
    totalCalories
  };
});

// Write back to recipes.json
const outputPath = path.join(__dirname, '../data/recipes.json');
fs.writeFileSync(outputPath, JSON.stringify(processedRecipes, null, 2), 'utf-8');

console.log(`✓ Processed ${processedRecipes.length} recipes`);
console.log('✓ Nutritional data calculated and saved to recipes.json');

// Log summary
processedRecipes.forEach(recipe => {
  console.log(`\n${recipe.name}:`);
  console.log(`  Total Calories: ${recipe.totalCalories}`);
  console.log(`  Protein: ${recipe.nutrition.macronutrients.protein}g`);
  console.log(`  Carbs: ${recipe.nutrition.macronutrients.carbohydrates}g`);
  console.log(`  Fats: ${recipe.nutrition.macronutrients.fats}g`);
});
