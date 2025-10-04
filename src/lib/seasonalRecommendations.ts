import { Food } from '@/types';
import { Season, SeasonalFood } from '@/types/advancedDiet';

/**
 * Get current season based on month (Northern Hemisphere - India)
 */
export function getCurrentSeason(): Season {
  const month = new Date().getMonth(); // 0-11
  
  // Spring: March, April, May (Vasant Ritu)
  if (month >= 2 && month <= 4) return 'spring';
  
  // Summer: June, July, August (Grishma Ritu)
  if (month >= 5 && month <= 7) return 'summer';
  
  // Autumn: September, October, November (Sharad Ritu)
  if (month >= 8 && month <= 10) return 'autumn';
  
  // Winter: December, January, February (Hemant/Shishir Ritu)
  return 'winter';
}

/**
 * Seasonal food availability mapping based on Ayurvedic principles
 */
const SEASONAL_FOODS: Record<string, Season[]> = {
  // Spring foods (cooling, detoxifying)
  'leafy_greens': ['spring', 'summer'],
  'bitter_gourd': ['spring', 'summer'],
  'asparagus': ['spring'],
  'strawberry': ['spring'],
  'mango': ['spring', 'summer'],
  
  // Summer foods (cooling, hydrating)
  'watermelon': ['summer'],
  'coconut': ['summer'],
  'mint': ['summer'],
  'coriander': ['summer'],
  'cucumber': ['summer', 'autumn'],
  'yogurt': ['summer'],
  
  // Autumn foods (warming, grounding)
  'pumpkin': ['autumn', 'winter'],
  'sweet_potato': ['autumn', 'winter'],
  'apple': ['autumn'],
  'pomegranate': ['autumn', 'winter'],
  'carrot': ['autumn', 'winter'],
  'beets': ['autumn', 'winter'],
  'dates': ['autumn', 'winter'],
  
  // Winter foods (warming, nourishing)
  'sesame': ['winter'],
  'ghee': ['winter'],
  'nuts': ['winter'],
  'root_vegetables': ['winter'],
  'ginger': ['winter'],
  'turmeric': ['winter'],
  'black_pepper': ['winter'],
  'jaggery': ['winter'],
  
  // Year-round foods
  'rice': ['spring', 'summer', 'autumn', 'winter'],
  'lentils': ['spring', 'summer', 'autumn', 'winter'],
  'chickpeas': ['spring', 'summer', 'autumn', 'winter'],
  'milk': ['spring', 'summer', 'autumn', 'winter'],
};

/**
 * Check if food name matches seasonal category
 */
function matchesFoodCategory(foodName: string, category: string): boolean {
  const name = foodName.toLowerCase();
  
  // Direct matches
  if (name.includes(category.replace('_', ' '))) return true;
  
  // Category-based matching
  switch (category) {
    case 'leafy_greens':
      return name.includes('spinach') || name.includes('kale') || 
             name.includes('lettuce') || name.includes('fenugreek') ||
             name.includes('methi') || name.includes('palak');
    
    case 'root_vegetables':
      return name.includes('potato') || name.includes('carrot') ||
             name.includes('radish') || name.includes('turnip') ||
             name.includes('beet');
    
    case 'nuts':
      return name.includes('almond') || name.includes('cashew') ||
             name.includes('walnut') || name.includes('pistachio');
    
    case 'lentils':
      return name.includes('dal') || name.includes('lentil') ||
             name.includes('moong') || name.includes('masoor') ||
             name.includes('toor') || name.includes('chana');
    
    default:
      return false;
  }
}

/**
 * Get seasonal availability for a food item
 */
export function getFoodSeasons(food: Food): Season[] {
  const foodName = food.name.toLowerCase();
  
  // Check each seasonal category
  for (const [category, seasons] of Object.entries(SEASONAL_FOODS)) {
    if (matchesFoodCategory(foodName, category)) {
      return seasons;
    }
  }
  
  // Default: available year-round
  return ['spring', 'summer', 'autumn', 'winter'];
}

/**
 * Check if food is in peak season
 */
export function isInPeakSeason(food: Food, season?: Season): boolean {
  const currentSeason = season || getCurrentSeason();
  const foodSeasons = getFoodSeasons(food);
  return foodSeasons.includes(currentSeason);
}

/**
 * Get Ayurvedic seasonal benefit description
 */
