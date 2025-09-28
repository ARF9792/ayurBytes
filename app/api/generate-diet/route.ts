import { NextRequest, NextResponse } from 'next/server';
import foods from '@/data/foods.json';

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

export async function POST(request: NextRequest) {
  try {
    const { prakriti } = await request.json();

    if (!prakriti) {
      return NextResponse.json(
        { error: 'Prakriti is required' },
        { status: 400 }
      );
    }

    // Filter foods based on prakriti
    let filteredFoods: Food[] = [];

    switch (prakriti) {
      case 'Pitta':
        filteredFoods = foods.filter(food => 
          food.ayurvedic.virya === 'Cooling'
        );
        break;
      
      case 'Vata':
        filteredFoods = foods.filter(food => 
          food.ayurvedic.virya === 'Heating'
        );
        break;
      
      case 'Kapha':
        filteredFoods = foods.filter(food => 
          food.ayurvedic.guna.includes('Light') || 
          food.ayurvedic.guna.includes('Dry')
        );
        break;
      
      default:
        filteredFoods = foods;
    }

    // Create diet plan
    const dietPlan: DietPlan = {
      breakfast: [],
      lunch: [],
      dinner: []
    };

    // Breakfast: Pick one "Easy" to digest item
    const easyDigestFoods = filteredFoods.filter(food => 
      food.ayurvedic.digestibility === 'Easy'
    );
    if (easyDigestFoods.length > 0) {
      dietPlan.breakfast.push(easyDigestFoods[0]);
    }

    // Lunch: Pick one "Grain", one "Lentil" or "Protein", and one "Vegetable"
    const lunchGrains = filteredFoods.filter(food => 
      food.category === 'Grain'
    );
    const lunchProteins = filteredFoods.filter(food => 
      food.category === 'Lentil' || food.category === 'Protein'
    );
    const lunchVegetables = filteredFoods.filter(food => 
      food.category === 'Vegetable'
    );

    if (lunchGrains.length > 0) {
      dietPlan.lunch.push(lunchGrains[0]);
    }
    if (lunchProteins.length > 0) {
      dietPlan.lunch.push(lunchProteins[0]);
    }
    if (lunchVegetables.length > 0) {
      dietPlan.lunch.push(lunchVegetables[0]);
    }

    // Dinner: Pick one "Grain" and one "Lentil"
    const dinnerGrains = filteredFoods.filter(food => 
      food.category === 'Grain'
    );
    const dinnerLentils = filteredFoods.filter(food => 
      food.category === 'Lentil'
    );

    if (dinnerGrains.length > 0) {
      dietPlan.dinner.push(dinnerGrains[0]);
    }
    if (dinnerLentils.length > 0) {
      dietPlan.dinner.push(dinnerLentils[0]);
    }

    return NextResponse.json(dietPlan);

  } catch (error) {
    console.error('Error generating diet plan:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}