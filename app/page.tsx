'use client';

import { useState } from 'react';
import PatientForm from './components/PatientForm';
import DietChartDisplay from './components/DietChartDisplay';
import LanguageSelector from './components/LanguageSelector';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { PatientFormData, DietPlan } from '@/src/types';
import { API_ENDPOINTS } from '@/src/constants';

export default function Home() {
  const { t } = useTranslation();
  // State to hold the generated diet plan
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  // State to manage loading UI
  const [isLoading, setIsLoading] = useState(false);
  // State to handle potential errors
  const [error, setError] = useState<string | null>(null);

  // This function will be called when the form is submitted
  const handleFormSubmit = async (data: PatientFormData) => {
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
        
        <PatientForm onSubmit={handleFormSubmit} />

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

        <DietChartDisplay dietPlan={dietPlan} />

        <footer className="text-center text-gray-500 text-sm py-8">
            {t('app.footer')}
        </footer>
      </div>
    </main>
  );
}