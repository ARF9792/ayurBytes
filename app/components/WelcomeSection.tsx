'use client';

import { Sparkles, Heart, TrendingUp, Book } from 'lucide-react';
import { useTranslation } from '@/src/contexts/TranslationContext';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className={`w-12 h-12 rounded-xl ${color.replace('border-', 'bg-').replace('500', '100')} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function WelcomeSection() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-8 mb-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-block">
          <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
            ✨ {t('app.tagline')}
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {t('welcome.title')}
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('welcome.subtitle')}
        </p>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border-2 border-emerald-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          🌟 {t('welcome.howItWorks')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              1
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('welcome.step1.title')}</h3>
            <p className="text-sm text-gray-600">{t('welcome.step1.desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-teal-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              2
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('welcome.step2.title')}</h3>
            <p className="text-sm text-gray-600">{t('welcome.step2.desc')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-3">
              3
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{t('welcome.step3.title')}</h3>
            <p className="text-sm text-gray-600">{t('welcome.step3.desc')}</p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Sparkles className="w-6 h-6 text-emerald-600" />}
          title={t('welcome.feature1.title')}
          description={t('welcome.feature1.desc')}
          color="border-emerald-500"
        />
        <FeatureCard
          icon={<Heart className="w-6 h-6 text-purple-600" />}
          title={t('welcome.feature2.title')}
          description={t('welcome.feature2.desc')}
          color="border-purple-500"
        />
        <FeatureCard
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          title={t('welcome.feature3.title')}
          description={t('welcome.feature3.desc')}
          color="border-blue-500"
        />
        <FeatureCard
          icon={<Book className="w-6 h-6 text-pink-600" />}
          title={t('welcome.feature4.title')}
          description={t('welcome.feature4.desc')}
          color="border-pink-500"
        />
      </div>

      {/* Getting Started CTA */}
      <div className="bg-white rounded-2xl p-6 shadow-lg text-center border-2 border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('welcome.cta.title')}</h3>
        <p className="text-gray-600 mb-4">{t('welcome.cta.subtitle')}</p>
        <div className="flex justify-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">✓ {t('welcome.badge.free')}</span>
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full">✓ {t('welcome.badge.scienceBacked')}</span>
          <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full">✓ {t('welcome.badge.personalized')}</span>
        </div>
      </div>
    </div>
  );
}
