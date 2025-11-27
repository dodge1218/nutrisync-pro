# Product Requirements Document: NutriWell & Wellness Suite

**Status**: ✅ Production Ready + Phase 9 Complete (Personalized DVs) + Net Calories + Cloud Sync + UI Modernized + Theme Toggle + Performance Optimized  
**Last Updated**: November 2025  
**Version**: 3.6

---

## 🎯 Implementation Status Summary

### ✅ ALL CORE FEATURES COMPLETE (Phases 1-11 + Net Calories + Cloud Sync + Performance)

**NutriWell Mode** - Smart Nutrition Intelligence
- ✅ Food logging with intelligent unit conversion
- ✅ 200+ food database with comprehensive nutrient profiles
- ✅ Meal planning & custom templates with AI autofill
- ✅ Food Budget tracker (daily/weekly/monthly views)
- ✅ Gut Health scoring & 7-day history with emoji indicators
- ✅ Animated gut visualization with particle effects
- ✅ Gamification: achievements, streaks, levels
- ✅ Nutrient gap detection with personalized recommendations
- ✅ Adrenal load tracking & stress-aware suggestions
- ✅ Multi-metric health correlations visualization
- ✅ AI-powered weekly insights (GPT-4o-mini)
- ✅ **Net calorie tracking** (consumed - exercise burned) with toggle switch

**SleepSync Mode** - Sleep-Optimized Meal Timing
- ✅ Circadian meal timing analysis
- ✅ Sleep readiness score based on last meal time
- ✅ 3-4 hour digestion buffer recommendations
- ✅ Meal timing dashboard with visual timeline

**LifeFlow Mode** - Time-Blocked Scheduling
- ✅ Recurring activity management (work, exercise, cooking, etc.)
- ✅ 3-7 day schedule generation with meal integration
- ✅ Goal system with milestone tracking
- ✅ Intelligent meal autofill based on patterns
- ✅ Cook time estimation & auto-scheduling
- ✅ Exercise Creator with 40+ activities & MET calculations
- ✅ BMI & TDEE calculations
- ✅ Daily check-in commitment system with history
- ✅ Auto-task generation (morning/evening routines, hydration)
- ✅ Activity completion tracking

**System-Wide Features**
- ✅ User authentication (email/password with Supabase)
- ✅ **Cloud data sync with multi-device support** (auto 2-second debounce)
  - ✅ Supabase backend with Row Level Security
  - ✅ Manual Push/Pull controls
  - ✅ Smart migration tool for existing users
  - ✅ Enable/disable toggle with status indicators
  - ✅ Error handling and graceful fallback
- ✅ New user onboarding with 4-step welcome flow
- ✅ Interactive tutorials for all three modes
- ✅ Personalized nutrition profile system
- ✅ Personalized daily values (Phase 9) - Toggle in Settings to use custom nutrient targets
- ✅ 7-day re-evaluation reminders with snooze
- ✅ Cross-mode synergy detection & insights
- ✅ Legal disclaimer banner (persistent)
- ✅ Responsive design (mobile & desktop)
- ✅ **Profile history tracking** (weight, BMI, waist, body fat) with trend visualization
- ✅ **Theme Toggle** (Dark/Light/System modes)

---

## 📋 FUTURE ENHANCEMENTS (Planned But Not Yet Implemented)

**Priority 1: Critical for Scale**
- [x] **User Authentication** - ✅ Email/password auth with Supabase (COMPLETE)
- [ ] **Google OAuth Integration** - Sign in with Google via Supabase (Planned)
- [x] **Cloud Data Storage & Sync** - ✅ COMPLETE - Full cloud sync implemented (January 2025)
  - ✅ Multi-device sync with automatic 2-second debounce
  - ✅ Real-time cloud backup to Supabase
  - ✅ Manual Push/Pull controls for data management
  - ✅ Smart migration tool for existing local data
  - ✅ Enable/disable toggle in Settings
  - ✅ Sync status indicators and error handling
  - ✅ Row Level Security (RLS) - users can only access their own data
  - ✅ JSONB storage for flexible data structures
  - ✅ Automatic indexing for fast queries
  - ✅ Error handling with graceful fallback to local storage
- [x] **Data Export/Deletion** - ✅ COMPLETE - GDPR compliance features (January 2025)
  - ✅ Export to JSON (complete data backup)
  - ✅ Export to CSV (food logs, stress logs, meal templates, exercise logs)
  - ✅ Account deletion with cascade delete
  - ✅ Confirmation dialog with type-to-confirm safety
  - ✅ Automatic sign out after deletion
- [x] **Theme Toggle** - ✅ COMPLETE - Dark/Light mode support (November 2025)
  
**Priority 2: Engagement & Retention**
- [x] **Activate Personalized DVs** - ✅ COMPLETE - Calculator integrated with toggle in Settings
- [x] **Exercise-Nutrition Integration** - ✅ Net calorie tracking COMPLETE (January 2025)
  - ✅ Net calorie display (consumed - burned)
  - ✅ Toggle switch on Food Budget page to view net vs gross calories
  - ✅ Exercise calorie burn integration from LifeFlow
  - ✅ Automatic detection when exercise logs exist for today
  - ✅ Flame icon indicator showing calories burned
  - ✅ Real-time updates as food/exercise logged
  - [ ] Post-workout meal suggestions (planned)
- [x] **Profile History Tracking** - ✅ COMPLETE (January 2025)
  - ✅ Weight tracking over time with trend indicators
  - ✅ BMI calculation and classification (underweight/normal/overweight/obese)
  - ✅ Waist circumference tracking
  - ✅ Body fat percentage tracking
  - ✅ Visual trend charts (last 30 days)
  - ✅ Metric comparison and progress visualization
  - ✅ Entry management (add, update, delete)
  - ✅ Optional notes for context
  - ✅ Latest values displayed with trend badges
- [x] **Advanced Educational Content** - ✅ COMPLETE - Library expanded with 30+ cards covering synergies, timing, and wellness
- [x] **Enhanced Synergy Detection** - ✅ COMPLETE - Sophisticated rules for nutrient interactions (iron+C, calcium+D, etc.)
- [x] **Performance Optimization** - ✅ COMPLETE - Code splitting, lazy loading, and chunking implemented

**Priority 3: Advanced Features**
- [ ] **Phase 12**: Gut Health Animation 2.0 (Core Feature)
  - Redesign empty state icon
  - Animation trigger on food log
  - 3-day food persistence in visual
  - "Inside the Gut" visualization
  - **Food Icons:** Replace generic particles with tiny, simple food icons (e.g., apple icon for apple, leaf for greens)
- [ ] **Phase 13**: Wearable integration (Apple Health, Fitbit, Whoop)
- [ ] **Restaurant & Travel Mode** - Dining out database, travel-friendly logging
- [ ] **Supplement Auto-Detection** - Amazon order history integration
- [ ] **Photo Logging** - AI-powered meal recognition from photos
- [ ] **Voice Logging** - Speech-to-text food entry
- [ ] **Lab Integration** - Import blood work results for targeted recommendations
- [ ] **Microbiome Integration** - Connect gut test results (Viome, Thorne, etc.)
- [ ] **Social Features** - Share templates, challenges, accountability groups

**Priority 4: Specialized Modes**
- [ ] **Menstrual Cycle Nutrition** - Phase-specific recommendations
- [ ] **Athletic Performance Mode** - Training load integration, periodized nutrition
- [ ] **Longevity Focus** - Track longevity markers, NAD+ boosting foods
- [ ] **Family Management** - Multiple profiles, kid-friendly tracking

---

## 🚀 Quick Reference: What's Built vs. What's Planned

| Feature | Status | Location |
|---------|--------|----------|
| Food Logging | ✅ Complete | Log Food page |
| Meal Planning | ✅ Complete | Meal Planner page |
| Food Budget | ✅ Complete | Food Budget page (default) |
| Gut Health Scoring | ✅ Complete | Dashboard & Food Budget |
| Animated Gut Visual | ✅ Complete | Food Budget page |
| Stress Tracking | ✅ Complete | Dashboard |
| Exercise Tracking | ✅ Complete | LifeFlow → Exercise tab |
| Goal Setting | ✅ Complete | LifeFlow page |
| Daily Check-Ins | ✅ Complete | LifeFlow page |
| Auto-Tasks | ✅ Complete | LifeFlow schedule |
| AI Insights | ✅ Complete | Dashboard |
| Cross-Mode Synergies | ✅ Complete | Dashboard |
| Onboarding & Tutorials | ✅ Complete | First launch |
| Profile Reminders | ✅ Complete | App-wide |
| **User Authentication** | ✅ Complete | Email/password with Supabase |
| **Cloud Data Sync** | ✅ Complete | Multi-device sync + backup |
| **Personalized DVs Active** | ✅ Complete | Settings → Use Personalized Daily Values toggle |
| **Net Calorie Tracking** | ✅ Complete | Food Budget toggle for net vs gross |
| **Profile History Tracking** | ✅ Complete | Settings → Profile History section |
| **Wearable Sync** | ❌ Not Built | Future integration |
| **Photo Logging** | ❌ Not Built | AI/API partnership needed |
| **Lab Integration** | ❌ Not Built | Data import system needed |

---

## ✅ Completed Implementation Details

### Phase 1-2: Core Food Logging ✅
- Text-based food entry with intelligent parsing
- 200+ food database with complete nutrient profiles
- Unit conversion system (metric ↔ imperial)
- Weight vs. volume detection (oz vs fl oz)
- Meal type categorization (breakfast, lunch, dinner, snack)
- Timestamp tracking for meal timing analysis

### Phase 3: Meal Planning ✅
- Weekly meal planner with drag-and-drop
- Preset meal templates (20+ healthy meals)
- Custom template creation with AI autofill
- One-click meal logging from templates
- Supplement tracking at each meal
- Integer-only portions (1oz increments)

### Phase 4: Food Budget Tracker ✅
- Time period selection (today, 7 days, 30 days)
- Nutrient tracking against daily values (DVs)
- Visual budget indicators (deficit/surplus)
- Critical gap alerts (<50% DV)
- Budget status categories (critical, low, approaching, optimal, excess)
- Plant diversity counter

### Phase 5: Gamification ✅
- GBDI/Gut Health score (0-100 scale)
- Streak tracker with visual calendar
- Achievement system (common, rare, epic, legendary)
- Level progression (Starter → Master → Legendary)
- Progress visualization with animations

