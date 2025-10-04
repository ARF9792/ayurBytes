'use client';

import { Utensils, Sun, Moon, Flame, Snowflake, Zap, Star, Heart, Leaf, Clock, BookOpen, Download, Share2, Printer } from 'lucide-react';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { Food, DietPlan, PatientProfile, NutritionalSummary as NutritionalSummaryType } from '@/src/types';
import NutritionalSummary from './NutritionalSummary';
import DietTypeBadge from './DietTypeBadge';
import QRCodeShare from './QRCodeShare';
import { downloadDietPlanPDF, shareDietPlanPDF } from '@/src/lib/pdfExport';
import { useState } from 'react';

interface DietChartDisplayProps {
  dietPlan: DietPlan | null;
  patientProfile?: PatientProfile;
  nutritionalSummary?: NutritionalSummaryType;
}

export default function DietChartDisplay({ dietPlan, patientProfile, nutritionalSummary }: DietChartDisplayProps) {
  const { t } = useTranslation();
  const [isSharing, setIsSharing] = useState(false);
  
  const handleDownloadPDF = () => {
    if (dietPlan) {
      downloadDietPlanPDF(dietPlan, patientProfile, nutritionalSummary);
    }
  };

  const handleSharePDF = async () => {
    if (dietPlan) {
      setIsSharing(true);
      const success = await shareDietPlanPDF(dietPlan, patientProfile, nutritionalSummary);
      setIsSharing(false);
      
      if (!success) {
        // Fallback to download if sharing not supported
        handleDownloadPDF();
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };
  
  if (!dietPlan) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative p-12 text-center">
          <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25 animate-pulse">
            <Utensils className="w-14 h-14 text-white" />
          </div>
          <p className="text-gray-600 leading-relaxed text-lg max-w-md mx-auto">
            {t('diet.empty.message')}
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case t('diet.breakfast'):
        return <Sun className="w-6 h-6 text-amber-600" />;
      case t('diet.lunch'):
        return <Utensils className="w-6 h-6 text-orange-600" />;
      case t('diet.dinner'):
        return <Moon className="w-6 h-6 text-indigo-600" />;
      default:
        return <Utensils className="w-6 h-6 text-gray-600" />;
    }
  };

  const getMealGradient = (mealType: string) => {
    switch (mealType) {
      case t('diet.breakfast'):
        return 'from-amber-400 via-yellow-400 to-orange-400';
      case t('diet.lunch'):
        return 'from-orange-400 via-red-400 to-pink-400';
      case t('diet.dinner'):
        return 'from-indigo-400 via-purple-400 to-violet-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getMealBg = (mealType: string) => {
    switch (mealType) {
      case t('diet.breakfast'):
        return 'from-amber-50/80 via-yellow-50/60 to-orange-50/80';
      case t('diet.lunch'):
        return 'from-orange-50/80 via-red-50/60 to-pink-50/80';
      case t('diet.dinner'):
        return 'from-indigo-50/80 via-purple-50/60 to-violet-50/80';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getVirya = (virya: string) => {
    return virya === 'Heating' ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200/50 shadow-sm">
        <Flame className="w-4 h-4" />
        Heating
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200/50 shadow-sm">
        <Snowflake className="w-4 h-4" />
        Cooling
      </span>
    );
  };

  const getDigestibility = (digestibility: string) => {
    return digestibility === 'Easy' ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50 shadow-sm">
        <Zap className="w-4 h-4" />
        Easy
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200/50 shadow-sm">
        <Star className="w-4 h-4" />
        Complex
      </span>
    );
  };

  const renderMealSection = (title: string, foods: Food[]) => {
    if (foods.length === 0) {
      return null;
    }

    return (
      <div className="relative mb-12">
        <div className={`relative overflow-hidden bg-gradient-to-br ${getMealBg(title)} rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getMealGradient(title)} opacity-10 rounded-full -translate-y-20 translate-x-20`}></div>
          
          <div className="relative p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${getMealGradient(title)} rounded-2xl flex items-center justify-center shadow-lg`}>
                {getMealIcon(title)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {foods.length} item{foods.length > 1 ? 's' : ''} selected for optimal nutrition
                </p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {foods.map((food, index) => (
                <div key={food.id} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <Leaf className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                              {food.name}
                              {(food as any).nameHindi && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                  ({(food as any).nameHindi})
                                </span>
                              )}
                            </h4>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <DietTypeBadge dietType={(food as any).dietType} size="sm" />
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200/50">
                                {food.category}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50">
                                <Heart className="w-3 h-3 inline mr-1" />
                                {food.calories} {t('diet.kcal')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        {getVirya(food.ayurvedic.virya)}
                        {getDigestibility(food.ayurvedic.digestibility)}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            {t('diet.rasa')}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {food.ayurvedic.rasa.map((rasa, index) => (
                              <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
                                {rasa}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            {t('diet.guna')}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {food.ayurvedic.guna.map((guna, index) => (
                              <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200/50 shadow-sm">
                                {guna}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Export Actions */}
      <div className="flex flex-wrap gap-3 justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={handleSharePDF}
          disabled={isSharing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="w-4 h-4" />
          {isSharing ? 'Sharing...' : 'Share PDF'}
        </button>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
        <QRCodeShare dietPlan={dietPlan} />
      </div>

      {/* Nutritional Summary */}
      {dietPlan.nutritionalSummary && (
        <NutritionalSummary 
          summary={dietPlan.nutritionalSummary} 
          profile={dietPlan.patientProfile}
        />
      )}

      {/* Ayurvedic Guidelines */}
      {dietPlan.guidelines && dietPlan.guidelines.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/50 rounded-3xl shadow-2xl border border-amber-100/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Ayurvedic Guidelines</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietPlan.guidelines.map((guideline, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl border border-amber-200/50">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{guideline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Meal Timings */}
      {dietPlan.mealTimings && dietPlan.mealTimings.length > 0 && (
        <div className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-blue-50/50 rounded-3xl shadow-2xl border border-indigo-100/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5"></div>
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Recommended Meal Timings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dietPlan.mealTimings.map((timing, index) => (
                <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/50 shadow-lg">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                      {timing.meal === 'breakfast' && <Sun className="w-8 h-8 text-white" />}
                      {timing.meal === 'lunch' && <Utensils className="w-8 h-8 text-white" />}
                      {timing.meal === 'dinner' && <Moon className="w-8 h-8 text-white" />}
                    </div>
                    <h4 className="text-lg font-bold text-gray-800 capitalize mb-2">{timing.meal}</h4>
                    <div className="text-2xl font-bold text-indigo-600 mb-2">{timing.recommendedTime}</div>
                  </div>
                  <p className="text-sm text-gray-600 text-center leading-relaxed">{timing.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Diet Plan */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full -translate-y-32 translate-x-32"></div>
      
      <div className="relative p-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {t('diet.title')}
            </span>
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-8">
          {renderMealSection(t('diet.breakfast'), dietPlan.breakfast)}
          {renderMealSection(t('diet.lunch'), dietPlan.lunch)}
          {renderMealSection(t('diet.dinner'), dietPlan.dinner)}
        </div>
        
        {dietPlan.breakfast.length === 0 && 
         dietPlan.lunch.length === 0 && 
         dietPlan.dinner.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <Utensils className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              No Suitable Foods Found
            </h3>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-lg">
              We couldn't find suitable foods for your prakriti in our current database. 
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}