import { Utensils, Clock, Sun, Moon, Flame, Snowflake, Zap, Star, Heart, Leaf } from 'lucide-react';

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

interface DietChartDisplayProps {
  dietPlan: DietPlan | null;
}

export default function DietChartDisplay({ dietPlan }: DietChartDisplayProps) {
  if (!dietPlan) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-200/20 to-emerald-200/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative p-12 text-center">
          <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/25 animate-pulse">
            <Utensils className="w-14 h-14 text-white" />
          </div>
          
          <p className="text-gray-600 leading-relaxed text-lg max-w-md mx-auto">
            Complete the form to generate Ayurvedic diet plan tailored to the unique constitution.
          </p>
          <div className="mt-8 flex justify-center space-x-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return <Sun className="w-6 h-6 text-amber-600" />;
      case 'Lunch':
        return <Utensils className="w-6 h-6 text-orange-600" />;
      case 'Dinner':
        return <Moon className="w-6 h-6 text-indigo-600" />;
      default:
        return <Utensils className="w-6 h-6 text-gray-600" />;
    }
  };

  const getMealGradient = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return 'from-amber-400 via-yellow-400 to-orange-400';
      case 'Lunch':
        return 'from-orange-400 via-red-400 to-pink-400';
      case 'Dinner':
        return 'from-indigo-400 via-purple-400 to-violet-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getMealBg = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return 'from-amber-50/80 via-yellow-50/60 to-orange-50/80';
      case 'Lunch':
        return 'from-orange-50/80 via-red-50/60 to-pink-50/80';
      case 'Dinner':
        return 'from-indigo-50/80 via-purple-50/60 to-violet-50/80';
      default:
        return 'from-gray-50 to-gray-100';
    }
  };

  const getVirya = (virya: string) => {
    return virya === 'Heating' ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200/50 shadow-sm">
        <Flame className="w-4 h-4" />
        Heating
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200/50 shadow-sm">
        <Snowflake className="w-4 h-4" />
        Cooling
      </span>
    );
  };

  const getDigestibility = (digestibility: string) => {
    return digestibility === 'Easy' ? (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200/50 shadow-sm">
        <Zap className="w-4 h-4" />
        Easy
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border border-yellow-200/50 shadow-sm">
        <Star className="w-4 h-4" />
        Complex
      </span>
    );
  };

  const renderMealSection = (title: string, foods: Food[]) => {
    if (foods.length === 0) {
      return null;
    }

    return (
      <div className="relative mb-12">
        <div className={`relative overflow-hidden bg-gradient-to-br ${getMealBg(title)} rounded-3xl shadow-xl border border-white/50 backdrop-blur-sm`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
          <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${getMealGradient(title)} opacity-10 rounded-full -translate-y-20 translate-x-20`}></div>
          
          <div className="relative p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-16 h-16 bg-gradient-to-br ${getMealGradient(title)} rounded-2xl flex items-center justify-center shadow-lg`}>
                {getMealIcon(title)}
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">
                  {title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {foods.length} item{foods.length > 1 ? 's' : ''} selected for optimal nutrition
                </p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {foods.map((food, index) => (
                <div key={food.id} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                            <Leaf className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                              {food.name}
                            </h4>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-200/50">
                                {food.category}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200/50">
                                <Heart className="w-3 h-3 inline mr-1" />
                                {food.calories} kcal
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 lg:justify-end">
                        {getVirya(food.ayurvedic.virya)}
                        {getDigestibility(food.ayurvedic.digestibility)}
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-200/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            Rasa (Taste)
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {food.ayurvedic.rasa.map((rasa, index) => (
                              <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200/50 shadow-sm">
                                {rasa}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <h5 className="font-semibold text-gray-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                            Guna (Quality)
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {food.ayurvedic.guna.map((guna, index) => (
                              <span key={index} className="px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border border-teal-200/50 shadow-sm">
                                {guna}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/50 rounded-3xl shadow-2xl border border-emerald-100/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full -translate-y-32 translate-x-32"></div>
      
      <div className="relative p-8">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/25">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Your Ayurvedic Diet Plan
            </span>
          </h2>
          <div className="mt-6 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="space-y-8">
          {renderMealSection('Breakfast', dietPlan.breakfast)}
          {renderMealSection('Lunch', dietPlan.lunch)}
          {renderMealSection('Dinner', dietPlan.dinner)}
        </div>
        
        {dietPlan.breakfast.length === 0 && 
         dietPlan.lunch.length === 0 && 
         dietPlan.dinner.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
              <Utensils className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              No Suitable Foods Found
            </h3>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed text-lg">
              We couldn't find suitable foods for your prakriti in our current database. 
            </p>
          </div>
        )}
      </div>
    </div>
  );
}