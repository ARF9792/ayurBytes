'use client';

import { useState } from 'react';
import { 
  User, Calendar, Users, Sparkles, Wind, Flame as Fire, Mountain,
  Heart, Activity, Droplets, Moon, Brain, AlertCircle, Pill, Utensils,
  Scale, Ruler, TrendingUp
} from 'lucide-react';
import { useTranslation } from '@/src/contexts/TranslationContext';
import { 
  PatientProfile, 
  PrakritiType, 
  MedicalCondition, 
  DietaryHabits, 
  ActivityLevel,
  StressLevel,
  BowelMovement,
  DigestionQuality
} from '@/src/types';
import { PRAKRITI_CONFIG } from '@/src/constants';

interface ComprehensivePatientFormProps {
  onSubmit: (data: PatientProfile, generateWeekly?: boolean) => void;
}

export default function ComprehensivePatientForm({ onSubmit }: ComprehensivePatientFormProps) {
  const { t } = useTranslation();
  const [selectedPrakriti, setSelectedPrakriti] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<MedicalCondition[]>([]);
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [bmi, setBmi] = useState<number>(0);
  const [generateWeekly, setGenerateWeekly] = useState(false);

  // Calculate BMI when height or weight changes
  const calculateBMI = (h: number, w: number) => {
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const calculatedBMI = w / (heightInMeters * heightInMeters);
      setBmi(parseFloat(calculatedBMI.toFixed(1)));
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    calculateBMI(value, weight);
  };

  const handleWeightChange = (value: number) => {
    setWeight(value);
    calculateBMI(height, value);
  };

  const toggleCondition = (condition: MedicalCondition) => {
    if (condition === 'None') {
      setSelectedConditions(['None']);
    } else {
      const filtered = selectedConditions.filter(c => c !== 'None');
      if (selectedConditions.includes(condition)) {
        setSelectedConditions(filtered.filter(c => c !== condition));
      } else {
        setSelectedConditions([...filtered, condition]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const allergiesStr = formData.get('allergies') as string;
    const medicationsStr = formData.get('medications') as string;
    
    const data: PatientProfile = {
      // Personal
      name: formData.get('name') as string,
      age: Number(formData.get('age')),
      gender: formData.get('gender') as 'Male' | 'Female',
      prakriti: formData.get('prakriti') as PrakritiType,
      
      // Physical
      height: Number(formData.get('height')),
      weight: Number(formData.get('weight')),
      bmi: bmi,
      
      // Health
      medicalConditions: selectedConditions.length > 0 ? selectedConditions : ['None'],
      allergies: allergiesStr ? allergiesStr.split(',').map(a => a.trim()) : [],
      currentMedications: medicationsStr ? medicationsStr.split(',').map(m => m.trim()) : [],
      
      // Dietary
      dietaryHabits: formData.get('dietaryHabits') as DietaryHabits,
      mealFrequency: Number(formData.get('mealFrequency')),
      waterIntake: Number(formData.get('waterIntake')),
      
      // Lifestyle
      activityLevel: formData.get('activityLevel') as ActivityLevel,
      sleepHours: Number(formData.get('sleepHours')),
      stressLevel: formData.get('stressLevel') as StressLevel,
      
      // Ayurvedic
      bowelMovements: formData.get('bowelMovements') as BowelMovement,
      digestionQuality: formData.get('digestionQuality') as DigestionQuality,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    if (!data.prakriti) {
      alert(t('form.prakriti.select'));
      return;
    }

    onSubmit(data, generateWeekly);
  };

  const prakritis = [
    {
      value: 'Vata',
      label: t('prakriti.vata'),
      description: t('prakriti.vata.desc'),
      detailedDescription: t('prakriti.vata.detailed'),
      color: 'from-blue-400 via-cyan-400 to-sky-400',
      bgColor: 'from-blue-50/80 to-cyan-50/80',
      borderColor: 'border-blue-200/50',
      icon: <Wind className="w-6 h-6" />,
      traits: [t('prakriti.vata.trait1'), t('prakriti.vata.trait2'), t('prakriti.vata.trait3')]
    },
    {
      value: 'Pitta',
      label: t('prakriti.pitta'), 
      description: t('prakriti.pitta.desc'),
      detailedDescription: t('prakriti.pitta.detailed'),
      color: 'from-orange-400 via-red-400 to-pink-400',
      bgColor: 'from-orange-50/80 to-red-50/80',
      borderColor: 'border-orange-200/50',
      icon: <Fire className="w-6 h-6" />,
      traits: [t('prakriti.pitta.trait1'), t('prakriti.pitta.trait2'), t('prakriti.pitta.trait3')]
    },
    {
      value: 'Kapha',
      label: t('prakriti.kapha'),
      description: t('prakriti.kapha.desc'),
      detailedDescription: t('prakriti.kapha.detailed'),
      color: 'from-green-400 via-emerald-400 to-teal-400',
      bgColor: 'from-green-50/80 to-emerald-50/80',
      borderColor: 'border-green-200/50',
      icon: <Mountain className="w-6 h-6" />,
      traits: [t('prakriti.kapha.trait1'), t('prakriti.kapha.trait2'), t('prakriti.kapha.trait3')]
    }
  ];

  const medicalConditionsList: MedicalCondition[] = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Thyroid', 
    'PCOD/PCOS', 'Arthritis', 'Acidity', 'IBS', 'None'
  ];

  const getBMICategory = (bmi: number) => {
    if (bmi === 0) return { text: '', color: 'text-gray-500' };
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-yellow-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  const bmiCategory = getBMICategory(bmi);

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
              Comprehensive Patient Profile
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Complete health assessment for personalized Ayurvedic diet planning
          </p>
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="block text-sm font-semibold text-gray-700">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                  placeholder="Enter age"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Physical Measurements */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              Physical Measurements
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="height" className="block text-sm font-semibold text-gray-700">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Height (cm) *
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  required
                  min="50"
                  max="250"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                  placeholder="e.g., 170"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="weight" className="block text-sm font-semibold text-gray-700">
                  <Scale className="w-4 h-4 inline mr-1" />
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  required
                  min="20"
                  max="300"
                  value={weight || ''}
                  onChange={(e) => handleWeightChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                  placeholder="e.g., 65"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <TrendingUp className="w-4 h-4 inline mr-1" />
                  BMI
                </label>
                <div className="w-full px-4 py-3 border-2 border-emerald-200/50 rounded-xl bg-emerald-50/50 text-base font-bold">
                  {bmi > 0 ? (
                    <span className={bmiCategory.color}>
                      {bmi} - {bmiCategory.text}
                    </span>
                  ) : (
                    <span className="text-gray-400">Auto-calculated</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Prakriti Selection */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              {t('form.prakriti')}
            </h3>
            
            <input type="hidden" name="prakriti" value={selectedPrakriti} />

            <div className="space-y-4">
              {prakritis.map((prakriti) => (
                <div 
                  key={prakriti.value} 
                  className={`relative block cursor-pointer group`}
                  onClick={() => setSelectedPrakriti(prakriti.value)}
                >
                  <div className={
                    `relative overflow-hidden p-6 border-2 rounded-2xl transition-all duration-500 hover:border-emerald-300 hover:shadow-xl bg-gradient-to-br ${prakriti.bgColor} backdrop-blur-sm group-hover:scale-[1.02] ` +
                    (selectedPrakriti === prakriti.value 
                      ? 'border-emerald-400 shadow-2xl shadow-emerald-500/20' 
                      : `${prakriti.borderColor}`)
                  }>
                    <div className="relative flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-12 h-12 bg-gradient-to-br ${prakriti.color} rounded-xl flex items-center justify-center shadow-lg text-white`}>
                            {prakriti.icon}
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">
                              {prakriti.label}
                            </h4>
                            <p className="text-sm text-gray-600 font-medium">
                              {prakriti.description}
                            </p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                          {prakriti.detailedDescription}
                        </p>
                        
                        <div className="flex flex-wrap gap-2">
                          {prakriti.traits.map((trait, index) => (
                            <span key={index} className="px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-gray-700 border border-white/50 shadow-sm">
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative ml-4">
                        <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${selectedPrakriti === prakriti.value ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                          <div className={`w-2 h-2 bg-white rounded-full transition-opacity duration-300 ${selectedPrakriti === prakriti.value ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Health Parameters */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              Health Parameters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Medical Conditions
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {medicalConditionsList.map((condition) => (
                    <div 
                      key={condition}
                      onClick={() => toggleCondition(condition)}
                      className={`px-4 py-3 rounded-xl border-2 cursor-pointer transition-all duration-300 text-center font-medium text-sm ${
                        selectedConditions.includes(condition)
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 shadow-md'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-emerald-200'
                      }`}
                    >
                      {condition}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="allergies" className="block text-sm font-semibold text-gray-700">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Food Allergies (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    name="allergies"
                    className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                    placeholder="e.g., Peanuts, Dairy"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="medications" className="block text-sm font-semibold text-gray-700">
                    <Pill className="w-4 h-4 inline mr-1" />
                    Current Medications (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="medications"
                    name="medications"
                    className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                    placeholder="e.g., Metformin, Aspirin"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Dietary Information */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              Dietary Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="dietaryHabits" className="block text-sm font-semibold text-gray-700">
                  Dietary Habits *
                </label>
                <select
                  id="dietaryHabits"
                  name="dietaryHabits"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="mealFrequency" className="block text-sm font-semibold text-gray-700">
                  Meals Per Day *
                </label>
                <input
                  type="number"
                  id="mealFrequency"
                  name="mealFrequency"
                  required
                  min="2"
                  max="6"
                  defaultValue="3"
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="waterIntake" className="block text-sm font-semibold text-gray-700">
                  <Droplets className="w-4 h-4 inline mr-1" />
                  Water Intake (L/day) *
                </label>
                <input
                  type="number"
                  id="waterIntake"
                  name="waterIntake"
                  required
                  min="0.5"
                  max="10"
                  step="0.5"
                  defaultValue="2"
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Lifestyle */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Lifestyle Factors
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="activityLevel" className="block text-sm font-semibold text-gray-700">
                  Activity Level *
                </label>
                <select
                  id="activityLevel"
                  name="activityLevel"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Sedentary">Sedentary</option>
                  <option value="Lightly Active">Lightly Active</option>
                  <option value="Moderately Active">Moderately Active</option>
                  <option value="Very Active">Very Active</option>
                  <option value="Extremely Active">Extremely Active</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="sleepHours" className="block text-sm font-semibold text-gray-700">
                  <Moon className="w-4 h-4 inline mr-1" />
                  Sleep (hours/day) *
                </label>
                <input
                  type="number"
                  id="sleepHours"
                  name="sleepHours"
                  required
                  min="3"
                  max="14"
                  step="0.5"
                  defaultValue="7"
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stressLevel" className="block text-sm font-semibold text-gray-700">
                  <Brain className="w-4 h-4 inline mr-1" />
                  Stress Level *
                </label>
                <select
                  id="stressLevel"
                  name="stressLevel"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 7: Ayurvedic Assessment */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-emerald-100/50 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              Ayurvedic Assessment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="bowelMovements" className="block text-sm font-semibold text-gray-700">
                  Bowel Movements *
                </label>
                <select
                  id="bowelMovements"
                  name="bowelMovements"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Regular">Regular</option>
                  <option value="Irregular">Irregular</option>
                  <option value="Constipation">Constipation</option>
                  <option value="Loose">Loose</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="digestionQuality" className="block text-sm font-semibold text-gray-700">
                  Digestion Quality *
                </label>
                <select
                  id="digestionQuality"
                  name="digestionQuality"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all duration-300 text-base font-medium bg-white/80 cursor-pointer"
                >
                  <option value="">Select</option>
                  <option value="Good">Good</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="submit"
              onClick={() => setGenerateWeekly(false)}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-6 px-8 rounded-2xl hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-500 font-bold text-xl shadow-2xl shadow-emerald-500/25 hover:shadow-3xl hover:shadow-emerald-500/30 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-3">
                <Sparkles className="w-6 h-6" />
                Single Day Plan
              </span>
            </button>

            <button
              type="submit"
              onClick={() => setGenerateWeekly(true)}
              className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white py-6 px-8 rounded-2xl hover:from-purple-600 hover:via-pink-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-500 font-bold text-xl shadow-2xl shadow-purple-500/25 hover:shadow-3xl hover:shadow-purple-500/30 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-3">
                <Calendar className="w-6 h-6" />
                7-Day Weekly Plan
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
