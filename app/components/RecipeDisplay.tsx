'use client';

import React from 'react';
import { Recipe, DifficultyLevel } from '@/types/recipe';
import { formatCookingTime, calculatePerServingNutrition } from '@/lib/recipeHelpers';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const perServing = calculatePerServingNutrition(recipe);

  const difficultyColors: Record<DifficultyLevel, string> = {
    Easy: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  };

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{recipe.name}</h3>
          {recipe.nameHindi && (
            <p className="text-sm text-gray-600 dark:text-gray-400">{recipe.nameHindi}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{recipe.description}</p>

      {/* Quick Info */}
      <div className="flex gap-4 mb-3 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-1">
          <span className="font-medium">⏱️</span>
          <span>{formatCookingTime(recipe.totalTime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">🍽️</span>
          <span>{recipe.servings} servings</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium">🔥</span>
          <span>{perServing.calories} cal/serving</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
          {recipe.category}
        </span>
        {recipe.tags.slice(0, 2).map((tag: string, idx: number) => (
          <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Nutrition Preview */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
          <div className="font-medium text-blue-900 dark:text-blue-300">Protein</div>
          <div className="text-blue-700 dark:text-blue-400">{perServing.nutrition.macronutrients.protein}g</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
          <div className="font-medium text-orange-900 dark:text-orange-300">Carbs</div>
          <div className="text-orange-700 dark:text-orange-400">{perServing.nutrition.macronutrients.carbohydrates}g</div>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
          <div className="font-medium text-yellow-900 dark:text-yellow-300">Fats</div>
          <div className="text-yellow-700 dark:text-yellow-400">{perServing.nutrition.macronutrients.fats}g</div>
        </div>
      </div>
    </div>
  );
}

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const perServing = calculatePerServingNutrition(recipe);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.name}</h2>
            {recipe.nameHindi && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">{recipe.nameHindi}</p>
            )}
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{recipe.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <div className="text-sm text-blue-900 dark:text-blue-300 font-medium">Prep Time</div>
              <div className="text-lg text-blue-700 dark:text-blue-400">{formatCookingTime(recipe.prepTime)}</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
              <div className="text-sm text-green-900 dark:text-green-300 font-medium">Cook Time</div>
              <div className="text-lg text-green-700 dark:text-green-400">{formatCookingTime(recipe.cookTime)}</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded">
              <div className="text-sm text-purple-900 dark:text-purple-300 font-medium">Total Time</div>
              <div className="text-lg text-purple-700 dark:text-purple-400">{formatCookingTime(recipe.totalTime)}</div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded">
              <div className="text-sm text-orange-900 dark:text-orange-300 font-medium">Servings</div>
              <div className="text-lg text-orange-700 dark:text-orange-400">{recipe.servings}</div>
            </div>
          </div>

          {/* Nutrition per Serving */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold dark:text-white mb-3">Nutrition per Serving</h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {perServing.calories} calories
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                  <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    {perServing.nutrition.macronutrients.protein}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                  <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                    {perServing.nutrition.macronutrients.carbohydrates}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fats</div>
                  <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                    {perServing.nutrition.macronutrients.fats}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Fiber</div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {perServing.nutrition.macronutrients.fiber}g
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold dark:text-white mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500 dark:text-orange-400 mt-1">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                    {' '}{ingredient.foodName}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold dark:text-white mb-3">Cooking Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step: any) => (
                <li key={step.stepNumber} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 dark:bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-700 dark:text-gray-300">{step.instruction}</p>
                    {step.duration && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">⏱️ {step.duration} min</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Health Benefits */}
          {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold dark:text-white mb-3">Health Benefits</h3>
              <ul className="space-y-2">
                {recipe.healthBenefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 dark:text-green-400 mt-1">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ayurvedic Notes */}
          {recipe.ayurvedicNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-yellow-900 dark:text-yellow-300">🕉️ Ayurvedic Notes</h3>
              <p className="text-gray-700 dark:text-gray-300">{recipe.ayurvedicNotes}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-gray-700 dark:text-gray-300">
                <div className="text-sm">
                  <span className="font-medium">Best for: </span>
                  {recipe.bestForPrakriti.join(', ')}
                </div>
                <div className="text-sm">
                  <span className="font-medium">• Seasons: </span>
                  {recipe.bestSeasons.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect?: (recipe: Recipe) => void;
}

export function RecipeList({ recipes, onRecipeSelect }: RecipeListProps) {
  const [selectedRecipe, setSelectedRecipe] = React.useState<Recipe | null>(null);

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    if (onRecipeSelect) {
      onRecipeSelect(recipe);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onClick={() => handleRecipeClick(recipe)}
          />
        ))}
      </div>

      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
