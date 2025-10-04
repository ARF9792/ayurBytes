# Language Translation Helper

## Quick Guide to Complete Remaining Languages

### Languages Pending:
1. Bengali (বাংলা) - bn.json
2. Telugu (తెలుగు) - te.json
3. Marathi (मराठी) - mr.json
4. Tamil (தமிழ்) - ta.json
5. Sanskrit (संस्कृतम्) - sa.json

### Steps:

1. **Copy base file**:
   ```bash
   Copy-Item "public\locales\en.json" "public\locales\bn.json"
   ```

2. **Open the file** and translate ONLY the values (keep keys in English)

3. **Example**:
   ```json
   // BEFORE (English):
   {
     "app.title": "Ayurvedic Diet Planner",
     "nav.home": "Home"
   }
   
   // AFTER (Bengali):
   {
     "app.title": "আয়ুর্বেদিক ডায়েট পরিকল্পনাকারী",
     "nav.home": "হোম"
   }
   ```

### Key Translation Points:

#### Bengali (bn.json) Sample:
```json
{
  "app.title": "আয়ুর্বেদিক ডায়েট পরিকল্পনাকারী",
  "app.subtitle": "আপনার অনন্য সংবিধানের উপর ভিত্তি করে ব্যক্তিগতকৃত আহার পরিকল্পনা",
  "nav.home": "হোম",
  "nav.quickstart": "দ্রুত শুরু",
  "nav.assessment": "মূল্যায়ন",
  "nav.dashboard": "ড্যাশবোর্ড",
  "nav.recipes": "রেসিপি"
}
```

#### Telugu (te.json) Sample:
```json
{
  "app.title": "ఆయుర్వేద ఆహార ప్రణాళిక",
  "app.subtitle": "మీ ప్రత్యేక రాజ్యాంగం ఆధారంగా వ్యక్తిగతీకరించిన ఆహార ప్రణాళికలు",
  "nav.home": "హోమ్",
  "nav.quickstart": "త్వరిత ప్రారంభం",
  "nav.assessment": "అంచనా",
  "nav.dashboard": "డాష్‌బోర్డ్",
  "nav.recipes": "వంటకాలు"
}
```

#### Marathi (mr.json) Sample:
```json
{
  "app.title": "आयुर्वेदिक आहार योजनाकार",
  "app.subtitle": "आपल्या अद्वितीय प्रकृतीवर आधारित वैयक्तिक आहार योजना",
  "nav.home": "मुख्यपृष्ठ",
  "nav.quickstart": "द्रुत सुरुवात",
  "nav.assessment": "मूल्यांकन",
  "nav.dashboard": "डॅशबोर्ड",
  "nav.recipes": "पाककृती"
}
```

#### Tamil (ta.json) Sample:
```json
{
  "app.title": "ஆயுர்வேத உணவு திட்டமிடுபவர்",
  "app.subtitle": "உங்கள் தனித்துவமான அமைப்பின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட உணவு திட்டங்கள்",
  "nav.home": "முகப்பு",
  "nav.quickstart": "விரைவு தொடக்கம்",
  "nav.assessment": "மதிப்பீடு",
  "nav.dashboard": "டாஷ்போர்டு",
  "nav.recipes": "சமையல் குறிப்புகள்"
}
```

#### Sanskrit (sa.json) Sample:
```json
{
  "app.title": "आयुर्वेदिक आहार योजनाकार",
  "app.subtitle": "भवतः अद्वितीय प्रकृतौ आधारितः व्यक्तिगत आहार योजनाः",
  "nav.home": "मुख्यपृष्ठम्",
  "nav.quickstart": "शीघ्र आरम्भः",
  "nav.assessment": "मूल्यांकनम्",
  "nav.dashboard": "नियंत्रण पटलम्",
  "nav.recipes": "पाक विधयः"
}
```

### Tips:

1. **Use AI Translation Tools**:
   - Google Translate API
   - DeepL
   - ChatGPT/Claude for batch translation
   
2. **Maintain Context**:
   - Translate based on Ayurvedic/health context
   - Keep technical terms (Prakriti, Vata, Pitta, Kapha) in Sanskrit
   
3. **Test After Translation**:
   ```bash
   npm run dev
   # Switch language in UI
   # Verify all text displays correctly
   ```

4. **Common Translations**:
   - "Vegetarian" → 
     - Bengali: নিরামিষ
     - Telugu: శాకాహారం
     - Marathi: शाकाहारी
     - Tamil: சைவம்
     - Sanskrit: शाकाहारी
   
   - "Non-Vegetarian" →
     - Bengali: আমিষ
     - Telugu: మాంసాహారం
     - Marathi: मांसाहारी
     - Tamil: அசைவம்
     - Sanskrit: मांसाहारी

### Automated Translation Script:

Create `scripts/translateLanguages.js`:
```javascript
const fs = require('fs');
const path = require('path');

// Load English translations
const en = require('../public/locales/en.json');

// AI Translation function (use your preferred API)
async function translate(text, targetLang) {
  // TODO: Implement with Google Translate API or similar
  return text; // Placeholder
}

async function generateTranslations(targetLang) {
  const translated = {};
  
  for (const [key, value] of Object.entries(en)) {
    translated[key] = await translate(value, targetLang);
  }
  
  const outputPath = path.join(__dirname, `../public/locales/${targetLang}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
  
  console.log(`✅ Generated ${targetLang}.json`);
}

// Run for all languages
['bn', 'te', 'mr', 'ta', 'sa'].forEach(generateTranslations);
```

---

## Priority Recommendation:

1. **Start with Bengali & Telugu** (largest user bases in India)
2. Then Marathi & Tamil
3. Sanskrit last (cultural/ceremonial use)

---

**Good luck with translations! 🌍**
