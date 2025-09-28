'use client';

import { User, Calendar, Users, Sparkles, Wind, Flame as Fire, Mountain, Heart, Star, Zap } from 'lucide-react';

interface PatientFormData {
  age: number;
  gender: string;
  prakriti: string;
}

interface PatientFormProps {
  onSubmit: (data: PatientFormData) => void;
}

export default function PatientForm({ onSubmit }: PatientFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: PatientFormData = {
      age: Number(formData.get('age')),
      gender: formData.get('gender') as string,
      prakriti: formData.get('prakriti') as string,
    };
    
    onSubmit(data);
  };

  const prakritis = [
    {
      value: 'Vata',
      label: 'Vata',
      description: 'Air & Space - Creative, energetic, quick-thinking',
      detailedDescription: 'Governs movement, breathing, and nervous system',
      color: 'from-blue-400 via-cyan-400 to-sky-400',
      bgColor: 'from-blue-50/80 to-cyan-50/80',
      borderColor: 'border-blue-200/50',
      icon: <Wind className="w-6 h-6" />,
      traits: ['Creative', 'Energetic', 'Quick-thinking']
    },
    {
      value: 'Pitta',
      label: 'Pitta', 
      description: 'Fire & Water - Focused, ambitious, organized',
      detailedDescription: 'Governs digestion, metabolism, and transformation',
      color: 'from-orange-400 via-red-400 to-pink-400',
      bgColor: 'from-orange-50/80 to-red-50/80',
      borderColor: 'border-orange-200/50',
      icon: <Fire className="w-6 h-6" />,
      traits: ['Focused', 'Ambitious', 'Organized']
    },
    {
      value: 'Kapha',
      label: 'Kapha',
      description: 'Earth & Water - Calm, stable, nurturing',
      detailedDescription: 'Governs structure, immunity, and emotional stability',
      color: 'from-green-400 via-emerald-400 to-teal-400',
      bgColor: 'from-green-50/80 to-emerald-50/80',
      borderColor: 'border-green-200/50',
      icon: <Mountain className="w-6 h-6" />,
      traits: ['Calm', 'Stable', 'Nurturing']
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative p-8">
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Patient Information
            </span>
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Tell us about yourself to create your personalized wellness plan
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-4">
            <label htmlFor="age" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Age
            </label>
            <div className="relative group">
              <input
                type="number"
                id="age"
                name="age"
                required
                min="1"
                max="120"
                className="w-full px-6 py-5 border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg group-hover:border-emerald-300"
                placeholder="Enter your age"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="gender" className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <Users className="w-4 h-4 text-white" />
              </div>
              Gender
            </label>
            <div className="relative group">
              <select
                id="gender"
                name="gender"
                required
                className="w-full px-6 py-5 border-2 border-gray-200/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-lg appearance-none cursor-pointer group-hover:border-emerald-300"
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                <svg className="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="flex items-center gap-3 text-lg font-bold text-gray-800 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              Ayurvedic Prakriti (Constitution)
            </label>
            
            <div className="space-y-4">
              {prakritis.map((prakriti) => (
                <label key={prakriti.value} className="relative block cursor-pointer group">
                  <input
                    type="radio"
                    name="prakriti"
                    value={prakriti.value}
                    required
                    className="sr-only peer"
                  />
                  <div className={`relative overflow-hidden p-6 border-2 ${prakriti.borderColor} rounded-2xl transition-all duration-500 peer-checked:border-emerald-400 peer-checked:shadow-2xl peer-checked:shadow-emerald-500/20 hover:border-emerald-300 hover:shadow-xl bg-gradient-to-br ${prakriti.bgColor} backdrop-blur-sm group-hover:scale-[1.02]`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/10 opacity-0 peer-checked:opacity-100 transition-opacity duration-500"></div>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${prakriti.color} opacity-5 rounded-full -translate-y-16 translate-x-16`}></div>
                    
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${prakriti.color} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
                            {prakriti.icon}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">
                              {prakriti.label}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {prakriti.description}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {prakriti.detailedDescription}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {prakriti.traits.map((trait, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-sm font-medium bg-white/60 text-gray-700 border border-white/50 shadow-sm">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative ml-4">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-300 shadow-sm">
                          <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-0 peer-checked:opacity-20 animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-6 px-8 rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-500 font-bold text-xl shadow-2xl shadow-emerald-500/25 hover:shadow-3xl hover:shadow-emerald-500/30 transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Generate My Personalized Diet Plan
              <Star className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}