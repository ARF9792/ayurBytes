'use client';

import { Activity, Flame, Zap, Leaf, TrendingUp, PieChart } from 'lucide-react';
import { NutritionalSummary as NutritionalSummaryType, PatientProfile } from '@/src/types';
import { 
  calculateDailyCalories, 
  calculateDailyProtein, 
  calculateDailyCarbs, 
  calculateDailyFats,
  calculateDailyFiber 
} from '@/src/lib/nutritionHelpers';

interface NutritionalSummaryProps {
  summary: NutritionalSummaryType;
  profile?: PatientProfile;
}

export default function NutritionalSummary({ summary, profile }: NutritionalSummaryProps) {
  const dailyRequirements = profile ? {
    calories: calculateDailyCalories(profile),
    protein: calculateDailyProtein(profile),
    carbs: calculateDailyCarbs(calculateDailyCalories(profile)),
    fats: calculateDailyFats(calculateDailyCalories(profile)),
    fiber: calculateDailyFiber(profile)
  } : null;

  const getPercentageColor = (percentage: number) => {
    if (percentage < 70) return 'text-yellow-600';
    if (percentage > 130) return 'text-red-600';
    return 'text-green-600';
  };

  const renderProgressBar = (current: number, target: number, color: string) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  const renderRasaPieChart = () => {
    const { rasaBalance } = summary;
    const total = Object.values(rasaBalance).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return null;

    const rasaData = [
      { name: 'Sweet', value: rasaBalance.sweet, color: '#f59e0b', emoji: '🍯' },
      { name: 'Sour', value: rasaBalance.sour, color: '#ef4444', emoji: '🍋' },
      { name: 'Salty', value: rasaBalance.salty, color: '#3b82f6', emoji: '🧂' },
      { name: 'Pungent', value: rasaBalance.pungent, color: '#dc2626', emoji: '🌶️' },
      { name: 'Bitter', value: rasaBalance.bitter, color: '#059669', emoji: '🥬' },
      { name: 'Astringent', value: rasaBalance.astringent, color: '#8b5cf6', emoji: '🫘' }
    ];

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {rasaData.map((rasa) => (
          rasa.value > 0 && (
            <div key={rasa.name} className="flex items-center gap-2 p-3 rounded-xl bg-white/60 border border-gray-200/50">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-md"
                style={{ backgroundColor: rasa.color + '20' }}
              >
                {rasa.emoji}
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-600">{rasa.name}</div>
                <div className="text-lg font-bold" style={{ color: rasa.color }}>
                  {rasa.value}
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 rounded-3xl shadow-2xl border border-purple-100/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/25">
            <PieChart className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Nutritional Summary
            </span>
          </h2>
          <p className="text-gray-600">Complete nutritional breakdown of your diet plan</p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Macronutrients */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Macronutrients
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Calories */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-orange-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Calories</div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalCalories}</div>
                </div>
              </div>
              {dailyRequirements && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Target: {dailyRequirements.calories} kcal
                  </div>
                  {renderProgressBar(summary.totalCalories, dailyRequirements.calories, 'bg-gradient-to-r from-orange-400 to-red-500')}
                  <div className={`text-xs font-bold ${getPercentageColor(summary.caloriePercentage || 0)}`}>
                    {summary.caloriePercentage}% of daily needs
                  </div>
                </div>
              )}
            </div>

            {/* Protein */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Protein</div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalProtein}g</div>
                </div>
              </div>
              {dailyRequirements && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Target: {dailyRequirements.protein}g
                  </div>
                  {renderProgressBar(summary.totalProtein, dailyRequirements.protein, 'bg-gradient-to-r from-blue-400 to-indigo-500')}
                  <div className={`text-xs font-bold ${getPercentageColor(summary.proteinPercentage || 0)}`}>
                    {summary.proteinPercentage}% of daily needs
                  </div>
                </div>
              )}
            </div>

            {/* Carbohydrates */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-green-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Carbs</div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalCarbs}g</div>
                </div>
              </div>
              {dailyRequirements && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Target: {dailyRequirements.carbs}g
                  </div>
                  {renderProgressBar(summary.totalCarbs, dailyRequirements.carbs, 'bg-gradient-to-r from-green-400 to-emerald-500')}
                  <div className={`text-xs font-bold ${getPercentageColor(summary.carbsPercentage || 0)}`}>
                    {summary.carbsPercentage}% of daily needs
                  </div>
                </div>
              )}
            </div>

            {/* Fats */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-yellow-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Fats</div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalFats}g</div>
                </div>
              </div>
              {dailyRequirements && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Target: {dailyRequirements.fats}g
                  </div>
                  {renderProgressBar(summary.totalFats, dailyRequirements.fats, 'bg-gradient-to-r from-yellow-400 to-amber-500')}
                  <div className={`text-xs font-bold ${getPercentageColor(summary.fatsPercentage || 0)}`}>
                    {summary.fatsPercentage}% of daily needs
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fiber */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-teal-200/50 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">Dietary Fiber</div>
                  <div className="text-2xl font-bold text-gray-800">{summary.totalFiber}g</div>
                </div>
              </div>
              {dailyRequirements && (
                <div className="text-right">
                  <div className="text-xs text-gray-600">Target: {dailyRequirements.fiber}g</div>
                  <div className="text-lg font-bold text-teal-600">
                    {Math.round((summary.totalFiber / dailyRequirements.fiber) * 100)}%
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Six Tastes (Rasa) Balance */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-600" />
            Six Tastes (Rasa) Balance
          </h3>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-lg">
            <p className="text-sm text-gray-600 mb-4">
              According to Ayurveda, a balanced meal should include all six tastes for optimal health and satisfaction.
            </p>
            {renderRasaPieChart()}
          </div>
        </div>

        {/* Daily Progress Message */}
        {dailyRequirements && summary.caloriePercentage && (
          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl">
            <p className="text-sm text-emerald-800">
              <strong>Note:</strong> This diet plan provides approximately{' '}
              <strong>{summary.caloriePercentage}%</strong> of your daily caloric needs.{' '}
              {summary.caloriePercentage < 50 && 'Additional meals or snacks are recommended.'}
              {summary.caloriePercentage >= 50 && summary.caloriePercentage <= 100 && 'Good coverage for main meals.'}
              {summary.caloriePercentage > 100 && 'This exceeds recommended daily intake. Consider portion sizes.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
