'use client';

import { User, Calendar, Users, Sparkles } from 'lucide-react';

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
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'Pitta',
      label: 'Pitta', 
      description: 'Fire & Water - Focused, ambitious, organized',
      color: 'from-orange-500 to-red-500'
    },
    {
      value: 'Kapha',
      label: 'Kapha',
      description: 'Earth & Water - Calm, stable, nurturing',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Patient Information
        </h2>
        <p className="text-gray-600">
          Tell us about yourself to create your personalized plan
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-2">
          <label htmlFor="age" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Calendar className="w-4 h-4 text-emerald-600" />
            Age
          </label>
          <div className="relative">
            <input
              type="number"
              id="age"
              name="age"
              required
              min="1"
              max="120"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 text-lg font-medium bg-gray-50 hover:bg-white"
              placeholder="Enter your age"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="gender" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Users className="w-4 h-4 text-emerald-600" />
            Gender
          </label>
          <div className="relative">
            <select
              id="gender"
              name="gender"
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all duration-300 text-lg font-medium bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-4">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Ayurvedic Prakriti (Constitution)
          </label>
          
          <div className="space-y-3">
            {prakritis.map((prakriti) => (
              <label key={prakriti.value} className="relative block cursor-pointer">
                <input
                  type="radio"
                  name="prakriti"
                  value={prakriti.value}
                  required
                  className="sr-only peer"
                />
                <div className="p-5 border-2 border-gray-200 rounded-xl transition-all duration-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 hover:border-gray-300 hover:bg-gray-50 peer-checked:shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${prakriti.color}`}></div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {prakriti.label}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {prakriti.description}
                      </p>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-emerald-500 peer-checked:bg-emerald-500 flex items-center justify-center transition-all duration-300">
                      <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate My Diet Plan
          </span>
        </button>
      </form>
    </div>
  );
}