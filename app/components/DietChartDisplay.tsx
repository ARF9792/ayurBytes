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
      <div className="text-center text-gray-500 py-8">
        Submit the form to generate a diet plan.
      </div>
    );
  }

  const renderMealSection = (title: string, foods: Food[]) => {
    if (foods.length === 0) {
      return null;
    }

    return (
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          {title}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                  Food Item
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                  Category
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                  Calories
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                  Virya (Energy)
                </th>
                <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">
                  Digestibility
                </th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3 font-medium text-gray-800">
                    {food.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {food.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {food.calories} kcal
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {food.ayurvedic.virya}
                  </td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {food.ayurvedic.digestibility}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Ayurvedic Diet Plan
      </h2>
      
      {renderMealSection('Breakfast', dietPlan.breakfast)}
      {renderMealSection('Lunch', dietPlan.lunch)}
      {renderMealSection('Dinner', dietPlan.dinner)}
      
      {dietPlan.breakfast.length === 0 && 
       dietPlan.lunch.length === 0 && 
       dietPlan.dinner.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No suitable foods found for your prakriti with the current food database.
        </div>
      )}
    </div>
  );
}