### Phase 6: SleepSync Mode ✅
- Meal timing analysis with visual timeline
- Sleep readiness score calculation
- 3-4 hour digestion buffer recommendations
- Caffeine cutoff timing
- Pattern detection for late eating

### Phase 7a: LifeFlow Scheduling ✅
- Recurring activity input system
- Category-based organization (work, exercise, cooking, etc.)
- Day-of-week selection for activities
- 3-7 day schedule generation
- Activity completion tracking

### Phase 7b: Meal Pattern Analysis ✅
- Automatic cook time estimation per template
- Historical cook time learning
- Pattern detection for recurring meals
- Confidence scoring for predictions

### Phase 7c: Adrenal Load Calculation ✅
- Dietary load tracking (caffeine, sugar, ultra-processed)
- Combined score (0-100) with dietary and stress components
- Supportive nutrient monitoring (magnesium, B-vitamins, vitamin C)

### Phase 7d: Enhanced Stress Tracking ✅
- User input system for daily stress levels
- Physical symptom tracking (tension, headaches, etc.)
- Mental symptom tracking (anxiety, brain fog, etc.)
- Stress history visualization with pattern detection
- 3+ consecutive day high stress alerts

### Phase 7e: LifeFlow Meal Autofill ✅
- Analyzes last 30 days of meal patterns
- Auto-populates future meals with >30% confidence
- Editable meal suggestions
- Cooking schedule generation

### Phase 7f: Stress-Aware Recommendations ✅
- High stress + high caffeine → reduction suggestions
- Poor sleep + high sugar → breakfast protein focus
- Low energy + nutrient gaps → targeted food recommendations
- Digestive issues + stress → fermented food suggestions

### Phase 7g: GBDI History Tracking ✅
- 7-day historical line chart
- Daily breakdown cards with individual scores
- Component factor display (fiber, fermented foods, diversity)
- Trend indicators (improving, stable, declining)
- Happy/sad emoji indicators on graph (😊/😔)

### Phase 7h: Multi-Metric Health Correlations ✅
- Unified timeline showing GBDI, stress, sleep, energy
- Correlation detection algorithms
- Strength indicators (strong, moderate, weak)
- Actionable recommendations based on patterns

### Phase 7i: AI-Powered Weekly Insights ✅
- GPT-4o-mini analysis of 7 days of data
- Pattern identification (improving, declining, consistent)
- Personalized actionable suggestions
- Positive reinforcement for healthy habits

### Phase 7j: Exercise Creator & Fitness Tracking ✅
- 40+ exercise activities with MET values
- BMI & TDEE calculations
- Calorie burn tracking per activity
- Weekly statistics (minutes, calories)
- Activity history with date filtering
- Fitness profile questionnaire
- **Location:** LifeFlow → Exercise tab

### Phase 7k: Personalized Nutrition Profiles ✅
- Multi-stage profile collection system
- BMR & TDEE calculation engine
- Personalized DV calculator (ready but not active)
- 7-day re-evaluation reminders
- Snooze functionality (tomorrow, 1 week)
- Lifestyle factors tracking (caffeine, alcohol, stress)
- ProfileReminder & ProfilePopupManager components

### Phase 7l: Animated Gut Visualization ✅
- Interactive gut character with 3 states (happy, neutral, struggling)
- Real-time food reaction system (3-second animations)
- Generic particle effects (upward-floating for good foods, warning for bad)
- Smooth Framer Motion animations
- Info modal explaining gut health scoring
- **Location:** Food Budget page

### Phase 8a: Onboarding & Tutorials ✅
- 4-step welcome flow (intro, profile, mode selection, disclaimer)
- Interactive tutorials for all 3 modes
- Element highlighting with overlays
- Progress tracking with skip/replay options
- Empty state guidance

### Phase 8b: Daily Check-In System ✅
- Morning check-in with AI-suggested tasks
- Task selection (3-5 per day) with custom input
- Throughout-day progress tracking
- Completion rate calculation
- Historical tracking with calendar view
- Category performance analysis
- **Location:** LifeFlow page

### Phase 8c: Auto-Task Generation ✅
- Common daily tasks auto-added to schedule
- Morning/evening routines, hydration reminders
- Smart scheduling (after wake, before sleep)
- Learning system (stops suggesting deleted tasks)
- Category toggles for customization
- **Location:** LifeFlow schedule

### Phase 8d: Enhanced Goal Progress ✅
- Quantitative milestone types (numeric, frequency, habit)
- Progress input UI with increment/decrement
- Target values and current progress
- Progress history with timestamps

### Phase 8e: Cross-Mode Synergies ✅
- Correlation detection across all 3 modes
- Nutrient-aware activity scheduling
- GBDI-informed wellness recommendations
- Sleep quality feedback loop
- Unified dashboard insights
- **Location:** Dashboard

### Phase 10: UI Modernization ✅
- **Complete Design System Refresh** (January 2025)
- Modern color palette with oklch color space
- Gradient backgrounds for depth and visual interest
- Enhanced shadows and depth (cards with hover effects)
- Improved button styling with active states and micro-interactions
- Larger touch targets and increased spacing (h-11 inputs, h-10/11 buttons)
- Rounded corners (rounded-xl, rounded-2xl) throughout
- Backdrop blur effects on cards and overlays
- Smooth transitions and animations (duration-200)
- Better visual hierarchy with bolder typography
- Refined component library (buttons, badges, inputs, progress bars)
- Improved header with gradient icon backgrounds
- Enhanced navigation with shadow effects

---

---

## 🔍 How to Use This PRD

**For Developers:**
- ✅ Green checkmarks = Feature is built and working
- ❌ Red X marks = Feature is planned but not yet built
- 📋 Clipboard = Feature is partially complete or needs integration

**Quick Navigation:**
- **Implementation Status Summary** (above) - What's done vs. what's planned
- **Problem Statement** (below) - Why this app exists
- **Feature Roadmap** - Detailed specs for all features (implemented + future)
- **Implementation Priority Guide** - Recommended build order for future features

---

## Problem Statement

Most people eat on autopilot without understanding specific nutrient gaps in their diet, particularly around gut health, micronutrients, and nutrient synergies. Existing tracking apps focus heavily on calories and macros while ignoring:

- **Micronutrient deficiencies** (vitamins, minerals, electrolytes)
- **Gut biome support** (fiber, fermented foods, polyphenols, diversity)
- **Nutrient timing and synergies** (e.g., vitamin C + iron, calcium-iron conflicts)
- **Practical, low-friction improvements** tailored to individual gaps
- **Wellness frameworks** like adrenal load, GBDI (Gut-Brain-Digestive Index), thermal food properties

This creates a gap where health-conscious users track religiously but still experience deficiencies, poor absorption, and suboptimal gut health.

## Product Vision

**NutriWell** is a stress-free nutrition intelligence platform that helps users:

1. **Log meals with minimal friction** — quick entry, common meal presets, "usual breakfast" buttons
2. **Discover specific nutrient gaps** — not just "eat more protein," but "you're 60% below magnesium DV"
3. **Understand timing and synergies** — "add citrus to this meal for better iron absorption"
4. **Support gut health** — track fiber, fermented foods, plant diversity, and ultra-processed burden
5. **Get actionable fixes** — ranked by ease, starting with warm/cooked options for digestibility
6. **Optionally explore products** — supplements and foods to close gaps (with affiliate monetization)

**Core Philosophy:** Reduce stress, increase clarity, prioritize food-first solutions, respect user preferences (liver 2-3x/week, cultured dairy, pumpkin seeds daily, etc.)

---

## Target Users & Personas

### 1. **The Busy Optimizer** (Primary)
- Age: 28-45
- Goals: Maximize health with minimal time investment
- Pain: Knows tracking matters but hates tedious apps
- Needs: Quick logging, clear gaps, fast fixes
- Example: "I eat the same breakfast daily — just let me log 'usual breakfast' and tell me what I'm missing."

### 2. **The Gut-Sensitive Wellness Seeker**
- Age: 25-50
- Goals: Improve digestion, energy, and microbiome health
- Pain: Bloating, inconsistent energy, confusion about "gut-friendly" foods
- Needs: Fermented food tracking, GBDI score, warm/cooked suggestions
- Example: "I know I should eat more fermented foods, but which ones and when?"

### 3. **The Fitness-Minded Tracker**
- Age: 22-40
- Goals: Performance, body composition, recovery
- Needs: Macro tracking + micronutrient optimization + electrolyte balance
- Example: "I hit my protein target but feel tired — what am I missing?"

### 4. **The "Optimize Everything" Biohacker**
- Age: 30-55
- Goals: Peak performance, longevity, data-driven health
- Needs: Deep analysis, synergy insights, wearable integration (future)
- Example: "Show me my adrenal load score and mineral trio sufficiency."

---

## Goals & Success Metrics

### Primary Goals
1. **Reduce logging friction** → < 60 seconds to log a full meal
2. **Surface actionable gaps** → Every user sees top 3 fixes daily
3. **Educate on synergies** → 80% of users learn ≥ 1 new pairing per week
4. **Support gut health** → Track GBDI score, fermented food frequency
5. **Prepare for monetization** → Affiliate product recommendations tied to gaps

### Success Metrics (MVP)
- **Daily Active Logging:** 60% of users log ≥1 meal/day
- **Gap Discovery:** 90% of users view their nutrient gaps within first 3 days
- **Suggestion Engagement:** 40% of users click on ≥1 suggestion per week
- **Gamification Engagement:** 70% of users check their GBDI score daily, 50% unlock ≥3 achievements in first 2 weeks
- **Streak Retention:** 40% of users maintain 7-day logging streak
- **Retention:** 50% weekly retention at 4 weeks
- **Educational Content:** 30% of users read ≥1 education card per week

### Success Metrics (v1.1+)
- **Affiliate CTR:** 5-10% of users click product recommendations
- **Premium Conversion:** 8-12% upgrade for deeper analysis
- **Wearable Sync:** 20% of users connect Apple Health / Fitbit

---

## Feature Roadmap

**Legend:**
- ✅ = Implemented and working
- ❌ = Planned but not yet built
- 📋 = Partially complete or needs integration

