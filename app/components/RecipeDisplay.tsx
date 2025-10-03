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
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800'
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{recipe.name}</h3>
          {recipe.nameHindi && (
            <p className="text-sm text-gray-600">{recipe.nameHindi}</p>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
          {recipe.difficulty}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>

      {/* Quick Info */}
      <div className="flex gap-4 mb-3 text-sm text-gray-700">
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
        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
          {recipe.category}
        </span>
        {recipe.tags.slice(0, 2).map((tag: string, idx: number) => (
          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Nutrition Preview */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="bg-blue-50 p-2 rounded">
          <div className="font-medium text-blue-900">Protein</div>
          <div className="text-blue-700">{perServing.nutrition.macronutrients.protein}g</div>
        </div>
        <div className="bg-orange-50 p-2 rounded">
          <div className="font-medium text-orange-900">Carbs</div>
          <div className="text-orange-700">{perServing.nutrition.macronutrients.carbohydrates}g</div>
        </div>
        <div className="bg-yellow-50 p-2 rounded">
          <div className="font-medium text-yellow-900">Fats</div>
          <div className="text-yellow-700">{perServing.nutrition.macronutrients.fats}g</div>
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{recipe.name}</h2>
            {recipe.nameHindi && (
              <p className="text-lg text-gray-600 mt-1">{recipe.nameHindi}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">{recipe.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded">
              <div className="text-sm text-blue-900 font-medium">Prep Time</div>
              <div className="text-lg text-blue-700">{formatCookingTime(recipe.prepTime)}</div>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <div className="text-sm text-green-900 font-medium">Cook Time</div>
              <div className="text-lg text-green-700">{formatCookingTime(recipe.cookTime)}</div>
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <div className="text-sm text-purple-900 font-medium">Total Time</div>
              <div className="text-lg text-purple-700">{formatCookingTime(recipe.totalTime)}</div>
            </div>
            <div className="bg-orange-50 p-3 rounded">
              <div className="text-sm text-orange-900 font-medium">Servings</div>
              <div className="text-lg text-orange-700">{recipe.servings}</div>
            </div>
          </div>

          {/* Nutrition per Serving */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Nutrition per Serving</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-gray-900 mb-3">
                {perServing.calories} calories
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Protein</div>
                  <div className="text-lg font-semibold text-blue-600">
                    {perServing.nutrition.macronutrients.protein}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Carbs</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {perServing.nutrition.macronutrients.carbohydrates}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fats</div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {perServing.nutrition.macronutrients.fats}g
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Fiber</div>
                  <div className="text-lg font-semibold text-green-600">
                    {perServing.nutrition.macronutrients.fiber}g
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient: any, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span className="text-gray-700">
                    <span className="font-medium">{ingredient.quantity} {ingredient.unit}</span>
                    {' '}{ingredient.foodName}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Cooking Instructions</h3>
            <ol className="space-y-4">
              {recipe.steps.map((step: any) => (
                <li key={step.stepNumber} className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">
                    {step.stepNumber}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-700">{step.instruction}</p>
                    {step.duration && (
                      <p className="text-sm text-gray-500 mt-1">⏱️ {step.duration} min</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Health Benefits */}
          {recipe.healthBenefits && recipe.healthBenefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Health Benefits</h3>
              <ul className="space-y-2">
                {recipe.healthBenefits.map((benefit: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Ayurvedic Notes */}
          {recipe.ayurvedicNotes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-yellow-900">🕉️ Ayurvedic Notes</h3>
              <p className="text-gray-700">{recipe.ayurvedicNotes}</p>
              <div className="mt-3 flex flex-wrap gap-2">
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
