# 🧪 AyurBytes - Testing Guide

## Quick Testing Checklist

### ✅ 1. Multi-Language Support

**Test Steps:**
1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Look for language selector in top-right corner
4. Click to switch to Hindi (हिन्दी)
5. Verify all text changes to Hindi

**Expected Results:**
- ✅ All navigation tabs in Hindi
- ✅ Welcome section in Hindi  
- ✅ Form labels in Hindi
- ✅ Diet type badges in Hindi
- ✅ Hindi food names appear alongside English

---

### ✅ 2. Veg/Non-Veg Labels

**Test Steps:**
1. Generate a diet plan using Quick Start form
2. Scroll to the diet plan display
3. Look at each food item

**Expected Results:**
- ✅ Each food has a colored badge:
  - 🟢 Green "Vegetarian" badge for veg foods
  - 🔴 Red "Non-Vegetarian" for non-veg (if any)
  - 🟡 Yellow "Eggetarian" for egg items
- ✅ Badge shows icon (Leaf, Drumstick, or Egg)
- ✅ Hindi food names shown in parentheses (e.g., "मूंग दाल")

---

### ✅ 3. Seasonal Recommendations

**Test Steps:**
1. Generate a diet plan
2. Open browser DevTools → Network tab
3. Look at the response from `/api/generate-diet`
4. Check for `seasonalInfo` in response

**Expected Results:**
```json
{
  "breakfast": [...],
  "lunch": [...],
  "dinner": [...],
  "seasonalInfo": {
    "currentSeason": "Monsoon",  // or Summer, Winter, etc.
    "guidelines": [
      "Avoid cold and heavy foods...",
      "Prefer warm, light meals..."
    ],
    "seasonalFoodsUsed": 15
  }
}
```

---

### ✅ 4. Weekly Plan Generator

**Test Steps:**
1. Fill out Comprehensive Assessment form completely
   - Name: Test User
   - Age: 30
   - Weight: 70 kg
   - Height: 170 cm
   - Activity Level: Moderate
   - Prakriti: Vata (or any)
2. In browser console, run:
```javascript
fetch('/api/generate-diet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    age: 30,
    prakriti: 'Vata',
    profile: {
      name: 'Test User',
      age: 30,
      gender: 'Male',
      weight: 70,
      height: 170,
      activityLevel: 'Moderate',
      prakriti: 'Vata'
    },
    generateWeekly: true
  })
})
.then(r => r.json())
.then(data => console.log(JSON.stringify(data, null, 2)))
```

**Expected Results:**
```json
{
  "weekStartDate": "2025-10-04T00:00:00.000Z",
  "weekEndDate": "2025-10-11T00:00:00.000Z",
  "dailyPlans": [
    {
      "dayNumber": 1,
      "date": "2025-10-04",
      "dayName": "Day 1",
      "breakfast": [...],
      "lunch": [...],
      "dinner": [...]
    },
    // ... 6 more days
  ],
  "weeklyNutritionAverage": {
    "calories": 1850,
    "protein": 65,
    "carbs": 250,
    "fats": 55
  },
  "varietyScore": 0.85,
  "seasonalGuidelines": [...],
  "currentSeason": "Monsoon"
}
```

---

### ✅ 5. Error Handling

**Test Steps:**
1. Generate diet plan normally
2. Check browser console for errors
3. Try edge cases:
   - Age = 0 (should show validation)
   - No prakriti selected (should show alert)
   - Switch languages rapidly

**Expected Results:**
- ✅ No console errors
- ✅ No "Cannot read properties of undefined" errors
- ✅ Validation messages appear
- ✅ App remains stable

---

## 🎯 Test Different Scenarios

### Scenario 1: Young Child
```
Age: 5
Prakriti: Kapha
Expected: Easy-to-digest foods, child-suitable portions
```

### Scenario 2: Active Adult
```
Age: 28
Gender: Male
Weight: 75 kg
Height: 180 cm
Activity: Very Active
Prakriti: Pitta
Expected: Higher calorie foods, balanced macros
```

### Scenario 3: Senior Citizen
```
Age: 70
Prakriti: Vata
Expected: Light, warm foods, easy digestion
```

### Scenario 4: Different Seasons
Test by changing system date (if possible) or check that current season is detected:
- **Summer (April-June)**: Cooling foods
- **Monsoon (July-September)**: Warm, dry foods
- **Winter (December-February)**: Heating foods

---

## 🐛 Common Issues & Solutions

### Issue 1: Hindi Text Not Showing
**Solution**: Check browser font support. Install Devanagari fonts if needed.

### Issue 2: Weekly Plan Not Generating
**Cause**: Missing profile data  
**Solution**: Ensure all required fields are provided (age, weight, height, activity level)

### Issue 3: No Seasonal Info in Response
**Cause**: Old API call without seasonal integration  
**Solution**: Refresh page, clear cache, rebuild: `npm run build`

### Issue 4: Diet Type Badges Not Showing
**Cause**: Food data not updated  
**Solution**: Re-run: `node scripts/updateFoods.js`

---

## 📊 Performance Benchmarks

### Expected Load Times
- Initial page load: < 2 seconds
- Language switch: < 300ms
- Diet plan generation: 1-2 seconds
- Weekly plan generation: 2-4 seconds

### Expected Response Sizes
- Single day diet plan: ~5-10 KB
- Weekly plan: ~30-50 KB
- Translation file: ~15 KB

---

## ✅ Final Verification Checklist

Before deploying to production, verify:

- [ ] All 7 languages load without errors
- [ ] All 50 foods have dietType field
- [ ] Hindi names display correctly
- [ ] Seasonal filtering is active
- [ ] Weekly plan API endpoint works
- [ ] No TypeScript compilation errors
- [ ] No console errors in browser
- [ ] Mobile responsive (test on phone)
- [ ] PDF export still works
- [ ] Dashboard still loads
- [ ] Recipe browser still works

---

## 🚀 Production Deployment

```bash
# 1. Install dependencies
npm install

# 2. Build for production
npm run build

# 3. Test production build
npm start

# 4. Verify on localhost:3000

# 5. Deploy to your hosting platform
# (Vercel, Netlify, AWS, etc.)
```

---

## 📞 Need Help?

If you encounter issues:
1. Check `IMPLEMENTATION_SUMMARY.md` for technical details
2. Review error messages in console
3. Verify food data: `node -e "console.log(require('./data/foods.json')[0])"`
4. Check translation files: `public/locales/en.json`, `public/locales/hi.json`

---

**Testing Guide Version**: 1.0  
**Last Updated**: October 4, 2025  
**Status**: Ready for Testing ✅
