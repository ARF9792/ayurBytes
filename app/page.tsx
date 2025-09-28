'use client';

import { useState } from 'react';
import PatientForm from './components/PatientForm';
import DietChartDisplay from './components/DietChartDisplay';

interface Food {
  id: number;
  name: string;
  category: string;
  calories: number;
  ayurvedic: {
    rasa: string[];
    guna: string[];
    virya: string;
    digestibility: string;
  };
}

interface DietPlan {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
}

interface PatientFormData {
  age: number;
  gender: string;
  prakriti: string;
}

export default function Home() {
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: PatientFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prakriti: formData.prakriti,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate diet plan');
      }

      const data = await response.json();
      setDietPlan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ayurvedic Diet Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover your personalized Ayurvedic diet plan based on your unique constitution (Prakriti)
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div>
            <PatientForm onSubmit={handleSubmit} />
            
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Generating your personalized diet plan...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Diet Chart */}
          <div>
            <DietChartDisplay dietPlan={dietPlan} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            This is a Proof of Concept application for Ayurvedic diet planning. 
            Consult with a qualified Ayurvedic practitioner for personalized medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}