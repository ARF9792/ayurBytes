'use client';

import { Sparkles, Brain, QrCode, Mic, Moon, Globe, Calendar, TrendingUp } from 'lucide-react';

export default function SmartFeatures() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Ayurvedic Analysis',
      description: 'Personalized recommendations based on Prakriti, season, and health conditions',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: 'Voice Input Support',
      description: 'Fill forms using voice commands in multiple Indian languages',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Weekly Meal Planning',
      description: '7-day diet plans with variety scoring and nutrition tracking',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: 'QR Code Sharing',
      description: 'Share your diet plan instantly via QR code',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: <Moon className="w-6 h-6" />,
      title: 'Dark Mode',
      description: 'Comfortable viewing experience day or night',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: '7 Indian Languages',
      description: 'Full support for Hindi, Bengali, Telugu, Marathi, Tamil, and Sanskrit',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Seasonal Recommendations',
      description: 'Auto-adapts food suggestions based on current season',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Smart Allergen Filtering',
      description: 'Automatically excludes foods based on your allergies',
      color: 'from-teal-500 to-emerald-500'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/50 dark:from-gray-800 dark:via-purple-900/20 dark:to-pink-900/20 rounded-3xl shadow-2xl border border-purple-100/50 dark:border-purple-800/50 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Smart Features
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Powered by AI and Modern Technology
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-gray-700"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" 
              style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
            ></div>
            
            <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 shadow-md text-white`}>
              {feature.icon}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {feature.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl border border-purple-200 dark:border-purple-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              SIH 2025 Innovation
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              This platform combines traditional Ayurvedic wisdom with cutting-edge AI technology, 
              multilingual support, and modern UX features to make personalized health accessible to all Indians.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
