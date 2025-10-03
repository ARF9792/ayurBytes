# Project Structure - Ayurvedic Diet Planner

## 📁 Organized File Structure

```
ayurBytes/
├── 📄 Configuration Files
│   ├── .gitignore
│   ├── next.config.ts           # Next.js configuration
│   ├── package.json             # Dependencies & scripts (Turbopack enabled)
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── README.md                # Project README
│
├── 📂 app/                      # Next.js App Directory
│   ├── 📂 api/                  # API Routes
│   │   ├── generate-diet/
│   │   │   └── route.ts         # Diet generation endpoint
│   │   └── translate/           # Translation endpoints (if needed)
│   │
│   ├── 📂 components/           # React Components
│   │   ├── ClientProviders.tsx  # Client-side provider wrapper
│   │   ├── DietChartDisplay.tsx # Diet plan display component
│   │   ├── LanguageSelector.tsx # Language selector dropdown
│   │   └── PatientForm.tsx      # Patient information form
│   │
│   ├── favicon.ico              # App favicon
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout (Server Component)
│   └── page.tsx                 # Home page
│
├── 📂 src/                      # Source Code
│   ├── 📂 constants/            # Constants & Configuration
│   │   └── index.ts             # App constants (Prakriti, meals, etc.)
│   │
│   ├── 📂 contexts/             # React Contexts
│   │   └── TranslationContext.tsx # Translation state management
│   │
│   ├── 📂 lib/                  # Utility Libraries
│   │   ├── utils.ts             # General utilities
│   │   └── dietHelpers.ts       # Diet-specific helper functions
│   │
│   └── 📂 types/                # TypeScript Type Definitions
│       ├── index.ts             # Main type definitions
│       └── translation.ts       # Translation-specific types
│
├── 📂 public/                   # Static Assets
│   ├── 📂 assets/               # Organized assets
│   │   └── 📂 icons/            # SVG Icons
│   │       ├── file.svg
│   │       ├── globe.svg
│   │       ├── next.svg
│   │       ├── vercel.svg
│   │       └── window.svg
│   │
│   ├── 📂 images/               # Image files
│   │   ├── 1.png
│   │   └── 2.png
│   │
│   └── 📂 locales/              # Translation files (JSON)
│       ├── en.json              # English
│       ├── hi.json              # Hindi
│       ├── bn.json              # Bengali
│       ├── te.json              # Telugu
│       ├── mr.json              # Marathi
│       ├── ta.json              # Tamil
│       └── sa.json              # Sanskrit
│
├── 📂 data/                     # Data Files
│   └── foods.json               # Ayurvedic foods database
│
└── 📂 docs/                     # Documentation
    ├── mermaid.md               # Diagrams & charts
    ├── ps.txt                   # Notes
    ├── TRANSLATION_README.md    # Translation documentation
    ├── IMPLEMENTATION_SUMMARY.md # Implementation details
    ├── FIXES_COMPLETED.md       # Bug fixes documentation
    ├── QUICK_REFERENCE.md       # Quick reference guide
    ├── PROJECT_STRUCTURE.md     # This file
    ├── REFACTORING_SUMMARY.md   # Refactoring details
    └── CHECKLIST.md             # Complete checklist
```

## 🎯 Key Improvements

### ✅ 1. **Better Organization**
- All images in `public/images/`
- All icons in `public/assets/icons/`
- All translations in `public/locales/`
- All documentation in `docs/`

### ✅ 2. **Type Safety**
- Centralized type definitions in `src/types/`
- Separate files for different type categories
- Proper TypeScript interfaces for all data structures

### ✅ 3. **Code Reusability**
- Helper functions in `src/lib/`
- Constants in `src/constants/`
- Shared utilities in proper locations

### ✅ 4. **Scalability**
- Prepared folders for future features (`hooks/`, `i18n/`, `utils/`)
- Modular component structure
- Separated concerns (data, logic, presentation)

### ✅ 5. **Clean Architecture**
- Server Components vs Client Components properly separated
- API routes in dedicated folder
- Static assets properly organized

## 📋 File Purposes

### Core Application Files

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout (Server Component) |
| `app/page.tsx` | Home page with main logic |
| `app/components/ClientProviders.tsx` | Wraps client-side providers |
| `app/api/generate-diet/route.ts` | Diet generation API endpoint |

### Type Definitions

| File | Purpose |
|------|---------|
| `src/types/index.ts` | Main types (Food, DietPlan, Prakriti, etc.) |
| `src/types/translation.ts` | Translation system types |

### Utilities & Helpers

| File | Purpose |
|------|---------|
| `src/lib/utils.ts` | General utility functions |
| `src/lib/dietHelpers.ts` | Diet-specific helper functions |
| `src/constants/index.ts` | App-wide constants |

### State Management

| File | Purpose |
|------|---------|
| `src/contexts/TranslationContext.tsx` | Translation context & provider |

### Components

| File | Purpose |
|------|---------|
| `app/components/PatientForm.tsx` | User input form |
| `app/components/DietChartDisplay.tsx` | Diet plan display |
| `app/components/LanguageSelector.tsx` | Language selection UI |

### Data & Assets

| Folder/File | Purpose |
|-------------|---------|
| `data/foods.json` | Ayurvedic foods database |
| `public/locales/*.json` | Translation files |
| `public/images/` | Image assets |
| `public/assets/icons/` | SVG icons |

## 🚀 Benefits of This Structure

1. **Easy Navigation** - Everything has its place
2. **Maintainability** - Clear separation of concerns
3. **Scalability** - Easy to add new features
4. **Type Safety** - Centralized type definitions
5. **Performance** - Proper Next.js optimization
6. **Developer Experience** - Intuitive file organization

## 📝 Naming Conventions

- **Components**: PascalCase (e.g., `PatientForm.tsx`)
- **Utilities**: camelCase (e.g., `dietHelpers.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Types**: PascalCase (e.g., `PatientFormData`)
- **Folders**: lowercase with hyphens (e.g., `generate-diet/`)

## 🔄 Migration Guide

### Old → New Locations

```
Root images (1.png, 2.png) → public/images/
Root SVGs (*.svg) → public/assets/icons/
Root docs (*.md) → docs/
Inline types → src/types/
Inline helpers → src/lib/
```

## 🎨 Asset Management

### Images
- **Location**: `public/images/`
- **Usage**: `<img src="/images/1.png" />`
- **Next.js Image**: `<Image src="/images/1.png" />`

### Icons
- **Location**: `public/assets/icons/`
- **Usage**: `<img src="/assets/icons/globe.svg" />`

### Translations
- **Location**: `public/locales/`
- **Usage**: Loaded via TranslationContext

## 🛠️ Development Workflow

1. **Components** → Add to `app/components/`
2. **Types** → Define in `src/types/`
3. **Utilities** → Add to `src/lib/`
4. **Constants** → Add to `src/constants/`
5. **API Routes** → Add to `app/api/`
6. **Documentation** → Add to `docs/`

## ✨ Best Practices

- ✅ Use absolute imports (`@/src/...`, `@/app/...`)
- ✅ Keep components focused and small
- ✅ Use TypeScript for type safety
- ✅ Organize by feature when project grows
- ✅ Document complex logic
- ✅ Keep translations up to date
- ✅ Use constants instead of magic strings

---

**Result**: A clean, organized, and scalable project structure! 🎉
