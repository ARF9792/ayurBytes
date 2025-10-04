'use client';

import { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import ComprehensivePatientForm from './components/ComprehensivePatientForm';
import DietChartDisplay from './components/DietChartDisplay';
import Dashboard from './components/Dashboard';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { PatientFormData, PatientProfile, DietPlan } from '@/src/types';
import { API_ENDPOINTS } from '@/src/constants';
import { FileText, UserCircle, BarChart3 } from 'lucide-react';
import { saveDietToHistory } from '@/lib/dashboardHelpers';

export default function Home() {
  const { t } = useTranslation();
  const [useComprehensiveForm, setUseComprehensiveForm] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  
  // State to hold the generated diet plan
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  // State to manage loading UI
  const [isLoading, setIsLoading] = useState(false);
  // State to handle potential errors
  const [error, setError] = useState<string | null>(null);
  // State to hold patient profile
  const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);

  // Load patient profile from localStorage on mount
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
    setDietPlan(null); // Clear previous results

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_DIET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ age: data.age, prakriti: data.prakriti }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan. Please try again.');
      }

      const result: DietPlan = await response.json();
      setDietPlan(result);

      // Save to history if we have nutritional summary
      if (result.nutritionalSummary) {
        saveDietToHistory(result, result.nutritionalSummary);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // This function will be called when the comprehensive form is submitted
  const handleComprehensiveFormSubmit = async (profile: PatientProfile) => {
    savePatientProfile(profile);
    
    setIsLoading(true);
    setError(null);
    setDietPlan(null);

    try {
      const response = await fetch(API_ENDPOINTS.GENERATE_DIET, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          age: profile.age, 
          prakriti: profile.prakriti,
          profile: profile // Send full profile for advanced diet generation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan. Please try again.');
      }

      const result: DietPlan = await response.json();
      // Add patient profile to diet plan
      result.patientProfile = profile;
      setDietPlan(result);

      // Save to history
      if (result.nutritionalSummary) {
        saveDietToHistory(result, result.nutritionalSummary);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8 md:p-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        
        <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {t('app.title')}
              </span>
            </h1>
            <p className="text-lg text-gray-600">
              {t('app.subtitle')}
            </p>
        </div>

        {/* Form Type Toggle */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => {
              setUseComprehensiveForm(false);
              setShowDashboard(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !useComprehensiveForm && !showDashboard
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-emerald-300'
            }`}
          >
            <FileText className="w-5 h-5" />
            Quick Form
          </button>
          <button
            onClick={() => {
              setUseComprehensiveForm(true);
              setShowDashboard(false);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              useComprehensiveForm && !showDashboard
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-purple-300'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            Comprehensive Assessment
          </button>
          <button
            onClick={() => setShowDashboard(!showDashboard)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showDashboard
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-600 border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>
        </div>

        {/* Dashboard View */}
        {showDashboard && (
          <Dashboard patientProfile={patientProfile || undefined} />
        )}

        {/* Form Views */}
        {!showDashboard && (
          <>
            {useComprehensiveForm ? (
              <ComprehensivePatientForm 
                onSubmit={handleComprehensiveFormSubmit}
              />
            ) : (
              <PatientForm onSubmit={handleBasicFormSubmit} />
            )}

            {isLoading && (
              <div className="text-center p-8 text-lg font-semibold text-emerald-700">
                {t('app.generating')}
              </div>
            )}

            {error && (
              <div className="text-center p-8 text-lg font-semibold text-red-600 bg-red-100 rounded-2xl">
                {error}
              </div>
            )}

            <DietChartDisplay 
              dietPlan={dietPlan} 
              patientProfile={patientProfile || undefined} 
              nutritionalSummary={dietPlan?.nutritionalSummary}
            />
          </>
        )}

        <footer className="text-center text-gray-500 text-sm py-8">
          {t('app.footer')}
        </footer>
      </div>
    </main>
  );
}