### MVP (Version 1.0) — Core Experience ✅ COMPLETE
**Goal:** Prove the core loop: log → analyze → fix → level up  
**Status:** All MVP features are built and production-ready

#### 1. Food Logging ✅ COMPLETE
- **Status:** Fully implemented and working
- **Manual text entry:** "2 cups lentils", "6oz chicken breast", "1 tbsp olive oil"
- **Intelligent unit detection & conversion:**
  - Properly distinguishes weight oz vs fluid oz (fl oz) for accurate calculations
  - Weight-based: "100g chicken" auto-converts to oz when needed
  - Volume-based: "20 fl oz water" or "20oz water" correctly interprets as fluid ounces
  - Handles both metric (g, kg, ml, L) and imperial (oz, lb, fl oz, cups) inputs
  - Backend calculations ensure accuracy across different measurement systems
- **Quick presets:** "usual breakfast", "usual lunch", "copy yesterday"
- **Simple meal buttons:** "add a fruit", "add fermented food", "add greens"
- **Brand detection:** Search for specific brands (e.g., "Fage yogurt", "Lifeway kefir")
- **Portion options:** Common portion sizes (container, cup, half-serving, etc.)
- **Meal templates:** Quick log complete meals with all ingredients
- **Supplements tracking:** 
  - Dedicated supplements button on Log Food and Meal Planner pages
  - Add supplements with proper doses (mg, mcg, IU, g)
  - Track supplement timing relative to meals
  - Future: Amazon order history integration for auto-detection and restocking reminders
- **Timestamp tracking:** For meal timing analysis (future)

#### 1.5 Meal Planning & Templates ✅ COMPLETE
- **Status:** Fully implemented with AI autofill and preset templates
- **Weekly meal planner:** Plan meals across all days of the week
- **Preset meal templates:** Pre-built healthy meal combinations organized by meal type
  - Breakfast: Protein oats, Greek yogurt parfait, scrambled eggs with spinach
  - Lunch: Chicken & rice bowls, lentil bowls, salads
  - Dinner: Salmon with quinoa, liver & onions, chickpea curry
  - Snacks: Apple with almond butter, kefir smoothie, sauerkraut with seeds
- **Custom meal templates with AI autofill:** Create your own meal templates with intelligent assistance
  - Type a meal description (e.g., "grilled chicken with broccoli and sweet potato")
  - AI automatically suggests appropriate ingredients from food database
  - **Intelligent unit handling:** AI autofill respects unit preferences and converts properly
    - Example: User types "100g chicken" → AI calculates nutrition for 100g, displays in oz equivalent
    - Distinguishes weight measurements from volume (100g chicken vs 20 fl oz water)
    - Backend validation ensures calculations are accurate regardless of input format
  - Manual search and add still available for full control
  - Name your common meals (e.g., "My Usual Breakfast")
- **Supplements at each meal:** 
  - Dedicated "Supplements" button on Meal Planner interface
  - Add supplements to meal plans with proper dosing (mg, mcg, IU)
  - Track supplement timing (with food, before bed, morning, etc.)
  - Future: Amazon integration for auto-detection of supplement purchases and restocking alerts
- **Portion tracking in ounces:** All ingredients measured in 1oz portions
  - Integer-only quantities (no decimals) for simplicity
  - Clear "oz" labels on all ingredient amounts
  - Easy mental math for portion sizing
- **Wellness supplements & practices at each meal:**
  - Each meal slot includes wellness supplement recommendations
  - AI suggests context-appropriate additions: herbal teas, water reminders, walks, stretching, meditation
  - Categories: beverages (herbal teas, water, bone broth), activities (walks, stretching), practices (breathing, gratitude), supplements (probiotics, vitamins)
  - When meal slot is empty, shows 2-3 wellness suggestions automatically
  - When meal is planned, shows "Add Supplement" button with AI suggestions below
- **One-click logging:** Log entire meals with all ingredients in one action
- **Meal planning:** Assign templates to specific days and meal times
- **Template management:** Edit, delete, and organize custom meal templates
- **Quick access:** Log meal templates directly from the Log Food page

#### 1.6 Food Budget Tracker ✅ COMPLETE
- **Status:** Fully implemented with time period selection and gap detection
- **Nutrient budget tracking:** View nutrient intake over time like financial budgeting
  - Track spending/consumption of each nutrient against daily "budget" (DV)
  - Visual "deficit" and "surplus" indicators for each nutrient
  - Time period selection: Today, 7 days, 30 days
  - Daily averages calculated for multi-day periods
- **Comprehensive nutrient monitoring:**
  - Macronutrients: Protein, carbs, fat, fiber with trend indicators
  - Vitamins: All B vitamins, A, C, D, E, K with deficit calculations
  - Minerals: Calcium, iron, magnesium, zinc, selenium, copper, manganese, potassium
- **Critical gap alerts:** Highlighted warnings for nutrients below 50% DV
  - Shows exact amount needed to reach target
  - Prioritized by severity (critical vs. moderate)
  - Actionable recommendations for each gap
- **Budget status categories:**
  - Critical (<50% DV): Red, immediate action needed
  - Low (50-80% DV): Orange, improvement recommended
  - Approaching (80-100% DV): Yellow, nearly optimal
  - Optimal (100-150% DV): Green, on target
  - Excess (>150% DV): Gray, above target
- **GBDI tracking over time:** Monitor gut health score trends
- **Plant diversity counter:** Track unique plant foods consumed
- **Guided gap filling:** System identifies deficiencies and guides toward foods that close multiple gaps efficiently

#### 1.7 SleepSync - Sleep-Optimized Meal Timing ✅ COMPLETE
- **Status:** Fully implemented with circadian analysis and sleep readiness scoring
- **Circadian meal timing analysis:** Analyzes when user eats to optimize sleep quality
  - Tracks meal timestamps automatically from logged meals
  - Detects eating patterns over time (last meal time, eating window)
  - Calculates "digestive buffer" before typical sleep time
- **Sleep science principles from Blueprint protocol:**
  - 3-4 hour digestion window before sleep (optimal: last meal by 6-7pm for 10pm sleep)
  - Early eating window optimization (finish eating earlier for better sleep)
  - Meal composition impact on sleep (heavy proteins/fats delay digestion)
  - Caffeine cutoff timing (8-10 hours before sleep)
- **Meal timing dashboard:**
  - Visual timeline showing meals plotted against optimal circadian window
  - "Sleep readiness score" based on last meal timing
  - Warnings for late meals, heavy dinners, evening caffeine
  - Personalized recommendations based on detected patterns
- **Time input for meals:**
  - User selects time when logging/planning meals
  - Default times suggested based on meal type (breakfast: 7am, lunch: 12pm, dinner: 6pm)
  - Time picker for custom scheduling
- **Pattern detection & guidance:**
  - Identifies if user is a "late eater" (meals after 8pm frequently)
  - Calculates average "eating window" (first to last meal)
  - Suggests earlier meal times when patterns harm sleep quality
  - Tracks improvements over time
- **Sleep optimization features:**
  - "Fast start" timer: countdown to when digestion completes
  - Meal composition warnings: "High-fat meal will take 4-5 hours to digest"
  - Alternative suggestions: "Try lighter dinner options for better sleep"
  - Educational content on circadian eating, autophagy, sleep quality
- **Bryan Johnson Blueprint principles:**
  - Early time-restricted feeding (eTRF) support
  - Last meal by 5-6pm guidance for optimal results
  - Meal sequencing for metabolic health
  - Sleep quality as primary metric
  - Anti-inflammatory, gut-friendly evening meals
- **Integration with existing features:**
  - Works with Meal Planner to suggest optimal meal times
  - Analyzes Food Budget data for meal composition
  - Provides SleepSync-specific achievements (7-day early eating streak, etc.)
  - Shows sleep optimization score alongside GBDI on dashboard

#### 1.8 LifeFlow - Time-Blocked Schedule Builder ✅ COMPLETE
**Status**: All features fully implemented including exercise tracking, check-ins, and auto-tasks

- **Intelligent scheduling system:** Builds timeblocked todo lists based on food, sleep, and daily activities
  - ✅ Detects awake window from sleep preferences (wake to sleep time)
  - ✅ Integrates meal times from food logs automatically
  - ✅ Creates comprehensive daily schedules for 3-7 days at a time

- **Recurring activity management:**
  - ✅ Input system for recurring activities: work, walking dog, cooking, exercise, hygiene tasks, etc.
  - ✅ Category-based organization (work, exercise, hygiene, cooking, pet-care, meal, custom)
  - ✅ Day-of-week selection for each activity (M-Su)
  - ✅ Time and duration inputs for each activity
  - ✅ **Minutes/hours toggle:** Switch between minute and hour-based duration input for flexibility
  - ✅ Visual icons and color-coding by category

- **Schedule generation:**
  - ✅ Auto-generates timeblocked schedules for next 3-7 days
  - ✅ Pulls in recurring activities based on selected days
  - ✅ Integrates meal times from food logs
  - ✅ Detects conflicts and time gaps
  - ✅ Sortable timeline view with start/end times

- **Intelligent Meal Template Autofill (✅ COMPLETE):**
  
  1. **Automatic Cook Time Estimation:**
     - ✅ Tracks cooking duration history per meal template
     - ✅ Calculates average cook time from historical data
     - ✅ Default 30 min for new templates, learns over time
     - ✅ Auto-generates cooking activity blocks before meal times
     - ✅ Stored in `cook-history` KV store: `{ templateId, actualMinutes, timestamp }`
     - ✅ Implementation: `/lib/mealPatternEngine.ts` - `estimateCookTime()`
  
  2. **Future Day Meal Autofill:**
     - ✅ Analyzes last 30 days of meal patterns
     - ✅ Detects recurring meal templates by day/mealType
     - ✅ Calculates confidence score (0-100) based on frequency
     - ✅ Auto-populates future meal slots with >30% confidence
     - ✅ Shows pattern detection count in UI
     - ✅ Implementation: `/lib/mealPatternEngine.ts` - `analyzeMealPatterns()`, `predictFutureMeals()`
  
  3. **Smart Cooking Schedule Generation:**
     - ✅ Generates cook start time based on meal time and cook duration
     - ✅ Creates separate "Cook: [meal name]" activity block
     - ✅ Links cooking activity to meal template via `mealTemplateId`
     - ✅ Marks with `isCookingActivity: true` flag
     - ✅ Implementation: `generateCookingSchedule()` function
  
  4. **Meal Templates in Schedule View:**
     - ✅ Meal templates displayed with cook time in schedule
     - ✅ Quick-swap capability (remove/add meals)
     - ✅ Completion tracking for cooking activities
     - ✅ Visual display of meal details in schedule cards
     - ✅ Pattern confidence indicators
  
  5. **Pattern Learning & Adaptation:**
     - ✅ Learns from user's actual meal scheduling behavior
     - ✅ Updates confidence scores as patterns strengthen
     - ✅ Respects user overrides and deletions
     - ✅ Adaptive learning system improves accuracy over time

