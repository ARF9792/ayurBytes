import { PatientProfile, Food, NutritionalSummary, Rasa, MealTiming, MealType } from '@/src/types';

/**
 * Calculate daily caloric requirements based on patient profile
 * Uses Mifflin-St Jeor Equation
 */
export function calculateDailyCalories(profile: PatientProfile): number {
  const { weight, height, age, gender, activityLevel } = profile;
  
  // Base Metabolic Rate (BMR)
  let bmr: number;
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Extremely Active': 1.9
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

/**
 * Calculate daily protein requirements (g/day)
 * Based on activity level and age
 */
export function calculateDailyProtein(profile: PatientProfile): number {
  const { weight, activityLevel, age } = profile;
  
  let proteinPerKg = 0.8; // Base requirement
  
  // Adjust based on activity
  if (activityLevel === 'Very Active' || activityLevel === 'Extremely Active') {
    proteinPerKg = 1.6;
  } else if (activityLevel === 'Moderately Active') {
    proteinPerKg = 1.2;
  } else if (activityLevel === 'Lightly Active') {
    proteinPerKg = 1.0;
  }
  
  // Adjust for elderly (higher protein needs)
  if (age >= 60) {
    proteinPerKg += 0.2;
  }
  
  return Math.round(weight * proteinPerKg);
}

/**
 * Calculate daily carbohydrate requirements (g/day)
 * Typically 45-65% of total calories
 */
export function calculateDailyCarbs(totalCalories: number): number {
  const carbCalories = totalCalories * 0.55; // 55% of calories from carbs
  return Math.round(carbCalories / 4); // 4 calories per gram of carbs
}

/**
 * Calculate daily fat requirements (g/day)
 * Typically 20-35% of total calories
 */
export function calculateDailyFats(totalCalories: number): number {
  const fatCalories = totalCalories * 0.25; // 25% of calories from fats
  return Math.round(fatCalories / 9); // 9 calories per gram of fat
}

/**
 * Calculate daily fiber requirements (g/day)
 */
export function calculateDailyFiber(profile: PatientProfile): number {
  const { age, gender } = profile;
  
  if (age < 18) return 25;
  if (gender === 'Male') {
    return age < 50 ? 38 : 30;
  } else {
    return age < 50 ? 25 : 21;
  }
}

/**
 * Calculate nutritional summary from a list of foods
 */
export function calculateNutritionalSummary(
  foods: Food[], 
  profile?: PatientProfile
): NutritionalSummary {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;
  let totalFiber = 0;
  
  const rasaCount: Record<string, number> = {
    'Sweet': 0,
    'Sour': 0,
    'Salty': 0,
    'Pungent': 0,
    'Bitter': 0,
    'Astringent': 0
  };
  
  foods.forEach(food => {
    totalCalories += food.calories;
    
    if (food.nutrition) {
      // Handle both old (flat) and new (nested) nutrition structure
      const nutrition = food.nutrition as any;
      
      if (nutrition.macronutrients) {
        // New structure with macronutrients/micronutrients
        totalProtein += nutrition.macronutrients.protein || 0;
        totalCarbs += nutrition.macronutrients.carbohydrates || 0;
        totalFats += nutrition.macronutrients.fats || 0;
        totalFiber += nutrition.macronutrients.fiber || 0;
      } else {
        // Old flat structure (current foods.json format)
        totalProtein += nutrition.protein || 0;
        totalCarbs += nutrition.carbohydrates || 0;
        totalFats += nutrition.fats || 0;
        totalFiber += nutrition.fiber || 0;
      }
    } else {
      // Estimate if nutrition data not available
      totalProtein += food.calories * 0.15 / 4;
      totalCarbs += food.calories * 0.55 / 4;
      totalFats += food.calories * 0.30 / 9;
      totalFiber += 2;
    }
    
    // Count rasa occurrences
    food.ayurvedic.rasa.forEach(rasa => {
      rasaCount[rasa] = (rasaCount[rasa] || 0) + 1;
    });
  });
  
  const summary: NutritionalSummary = {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFats: Math.round(totalFats),
    totalFiber: Math.round(totalFiber),
    rasaBalance: {
      sweet: rasaCount['Sweet'] || 0,
      sour: rasaCount['Sour'] || 0,
      salty: rasaCount['Salty'] || 0,
      pungent: rasaCount['Pungent'] || 0,
      bitter: rasaCount['Bitter'] || 0,
      astringent: rasaCount['Astringent'] || 0,
    }
  };
  
  // Calculate percentages if profile provided
  if (profile) {
    const dailyCalories = calculateDailyCalories(profile);
    const dailyProtein = calculateDailyProtein(profile);
    const dailyCarbs = calculateDailyCarbs(dailyCalories);
    const dailyFats = calculateDailyFats(dailyCalories);
    
    summary.caloriePercentage = Math.round((totalCalories / dailyCalories) * 100);
    summary.proteinPercentage = Math.round((totalProtein / dailyProtein) * 100);
    summary.carbsPercentage = Math.round((totalCarbs / dailyCarbs) * 100);
    summary.fatsPercentage = Math.round((totalFats / dailyFats) * 100);
  }
  
  return summary;
}

/**
 * Get Ayurvedic guidelines based on prakriti and health conditions
 */
export function getAyurvedicGuidelines(profile: PatientProfile): string[] {
  const guidelines: string[] = [];
  const { prakriti, bowelMovements, digestionQuality, medicalConditions } = profile;
  
  // Prakriti-specific guidelines
  switch (prakriti) {
    case 'Vata':
      guidelines.push('Favor warm, cooked, and nourishing foods');
      guidelines.push('Avoid cold, dry, and raw foods');
      guidelines.push('Eat meals at regular times');
      guidelines.push('Include healthy fats like ghee and sesame oil');
      break;
    case 'Pitta':
      guidelines.push('Favor cooling and hydrating foods');
      guidelines.push('Avoid spicy, salty, and fried foods');
      guidelines.push('Include sweet fruits and vegetables');
      guidelines.push('Drink plenty of cool water');
      break;
    case 'Kapha':
      guidelines.push('Favor light, warm, and dry foods');
      guidelines.push('Avoid heavy, oily, and sweet foods');
      guidelines.push('Include pungent and bitter tastes');
      guidelines.push('Eat smaller portions');
      break;
  }
  
  // Bowel movement guidelines
  if (bowelMovements === 'Constipation') {
    guidelines.push('Increase fiber intake with fruits and vegetables');
    guidelines.push('Drink warm water first thing in the morning');
  } else if (bowelMovements === 'Loose') {
    guidelines.push('Avoid cold and raw foods');
    guidelines.push('Include binding foods like banana and yogurt');
  }
  
  // Digestion guidelines
  if (digestionQuality === 'Poor') {
    guidelines.push('Eat easily digestible foods');
    guidelines.push('Avoid heavy meals in the evening');
    guidelines.push('Include digestive spices like ginger and cumin');
  }
  
  // Medical condition guidelines
  if (medicalConditions && medicalConditions.includes('Diabetes')) {
    guidelines.push('Choose low glycemic index foods');
    guidelines.push('Avoid refined sugars and white rice');
  }
  
  if (medicalConditions && medicalConditions.includes('Hypertension')) {
    guidelines.push('Reduce sodium intake');
    guidelines.push('Include potassium-rich foods');
  }
  
  if (medicalConditions && medicalConditions.includes('Acidity')) {
    guidelines.push('Avoid sour and spicy foods');
    guidelines.push('Include cooling foods like cucumber and coconut');
  }
  
  return guidelines;
}

/**
 * Get meal timing recommendations
 */
export function getMealTimings(): MealTiming[] {
  return [
    {
      meal: 'breakfast' as MealType,
      recommendedTime: '7:00 AM - 9:00 AM',
      description: 'Break the overnight fast with light, energizing foods'
    },
    {
      meal: 'lunch' as MealType,
      recommendedTime: '12:00 PM - 1:00 PM',
      description: 'Main meal when digestive fire (Agni) is strongest'
    },
    {
      meal: 'dinner' as MealType,
      recommendedTime: '6:00 PM - 7:30 PM',
      description: 'Light meal, eaten at least 2-3 hours before sleep'
    }
  ];
}
