'use client';

import { Calendar, TrendingUp, Award, Utensils, Sun, Moon } from 'lucide-react';
import { useTranslation } from '@/src/contexts/TranslationContext';
import DietTypeBadge from './DietTypeBadge';

interface WeeklyPlanDisplayProps {
  weeklyPlan: any;
}

export default function WeeklyPlanDisplay({ weeklyPlan }: WeeklyPlanDisplayProps) {
  const { t } = useTranslation();

  if (!weeklyPlan) return null;

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(weeklyPlan.weekStartDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return days[date.getDay()];
  };

  const formatDate = (dayNumber: number) => {
    const date = new Date(weeklyPlan.weekStartDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Your 7-Day Meal Plan</h2>
            <p className="text-emerald-100">
              {new Date(weeklyPlan.weekStartDate).toLocaleDateString()} - {new Date(weeklyPlan.weekEndDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm opacity-90">Avg Calories</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(weeklyPlan.weeklyNutritionAverage?.calories || 0)}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-sm opacity-90">Variety Score</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round((weeklyPlan.varietyScore || 0) * 100)}%
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm opacity-90">Protein</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(weeklyPlan.weeklyNutritionAverage?.protein || 0)}g
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm opacity-90">Season</span>
            </div>
            <div className="text-lg font-bold">
              {weeklyPlan.currentSeason || 'All Season'}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Plans */}
      <div className="space-y-6">
        {weeklyPlan.dailyPlans?.map((day: any, index: number) => (
          <div 
            key={day.dayNumber}
            className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' :
                    index === 6 ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                    'bg-gradient-to-br from-blue-400 to-indigo-500'
                  }`}>
                    {day.dayNumber}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{getDayName(day.dayNumber)}</h3>
                    <p className="text-sm text-gray-500">{formatDate(day.dayNumber)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Total Calories</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {Math.round(day.totalCalories || 0)}
                  </div>
                </div>
              </div>
            </div>

            {/* Meals */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Breakfast */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <h4 className="font-bold text-gray-800">Breakfast</h4>
                  </div>
                  {day.breakfast?.map((food: any, idx: number) => (
                    <div key={idx} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                      <div className="font-medium text-sm text-gray-800 mb-2">{food.name}</div>
                      <div className="flex flex-wrap gap-2">
                        <DietTypeBadge dietType={food.dietType} size="sm" />
                        <span className="text-xs text-gray-600">{food.calories} kcal</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lunch */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="w-5 h-5 text-orange-500" />
                    <h4 className="font-bold text-gray-800">Lunch</h4>
                  </div>
                  {day.lunch?.map((food: any, idx: number) => (
                    <div key={idx} className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                      <div className="font-medium text-sm text-gray-800 mb-2">{food.name}</div>
                      <div className="flex flex-wrap gap-2">
                        <DietTypeBadge dietType={food.dietType} size="sm" />
                        <span className="text-xs text-gray-600">{food.calories} kcal</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dinner */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <h4 className="font-bold text-gray-800">Dinner</h4>
                  </div>
                  {day.dinner?.map((food: any, idx: number) => (
                    <div key={idx} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <div className="font-medium text-sm text-gray-800 mb-2">{food.name}</div>
                      <div className="flex flex-wrap gap-2">
                        <DietTypeBadge dietType={food.dietType} size="sm" />
                        <span className="text-xs text-gray-600">{food.calories} kcal</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal Guidelines */}
      {weeklyPlan.seasonalGuidelines && weeklyPlan.seasonalGuidelines.length > 0 && (
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            Seasonal Guidelines for {weeklyPlan.currentSeason}
          </h3>
          <ul className="space-y-2">
            {weeklyPlan.seasonalGuidelines.map((guideline: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-teal-500 mt-1">•</span>
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