- **Goal tracking system:**
  - ✅ Create goals with titles, descriptions, and target dates
  - ✅ Break down goals into milestones
  - ✅ Track milestone completion with checkboxes
  - ✅ Progress bars showing completion percentage
  - ✅ Active/completed/paused status management
  - 🔄 **Enhanced progress tracking (Phase 8d):**
    - Input-based milestone progress (not just checkboxes)
    - Quantitative goals: "Run 5 miles" with input field for actual distance
    - Frequency goals: "Meditate 5x this week" with counter
    - Habit tracking: "Drink 8 glasses of water daily" with daily check-ins
    - Progress charts showing trend over time
    - Goal completion predictions based on current pace

- **Activity completion tracking:**
  - ✅ Check off activities as completed throughout the day
  - ✅ Visual progress indicators per day (percentage complete)
  - ✅ Completion stats across multiple days
  - ✅ Recurring activity completion history

- **Scaffolding intelligence:**
  - ✅ Detects time blocks where user is awake but unscheduled
  - ✅ Suggests activities that fit available time slots
  - ✅ Recommends goal-related tasks during free time
  - ✅ Guides user to accomplish goals incrementally

- **3-7 day planning:**
  - ✅ Default view shows 3 days of scheduling
  - ✅ Options for 5-day and 7-day views
  - ✅ Rolling window (updates as days pass)
  - ✅ Historical view of past schedules

- **Exercise Creator & Fitness Profile ✅ COMPLETE:**
  - **Status:** Fully integrated into LifeFlow → Exercise tab, production ready
  - **Comprehensive user profile questionnaire:**
    - Physical metrics: Weight, height, age, sex (pulls from main profile if already set)
    - **BMI calculation:** Automatic calculation and classification (underweight, normal, overweight, obese)
    - Body composition goals (maintain, lose weight, gain muscle, general fitness)
    - Current fitness level (sedentary, lightly active, moderately active, very active, extremely active)
    - Exercise preferences and restrictions
    - **Smart integration:** If user has already completed Stage 1 profile setup (Phase 7k), this questionnaire pre-fills existing data
    - **Updates both systems:** Changes made here also update main user profile for consistent DV calculations
  
  - **Exercise type selection & customization:**
    - **Cardiovascular activities:**
      - Walking (speed selection: casual/brisk/power walking)
      - Running (pace selection: jogging/moderate/fast)
      - Cycling (intensity: leisure/moderate/vigorous)
      - Swimming (stroke type and intensity)
      - Rowing machine, elliptical, stair climber
    - **Strength training:**
      - Gym lifting (intensity: beginner/intermediate/advanced)
      - Bodyweight exercises (push-ups, pull-ups, squats)
      - Resistance bands
      - Free weights vs. machines
    - **Sports & recreational:**
      - Boxing, kickboxing, martial arts (intensity levels)
      - Football, soccer, basketball (casual vs. competitive)
      - Tennis, racquetball, badminton
      - Rock climbing, hiking
      - Dance (various styles and intensity)
      - Yoga (gentle/moderate/power yoga)
      - Pilates
    - **Other activities:**
      - User-defined activities with custom intensity descriptions
      - Manual calorie burn rate input option
      - Duration-based vs. distance-based tracking
  
  - **Intelligent calorie burn calculation:**
    - **MET (Metabolic Equivalent of Task) based calculations:**
      - Walking 3.5 mph = 4.3 METs, 4.5 mph = 5.0 METs
      - Running 5 mph = 8.3 METs, 6 mph = 9.8 METs, 8 mph = 11.8 METs
      - Gym lifting: light = 3.0 METs, moderate = 5.0 METs, vigorous = 6.0 METs
      - Boxing: general = 7.8 METs, sparring = 9.0 METs
      - Swimming: light = 5.8 METs, moderate = 7.0 METs, vigorous = 9.8 METs
      - Cycling: leisure (10-12 mph) = 6.8 METs, moderate (12-14 mph) = 8.0 METs, vigorous (14-16 mph) = 10.0 METs
      - Yoga: gentle = 2.5 METs, moderate = 3.0 METs, power = 4.0 METs
      - Football: casual = 6.0 METs, competitive = 8.0 METs
    - **Formula:** Calories burned = MET × weight (kg) × duration (hours)
    - Adjustments for fitness level and intensity
    - Real-time calorie burn estimates during activity logging
    - Historical tracking of total calories burned per day/week
  
  - **Exercise schedule integration:**
    - Add exercise sessions to LifeFlow schedule
    - Auto-populate with recommended workout times
    - Track exercise completion and actual duration
    - Adjust calorie burn if duration differs from planned
    - Recovery time suggestions between intense workouts
  
  - **Exercise library & presets:**
    - Common workout templates: "30-min morning run", "45-min gym session", "15-min HIIT"
    - Customizable workout routines (circuit training, supersets, intervals)
    - Video/text descriptions for proper form (future)
    - Equipment needed tags (bodyweight, dumbbells, full gym, etc.)
  
  - **Progress tracking:**
    - Total weekly exercise minutes
    - Total calories burned tracking
    - Exercise consistency streaks
    - Fitness goal progress (weight loss, endurance improvement, strength gains)
    - Before/after metrics comparison

- **NutriWell Integration - Exercise Calorie Toggle ❌ NOT YET IMPLEMENTED:**
  - **Status:** Planned for future release
  - **Calorie burn adjustment in Food Budget:**
    - Toggle to display "Net Calories" = Food intake - Exercise burn
    - Shows both gross calories consumed and net after exercise
    - Helps users in caloric deficit/surplus planning
    - Visual indicator: "You burned 450 calories today from exercise"
  
  - **Exercise-aware nutrient recommendations:**
    - Post-workout nutrition timing suggestions
    - Increased protein recommendations on strength training days
    - Electrolyte replenishment after cardio (>45 min)
    - Carbohydrate timing for endurance activities
    - Recovery meal suggestions based on workout intensity
  
  - **Activity level auto-adjustment:**
    - Daily calorie target dynamically adjusts based on logged exercise
    - Protein requirements scale with strength training frequency
    - Micronutrient needs increase with high activity (iron, magnesium, B-vitamins)
    - Hydration recommendations based on workout duration and intensity

- **Integration with other modes:**
  - ✅ Uses sleep schedule from SleepSync
  - ✅ Auto-imports meal times from NutriWell logs
  - ✅ Respects eating window and digestion buffers
  - ✅ Coordinates work, exercise, meals for optimal timing
  - ✅ **Cross-mode synergy (Phase 8e - COMPLETE):**
    - Nutrient-aware activity scheduling (high-protein breakfast → morning workout)
    - GBDI-informed stress breaks (low gut health day → schedule meditation)
    - Sleep quality feedback loop (poor sleep → suggest earlier dinner time)
    - Energy level tracking → reschedule demanding tasks
    - Bidirectional insights: "Low magnesium days correlate with missed yoga sessions"

