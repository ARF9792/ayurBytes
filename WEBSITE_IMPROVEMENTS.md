# AyurBytes - Personalized Ayurvedic Diet Planner

## 🌟 Welcome to Your Improved Website!

We've completely redesigned the user experience to make it **beginner-friendly**, **intuitive**, and **feature-rich**. Here's what's new:

---

## 📱 New Navigation System

### **5 Clear Sections** (Tab-Based Navigation)

1. **🏠 Home** - Welcome page with feature overview and latest diet plan
2. **⚡ Quick Start** - 30-second form for beginners
3. **👤 Assessment** - Comprehensive health evaluation (detailed)
4. **📊 Dashboard** - Track progress with beautiful charts
5. **👨‍🍳 Recipes** - Browse Ayurvedic recipes with filtering

---

## 🎯 User Journey Improvements

### For New Users:
1. **Land on Home** → See welcome section explaining what AyurBytes does
2. **Read "How It Works"** → Understand the 3-step process
3. **Choose Your Path**:
   - **Quick Start**: For instant results (minimal info)
   - **Assessment**: For personalized care (detailed info)
4. **Get Diet Plan** → Automatically saved to dashboard
5. **Explore Recipes** → Find cooking instructions for your foods
6. **Track Progress** → Monitor trends over time

### For Returning Users:
- See latest diet plan on Home page
- Quick access to Dashboard and Recipes
- Profile saved in browser (auto-fills forms)

---

## ✨ Key Features

### 1. **Welcome Section** (`WelcomeSection.tsx`)
- **Hero Banner**: Clear value proposition
- **How It Works**: 3-step visual guide
- **Feature Cards**: Explains each section (Quick Start, Assessment, Dashboard, Recipes)
- **Getting Started CTA**: Encourages action with benefits (Free, Science-Backed, Personalized)

### 2. **Quick Start Form**
- **30-second setup**: Just age, gender, and prakriti (body type)
- **Beginner-friendly**: Perfect for first-time users
- **Info boxes**: Explains why it's good for beginners
- **Instant results**: Generates basic diet plan

### 3. **Comprehensive Assessment**
- **Detailed evaluation**: 15+ fields including medical history, lifestyle, goals
- **Health conditions**: Diabetes, PCOD, thyroid, etc.
- **Personalized care**: Most accurate recommendations
- **Info boxes**: Explains benefits of detailed form

### 4. **Dashboard** (Already existed, now more visible)
- **4 Charts**: Calorie trends, macro distribution, six tastes, weekly macros
- **Stat Cards**: Days tracked, average calories, streak, compliance
- **3 Tabs**: Overview, Nutrition, Compliance
- **History tracking**: Last 30 diet plans auto-saved

### 5. **Recipe Browser** (NEW!)
- **Search bar**: Find recipes by name or ingredients
- **Filters**: Category (Breakfast, Main Course, etc.) and difficulty
- **Recommended section**: Recipes matching your current diet plan
- **Recipe cards**: Show time, servings, difficulty, nutrients
- **Detailed view**: Ingredients, instructions, nutrition facts, Ayurvedic benefits

---

## 🎨 Design Improvements

### Visual Hierarchy
- **Color-coded sections**: Each feature has unique gradient (Emerald, Purple, Blue, Pink)
- **Icons everywhere**: Visual cues for quick recognition
- **Card-based layout**: Clean, modern, mobile-friendly
- **Shadows and borders**: Depth and separation

### Mobile Responsive
- **Tab labels hide on small screens**: Icons only
- **Grid layouts adapt**: 1 column on mobile, 2-3 on desktop
- **Touch-friendly buttons**: Large tap targets
- **Scrollable modals**: Works on any screen size

### Empty States
- **No diet plan yet**: Shows welcome section instead of blank page
- **No recipes found**: Helpful message with retry suggestion
- **No dashboard data**: Explains how to generate first plan

---

## 📂 File Structure

```
app/
├── page.tsx                      # Main app (NEW IMPROVED VERSION)
├── page_old_backup.tsx           # Old version (backup)
├── components/
│   ├── WelcomeSection.tsx        # NEW: Hero & feature cards
│   ├── RecipeBrowser.tsx         # NEW: Recipe search & browse
│   ├── PatientForm.tsx           # Quick form (30 sec)
│   ├── ComprehensivePatientForm  # Detailed form (5 min)
│   ├── DietChartDisplay.tsx      # Shows diet plan
│   ├── Dashboard.tsx             # Progress tracking
│   ├── RecipeDisplay.tsx         # Recipe card & detail view
│   └── LanguageSelector.tsx      # English/Hindi toggle
```

---

## 🔧 Technical Improvements

### State Management
- **Single view state**: `currentView` controls which section shows
- **Persistent profile**: Saved to localStorage, auto-loads
- **Diet plan caching**: Saved after generation
- **Recipe loading**: Lazy-loaded from JSON

