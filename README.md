# NutriWell, SleepSync & LifeFlow - Complete Wellness Suite

A comprehensive wellness platform combining intelligent nutrition tracking, meal timing optimization, and time-blocked scheduling. Track nutrients, optimize gut health, improve sleep through meal timing, and schedule your days for maximum wellness impact.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue) ![Version](https://img.shields.io/badge/Version-3.0-blue)

---

## 🌟 Three Integrated Modes

### 🥗 NutriWell - Nutrition Intelligence
Track meals, analyze nutrients, close gaps, and support gut health with science-backed recommendations.

**Key Features:**
- Comprehensive food logging with 200+ item database
- 25+ nutrient tracking (macros, vitamins, minerals, electrolytes)
- Gut Health (GBDI) scoring with 7-day history
- Meal templates with AI-powered autofill
- Food Budget tracker (daily, weekly, monthly views)
- Achievement system & streak tracking
- Personalized recommendations engine

### 🌙 SleepSync - Meal Timing Optimization
Optimize when you eat to improve sleep quality using circadian science and digestive timing.

**Key Features:**
- Sleep schedule configuration
- Meal timing analysis
- Circadian eating window calculator
- Sleep readiness score
- Digestive buffer recommendations
- Late meal warnings
- Integration with NutriWell food logs

### 📅 LifeFlow - Time-Blocked Scheduling
Build daily schedules that integrate nutrition, sleep, activities, and personal goals.

**Key Features:**
- Recurring activity management
- 3-7 day schedule generation
- Goal tracking with milestones
- Intelligent meal autofill from patterns
- Cook time estimation
- Activity completion tracking
- Free time scaffolding for goals

---

## 🚀 Advanced Features

### Wellness Intelligence
- **Stress Tracking** — Daily stress, sleep quality, and energy monitoring
- **Health Correlations** — Multi-metric pattern detection (stress vs. gut health, sleep vs. energy)
- **AI Insights** — Weekly personalized recommendations using GPT-4o-mini
- **GBDI History** — 7-day gut health trend tracking with insights

### Educational Content
- 15+ in-app learning cards
- Nutrient synergy education
- Meal timing science
- Gut health fundamentals

---

## 📋 Documentation

Comprehensive documentation for users, developers, and stakeholders:

### Core Documentation
- **[PRODUCTION-READY.md](./PRODUCTION-READY.md)** — Production deployment status and readiness checklist
- **[PRD.md](./PRD.md)** — Complete Product Requirements Document (v3.0)
- **[IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md)** — Feature completion tracker (100%)
- **[NEXT-STEPS.md](./NEXT-STEPS.md)** — Future enhancement roadmap
- **[COMPLETION-SUMMARY.md](./COMPLETION-SUMMARY.md)** — Implementation work summary

### Additional Documentation
- **[/src/components/_archived/README.md](./src/components/_archived/README.md)** — Future Phase 7k/7j feature documentation
- **[docs/legal-disclaimer.md](./docs/legal-disclaimer.md)** — Full legal disclaimers

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nutriwell
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Seed Data

The app includes realistic sample data demonstrating all three modes:
- **15 food log entries** across 2 days with varied meals
- **3 days of stress tracking** data
- **3 custom meal templates** (breakfast, lunch, dinner)
- **4 recurring activities** (work, workout, dog walk, meditation)
- **2 active goals** with milestones
- **Configured sleep schedule** for SleepSync analysis

Explore all features immediately without manual setup.

---

## 🏗️ Tech Stack

- **Frontend:** React 19, TypeScript 5.7
- **Styling:** Tailwind CSS 4.1, shadcn/ui components
- **State Management:** React hooks + `useKV` (persistent local storage)
- **Icons:** Phosphor Icons
- **Build Tool:** Vite 6.4
- **Deployment:** Vercel-ready (Spark template)

---

## 🎨 Design Philosophy

### Core Principles
1. **Simplicity Through Reduction** — Start complex, remove until simplest effective solution
2. **Material Honesty** — UI elements look and behave like what they are
3. **Obsessive Detail** — Every pixel, interaction, and transition is intentional
4. **Food First, Products Second** — Always recommend whole foods before supplements
5. **Calm, Not Chaotic** — Soft colors, generous spacing, no alarm bells
6. **Warm & Digestible** — Default to cooked/room-temp suggestions for sensitive users

### Typography
- **Headings:** Crimson Pro (serif, elegant)
- **Body:** Inter (sans-serif, highly legible)
- **Hierarchy:** Clear distinction between H1/H2/H3 and body text

### Color Palette
- **Primary:** Earthy sage green (trust, health, nature)
- **Secondary:** Soft mint (calm, freshness)
- **Accent:** Warm teal (energy, vitality)
- **Background:** Off-white with subtle warmth
- **Foreground:** Deep charcoal (not pure black)

---

## 📊 Project Structure

```
nutriwell-sleepsync-lifeflow/
├── src/
│   ├── components/
│   │   ├── pages/                      # Main application pages
│   │   │   ├── LogFood.tsx             # Food logging interface
│   │   │   ├── MealPlanner.tsx         # Meal templates & planning
│   │   │   ├── FoodBudget.tsx          # Nutrient budget tracker
│   │   │   ├── Recommendations.tsx     # Personalized suggestions
│   │   │   ├── Education.tsx           # Educational content
│   │   │   ├── Achievements.tsx        # Gamification & streaks
│   │   │   ├── Settings.tsx            # User preferences
│   │   │   ├── SleepSync.tsx           # Meal timing optimization
│   │   │   └── LifeFlow.tsx            # Time-blocked scheduling
│   │   ├── ui/                         # shadcn components (40+)
│   │   ├── StressTracker.tsx           # Daily stress input
│   │   ├── StressHistory.tsx           # 7-day stress trends
│   │   ├── GBDIDisplay.tsx             # Gut health score
│   │   ├── GBDIHistory.tsx             # 7-day gut health trends
│   │   ├── HealthCorrelations.tsx      # Multi-metric analysis
│   │   ├── AIInsights.tsx              # AI-powered insights
│   │   ├── AdrenalLoadDisplay.tsx      # Stress load visualization
│   │   ├── _archived/                  # Future Phase 7k/7j components
│   │   └── ...
│   ├── lib/
│   │   ├── nutritionEngine.ts          # Core nutrition analysis
│   │   ├── circadianEngine.ts          # Meal timing calculations
│   │   ├── mealPatternEngine.ts        # Pattern detection
│   │   ├── adrenalEngine.ts            # Stress load calculations
│   │   ├── dailyValues.ts              # DV reference data
│   │   ├── exerciseEngine.ts           # MET calculations (future)
│   │   ├── personalizedNutrition.ts    # Profile calculations (future)
│   │   └── ...
│   ├── data/
│   │   ├── foods.ts                    # 200+ food database
│   │   ├── mealTemplates.ts            # Preset meal templates
│   │   └── wellnessSupplements.ts      # Wellness items
│   ├── App.tsx                         # Root component
│   └── index.css                       # Theme & global styles
├── PRD.md                              # Product Requirements (v3.0)
├── PRODUCTION-READY.md                 # Deployment readiness
├── IMPLEMENTATION-STATUS.md            # Feature completion (100%)
├── NEXT-STEPS.md                       # Future roadmap
└── README.md                           # This file
```

---

## 🔬 Core Logic

### Nutrition Analysis (`lib/nutritionEngine.ts`)

The analysis engine performs:

1. **Nutrient Totals Calculation** — Sum all logged foods by serving quantity
2. **Gap Detection** — Compare totals to Daily Values, classify as critical/moderate/minor/good
3. **Gut Support Score (0-100)** — Based on:
   - Fiber intake (35% weight)
   - Fermented food count (25% weight)
   - Plant diversity (20% weight)
   - Polyphenol-rich foods (15% weight)
   - Ultra-processed penalty (−15% max)
   - Gut stressor penalty (−10% per stressor)

4. **GBDI Calculation** — Gut-Brain-Digestive Index:
   - Base score: 50
   - +fiber % (−50) × 0.3
   - +fermented count × 8 (max +20)
   - +plant diversity × 2 (max +15)
   - −ultra-processed burden × 0.5
   - −gut stressors × 10

5. **Adrenal Load** — Stress markers:
   - Coffee count × 15
   - Excess sugar × 0.2
   - Ultra-processed count × 10
   - Low magnesium penalty (+10)
   - Low vitamin C penalty (+5)

6. **Synergy Suggestions** — Rule-based logic:
   - Non-heme iron + no vitamin C → suggest adding vitamin C
   - Iron + high calcium → suggest separating
   - Low magnesium → suggest pumpkin seeds, spinach, dark chocolate
   - Low fiber + no fermented → suggest gut-supportive foods

7. **Timing Conflicts** — Detect:
   - Coffee within 2 hours of iron-rich meal
   - Calcium-rich food with iron
   - Heavy meals after 8pm

---

## 🍽️ Food Database

Currently includes 20 nutrient-dense foods across categories:
- **Proteins:** Eggs, chicken, salmon, sardines, lentils
- **Vegetables:** Spinach, broccoli, bell peppers, sweet potato
- **Dairy:** Kefir, Greek yogurt
- **Fermented:** Sauerkraut, kimchi
- **Grains:** Oats, quinoa
- **Nuts/Seeds:** Almonds, pumpkin seeds
- **Fruits:** Blueberries, avocado
- **Other:** Dark chocolate

**Future:** Integrate USDA FoodData Central API for 10K+ foods

---

## 🧪 Key Wellness Lenses

### 1. **GBDI (Gut-Brain-Digestive Index)**
Composite score reflecting overall gut health, fiber intake, and microbiome support.

### 2. **Adrenal Load**
Measures dietary stress from caffeine, refined sugars, and nutrient deficiencies affecting stress response.

### 3. **Warm vs. Cold Suitability**
Tags foods as "warm-suitable" (cooked, room-temp, easier to digest) vs. cold/raw. Prioritizes warm options for sensitive digestion.

### 4. **Fermented/Probiotic Frequency**
Tracks consumption of kefir, yogurt, sauerkraut, kimchi — target 2x/week for gut diversity.

### 5. **Timing Conflicts**
Flags absorption inhibitors:
- Coffee/tea within 2 hours of iron
- High calcium + iron in same meal
- Late heavy meals (sleep disruption)

### 6. **Mineral Trio Sufficiency**
Calcium, magnesium, potassium balance — critical for bones, muscles, nerves, blood pressure.

### 7. **Gut Stressors**
Flags NSAIDs mention, ultra-processed foods (>20% of intake), alcohol.

### 8. **Staple Compliance**
Tracks user-declared staples:
- Liver: 2-3x/week (B12, iron, vitamin A)
- Cultured dairy: 2x/week (probiotics)
- Pumpkin seeds: daily (magnesium, zinc)

---

## 🚧 Roadmap

### ✅ MVP Complete (v3.0) - Production Ready
All features implemented and tested:
- [x] NutriWell mode with comprehensive tracking
- [x] SleepSync meal timing optimization
- [x] LifeFlow time-blocked scheduling
- [x] Stress tracking & health correlations
- [x] AI-powered weekly insights
- [x] 7-day history tracking (gut health, stress)
- [x] Achievement system & gamification
- [x] Educational content library
- [x] Responsive mobile design
- [x] Seed data for immediate exploration

### 🎯 Future Enhancements (User-Driven)

#### Phase 7k: Personalized Nutrition Profiles
Build only if users request personalized recommendations:
- Multi-stage profile setup (age, sex, activity level)
- Dynamic Daily Value calculations
- BMI and body composition tracking
- Lifestyle factors (caffeine, medications)
- 7-day re-evaluation reminders

**Estimated Effort:** 2-3 weeks

#### Phase 7j: Exercise & Fitness Tracking
Build only if users want fitness integration:
- Exercise logging with MET-based calorie calculations
- Workout schedule integration with LifeFlow
- Exercise-aware nutrient recommendations
- Progress tracking & history

**Estimated Effort:** 1-2 weeks

#### Phase 8: User Authentication
Build only when multi-device sync is needed:
- Secure login & multi-user support
- Cloud data sync (Supabase)
- Developer data isolation
- Data export & account deletion

**Estimated Effort:** 3-4 weeks

#### Phase 8a-e: Advanced UX
- Interactive onboarding tutorial
- Daily check-in commitment system
- Auto-task generation for LifeFlow
- Enhanced goal progress tracking (quantitative inputs)
- Cross-mode synergy detection

**Estimated Effort:** 4-6 weeks total

**See [NEXT-STEPS.md](./NEXT-STEPS.md) for detailed implementation plans**

---

## ⚖️ Legal & Compliance

### Disclaimers

**This application is for informational and educational purposes only.**

- ❌ **Not medical advice** — Always consult a physician or registered dietitian
- ❌ **No diagnosis/treatment** — Does not diagnose, treat, cure, or prevent any disease
- ❌ **No professional relationship** — Use does not create a doctor-patient or dietitian-client relationship
- ✅ **Estimates only** — Nutrient values are approximate and may not reflect actual food consumed
- ✅ **Affiliate disclosure** — May earn commissions on product recommendations

**See [docs/legal-disclaimer.md](./docs/legal-disclaimer.md) for full legal text.**

### Data Privacy
- **Local storage only (MVP)** — All data stored in browser via spark.kv
- **No server transmission** — Your data never leaves your device
- **User control** — Clear data anytime via browser DevTools

---

## 🤝 Contributing

This is currently a solo/demo project. Future plans may include:
- Community-sourced food database
- User-submitted meal templates
- Translations (Spanish, etc.)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 📬 Contact

- **Issues:** Open a GitHub issue
- **Email:** (placeholder) support@nutriwell.app
- **Documentation:** See `/docs` folder

---

## 🙏 Acknowledgments

- **Nutrition Data:** USDA FoodData Central
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Phosphor Icons](https://phosphoricons.com/)
- **Inspiration:** Cronometer, ZOE, Huberman Lab, functional nutrition community

---

**Built with ❤️ for people who want to optimize nutrition, sleep, and daily wellness.**

*NutriWell, SleepSync & LifeFlow — Complete wellness intelligence in one platform.*
