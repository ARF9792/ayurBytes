'use client';

import { useState } from 'react';
import { Leaf, Heart, Shield, Sparkles, CheckCircle, AlertCircle, Star, Zap, Crown, Award, Target, Users } from 'lucide-react';
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
      icon: <Leaf className="w-7 h-7" />,
      title: "Ancient Wisdom",
      description: "Based on 5000+ years of Ayurvedic knowledge and time-tested principles",
      gradient: "from-green-400 to-emerald-500"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Personalized Care",
      description: "Tailored to your unique constitution and individual wellness needs",
      gradient: "from-pink-400 to-red-500"
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Holistic Health",
      description: "Promotes perfect balance between mind, body, and spiritual well-being",
      gradient: "from-blue-400 to-indigo-500"
    }
  ];

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Happy Users" },
    { icon: <Award className="w-6 h-6" />, value: "5000+", label: "Years of Wisdom" },
    { icon: <Target className="w-6 h-6" />, value: "98%", label: "Success Rate" },
    { icon: <Crown className="w-6 h-6" />, value: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-200/20 to-cyan-200/20 rounded-full translate-y-40 -translate-x-40"></div>
      
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-20">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25">
                  <Leaf className="w-14 h-14 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full animate-ping opacity-20"></div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Ayurvedic Diet
              </span>
              <br />
              <span className="text-gray-800">Planner</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
              Discover your personalized Ayurvedic diet plan based on your unique constitution. 
              <span className="font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Ancient wisdom meets modern convenience.
              </span>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-full -translate-y-16 translate-x-16`}></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto shadow-lg group-hover:rotate-6 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div className="space-y-8">
            <PatientForm onSubmit={handleSubmit} />
            
            {/* Loading State */}
            {isLoading && (
              <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm p-10">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
                <div className="relative text-center">
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-full animate-spin shadow-2xl shadow-emerald-500/25">
                      <div className="w-6 h-6 bg-white rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 shadow-lg"></div>
                    </div>
                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-emerald-500 animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Creating Your Personalized Diet Plan
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Analyzing your unique constitution and selecting the perfect foods for optimal wellness...
                  </p>
                  <div className="mt-6 flex justify-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="relative overflow-hidden bg-gradient-to-br from-red-50 via-pink-50/50 to-red-50 rounded-3xl shadow-2xl border border-red-200/50 backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-pink-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-200/20 to-pink-200/20 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative flex items-start gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-red-800 mb-3">
                      Something went wrong
                    </h3>
                    <p className="text-red-700 mb-6 text-lg leading-relaxed">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="group relative overflow-hidden px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Try Again
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Success State */}
            {dietPlan && !isLoading && (
              <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50/50 to-green-50 rounded-3xl shadow-2xl border border-green-200/50 backdrop-blur-sm p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative flex items-center gap-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">
                      Diet Plan Generated Successfully!
                    </h3>
                    <p className="text-green-700 text-lg leading-relaxed">
                      Your personalized Ayurvedic diet plan is ready. Check the beautiful results on the right.
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
        <div className="mt-24 text-center">
          <div className="relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/50 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full -translate-y-20 translate-x-20"></div>
            
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Important Disclaimer
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg max-w-4xl mx-auto">
                This is a Proof of Concept application for Ayurvedic diet planning. The recommendations provided 
                are for educational purposes only and should not replace professional medical advice. 
                Please consult with a qualified Ayurvedic practitioner or healthcare provider for personalized 
                medical guidance and comprehensive treatment plans tailored to your specific health needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}