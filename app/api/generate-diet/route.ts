import { NextRequest, NextResponse } from 'next/server';
import foods from '@/data/foods.json';

// MODIFIED: Added suitableFor to the interface
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
    suitableFor: string[];
  };
}

interface DietPlan {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
}

// ADDED: Helper function to determine age group
function getAgeGroup(age: number): string {
  if (age <= 12) {
    return 'Child';
  } else if (age >= 60) {
    return 'Elderly';
  } else {
    return 'Adult';
  }
}

export async function POST(request: NextRequest) {
  try {
    // MODIFIED: Destructure both age and prakriti
    const { age, prakriti } = await request.json();

    if (!prakriti || age === undefined) {
      return NextResponse.json(
        { error: 'Prakriti and age are required' },
        { status: 400 }
      );
    }
    
    // ADDED: Determine the age group
    const ageGroup = getAgeGroup(age);

    // Filter foods based on prakriti
    let prakritiFilteredFoods: Food[] = [];

    switch (prakriti) {
      case 'Pitta':
        prakritiFilteredFoods = foods.filter(food => 
          food.ayurvedic.virya === 'Cooling'
        );
        break;
      
      case 'Vata':
        prakritiFilteredFoods = foods.filter(food => 
          food.ayurvedic.virya === 'Heating'
        );
        break;
      
      case 'Kapha':
        prakritiFilteredFoods = foods.filter(food => 
          food.ayurvedic.guna.includes('Light') || 
          food.ayurvedic.guna.includes('Dry')
        );
        break;
      
      default:
        prakritiFilteredFoods = foods as Food[];
    }

    // MODIFIED: Add a second filter for the age group
    const filteredFoods = prakritiFilteredFoods.filter(food => 
      food.ayurvedic.suitableFor.includes(ageGroup)
    );

    // Create diet plan using the final filtered list
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

    const dinnerGrains = lunchGrains.length > 1 ? lunchGrains.slice(1) : lunchGrains;
    const dinnerLentils = filteredFoods.filter(food => food.category === 'Lentil');

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