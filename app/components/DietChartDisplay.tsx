import { Utensils, Clock, Flame, Zap } from 'lucide-react';

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
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
            <Utensils className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Your Diet Plan Awaits
          </h3>
          <p className="text-gray-500 leading-relaxed">
            Complete the form to generate your personalized Ayurvedic diet plan tailored to your unique constitution.
          </p>
        </div>
      </div>
    );
  }

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'Lunch':
        return <Utensils className="w-5 h-5 text-orange-600" />;
      case 'Dinner':
        return <Zap className="w-5 h-5 text-indigo-600" />;
      default:
        return <Utensils className="w-5 h-5 text-gray-600" />;
    }
  };

  const getMealGradient = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return 'from-amber-50 to-yellow-50 border-amber-200';
      case 'Lunch':
        return 'from-orange-50 to-red-50 border-orange-200';
      case 'Dinner':
        return 'from-indigo-50 to-purple-50 border-indigo-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  const getVirya = (virya: string) => {
    return virya === 'Heating' ? (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
        <Flame className="w-3 h-3" />
        Heating
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
        <div className="w-3 h-3 rounded-full bg-blue-400"></div>
        Cooling
      </span>
    );
  };

  const getDigestibility = (digestibility: string) => {
    return digestibility === 'Easy' ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
        Easy
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
        Difficult
      </span>
    );
  };

  const renderMealSection = (title: string, foods: Food[]) => {
    if (foods.length === 0) {
      return null;
    }

    return (
      <div className={`bg-gradient-to-r ${getMealGradient(title)} rounded-2xl border-2 p-6 mb-8 shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          {getMealIcon(title)}
          <h3 className="text-2xl font-bold text-gray-800">
            {title}
          </h3>
        </div>
        
        <div className="space-y-4">
          {foods.map((food) => (
            <div key={food.id} className="bg-white rounded-xl shadow-md border border-white/50 p-5 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                    {food.name}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      {food.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                      {food.calories} kcal
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {getVirya(food.ayurvedic.virya)}
                  {getDigestibility(food.ayurvedic.digestibility)}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Rasa (Taste):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {food.ayurvedic.rasa.map((rasa, index) => (
                        <span key={index} className="px-2 py-1 rounded-md text-xs bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {rasa}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Guna (Quality):</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {food.ayurvedic.guna.map((guna, index) => (
                        <span key={index} className="px-2 py-1 rounded-md text-xs bg-teal-50 text-teal-700 border border-teal-200">
                          {guna}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Utensils className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
          Your Ayurvedic Diet Plan
        </h2>
        <p className="text-gray-600">
          Personalized nutrition based on your unique constitution
        </p>
      </div>
      
      {renderMealSection('Breakfast', dietPlan.breakfast)}
      {renderMealSection('Lunch', dietPlan.lunch)}
      {renderMealSection('Dinner', dietPlan.dinner)}
      
      {dietPlan.breakfast.length === 0 && 
       dietPlan.lunch.length === 0 && 
       dietPlan.dinner.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <Utensils className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            No Suitable Foods Found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
            We couldn't find suitable foods for your prakriti in our current database. 
            Please try a different constitution or contact our support team.
          </p>
        </div>
      )}
    </div>
  );
}