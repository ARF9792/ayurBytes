'use client';

import { useState } from 'react';
import { Recipe } from '@/types/recipe';
import { RecipeCard, RecipeDetail } from './RecipeDisplay';
import { Search, Filter, ChefHat } from 'lucide-react';

interface RecipeBrowserProps {
  recipes: Recipe[];
  dietPlanFoods?: string[]; // Food names from current diet plan
}

export default function RecipeBrowser({ recipes, dietPlanFoods = [] }: RecipeBrowserProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(recipes.map(r => r.category)))];
  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.nameHindi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Separate recommended recipes (based on diet plan)
  const recommendedRecipes = filteredRecipes.filter(recipe =>
    recipe.ingredients.some(ing =>
      dietPlanFoods.some(food =>
        ing.foodName.toLowerCase().includes(food.toLowerCase()) ||
        food.toLowerCase().includes(ing.foodName.toLowerCase())
      )
    )
  );

  const otherRecipes = filteredRecipes.filter(recipe => !recommendedRecipes.includes(recipe));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ChefHat className="w-8 h-8 text-emerald-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ayurvedic Recipe Library</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Discover traditional recipes aligned with your dietary needs
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search recipes by name, ingredients, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:outline-none transition-colors bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:outline-none text-sm min-w-[160px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none cursor-pointer hover:border-emerald-300 transition-colors"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 pr-10 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 focus:outline-none text-sm min-w-[160px] bg-white dark:bg-gray-900 text-gray-900 dark:text-white appearance-none cursor-pointer hover:border-emerald-300 transition-colors"
              style={{ 
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="ml-auto text-sm text-gray-600 dark:text-gray-400 font-medium">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Recipes (if diet plan exists) */}
      {recommendedRecipes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommended for Your Diet Plan
            </h3>
            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold">
              {recommendedRecipes.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Recipes */}
      {otherRecipes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {recommendedRecipes.length > 0 ? 'More Recipes' : 'All Recipes'}
            </h3>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-semibold">
              {otherRecipes.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No recipes found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
}
