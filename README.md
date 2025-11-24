# NutriWell - Smart Nutrition Intelligence

A comprehensive nutrition tracking and analysis platform that helps users identify nutrient gaps, optimize absorption through synergy insights, and support gut health — all with a food-first, low-friction approach.

![NutriWell](https://img.shields.io/badge/Status-MVP-green) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)

---

## 🌟 Key Features

### Core Functionality
- **Low-Friction Food Logging** — Quick add buttons, search, and simple serving input
- **Comprehensive Nutrient Analysis** — Track 25+ nutrients (macros, vitamins, minerals, electrolytes)
- **Gap Detection** — Color-coded status for each nutrient with % of Daily Value
- **Synergy Intelligence** — Suggestions for nutrient pairings (e.g., vitamin C + iron)
- **Timing Conflict Detection** — Alerts for absorption issues (e.g., coffee near iron-rich meals)
- **Net Calorie Tracking** — See calories consumed minus exercise burned
- **Cloud Data Sync** — Multi-device sync with automatic backup (optional)

### Wellness Framework
- **Gut Support Score (0-100)** — Based on fiber, fermented foods, plant diversity, ultra-processed burden
- **GBDI (Gut-Brain-Digestive Index)** — Holistic digestive wellness metric
- **Adrenal Load Score** — Tracks stress impact from caffeine, sugar, processed foods
- **Mineral Trio Sufficiency** — Calcium, magnesium, potassium balance
- **Warm Food Preference** — Prioritizes cooked/room-temp options for easier digestion

### User Experience
- **User Authentication** — Secure email/password login via Supabase
- **Personalized Daily Values** — Custom nutrient targets based on your profile
- **Exercise Integration** — Log workouts in LifeFlow mode, see net calories in NutriWell
- **Multi-Mode System** — NutriWell (nutrition), SleepSync (meal timing), LifeFlow (scheduling)

### Educational Content
- **In-App Learning** — 9+ educational cards covering nutrient synergies, timing, and wellness
- **Actionable Takeaways** — Every card includes practical "what to do" steps
- **Contextual Delivery** — Relevant content appears based on detected gaps

### Future Features (Roadmap)
- **Data Export** — Download your data as JSON/CSV
- **Wearable Integration** — Apple Watch, Fitbit sync for activity, sleep, HRV-informed recommendations
- **Post-Workout Nutrition** — Meal suggestions based on exercise type and timing

---

## 📋 Documentation

This project includes comprehensive business and technical documentation:

- **[PRD.md](./PRD.md)** — Product Requirements Document (features, personas, roadmap, metrics)
- **[CLOUD-SYNC-GUIDE.md](./CLOUD-SYNC-GUIDE.md)** — Complete guide to cloud data synchronization
- **[USER-TODO-SUPABASE-SETUP.md](./USER-TODO-SUPABASE-SETUP.md)** — Supabase setup instructions
- **[docs/business-plan.md](./docs/business-plan.md)** — Market analysis, revenue model, go-to-market strategy
- **[docs/legal-disclaimer.md](./docs/legal-disclaimer.md)** — Full legal disclaimers and compliance notes
- **[docs/integration-plan.md](./docs/integration-plan.md)** — Wearable/biometric integration strategy
- **[docs/content-model.md](./docs/content-model.md)** — Educational content structure and creation workflow

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

Sample food logs are automatically seeded on first load. You can:
- View sample analysis on the Dashboard
- Add new foods via Log Food page
- Clear data in browser DevTools → Application → Storage → spark.kv

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
nutriwell/
├── docs/                          # Business & technical documentation
│   ├── business-plan.md
│   ├── legal-disclaimer.md
│   ├── integration-plan.md
│   └── content-model.md
├── src/
│   ├── components/
│   │   ├── pages/                 # Main page components
│   │   │   ├── Dashboard.tsx      # Today's nutrition overview
│   │   │   ├── LogFood.tsx        # Food logging interface
│   │   │   ├── Recommendations.tsx # Synergy suggestions & gaps
│   │   │   ├── Education.tsx      # Educational content cards
│   │   │   └── Settings.tsx       # User preferences
│   │   ├── ui/                    # shadcn components (40+ pre-installed)
│   │   ├── DisclaimerBanner.tsx   # Persistent legal disclaimer
│   │   └── Navigation.tsx         # Main navigation tabs
│   ├── lib/
│   │   ├── nutritionEngine.ts     # Core analysis logic
│   │   ├── dailyValues.ts         # DV constants & utilities
│   │   └── affiliate.ts           # Product matching (stubbed)
│   ├── data/
│   │   └── foods.ts               # 20-food mock database
│   ├── App.tsx                    # Root component
│   └── index.css                  # Global styles & theme
├── PRD.md                         # Product Requirements Document
├── README.md                      # This file
└── package.json
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

### ✅ MVP (Current)
- [x] Food logging with 20-food database
- [x] Comprehensive nutrient analysis (25+ nutrients)
- [x] Gap detection with color coding
- [x] Synergy suggestions (vitamin C + iron, etc.)
- [x] Timing conflict detection
- [x] Gut support score, GBDI, adrenal load
- [x] Wellness audit dashboard
- [x] Educational content (9 cards)
- [x] Persistent local storage (spark.kv)
- [x] Responsive design (mobile-friendly)
- [x] Legal disclaimers

### 🎯 v1.1 (Months 4-6)
- [ ] Affiliate product recommendations (with disclaimers)
- [ ] Expand food database (100+ foods or API integration)
- [ ] Meal timing optimization
- [ ] Weekly trends & reports
- [ ] CSV export
- [ ] Recipe suggestions for gap-filling

### 🚀 v2.0 (Months 10-12)
- [ ] Apple Health / HealthKit integration
- [ ] Fitbit API sync
- [ ] HRV-informed recommendations
- [ ] Activity-adjusted nutrient targets
- [ ] Premium tier (deeper analysis, unlimited history)
- [ ] Photo logging (AI food recognition)

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

**Built with ❤️ for people who care about what they eat.**

*NutriWell — Know your gaps, close them with food, thrive.*
