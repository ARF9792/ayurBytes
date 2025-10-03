// Type definitions for the Ayurvedic Diet Planner application

/**
 * Patient form data structure
 */
export interface PatientFormData {
  age: number;
  gender: 'Male' | 'Female';
  prakriti: PrakritiType;
}

/**
 * Prakriti (Ayurvedic constitution) types
 */
export type PrakritiType = 'Vata' | 'Pitta' | 'Kapha';

/**
 * Age group categories for diet planning
 */
export type AgeGroup = 'Child' | 'Adult' | 'Elderly';

/**
 * Ayurvedic properties of food
 */
export interface AyurvedicProperties {
  rasa: Rasa[];
  guna: Guna[];
  virya: Virya;
  digestibility: Digestibility;
  suitableFor: AgeGroup[];
}

/**
 * Rasa (Taste) types in Ayurveda
 */
export type Rasa = 'Sweet' | 'Sour' | 'Salty' | 'Pungent' | 'Bitter' | 'Astringent';

/**
 * Guna (Quality) types in Ayurveda
 */
export type Guna = 'Heavy' | 'Light' | 'Oily' | 'Dry' | 'Hot' | 'Cold' | 'Smooth' | 'Rough';

/**
 * Virya (Potency) types
 */
export type Virya = 'Heating' | 'Cooling';

/**
 * Digestibility levels
 */
export type Digestibility = 'Easy' | 'Moderate' | 'Complex';

/**
 * Food category types
 */
export type FoodCategory = 'Grain' | 'Lentil' | 'Protein' | 'Vegetable' | 'Fruit' | 'Dairy' | 'Spice';

/**
 * Food item structure
 */
export interface Food {
  id: number;
  name: string;
  category: FoodCategory;
  calories: number;
  ayurvedic: AyurvedicProperties;
}

/**
 * Meal types
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner';

/**
 * Complete diet plan structure
 */
export interface DietPlan {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
}

/**
 * API response types
 */
export interface DietPlanResponse extends DietPlan {}

export interface ApiError {
  error: string;
  message?: string;
}