export function getSeasonalBenefit(food: Food, season: Season): string {
  const foodName = food.name.toLowerCase();
  
  switch (season) {
    case 'spring':
      if (foodName.includes('bitter') || foodName.includes('leafy')) {
        return 'Detoxifies and balances Kapha accumulated during winter';
      }
      return 'Light and energizing for spring renewal';
    
    case 'summer':
      if (foodName.includes('cucumber') || foodName.includes('melon') || 
          foodName.includes('coconut') || foodName.includes('yogurt')) {
        return 'Cooling and hydrating, pacifies Pitta in summer heat';
      }
      return 'Helps maintain body temperature and hydration';
    
    case 'autumn':
      if (foodName.includes('sweet') || foodName.includes('root')) {
        return 'Grounding and nourishing, balances Vata in dry season';
      }
      return 'Provides stability during seasonal transition';
    
    case 'winter':
      if (foodName.includes('sesame') || foodName.includes('ghee') || 
          foodName.includes('nut') || foodName.includes('ginger')) {
        return 'Warming and strengthening, builds immunity in cold weather';
      }
      return 'Nourishes and insulates body during winter';
  }
}

/**
 * Filter foods to prefer seasonal options
 */
export function filterSeasonalFoods(foods: Food[], season?: Season): Food[] {
  const currentSeason = season || getCurrentSeason();
  
  // Separate seasonal and non-seasonal foods
  const seasonalFoods: Food[] = [];
  const nonSeasonalFoods: Food[] = [];
  
  foods.forEach(food => {
    if (isInPeakSeason(food, currentSeason)) {
      seasonalFoods.push(food);
    } else {
      nonSeasonalFoods.push(food);
    }
  });
  
  // Prefer seasonal foods (70%) over non-seasonal (30%)
  const seasonalCount = Math.ceil(foods.length * 0.7);
  const result = seasonalFoods.slice(0, seasonalCount);
  
  // Fill remaining with non-seasonal if needed
  if (result.length < foods.length) {
    const remaining = foods.length - result.length;
    result.push(...nonSeasonalFoods.slice(0, remaining));
  }
  
  return result;
}

/**
 * Get seasonal food recommendations with Ayurvedic benefits
 */
export function getSeasonalFoodRecommendations(
  foods: Food[], 
  season?: Season
): SeasonalFood[] {
  const currentSeason = season || getCurrentSeason();
  
  return foods.map(food => ({
    food,
    seasons: getFoodSeasons(food),
    isPeakSeason: isInPeakSeason(food, currentSeason),
    ayurvedicBenefit: getSeasonalBenefit(food, currentSeason),
  }));
}

/**
 * Get seasonal eating guidelines based on Ayurveda
 */
export function getSeasonalGuidelines(season: Season): {
  dosha: string;
  tastes: string[];
  foods: string[];
  avoid: string[];
  lifestyle: string;
} {
  switch (season) {
    case 'spring':
      return {
        dosha: 'Kapha predominant - focus on lightness and detoxification',
        tastes: ['Pungent', 'Bitter', 'Astringent'],
        foods: ['Leafy greens', 'Bitter vegetables', 'Light grains', 'Honey'],
        avoid: ['Heavy foods', 'Dairy', 'Sweet fruits', 'Fried foods'],
        lifestyle: 'Exercise regularly, wake early, practice detoxifying routines',
      };
    
    case 'summer':
      return {
        dosha: 'Pitta predominant - focus on cooling and hydration',
        tastes: ['Sweet', 'Bitter', 'Astringent'],
        foods: ['Cooling fruits', 'Cucumber', 'Coconut', 'Rice', 'Sweet vegetables'],
        avoid: ['Spicy foods', 'Sour foods', 'Heating spices', 'Alcohol'],
        lifestyle: 'Stay hydrated, avoid midday sun, practice cooling breathing',
      };
    
    case 'autumn':
      return {
        dosha: 'Vata predominant - focus on grounding and moisture',
        tastes: ['Sweet', 'Sour', 'Salty'],
        foods: ['Root vegetables', 'Sweet fruits', 'Warm soups', 'Healthy fats'],
        avoid: ['Raw foods', 'Cold foods', 'Dry foods', 'Beans in excess'],
        lifestyle: 'Establish routine, stay warm, practice oil massage (abhyanga)',
      };
    
    case 'winter':
      return {
        dosha: 'Vata and Kapha - focus on warming and building',
        tastes: ['Sweet', 'Sour', 'Salty'],
        foods: ['Warming spices', 'Nuts', 'Ghee', 'Root vegetables', 'Whole grains'],
        avoid: ['Cold drinks', 'Raw salads', 'Frozen foods', 'Light meals'],
        lifestyle: 'Eat warm foods, use warming spices, maintain regular sleep schedule',
      };
  }
}
