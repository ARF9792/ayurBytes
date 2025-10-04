'use client';

import { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import ComprehensivePatientForm from './components/ComprehensivePatientForm';
import DietChartDisplay from './components/DietChartDisplay';
import Dashboard from './components/Dashboard';
import RecipeBrowser from './components/RecipeBrowser';
import WelcomeSection from './components/WelcomeSection';
import WeeklyPlanDisplay from './components/WeeklyPlanDisplay';
import LanguageSelector from './components/LanguageSelector';
import DarkModeToggle from './components/DarkModeToggle';
import SmartFeatures from './components/SmartFeatures';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { PatientFormData, PatientProfile, DietPlan } from '@/src/types';
import { Recipe } from '@/types/recipe';
import { API_ENDPOINTS } from '@/src/constants';
import { FileText, UserCircle, BarChart3, ChefHat, Home as HomeIcon } from 'lucide-react';
import { saveDietToHistory } from '@/lib/dashboardHelpers';

type ViewType = 'home' | 'quick-form' | 'comprehensive-form' | 'dashboard' | 'recipes';

export default function Home() {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState<ViewType>('home');
  
  // State to hold the generated diet plan
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  // State for weekly plan
  const [weeklyPlan, setWeeklyPlan] = useState<any | null>(null);
  // State to manage loading UI
  const [isLoading, setIsLoading] = useState(false);
  // State to handle potential errors
  const [error, setError] = useState<string | null>(null);
  // State to hold patient profile
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
  // State for recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Load patient profile and recipes on mount
  useEffect(() => {
    const saved = localStorage.getItem('patientProfile');
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        setPatientProfile(profile);
      } catch (e) {
        console.error('Failed to load patient profile', e);
      }
    }

    // Load recipes
    import('@/data/recipes.json')
      .then(module => {
        setRecipes((module.default || module) as Recipe[]);
      })
      .catch(err => console.error('Failed to load recipes:', err));
  }, []);

  // Save patient profile to localStorage
  const savePatientProfile = (profile: PatientProfile) => {
    setPatientProfile(profile);
    localStorage.setItem('patientProfile', JSON.stringify(profile));
  };

  // This function will be called when the basic form is submitted
  const handleBasicFormSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_DIET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan');
      }

      const plan: DietPlan = await response.json();
      setDietPlan(plan);
      
      // Save to dashboard history
      if (plan && plan.nutritionalSummary) {
        saveDietToHistory(plan, plan.nutritionalSummary);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // This function will be called when the comprehensive form is submitted
  const handleComprehensiveFormSubmit = async (profile: PatientProfile, generateWeekly = false) => {
    setIsLoading(true);
    setError(null);
    setWeeklyPlan(null); // Clear previous weekly plan
    setDietPlan(null); // Clear previous diet plan

    // Save the full profile
    savePatientProfile(profile);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_DIET, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: profile.age,
          prakriti: profile.prakriti,
          profile: profile,
          generateWeekly: generateWeekly
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan');
      }

      const data = await response.json();
      
      if (generateWeekly) {
        setWeeklyPlan(data);
      } else {
        setDietPlan(data);
        // Save to dashboard history
        if (data && data.nutritionalSummary) {
          saveDietToHistory(data, data.nutritionalSummary);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Get food names from diet plan for recipe recommendations
  const dietPlanFoodNames = dietPlan
    ? [
        ...dietPlan.breakfast,
        ...dietPlan.lunch,
        ...dietPlan.dinner,
        ...(dietPlan.snacks || [])
      ].map(food => food.name)
    : [];

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        {/* Header with Language Selector */}
        <div className="flex justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {patientProfile && (
              <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                👤 {t('app.welcome', { name: patientProfile.name || t('app.user') })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <LanguageSelector />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-2 transition-colors duration-300">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <button
              onClick={() => setCurrentView('home')}
              className={`flex items-center justify-center gap-2 px-3 py-4 md:px-4 md:py-3 rounded-xl font-semibold transition-all duration-300 min-h-[52px] ${
                currentView === 'home'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <HomeIcon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm md:text-base">{t('nav.home')}</span>
            </button>
            <button
              onClick={() => setCurrentView('quick-form')}
              className={`flex items-center justify-center gap-2 px-3 py-4 md:px-4 md:py-3 rounded-xl font-semibold transition-all duration-300 min-h-[52px] ${
                currentView === 'quick-form'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm md:text-base">{t('nav.quickstart')}</span>
            </button>
            <button
              onClick={() => setCurrentView('comprehensive-form')}
              className={`flex items-center justify-center gap-2 px-3 py-4 md:px-4 md:py-3 rounded-xl font-semibold transition-all duration-300 min-h-[52px] ${
                currentView === 'comprehensive-form'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <UserCircle className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm md:text-base">{t('nav.assessment')}</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center justify-center gap-2 px-3 py-4 md:px-4 md:py-3 rounded-xl font-semibold transition-all duration-300 min-h-[52px] ${
                currentView === 'dashboard'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm md:text-base">{t('nav.dashboard')}</span>
            </button>
            <button
              onClick={() => setCurrentView('recipes')}
              className={`flex items-center justify-center gap-2 px-3 py-4 md:px-4 md:py-3 rounded-xl font-semibold transition-all duration-300 min-h-[52px] ${
                currentView === 'recipes'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ChefHat className="w-5 h-5 flex-shrink-0" />
              <span className="hidden sm:inline text-sm md:text-base">{t('nav.recipes')}</span>
            </button>
          </div>
        </nav>

        {/* Content Area */}
        <div className="min-h-[60vh]">
          {/* Home View */}
          {currentView === 'home' && (
            <>
              <WelcomeSection />
              
              {/* Smart Features Showcase */}
              <SmartFeatures />
              
              {/* Show diet plan if exists */}
              {dietPlan && (
                <div className="mt-8">
                  <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 mb-6 border-2 border-emerald-300">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ✨ {t('dietPlan.latestPlan')}
                    </h3>
                    <p className="text-gray-700 text-lg">
                      {t('common.planGenerated')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setCurrentView('recipes')}
                        className="px-6 py-3 bg-white text-emerald-700 rounded-lg font-semibold hover:shadow-md transition-all min-h-[48px] text-sm md:text-base"
                      >
                        {t('common.findRecipes')}
                      </button>
                      <button
                        onClick={() => setCurrentView('dashboard')}
                        className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:shadow-md transition-all min-h-[48px] text-sm md:text-base"
                      >
                        {t('common.viewDashboard')}
                      </button>
                    </div>
                  </div>
                  
                  <DietChartDisplay 
                    dietPlan={dietPlan} 
                    patientProfile={patientProfile || undefined} 
                    nutritionalSummary={dietPlan?.nutritionalSummary}
                  />
                </div>
              )}
            </>
          )}

          {/* Quick Form View */}
          {currentView === 'quick-form' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-emerald-200">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('quickform.title')}</h2>
                    <p className="text-sm text-gray-600">{t('quickform.subtitle')}</p>
                  </div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-emerald-800">
                    {t('quickform.info')}
                  </p>
                </div>
              </div>

              <PatientForm onSubmit={handleBasicFormSubmit} />

              {isLoading && (
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-emerald-700">{t('app.generating')}</p>
                </div>
              )}

              {error && (
                <div className="text-center p-8 text-lg font-semibold text-red-600 bg-red-100 rounded-2xl border-2 border-red-300">
                  {error}
                </div>
              )}

              {dietPlan && !isLoading && (
                <DietChartDisplay 
                  dietPlan={dietPlan} 
                  patientProfile={patientProfile || undefined} 
                  nutritionalSummary={dietPlan?.nutritionalSummary}
                />
              )}
            </div>
          )}

          {/* Comprehensive Form View */}
          {currentView === 'comprehensive-form' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                <div className="flex items-center gap-3 mb-4">
                  <UserCircle className="w-8 h-8 text-purple-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('assessment.title')}</h2>
                    <p className="text-sm text-gray-600">{t('assessment.subtitle')}</p>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-purple-800">
                    {t('assessment.info')}
                  </p>
                </div>
              </div>

              <ComprehensivePatientForm onSubmit={handleComprehensiveFormSubmit} />

              {isLoading && (
                <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold text-purple-700">{t('app.generating')}</p>
                </div>
              )}

              {error && (
                <div className="text-center p-8 text-lg font-semibold text-red-600 bg-red-100 rounded-2xl border-2 border-red-300">
                  {error}
                </div>
              )}

              {weeklyPlan && !isLoading && (
                <WeeklyPlanDisplay weeklyPlan={weeklyPlan} />
              )}

              {dietPlan && !isLoading && !weeklyPlan && (
                <DietChartDisplay 
                  dietPlan={dietPlan} 
                  patientProfile={patientProfile || undefined} 
                  nutritionalSummary={dietPlan?.nutritionalSummary}
                />
              )}
            </div>
          )}

          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h2>
                    <p className="text-sm text-gray-600">{t('dashboard.subtitle')}</p>
                  </div>
                </div>
              </div>
              
              <Dashboard patientProfile={patientProfile || undefined} />
            </div>
          )}

          {/* Recipes View */}
          {currentView === 'recipes' && (
            <RecipeBrowser 
              recipes={recipes} 
              dietPlanFoods={dietPlanFoodNames}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t-2 border-gray-200">
          <p>{t('app.footer')}</p>
          <p className="mt-2 text-xs">
            🌿 {t('app.poweredBy')}
          </p>
        </footer>
      </div>
    </main>
  );
}
