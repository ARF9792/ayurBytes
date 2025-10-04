const fs = require('fs');
const path = require('path');

// Load foods
const foodsPath = path.join(__dirname, '../data/foods.json');
const foods = JSON.parse(fs.readFileSync(foodsPath, 'utf8'));

// Hindi names mapping (common foods)
const hindiNames = {
  'Moong Dal': 'मूंग दाल',
  'Basmati Rice': 'बासमती चावल',
  'Chapati': 'चपाती',
  'Roti': 'रोटी',
  'Paratha': 'पराठा',
  'Rice': 'चावल',
  'Dal': 'दाल',
  'Lentil': 'दाल',
  'Milk': 'दूध',
  'Ghee': 'घी',
  'Butter': 'मक्खन',
  'Curd': 'दही',
  'Yogurt': 'दही',
  'Paneer': 'पनीर',
  'Potato': 'आलू',
  'Tomato': 'टमाटर',
  'Onion': 'प्याज',
  'Spinach': 'पालक',
  'Carrot': 'गाजर',
  'Cabbage': 'पत्तागोभी',
  'Cauliflower': 'फूलगोभी',
  'Peas': 'मटर',
  'Banana': 'केला',
  'Apple': 'सेब',
  'Mango': 'आम',
  'Orange': 'संतरा',
  'Papaya': 'पपीता',
  'Pomegranate': 'अनार',
  'Grapes': 'अंगूर',
  'Watermelon': 'तरबूज',
  'Guava': 'अमरूद',
  'Chicken': 'मुर्गा',
  'Fish': 'मछली',
  'Egg': 'अंडा',
  'Meat': 'मांस',
  'Turmeric': 'हल्दी',
  'Cumin': 'जीरा',
  'Ginger': 'अदरक',
  'Garlic': 'लहसुन',
  'Cardamom': 'इलायची',
  'Cinnamon': 'दालचीनी',
  'Clove': 'लौंग',
  'Honey': 'शहद',
  'Jaggery': 'गुड़',
  'Sugar': 'चीनी',
  'Salt': 'नमक',
  'Oil': 'तेल',
  'Wheat': 'गेहूं',
  'Almond': 'बादाम',
  'Cashew': 'काजू',
  'Walnut': 'अखरोट',
  'Coconut': 'नारियल',
  'Cucumber': 'खीरा',
  'Radish': 'मूली',
  'Beetroot': 'चुकंदर',
  'Pumpkin': 'कद्दू',
  'Bitter Gourd': 'करेला',
  'Bottle Gourd': 'लौकी',
  'Ridge Gourd': 'तोरी',
  'Lady Finger': 'भिंडी',
  'Okra': 'भिंडी',
  'Brinjal': 'बैंगन',
  'Eggplant': 'बैंगन',
  'Green Beans': 'हरी बीन्स',
  'Lemon': 'नींबू',
  'Lime': 'नींबू',
  'Mint': 'पुदीना',
  'Coriander': 'धनिया',
  'Fenugreek': 'मेथी',
  'Mustard': 'सरसों',
  'Sesame': 'तिल',
  'Peanut': 'मूंगफली',
  'Soybean': 'सोयाबीन',
  'Chickpea': 'चना',
  'Kidney Bean': 'राजमा',
  'Black Gram': 'उड़द',
  'Green Gram': 'मूंग',
  'Pigeon Pea': 'तुअर',
  'Bengal Gram': 'चना दाल',
  'Tea': 'चाय',
  'Coffee': 'कॉफी',
  'Water': 'पानी'
};

// Function to determine diet type
function getDietType(food) {
  const name = food.name.toLowerCase();
  
  // Non-Vegetarian
  if (name.includes('chicken') || name.includes('mutton') || name.includes('lamb') ||
      name.includes('goat') || name.includes('fish') || name.includes('prawn') ||
      name.includes('shrimp') || name.includes('meat') || name.includes('pork') ||
      name.includes('beef')) {
    return 'Non-Vegetarian';
  }
  
  // Eggetarian
  if (name.includes('egg')) {
    return 'Eggetarian';
  }
  
  // Check if vegan (no dairy)
  const hasDairy = name.includes('milk') || name.includes('ghee') || 
                    name.includes('butter') || name.includes('curd') ||
                    name.includes('yogurt') || name.includes('paneer') ||
                    name.includes('cheese') || name.includes('cream');
  
  if (!hasDairy) {
    // Could be vegan, but for simplicity mark as Vegetarian
    return 'Vegetarian';
  }
  
  return 'Vegetarian';
}

// Function to generate Hindi name
function getHindiName(englishName) {
  // Try to find direct match
  for (const [eng, hin] of Object.entries(hindiNames)) {
    if (englishName.toLowerCase().includes(eng.toLowerCase())) {
      // Replace the English part with Hindi
      return englishName.replace(new RegExp(eng, 'gi'), hin);
    }
  }
  
  // If no match found, return undefined (will use English name as fallback)
  return undefined;
}

// Update each food
const updatedFoods = foods.map(food => {
  const dietType = getDietType(food);
  const nameHindi = getHindiName(food.name);
  
  return {
    ...food,
    dietType,
    ...(nameHindi && { nameHindi })
  };
});

// Save updated foods
fs.writeFileSync(foodsPath, JSON.stringify(updatedFoods, null, 2), 'utf8');

console.log(`✅ Updated ${updatedFoods.length} foods with dietType`);
console.log(`✅ Added Hindi names to ${updatedFoods.filter(f => f.nameHindi).length} foods`);
console.log('\nDiet Type Distribution:');
console.log(`- Vegetarian: ${updatedFoods.filter(f => f.dietType === 'Vegetarian').length}`);
console.log(`- Non-Vegetarian: ${updatedFoods.filter(f => f.dietType === 'Non-Vegetarian').length}`);
console.log(`- Eggetarian: ${updatedFoods.filter(f => f.dietType === 'Eggetarian').length}`);
console.log(`- Vegan: ${updatedFoods.filter(f => f.dietType === 'Vegan').length}`);