- **Auto-Task Generation System ✅ COMPLETE (Phase 8c):**
  - **Status:** Fully implemented with learning system
  - **Common daily tasks automatically added to schedule:**
    - Morning routine: "Brush teeth", "Drink 16oz water", "Morning stretch"
    - Hygiene: "Shower", "Floss teeth", "Skincare routine"
    - Hydration reminders: "Drink water" blocks every 2-3 hours
    - Evening routine: "Brush teeth", "Nighttime skincare", "Prep tomorrow"
    - Pet care (if enabled): "Walk dog", "Feed pet"
    - Household: "Check email", "Tidy kitchen", "Make bed"
  - **Smart scheduling logic:**
    - Morning tasks auto-placed after wake time
    - Evening tasks auto-placed before sleep time
    - Hydration reminders distributed throughout awake window
    - Avoids conflicts with existing activities
    - User can enable/disable individual auto-tasks
    - Learns from user deletions (don't re-suggest removed tasks)
  - **Customization settings:**
    - Toggle entire auto-task system on/off
    - Select which categories to auto-generate
    - Set custom timings for routine tasks
    - Add personal recurring tasks to auto-generation list

- **Daily Check-In Commitment System ✅ COMPLETE (Phase 8b):**
  - **Status:** Fully implemented with history tracking and performance analysis
  - **Morning/Evening Check-In Sessions:**
    - User prompted to commit to 3-5 tasks for the day
    - App suggests tasks based on:
      - User's active goals (pull from goal system)
      - Nutrient gaps from NutriWell (e.g., "Add fermented food today")
      - Recent stress levels (e.g., "Take 10-min walk" if high stress)
      - Unscheduled free time blocks
      - Tasks skipped yesterday
    - **Task Invention Algorithm:**
      - Analyzes user's goals and breaks them into micro-actions
      - Suggests wellness tasks: "5-min meditation", "Gratitude journal", "Call a friend"
      - Recommends habit-building: "Read 10 pages", "No phone before bed", "Morning sunlight"
      - Health-focused: "Hit protein goal", "Log all meals", "Drink 8 glasses water"
      - Productivity: "Work on [goal milestone]", "Clear inbox", "Plan tomorrow"
  - **Task Selection & Commitment:**
    - User presented with 8-10 suggested tasks
    - Selects 3-5 to commit to for the day
    - Can edit task descriptions
    - Can add custom tasks not in suggestions
    - Each task gets a checkbox and optional time reminder
  - **Throughout-Day Tracking:**
    - Committed tasks displayed prominently in LifeFlow view
    - Quick-check interface: swipe to complete tasks
    - Progress indicator: "2/5 tasks complete today"
    - Option to defer task to tomorrow
    - Completion timestamps recorded
  - **Historical Tracking & Insights:**
    - ✅ Stored in `check-in-history` KV store with structure:
      ```typescript
      {
        date: string,           // YYYY-MM-DD
        committedTasks: [
          {
            id: string,
            description: string,
            category: 'goal' | 'wellness' | 'health' | 'habit' | 'custom',
            completed: boolean,
            completedAt?: timestamp,
            source?: 'suggested' | 'user-created'
          }
        ],
        completionRate: number, // 0-100
        checkInTime: timestamp
      }
      ```
    - **History View Component:**
      - Calendar view showing check-in completion rates
      - Weekly summary: "This week you completed 18/25 committed tasks (72%)"
      - Most frequently committed tasks
      - Most frequently completed vs. skipped tasks
      - Streak tracking: consecutive days with 100% completion
      - Category breakdown: which types of tasks you excel at
    - **Pattern Detection:**
      - "You complete wellness tasks 85% of the time but goal tasks only 40%"
      - "Tasks scheduled before 10am have 90% completion rate"
      - "You're most consistent on weekdays"
    - **Accountability Features:**
      - Review yesterday's incomplete tasks at morning check-in
      - Option to recommit to incomplete tasks
      - Celebration animations for perfect days
      - Achievement unlocks: "7-day perfect commitment streak"

#### 2. Gamification System ✅ COMPLETE
- **Status:** All features implemented including achievements, streaks, and GBDI scoring
- **GBDI Score Display:** Large, animated score card with trend indicators (↑↓) comparing to previous day
- **Streak Tracker:** Current streak, best streak, last 7 days visual calendar
- **Achievement System:** Unlock badges for milestones:
  - **Common:** First meal logged, 5 days streak
  - **Rare:** 7 fermented foods in a week, Omega Warrior (3x fish/week)
  - **Epic:** GBDI 80+, Consistency King (7-day streak), No ultra-processed for 3 days
  - **Legendary:** Perfect Nutrient Day (100% all DVs), 30+ plant types/week, 30-day streak
- **Progress Visualization:** Animated progress bars, color-coded status cards, satisfying animations
- **Level System:** Starter → Rising → Champion → Master → Legendary based on streak length
- **Gut Health Breakdown:** Visual cards showing fermented foods, plant diversity, ultra-processed burden, gut stressors

#### 2.5 New User Onboarding & Tutorial ✅ COMPLETE (Phase 8a)
**Goal:** Reduce friction for first-time users, teach core concepts, drive early engagement  
**Status:** Fully implemented with 4-step welcome flow and interactive tutorials

- **Welcome Flow (First Launch):**
  - **Screen 1: Welcome**
    - Friendly introduction to NutriWell suite
    - Value proposition: "Track nutrition, optimize sleep timing, and schedule your days"
    - Visual preview of three modes with icons
    - "Get Started" CTA
  
  - **Screen 2: Quick Profile**
    - Optional: Age, dietary preference (omnivore/vegetarian/vegan)
    - Goal selection: "What brings you here?"
      - ☐ Better gut health
      - ☐ More energy
      - ☐ Nutrient optimization
      - ☐ Better sleep
      - ☐ Productivity & time management
    - "This helps us personalize your experience"
    - Skip option available
  
  - **Screen 3: Mode Selection**
    - "Choose your starting point (you can switch anytime):"
    - **NutriWell** - Nutrition intelligence
    - **SleepSync** - Meal timing for better sleep
    - **LifeFlow** - Time-blocked scheduling
    - Brief description of each
    - Selected mode determines initial tutorial
  
  - **Screen 4: Legal Disclaimer**
    - Clear, prominent disclaimer
    - "This is educational, not medical advice"
    - "Consult healthcare professional before dietary changes"
    - "I Understand" button (required)

- **Interactive Tutorial System:**
  
  - **NutriWell Tutorial (5 steps):**
    1. **"Log your first meal"**
       - Overlay highlights Log Food button
       - Tooltip: "Let's start by logging what you ate today"
       - Guides user to log a simple meal
       - Example: "Try typing: 2 eggs, 1 cup oatmeal, 1 banana"
    
    2. **"See your nutrient breakdown"**
       - Dashboard tour highlights nutrient grid
       - Explains color coding (red/yellow/green)
       - Shows where gaps appear
       - "These are your nutrient gaps - we'll help you fill them"
    
    3. **"Understanding GBDI Score"**
       - Highlights GBDI card
       - Explains gut-brain-digestive health metric
       - "Higher score = better gut health"
       - Shows what factors influence score
    
    4. **"Get personalized recommendations"**
       - Navigates to Recommendations page
       - Shows how suggestions are tailored to their gaps
       - "We prioritize food-first solutions"
    
    5. **"Explore other features"**
       - Quick overview of Meal Planner, Food Budget, Achievements
       - "Log daily to unlock achievements and track trends"
       - "Tutorial complete! 🎉"
  
  - **SleepSync Tutorial (3 steps):**
    1. **"Set your sleep schedule"**
       - Guides to sleep time settings
       - "When do you typically sleep and wake?"
       - Explains why this matters for meal timing
    
    2. **"Log meals with times"**
       - Shows how to add meal times
       - Explains 3-4 hour digestion buffer
       - "Eating earlier improves sleep quality"
    
    3. **"Check your sleep readiness"**
       - Shows timeline visualization
       - Explains sleep readiness score
       - "Move dinner earlier to improve this score"
  
  - **LifeFlow Tutorial (4 steps):**
    1. **"Add a recurring activity"**
       - Guides to activity input
       - "Let's add something you do regularly"
       - Example: "Work, 9am-5pm, Monday-Friday"
    
    2. **"Generate your schedule"**
       - Shows how schedule auto-generates
       - Meals auto-import from NutriWell
       - "We've filled in your meals and activities"
    
    3. **"Track completion"**
       - Shows checkbox system
       - "Check off tasks as you complete them"
       - Progress indicators explained
    
    4. **"Set a goal"**
       - Guides to goal creation
       - "Break big goals into daily milestones"
       - Shows how free time blocks can be used for goals

- **Tutorial Controls:**
  - **Progress indicator:** "Step 2 of 5"
  - **Skip option:** "Skip tutorial" button (persistent)
  - **Back/Next navigation**
  - **Tutorial replay:** Accessible from Settings → "Replay Tutorial"
  - **Help hints:** Question mark icons throughout app link to relevant tutorial steps

- **Contextual Tooltips (Post-Tutorial):**
  - First time using each feature → brief tooltip appears
  - Examples:
    - First time opening Meal Planner: "Save common meals as templates"
    - First time viewing achievements: "Log consistently to unlock badges"
    - First time adding supplement: "Track vitamins and minerals separately"
  - Dismissible with "Got it" or "Don't show again"
  - Tooltips stored in user preferences to avoid repetition

- **Empty States as Onboarding:**
  - **No food logs yet:**
    - Friendly illustration
    - "Your nutrition journey starts here"
    - "Log your first meal" CTA with quick-start tips
  
  - **No meal templates yet:**
    - "Create templates for meals you eat often"
    - "Try AI autofill or browse presets" CTA
  
  - **No goals yet:**
    - "What do you want to accomplish?"
    - "Create your first goal" CTA with examples

- **Progressive Disclosure:**
  - Advanced features hidden initially
  - Unlocked after 3 days of usage or 10 meals logged
  - Examples: Food Budget trends, GBDI history, AI insights
  - Unlock notifications: "New feature unlocked: 7-day GBDI trends!"

- **Onboarding Checklist (Optional):**
  - Persistent checklist in Dashboard (first week only)
  - ☐ Log your first meal
  - ☐ Create a meal template
  - ☐ Check your nutrient gaps
  - ☐ Set up sleep schedule (SleepSync)
  - ☐ Add a recurring activity (LifeFlow)
  - ☐ Complete 3 days in a row
  - Progress: "4/7 complete"
  - Dismissible after completion or 7 days

- **Educational Cards Integration:**
  - During tutorial, show relevant education cards
  - "Learn more about synergies" link after nutrient overview
  - Gradually introduce concepts (don't overwhelm)
  - First week: focus on basics (logging, GBDI, gaps)
  - Second week: introduce advanced features (synergies, timing)

- **Tutorial Analytics (Future):**
  - Track where users drop off in tutorial
  - Which steps cause confusion (high skip rate)
  - Feature adoption rates post-tutorial
  - Iterate on tutorial flow based on data

#### 3. Nutrient Analysis Engine ✅ COMPLETE
- **Status:** All nutrient tracking and analysis features implemented
- **Macronutrients:** Protein, carbs, fat, fiber
- **Micronutrients:** Key vitamins (C, D, A, E, K, B-complex), minerals (iron, zinc, calcium, magnesium)
- **Electrolytes:** Sodium, potassium, magnesium
- **Phytonutrients & Bioactive Compounds:**
  - Polyphenols (from berries, green tea, dark chocolate, olive oil)
  - Carotenoids (beta-carotene, lycopene, lutein from colorful vegetables)
  - Flavonoids (quercetin, anthocyanins from fruits and vegetables)
  - Sulfur compounds (from garlic, onions, cruciferous vegetables)
  - Gingerol, curcumin, capsaicin from spices
- **Gut health markers:**
  - Fermented food presence (y/n)
  - Fiber grams (soluble vs insoluble tracking in future)
  - Polyphenol-rich foods
  - Ultra-processed flag
  - Plant food diversity count
  - Prebiotic foods (garlic, onion, asparagus, Jerusalem artichoke)
- **Synergy tracking system:** (NEW)
  - Automatically detects nutrient synergies and antagonisms across logged meals
  - Positive synergies: Vitamin C + iron, vitamin D + calcium, black pepper + turmeric (piperine + curcumin)
  - Negative interactions: Calcium + iron, coffee/tea + iron, high fiber + mineral absorption
  - Tracks spices and garnishes for bioavailability enhancement
  - Fat-soluble vitamins (A, D, E, K) tracked with fat intake in same meal
  - Provides real-time feedback on meal combinations

#### 4. Gap Detection & Scoring ✅ COMPLETE
- **Status:** All features implemented with color-coded status and gut health scoring
- **Daily Value (DV) comparison:** Show % of DV achieved for each nutrient
- **Color-coded status:**
  - 🟢 Green: ≥80% DV
  - 🟡 Yellow: 50-79% DV
  - 🔴 Red: <50% DV
- **Gut Support Score:** 0-100 based on fiber, fermented foods, diversity, ultra-processed burden

#### 4.5 Gut Health Score & History Tracking (✅ COMPLETE - RENAMED FROM GBDI)
**Status**: Fully implemented with 7-day historical tracking and insights. Composite score system updated. **RENAMED to "Gut Health" for clarity.**

- **Comprehensive gut-brain-digestive health metric (0-100):**
  - Gut microbiome health: fiber intake, fermented foods, plant diversity, polyphenol-rich foods
  - Gut-brain axis: supportive nutrients for neurotransmitter production, stress-reducing compounds
  - Digestive wellness: warm/cooked food ratio, ultra-processed burden, gut stressors (NSAIDs, alcohol)
- **Higher score is better** — composite score tracking protective factors
- **Real-time calculation:** Updated daily based on food logs and dietary patterns
- **User-facing name:** "Gut Health" (simplified from technical "GBDI" acronym)
- **Calculation explanation:** 
  - Displayed to users in simple terms
  - "Your Gut Health score is based on fiber, fermented foods, plant diversity, and limiting ultra-processed foods"
  - Detailed breakdown available in tooltip or info panel
  - Each component weighted and explained:
    - Fiber intake (25% weight): Target 25-35g/day
    - Fermented foods (20% weight): Target 2+ servings/day
    - Plant diversity (20% weight): Target 30+ unique plants/week
    - Polyphenol-rich foods (15% weight): Berries, olive oil, tea, dark chocolate
    - Prebiotic foods (10% weight): Garlic, onions, asparagus, Jerusalem artichoke
    - Ultra-processed burden (10% weight): <10% of daily calories
    - Gut stressors absent (10% weight): No NSAIDs, excess alcohol, antibiotics

- **Updated Dashboard Visualization (🔄 Phase 7j):**
  - **Composite Score System:**
    - Primary metric combining GBDI + micronutrients + macronutrients + vitamins
    - Weighted average: 30% GBDI, 25% macros (protein, fiber emphasis), 25% vitamins, 20% minerals
    - Displayed as main trend line on dashboard
    - Shows holistic nutritional wellness, not just gut health
  
  - **Improved Graph Types:**
    - **Bar chart option:** Better for comparing daily values without calorie distortion
    - **Hybrid chart:** Bars for composite/GBDI, lines for nutrients
    - **Normalized scaling:** All metrics shown as % of daily value for fair comparison
    - Toggle between line graph and bar chart views
    - Grouped bar chart for side-by-side metric comparison
  
  - **Toggle System Redesign:**
    - **Composite Score (always visible):** Main nutritional wellness indicator
    - **GBDI (toggle):** Gut health specific metric
    - **Protein (toggle):** Individual macro tracking
    - **Fiber (toggle):** Individual macro tracking
    - **Calories (toggle):** Energy intake (option to show net after exercise)
    - **Micronutrient composite (toggle):** Average of key vitamins/minerals
    - **Vitamin composite (toggle):** Average of all vitamins
    - Removed individual vitamin toggles to reduce clutter
    - Clean, organized toggle interface with color-coded indicators

- **7-Day Historical Tracking (✅ COMPLETE - Phase 7g):**
  - ✅ **GutHealthHistory component** (renamed from GBDIHistory) - Visual timeline of gut health over time
  - ✅ Line chart showing Gut Health trends across 7 days
  - ✅ Daily breakdown cards with individual scores
  - ✅ **Visual indicators on graph:** 
    - 😊 **Happy/smiley icon** for days with high gut health score (good food choices)
    - 😔 **Sad/frown icon** for days with low gut health score (poor food choices, high ultra-processed intake)
    - Icon displayed directly on the trend line at each data point
    - Icon color matches score status (green for good, yellow for fair, red for poor)
  - ✅ Component factors display:
    - Fiber intake (grams)
    - Fermented foods count
    - Plant diversity score
    - Polyphenol-rich foods
    - Prebiotic foods
    - Ultra-processed burden
  - ✅ Trend indicators (improving, stable, declining)
  - ✅ Color-coded status badges per day
  
- **Pattern Detection & Insights:**
  - ✅ Identifies consistency in gut-healthy eating
  - ✅ Flags days with low fiber or high ultra-processed intake
  - ✅ Detects improvement/decline patterns
  - ✅ Automated recommendations based on trends
  - ✅ Highlights best and worst days with explanations

- **Gut-Brain Axis Integration:**
  - Nutrients supporting vagus nerve function (omega-3s, zinc, magnesium)
  - Foods promoting GABA, serotonin precursors (fermented foods, tryptophan sources)
  - Anti-inflammatory compounds (polyphenols, omega-3s)
  - Stress-gut connection markers (high cortisol foods vs. gut-calming foods)

- **Dashboard Integration:**
  - ✅ Current Gut Health score displayed prominently (renamed from "GBDI")
  - ✅ 7-day history chart accessible from dashboard
  - ✅ Quick insights on recent trends
  - ✅ Links to detailed breakdown and recommendations
  - ✅ Explanation tooltip: "Learn how Gut Health is calculated"

#### 4.9 Animated Gut Visualization (✅ COMPLETE - Phase 7l)
**Goal:** Fun, engaging visual representation of gut health in real-time
**Status**: Fully implemented with smooth animations and real-time reactions

- **Animated Gut Character:**
  - ✅ Pretty, friendly animated gut illustration using SVG
  - ✅ Reacts dynamically as users input foods with 3-second timed effects
  - ✅ Smooth, delightful animations using Framer Motion
  - ✅ Minimalist design for optimal performance
  
- **Food Reaction System:**
  - ✅ **Happy foods (gut-supportive):**
    - Fermented foods, high-fiber foods → simple upward-floating particles
    - Polyphenol-rich foods → gentle circular particle animation
    - Real-time detection when logging meals
    - Positive reinforcement with green glow
  
  - ✅ **Problematic foods (destructive to gut biome):**
    - Ultra-processed foods → warning red particles
    - Gut stressors → visual alerts
    - Muted colors and warning state
  
- **Real-Time Updates:**
  - ✅ Updates immediately when user logs food (5-second detection window)
  - ✅ Smooth transitions between states (not jarring)
  - ✅ Cumulative effect: more good food → happier gut throughout the day
  - ✅ Daily state based on overall GBDI score
  
- **Interaction Elements:**
  - ✅ Info button to see detailed gut health scoring explanation
  - ✅ Three states: Happy (70+), Neutral (40-69), Struggling (<40)
  - ✅ Visual progress indicators showing current state
  - ✅ Contextual messages based on score
  
- **Visual Design Principles:**
  - ✅ Simple over complex: Lightweight SVG animation
  - ✅ Fun over clinical: Delights users without overwhelming
  - ✅ Performance-first: Optimized animations, no heavy assets
  - ✅ Accessible: Motion works smoothly across devices
  - ✅ Responsive: Scales beautifully on mobile and desktop
  - ✅ Generic particle design: Simple circular particles aligned with calm, natural brand aesthetic (no sparkles)
  
- **Technical Implementation:**
  - ✅ Framer Motion for smooth, performant animations
  - ✅ SVG-based illustration (scalable, small file size)
  - ✅ State-driven animation (happy, neutral, struggling)
  - ✅ Particle system for visual effects (positive/warning)
  - ✅ Real-time food type detection logic
  
- **Placement in UI:**
  - ✅ Food Budget page integration (prominent but not intrusive)
  - ✅ Displays below summary cards, above history chart
  - ✅ Reacts to recent food logs automatically
  
**Implementation Complete**: AnimatedGut component fully functional and integrated with brand-appropriate particle effects.

#### 4.10 Gut Health Animation 2.0 (📋 PLANNED - Phase 12)
**Goal:** Elevate the gut animation to a core, immersive feature that visualizes digestion and microbiome health.

- **Core Requirements:**
  - **Redesigned Empty State:** Replace current simple SVG with a more engaging, polished "empty gut" icon/illustration.
  - **"Inside the Gut" Visualization:**
    - Visualize actual food items (icons/particles) floating/digesting inside the gut.
    - Foods persist for ~3 days (representing transit time).
    - Visual distinction between "good" bacteria fuel (fiber, fermented) and "bad" inputs.
  - **Navigation Trigger:**
    - When a user logs a food, automatically trigger a transition/modal showing the food entering the gut animation.
    - "Feed your gut" feedback loop.
  - **Preview/Demo Mode:**
    - Ability to add example foods to see the animation in action immediately.
  - **Enhanced Particle Physics:**
    - More dynamic interactions between food particles.
    - "Crowding" effect as gut fills up.

#### 4.6 Adrenal Load Score & Stress Tracking (✅ COMPLETE)
**Status**: Fully implemented with all features

- **Two-Part Calculation System:**
  1. **Dietary Load (40% weight):** ✅ Calculated from food logs
     - Caffeine intake tracking
     - Refined sugar burden
     - Ultra-processed food percentage
     - Supportive nutrient adequacy (magnesium, B-vitamins, vitamin C)
  
  2. **Stress Load (60% weight):** ✅ User-reported metrics via StressTracker component
     - Stress level scale (1-10): "How stressed do you feel today?"
     - Sleep quality (1-10): "How well did you sleep last night?"
     - Energy level (1-10): "How is your energy level today?"
     - Physical symptoms: Tension, headaches, digestive issues, fatigue, racing heart, shallow breathing
     - Mental symptoms: Anxiety, brain fog, irritability, overwhelm, racing thoughts, difficulty focusing

- **Combined Adrenal Load Score (0-100):** ✅
  - 0-33 (Low): Maintenance mode - focus on prevention
  - 34-66 (Moderate): Active support - prioritize stress-reducing nutrients
  - 67-100 (High): Urgent intervention - eliminate stressors, maximize supportive foods

- **Personalized Stress-Aware Recommendations Engine:** ✅
  - High stress + high caffeine → "Consider reducing caffeine and adding adaptogenic herbs"
  - Poor sleep + high sugar → "Focus on protein-rich breakfast and limit refined carbs"
  - Low energy + nutrient gaps → "Prioritize magnesium, B-vitamins, and iron-rich foods"
  - Digestive issues + stress → "Try fermented foods and warm, cooked meals"
  - Physical symptoms → "Add magnesium-rich foods (pumpkin seeds, dark leafy greens)"
  - Mental fog → "Increase B-vitamins (eggs, salmon, nutritional yeast)"

- **Adrenal-Supportive Nutrient Tracking:** ✅
  - **Key nutrients monitored:**
    - Magnesium (target: 400mg/day) - stress resilience
    - B5 Pantothenic acid (target: 5mg/day) - adrenal function
    - B6 (target: 1.7mg/day) - neurotransmitter production
    - Vitamin C (target: 90mg/day) - cortisol regulation
    - Quality protein (target: 0.8g/kg body weight) - neurotransmitter building blocks
  - **Food recommendations:**
    - Stress-resilient: Salmon, eggs, leafy greens, nuts, berries, avocado
    - Cortisol-balancing: Sweet potatoes, oats, dark chocolate, green tea
    - Avoid/limit: High caffeine (>400mg/day), refined sugar, alcohol

- **Weekly Stress Pattern Analysis:** ✅
  - Track stress logs over time alongside nutrient intake
  - Identify correlations (e.g., high stress on days with low magnesium)
  - Visual trend charts showing stress vs. nutrient adequacy
  - Suggest dietary interventions based on detected patterns
  - Alert when stress is high for 3+ consecutive days

- **Implementation Components:**
  - ✅ `/lib/adrenalEngine.ts` - Calculation logic
  - ✅ `/components/StressTracker.tsx` - User input interface
  - ✅ `/components/AdrenalLoadDisplay.tsx` - Score visualization
  - ✅ `/components/StressHistory.tsx` - Pattern history and insights
  - ✅ Dashboard integration with daily stress logging prompt
  - ✅ Stress-aware recommendation filtering in Recommendations page
  - ✅ Stress pattern history chart with correlation detection
  - ✅ 3+ consecutive day high stress alerts

#### 4.7 Health Correlations Visualization (✅ COMPLETE - Phase 7h)
**Status**: Fully implemented with intelligent pattern detection

- **Multi-Metric Charting:**
  - ✅ Unified timeline showing GBDI, stress, sleep quality, and energy levels
  - ✅ 7-day trend visualization using Recharts
  - ✅ Color-coded lines for each health metric
  - ✅ Responsive design for mobile and desktop
  - ✅ Interactive tooltips showing detailed daily values

- **Correlation Detection Algorithms:**
  - ✅ **Stress-Gut Health Correlation**: Detects when high stress days coincide with low GBDI
  - ✅ **Sleep-Energy Correlation**: Identifies poor sleep impacting energy levels
  - ✅ **Stress-Magnesium Correlation**: Flags low magnesium intake on high stress days
  - ✅ **Trend Analysis**: Compares first and last days to detect improving/declining patterns
  - ✅ **Positive Reinforcement**: Celebrates when gut health and energy are both high

- **Intelligent Insights:**
  - ✅ Strength indicators (strong, moderate, weak correlations)
  - ✅ Direction indicators (positive or negative relationships)
  - ✅ Actionable recommendations based on detected patterns
  - ✅ Visual badges showing correlation strength
  - ✅ Priority alerts for concerning patterns

- **User Experience:**
  - ✅ Empty state guidance for new users
  - ✅ Minimum 3 days of data required for analysis
  - ✅ Clear explanations of scaling (stress/sleep/energy × 10 to match GBDI scale)
  - ✅ Visual hierarchy emphasizing most important correlations

- **Implementation:**
  - ✅ `/components/HealthCorrelations.tsx` - Main component
  - ✅ Dashboard integration below stress and GBDI history
  - ✅ Pattern detection with configurable thresholds
  - ✅ Real-time updates as user logs more data

#### 4.8 AI-Powered Weekly Insights (✅ COMPLETE - Phase 7i)
**Status**: Fully implemented using spark.llm API

- **Intelligent Analysis:**
  - ✅ Analyzes 7 days of nutrition and wellness data
  - ✅ Uses GPT-4o-mini for cost-effective insights
  - ✅ Aggregates GBDI, gut support, fiber, fermented foods, gaps
  - ✅ Considers weekly patterns and trends

- **Personalized Recommendations:**
  - ✅ Notable pattern identification (improving, declining, consistent)
  - ✅ Specific actionable suggestions tailored to user's data
  - ✅ Positive reinforcement for healthy habits
  - ✅ Priority action for the coming week
  - ✅ Encouraging, practical tone (not generic advice)

- **User Interface:**
  - ✅ One-click "Generate Insights" button
  - ✅ Loading skeleton while processing
  - ✅ Formatted bullet points for readability
  - ✅ "Regenerate" option for fresh perspective
  - ✅ Error handling with helpful messages
  - ✅ Minimum 2 days of data required

- **Data Privacy:**
  - ✅ All analysis happens client-side
  - ✅ Only aggregated metrics sent to LLM (no personal identifiers)
  - ✅ Results stored only in session (not persisted)

- **Technical Implementation:**
  - ✅ `/components/AIInsights.tsx` - Main component
  - ✅ Uses window.spark.llm() API
  - ✅ JSON-free text generation for natural language output
  - ✅ Graceful error handling and retry capability
  - ✅ Dashboard integration for easy access

#### 5. Wellness Audit Lenses ✅ COMPLETE
- **Status:** All audit systems implemented and functional
- **GBDI (Gut Biome Destruction Index):** Composite score measuring gut-brain-digestive health
  - Tracks destructive factors: ultra-processed foods, gut stressors, low fiber, lack of diversity
  - Protective factors: fermented foods, plant diversity, polyphenols, supportive nutrients
  - Gut-brain axis components: omega-3s, tryptophan, GABA precursors, vagus nerve support
  - Lower scores indicate better gut health (destruction index)
- **Adrenal Load:** Caffeine + refined sugar + stress markers
- **Warm vs. Cold:** Preference for cooked/room-temp foods (digestibility)
- **Fermented/Probiotic Frequency:** Track 2x/week target
- **Timing Conflicts:**
  - Coffee near iron-rich meal (−30 min to +60 min)
  - High calcium + iron in same meal
- **Mineral Trio Sufficiency:** Magnesium + potassium + calcium balance
- **Gut Stressors:** NSAIDs mention, ultra-processed food %, alcohol
- **Auto-Detected Staple Foods:** (NEW)
  - System automatically detects foods user logs frequently (4+ times in 30 days)
  - Displayed on Dashboard with frequency labels (daily staple, 2x/week, etc.)
  - Replaces manual staple configuration in Settings
  - Top 6 most-logged foods shown as "Your Staple Foods"
  - Provides feedback on eating patterns without manual input

#### 6. Suggestion Engine ✅ COMPLETE
- **Status:** Synergy detection and personalized recommendations fully implemented
- **Synergy suggestions:**
  - "Add bell pepper (vitamin C) to boost iron absorption from lentils"
  - "Space coffee 2 hours from this iron-rich meal"
  - "Avoid taking calcium supplement with this meal (reduce iron absorption)"
- **Gap fixes (prioritized):**
  - **Food-first:** "Add 1 cup sauerkraut (fermented, gut-friendly)"
  - **Meal timing:** "Move protein to breakfast for better distribution"
  - **Product options (optional):** "Consider magnesium glycinate supplement" (with disclaimer)
- **Warm/cooked priority:** Always suggest cooked/warm options first for digestibility

#### 7. Dashboard ✅ COMPLETE
- **Status:** All dashboard components implemented with real-time updates
- **GBDI Score Hero Card:** Large animated card with current score, trend vs yesterday, status badge (Excellent/Good/Fair/Poor/Critical)
- **Streak Tracker Card:** Current streak, best streak, last 7 days visual calendar
- **Today's Summary:** Total calories, macros, fiber, gut score
- **Nutrient Grid:** Visual %DV bars for all tracked nutrients
- **Top 3 Fixes:** Highest-impact, lowest-friction improvements
- **Achievements Panel:** Show unlocked/locked achievements with progress bars
- **Gut Health Panel:** Fermented food count, fiber grams, plant diversity
- **Legal Disclaimer Banner:** Persistent, prominent

#### 8. Educational Content ✅ COMPLETE
- **Status:** In-app educational cards with nutrient information
- **In-app cards:** "Why Vitamin C + Iron?", "Gut-Friendly Snack Ideas", "Adrenal Support Foods"
- **Nutrient tags:** Each card tagged with relevant nutrients
- **Beginner-friendly:** Plain language, no medical jargon

#### 9. Settings & Profile ✅ COMPLETE
- **Status:** Profile management with re-evaluation reminders implemented
- **User preferences:**
  - Age, sex, activity level (for future DV customization)
  - Dietary pattern (omnivore, vegetarian, vegan)
  - Staple commitments (liver 2-3x/week, cultured dairy 2x/week, pumpkin seeds daily)
- **Toggle:** "Show supplement suggestions" (default: off)
- **Future:** Connect wearables (stubbed)

#### 10. User Authentication & Data Privacy ✅ IMPLEMENTED (Basic Authentication Complete)
**Goal:** Enable secure multi-user access while protecting privacy  
**Status:** **Basic Supabase authentication implemented and ready for deployment**

**✅ IMPLEMENTED: Authentication System (Production Ready)**

**Authentication Features:**
- ✅ **Email/password authentication** via Supabase
- ✅ **Sign up flow** with email verification
- ✅ **Sign in/sign out** functionality
- ✅ **Protected routes** - app requires login
- ✅ **Secure JWT token** management
- ✅ **Beautiful auth UI** with AuthLayout component
- ✅ **Loading states** while auth initializes
- ✅ **Error handling** with user-friendly messages
- ✅ **Sign out button** in app header

**Database & Backend:**
- ✅ **Supabase integration** configured
- ✅ **Row Level Security (RLS)** policies set up
- ✅ **User profiles table** with auto-creation trigger
- ✅ **Developer flag** for data isolation
- ✅ **Environment variables** for credentials (`.env`)
- ✅ **Deployment documentation** (`USER-TODO-DEPLOYMENT.md`)
- ✅ **Setup guide** (`USER-TODO-SUPABASE-SETUP.md`)

**Files Created:**
- ✅ `/src/lib/supabase.ts` - Supabase client configuration
- ✅ `/src/hooks/useAuth.ts` - Authentication React hook
- ✅ `/src/components/auth/AuthLayout.tsx` - Auth page wrapper
- ✅ `/src/components/auth/LoginForm.tsx` - Sign in/up form
- ✅ `.env.example` - Environment variable template
- ✅ `USER-TODO-SUPABASE-SETUP.md` - Quick setup guide
- ✅ `USER-TODO-DEPLOYMENT.md` - Complete deployment guide

**Security Implemented:**
- ✅ **Row Level Security (RLS)** - Users can only access their own data
- ✅ **Email verification** - Required before full access
- ✅ **Secure environment variables** - Keys in `.env`, not committed to Git
- ✅ **Developer data isolation** - `is_developer` flag for excluding personal data from analytics
- ✅ **HTTPS/TLS** - All API calls encrypted (Supabase default)

**User Experience:**
- ✅ **Smooth onboarding** - Sign up → verify email → sign in → use app
- ✅ **Persistent sessions** - Stay logged in across page refreshes
- ✅ **Clean logout** - One-click sign out from app header
- ✅ **Loading states** - No jarring transitions during auth checks

**⚠️ USER ACTION REQUIRED BEFORE DEPLOYMENT:**

To deploy this app to production, you **must**:

1. **Create a Supabase account** (free tier available)
2. **Set up a Supabase project** (takes 2-3 minutes)
3. **Run the database setup SQL script** (provided in deployment guide)
4. **Add environment variables** to Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Update Supabase redirect URLs** with your Vercel domain

**📚 Complete setup instructions in:**
- `USER-TODO-SUPABASE-SETUP.md` - Quick 5-minute setup guide
- `USER-TODO-DEPLOYMENT.md` - Full deployment to Vercel guide with Supabase integration

**🔐 What's Included:**
- Database schema with user profiles table
- Row Level Security (RLS) policies for data isolation
- Email verification workflow
- Developer account exclusion from analytics

**📊 CURRENT STATE: Local Storage + Cloud Auth**
- **Authentication**: Handled by Supabase (cloud) ✅
- **User data**: Still stored locally in browser via spark.kv
- **Multi-device sync**: NOT YET IMPLEMENTED (see below)

Each user has a separate account and can only access their own data. However, their food logs, meal templates, and other app data are still stored in their browser's local storage, not synced to the cloud yet.

**❌ NOT YET IMPLEMENTED: Cloud Data Storage & Multi-Device Sync**

The following features are planned but not yet built:

**Cloud Data Storage:**
- Migrate from spark.kv (local storage) to Supabase database
- Store food logs, meal templates, stress logs, etc. in the cloud
- Real-time sync across devices
- Automatic backups

**Migration System:**
- One-time migration: Upload existing local data to cloud
- Prompt on first login: "Upload your local data?"
- Offline-first architecture: Local cache + cloud backup
- Conflict resolution for simultaneous edits

**Additional Auth Features:**
- Password reset via email
- "Sign in with Google" OAuth
- Magic link authentication (passwordless)
- Account deletion with GDPR compliance
- Data export (JSON, CSV)

**Implementation Plan:**
See `PRD.md` Phase 8 implementation steps (items 24-30) for full specifications on migrating from local storage to cloud database.

---

### Phase 9: Personalized Nutrition Integration ✅ COMPLETE
**Goal:** Activate personalized daily values based on user profile  
**Status:** Fully implemented (January 2025)  
**Location:** Settings page

**Overview:**
Users can now enable personalized daily nutrient values calculated from their age, weight, height, sex, activity level, and health goals. This transforms the one-size-fits-all RDA approach into truly personalized nutrition guidance.

#### Implementation Details

**9a. Personalized Daily Value Toggle** ✅
  - Settings page integration with Switch component
  - Hook-based architecture (`usePersonalizedDVs`)
  - Automatic calculation based on user profile
  - Falls back to standard RDA when disabled or no profile exists
  - Clear UI feedback showing when personalization is active
  - Graceful degradation when profile incomplete

**9b. Dynamic DV Calculation Engine** ✅
  - Integrates with existing `personalizedDVs.ts` calculator
  - Uses CompleteUserProfile data from KV storage (`complete-user-profile` key)
  - Calculates personalized values for all major nutrients:
    - **Calories**: TDEE based on Harris-Benedict BMR + activity multiplier + goal adjustment
    - **Protein**: 0.8-1.6g per kg body weight (scales with activity level)
    - **Fiber**: 14g per 1000 calories consumed
    - **Iron**: Sex-specific (18mg for menstruating females, 8mg for males/post-menopausal)
    - **B-vitamins**: Increased for high activity levels
    - **Magnesium**: Boosted for high stress or intense exercise
    - **Potassium**: Activity-adjusted
    - All other micronutrients with age/sex/activity adjustments

**9c. User Experience** ✅
  - **Location**: Settings → Nutrition Calculations section
  - **Toggle control**: "Use Personalized Daily Values"
  - **Descriptive text**: Explains benefits clearly
  - **Status indicators**:
    - When ON: "✓ Using your profile data to calculate personalized nutrient targets"
    - When OFF: "Currently using standard daily values (RDA)"
  - **Profile dependency**: Encourages keeping profile updated
  - **Seamless integration**: Works with existing Food Budget, gap detection, recommendations

**9d. Technical Architecture** ✅
  - **Hook**: `/hooks/usePersonalizedDVs.ts`
    - Clean, reusable API
    - Returns: `{ dvs: PersonalizedDailyValues, isPersonalized: boolean, enabled: boolean, toggle: () => void }`
    - Type-safe with full TypeScript support
  - **Calculator**: `/lib/personalizedDVs.ts` (already existed, now activated)
    - `calculatePersonalizedDVs(profile: CompleteUserProfile): PersonalizedDailyValues`
    - `calculateBMR()`, `calculateTDEE()`, `calculateBMI()` utilities
  - **Storage**:
    - Feature flag: `use-personalized-dvs` (boolean) in spark.kv
    - Profile data: `complete-user-profile` (CompleteUserProfile) in spark.kv
  - **Efficient computation**: Only calculates when both profile exists AND feature enabled

**9e. Future Integration Opportunities** 📋
The foundation is now ready for deeper integration:
  - [ ] Food Budget page: Display personalized targets instead of fixed DVs
  - [ ] Nutrient gap detection: Use personal thresholds (e.g., "You need 120g protein based on your weight and activity")
  - [ ] Recommendations engine: Tailor suggestions to personal needs
  - [ ] AI weekly insights: Factor in personal targets
  - [ ] Progress tracking: Show improvement toward personalized goals
  - [ ] Achievement system: Unlock badges for meeting personal targets

**Impact:**
This feature transforms NutriWell from a generic tracking tool into a truly personalized nutrition coach. Users with high activity levels now see appropriate protein targets. Older adults see age-adjusted recommendations. Athletes get performance-optimized nutrient goals.

**Implementation Files:**
- ✅ `/hooks/usePersonalizedDVs.ts` - Main hook (NEW)
- ✅ `/lib/personalizedDVs.ts` - Calculator (existed, now activated)
- ✅ `/components/pages/Settings.tsx` - UI toggle (modified)
- 📋 Future: Integrate hook into Food Budget, Recommendations, Dashboard

---

### Phase 10: Profile History Tracking ✅ COMPLETE
**Goal:** Track body metrics over time to visualize progress and trends  
**Status:** Fully implemented (January 2025)  
**Location:** Settings page → Profile History section

**Overview:**
Users can now track key body measurements over time including weight, BMI, waist circumference, and body fat percentage. Visual trend charts and progress indicators help users see their health journey at a glance.

#### Implementation Details

**10a. Body Metrics Tracking** ✅
  - Weight tracking (lb) with decimal precision
  - BMI calculation and classification (underweight/normal/overweight/obese)
  - Waist circumference (inches) for health risk assessment
  - Body fat percentage for body composition tracking
  - Optional notes for context
  - Date tracking with historical data

**10b. Trend Visualization** ✅
  - Last 30 days trend chart using Recharts
  - Multiple metric views (weight, BMI, waist, body fat)
  - Trend indicators showing 5-day directional change
  - Latest values displayed prominently with trend badges
  - Line charts with smooth curves and data points

**10c. Entry Management** ✅
  - Add measurements via intuitive dialog form
  - Update existing entries (same-day edits)
  - Delete entries with confirmation
  - Toast notifications for feedback

**10d. Technical Architecture** ✅
  - Component: `/components/ProfileHistory.tsx`
  - Storage: `profile-history` in spark.kv
  - Type-safe TypeScript interfaces

**Impact:**
Provides users with concrete, visual feedback on their health journey. Seeing trends over time increases motivation and helps users understand if their nutrition and lifestyle changes are working.

**Implementation Files:**
- ✅ `/components/ProfileHistory.tsx` - Main component (NEW)
- ✅ `/components/pages/Settings.tsx` - Integration point

---

### Phase 11: UI Redesign & Modernization (Clean & Minimalist) ✅ COMPLETE
**Goal:** Completely overhaul the UI to be professional, clean, and modern.
**Status:** Complete (November 2025)

#### 11.1 Design System Refinement
- **Color Palette:** Refine `oklch` values for a softer, high-quality dark mode. Reduce "neon" feel, increase "pro app" feel.
- **Typography:** Optimize font weights and line heights for readability.
- **Spacing:** Increase whitespace for a less cluttered look.
- **Borders & Shadows:** Use subtle borders and sophisticated shadows instead of heavy outlines.

#### 11.2 Layout Overhaul
- **Sidebar Navigation:** Move from top tabs to a collapsible sidebar for better scalability and modern look.
- **Dashboard Layout:** Implement a "Bento Box" grid layout for the main dashboard.
- **Responsive Design:** Ensure perfect mobile experience with bottom navigation or hamburger menu.

#### 11.3 Component Modernization
- **Cards:** Clean, minimal cards with subtle hover effects.
- **Inputs:** Modern, accessible input fields with clear focus states.
- **Charts:** Re-style Recharts to match the new minimal aesthetic.
- **Animations:** Refine Framer Motion transitions to be smoother and less distracting.

#### 11.4 Page-Specific Redesigns
- **Log Food:** Simplify the logging flow. Focus on speed and clarity.
- **Food Budget:** Redesign progress bars to be sleek and informative.
- **LifeFlow:** Improve the calendar/schedule visualization.

#### 11.5 Theme Support
- **Dark/Light Mode:** Toggle button implemented for user preference.
