// Type definitions for the Ayurvedic Diet Planner application

/**
 * Basic patient form data structure
 */
export interface PatientFormData {
  age: number;
  gender: 'Male' | 'Female';
  prakriti: PrakritiType;
}

/**
 * Comprehensive patient profile data structure
 */
export interface PatientProfile extends PatientFormData {
  // Personal Information
  name: string;
  patientId?: string;
  dateOfBirth?: Date;
  
  // Physical Measurements
  height: number; // in cm
  weight: number; // in kg
  bmi?: number; // calculated
  
  // Health Parameters
  medicalConditions: MedicalCondition[];
  allergies: string[];
  currentMedications: string[];
  
  // Dietary Information
  dietaryHabits: DietaryHabits;
  mealFrequency: number; // meals per day
  waterIntake: number; // liters per day
  
  // Lifestyle
  activityLevel: ActivityLevel;
  sleepHours: number;
  stressLevel: StressLevel;
  
  // Ayurvedic Assessment
  bowelMovements: BowelMovement;
  digestionQuality: DigestionQuality;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Prakriti (Ayurvedic constitution) types
 */
export type PrakritiType = 'Vata' | 'Pitta' | 'Kapha';

/**
 * Medical conditions
 */
export type MedicalCondition = 
  | 'Diabetes'
  | 'Hypertension'
  | 'Heart Disease'
  | 'Thyroid'
  | 'PCOD/PCOS'
  | 'Arthritis'
  | 'Acidity'
  | 'IBS'
  | 'None';

/**
 * Dietary habits
 */
export type DietaryHabits = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian';

/**
 * Activity level
 */
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Extremely Active';

/**
 * Stress level
 */
export type StressLevel = 'Low' | 'Moderate' | 'High';

/**
 * Bowel movement patterns
 */
export type BowelMovement = 'Regular' | 'Irregular' | 'Constipation' | 'Loose';

/**
 * Digestion quality
 */
export type DigestionQuality = 'Good' | 'Moderate' | 'Poor';

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
 * Season types
 */
export type Season = 'Summer' | 'Winter' | 'Monsoon' | 'Spring' | 'Autumn' | 'All';

/**
 * Nutritional information structure
 */
export interface NutritionalInfo {
  calories: number;
  protein: number; // grams
  carbohydrates: number; // grams
  fats: number; // grams
  fiber: number; // grams
  sugar?: number; // grams
  
  // Micronutrients (optional, in mg unless specified)
  vitaminA?: number; // mcg
  vitaminC?: number; // mg
  vitaminD?: number; // mcg
  vitaminB12?: number; // mcg
  calcium?: number; // mg
  iron?: number; // mg
  magnesium?: number; // mg
  potassium?: number; // mg
  zinc?: number; // mg
  
  // Additional metrics
  glycemicIndex?: number;
  cholesterol?: number; // mg
  sodium?: number; // mg
}

/**
 * Food item structure
 */
export interface Food {
  id: number;
  name: string;
  category: FoodCategory;
  calories: number;
  ayurvedic: AyurvedicProperties;
  nutrition?: NutritionalInfo; // Enhanced nutritional data
  servingSize?: string; // e.g., "100g", "1 cup"
  region?: string; // e.g., "North Indian", "South Indian"
  season?: Season[]; // Best seasons for this food
}

/**
 * Meal types
 */
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

/**
 * Meal timing recommendation
 */
export interface MealTiming {
  meal: MealType;
  recommendedTime: string;
  description: string;
}

/**
 * Nutritional summary for a meal or entire plan
 */
export interface NutritionalSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  totalFiber: number;
  
  // Rasa (taste) distribution
  rasaBalance: {
    sweet: number;
    sour: number;
    salty: number;
    pungent: number;
    bitter: number;
    astringent: number;
  };
  
  // Daily requirement percentages
  caloriePercentage?: number;
  proteinPercentage?: number;
  carbsPercentage?: number;
  fatsPercentage?: number;
}

/**
 * Complete diet plan structure
 */
export interface DietPlan {
  breakfast: Food[];
  lunch: Food[];
  dinner: Food[];
  snacks?: Food[]; // Optional snacks
  
  // Enhanced metadata
  patientProfile?: PatientProfile;
  nutritionalSummary?: NutritionalSummary;
  mealTimings?: MealTiming[];
  guidelines?: string[]; // Ayurvedic guidelines for the patient
  generatedAt?: Date;
}

/**
 * API response types
 */
export interface DietPlanResponse extends DietPlan {}

export interface ApiError {
  error: string;
  message?: string;
}