### Data Flow
1. User submits form → POST to `/api/generate-diet`
2. API returns diet plan → Save to state + localStorage history
3. Diet plan shown → Available across all sections
4. Food names extracted → Used for recipe recommendations

### Error Handling
- **Loading states**: Spinner with message
- **Error messages**: Red alert boxes
- **Empty states**: Helpful guidance
- **Fallbacks**: Graceful degradation

---

## 🚀 How to Use (For Developers)

### Run the Development Server
```bash
npm run dev
```

### Navigate Sections Programmatically
```typescript
setCurrentView('home')              // Go to home
setCurrentView('quick-form')        // Go to quick start
setCurrentView('comprehensive-form') // Go to assessment
setCurrentView('dashboard')         // Go to dashboard
setCurrentView('recipes')           // Go to recipes
```

### Access Current Diet Plan
```typescript
const foodNames = dietPlan
  ? [...dietPlan.breakfast, ...dietPlan.lunch, ...dietPlan.dinner]
      .map(food => food.name)
  : [];
```

### Check if User Has Profile
```typescript
if (patientProfile) {
  console.log('User:', patientProfile.name);
  console.log('Age:', patientProfile.age);
  console.log('Prakriti:', patientProfile.prakriti);
}
```

---

## 📊 Data Files

### Single Source of Truth
- **`data/foods.json`**: All food items (300+ foods)
- **`data/recipes.json`**: All recipes (50+ recipes)

### No Confusion!
We use **one foods.json file** located at `data/foods.json`. Any other food files you see are old/unused.

---

## 🎓 For Beginners (Users)

### "I'm new to Ayurveda, where do I start?"
1. Click **"Quick Start"** tab
2. Fill in your age, gender, and select your body type (Vata/Pitta/Kapha)
   - **Don't know your type?** We'll add a quiz soon! For now, choose "Vata" if you're thin/active, "Pitta" if you're medium build, "Kapha" if you're heavier build
3. Click "Generate Diet Plan"
4. View your personalized meals!

### "What's the difference between Quick Start and Assessment?"
- **Quick Start**: 3 fields, 30 seconds, basic recommendations
- **Assessment**: 15+ fields, 5 minutes, highly personalized (considers health conditions, allergies, goals)

### "How do I find recipes?"
1. Generate a diet plan first (Quick Start or Assessment)
2. Click **"Recipes"** tab
3. See **"Recommended for Your Diet Plan"** section at top
4. Click any recipe card to see full instructions

### "What are the charts for?"
The **Dashboard** shows:
- How many calories you've eaten over time
- Balance of protein/carbs/fat
- Six Ayurvedic tastes (sweet, sour, salty, pungent, bitter, astringent)
- Your compliance streak

---

## 🐛 Known Issues & Fixes

### ❌ "Multiple foods.json files confusing me"
**Fixed!** We now use only `data/foods.json`. Ignore any other files.

### ❌ "Forms appearing without explanation"
**Fixed!** Each form now has:
- Descriptive header with icon
- Info box explaining purpose
- Estimated time to complete

### ❌ "Can't find recipes"
**Fixed!** Recipes now have dedicated tab with:
- Search functionality
- Category/difficulty filters
- Recommended section based on your diet

### ❌ "Graphs not working"
**Fixed!** Dashboard charts now:
- Show empty state if no data
- Explain how to generate first plan
- Display properly on all screen sizes

### ❌ "Too confusing for newcomers"
**Fixed!** Added:
- Welcome section on home page
- "How It Works" visual guide
- Feature cards explaining each section
- Info boxes on every form

---

## 🎯 Next Steps (Future Enhancements)

### Coming Soon:
- [ ] **Prakriti Quiz**: Auto-determine body type with questions
- [ ] **Weekly meal plans**: 7-day plans with variety
- [ ] **Grocery list**: Export shopping list from diet plan
- [ ] **Print/PDF export**: Save diet plans as PDF
- [ ] **Email reminders**: Get notified for meal times
- [ ] **Food diary**: Track what you actually ate
- [ ] **Recipe ratings**: Rate and favorite recipes
- [ ] **Social sharing**: Share your progress

---

## 💡 Tips for Best Experience

### For Users:
1. **Use Comprehensive Assessment** for best results (takes 5 min, worth it!)
2. **Generate multiple plans** to see dashboard charts populate
3. **Explore recipes** - many have video links and Ayurvedic benefits
4. **Check dashboard weekly** to track your compliance streak

### For Developers:
1. **Keep components small**: Each section is its own component
2. **Use TypeScript**: All types defined in `src/types/`
3. **Follow naming**: Component files are PascalCase, utilities are camelCase
4. **Test mobile-first**: Most users will be on phones

---

## 📞 Support

### Issues?
- Check **Known Issues** section above
- Clear browser cache and try again
- Check console for error messages

### Questions?
- Read **For Beginners** section
- Check **How to Use** section
- Review component code (well-commented!)

---

**🌿 Made with ancient wisdom and modern technology**

*AyurBytes - Your Journey to Ayurvedic Wellness Starts Here*
