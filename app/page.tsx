'use client';

import { useState } from 'react';
import { Leaf, Heart, Shield, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
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

  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Ancient Wisdom",
      description: "Based on 5000+ years of Ayurvedic knowledge and principles"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Personalized Care",
      description: "Tailored to your unique constitution and individual needs"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Holistic Health",
      description: "Promotes balance between mind, body, and spirit"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Ayurvedic Diet
              </span>
              <br />
              <span className="text-gray-800">Planner</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover your personalized Ayurvedic diet plan based on your unique constitution (Prakriti). 
              Ancient wisdom meets modern convenience.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4 mx-auto">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <PatientForm onSubmit={handleSubmit} />
            
            {/* Loading State */}
            {isLoading && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full animate-spin">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1/2 transform -translate-x-1/2"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    Creating Your Diet Plan
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Analyzing your constitution and selecting the perfect foods for your unique needs...
                  </p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {dietPlan && !isLoading && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-1">
                      Diet Plan Generated Successfully!
                    </h3>
                    <p className="text-green-700 text-sm">
                      Your personalized Ayurvedic diet plan is ready. Check the results on the right.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Diet Chart */}
          <div className="xl:sticky xl:top-8 xl:self-start">
            <DietChartDisplay dietPlan={dietPlan} />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Important Disclaimer
            </h3>
            <p className="text-gray-600 leading-relaxed">
              This is a Proof of Concept application for Ayurvedic diet planning. The recommendations provided 
              are for educational purposes only and should not replace professional medical advice. 
              Please consult with a qualified Ayurvedic practitioner or healthcare provider for personalized 
              medical guidance and treatment plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}