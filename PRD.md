# Product Requirements Document: NutriWell & Wellness Suite

**Status**: Production Ready - All Core Features Complete  
**Last Updated**: January 2025  
**Version**: 2.3

---

## Implementation Progress Tracker

### ✅ Completed Features
- [x] **Phase 1-2**: Core food logging, nutrition engine, dashboard
- [x] **Phase 3**: Meal planning, templates, AI autofill
- [x] **Phase 4**: Food Budget tracker with time periods
- [x] **Phase 5**: GBDI scoring, gamification, achievements
- [x] **Phase 6**: SleepSync mode with circadian timing
- [x] **Phase 7a**: LifeFlow scheduling with recurring activities
- [x] **Phase 7b**: Meal pattern analysis and cook time estimation
- [x] **Phase 7c**: Adrenal load calculation (dietary component)
- [x] **Phase 7d**: Enhanced stress tracking with user input system, stress history visualization, pattern detection
- [x] **Phase 7e**: LifeFlow meal autofill with editable templates - COMPLETE
- [x] **Phase 7f**: Stress-aware personalized recommendations - COMPLETE
- [x] **Phase 7g**: GBDI history tracking with 7-day trends and insights

### 📋 Future Enhancements (Post-MVP)
- [ ] **Phase 8**: User Authentication & Multi-User Support
- [ ] **Phase 9**: Advanced educational content expansion
- [ ] **Phase 10**: Enhanced synergy detection with more rules
- [ ] **Phase 11**: Performance optimization and polish
- [ ] **Phase 12**: Wearable integration (Apple Health, Fitbit, Whoop)

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

### MVP (Version 1.0) — Core Experience
**Goal:** Prove the core loop: log → analyze → fix → level up

#### 1. Food Logging
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

#### 1.5 Meal Planning & Templates (ENHANCED)
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

#### 1.6 Food Budget Tracker (NEW)
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

#### 1.7 SleepSync - Sleep-Optimized Meal Timing (RENAMED from CircaFast)
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

#### 1.8 LifeFlow - Time-Blocked Schedule Builder (✅ COMPLETE)
**Status**: Fully implemented with intelligent meal autofill and goal tracking

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

- **Integration with other modes:**
  - ✅ Uses sleep schedule from SleepSync
  - ✅ Auto-imports meal times from NutriWell logs
  - ✅ Respects eating window and digestion buffers
  - ✅ Coordinates work, exercise, meals for optimal timing

#### 2. Gamification System (NEW)
- **GBDI Score Display:** Large, animated score card with trend indicators (↑↓) comparing to previous day
- **Streak Tracker:** Daily logging streak with visual calendar, achievements at 3, 7, 14, 30+ days
- **Achievement System:** Unlock badges for milestones:
  - **Common:** First meal logged, 5 days streak
  - **Rare:** 7 fermented foods in a week, Omega Warrior (3x fish/week)
  - **Epic:** GBDI 80+, Consistency King (7-day streak), No ultra-processed for 3 days
  - **Legendary:** Perfect Nutrient Day (100% all DVs), 30+ plant types/week, 30-day streak
- **Progress Visualization:** Animated progress bars, color-coded status cards, satisfying animations
- **Level System:** Starter → Rising → Champion → Master → Legendary based on streak length
- **Gut Health Breakdown:** Visual cards showing fermented foods, plant diversity, ultra-processed burden, gut stressors

#### 3. Nutrient Analysis Engine
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

#### 4. Gap Detection & Scoring
- **Daily Value (DV) comparison:** Show % of DV achieved for each nutrient
- **Color-coded status:**
  - 🟢 Green: ≥80% DV
  - 🟡 Yellow: 50-79% DV
  - 🔴 Red: <50% DV
- **Gut Support Score:** 0-100 based on fiber, fermented foods, diversity, ultra-processed burden

#### 4.5 GBDI Score & History Tracking (✅ COMPLETE)
**Status**: Fully implemented with 7-day historical tracking and insights

- **Comprehensive gut-brain-digestive health metric (0-100):**
  - Gut microbiome health: fiber intake, fermented foods, plant diversity, polyphenol-rich foods
  - Gut-brain axis: supportive nutrients for neurotransmitter production, stress-reducing compounds
  - Digestive wellness: warm/cooked food ratio, ultra-processed burden, gut stressors (NSAIDs, alcohol)
- **Higher GBDI is better** — composite score tracking protective factors
- **Real-time calculation:** Updated daily based on food logs and dietary patterns

- **7-Day Historical Tracking (✅ NEW - Phase 7g):**
  - ✅ **GBDIHistory component** - Visual timeline of gut health over time
  - ✅ Line chart showing GBDI trends across 7 days
  - ✅ Daily breakdown cards with individual scores
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
  - ✅ Current GBDI score displayed prominently
  - ✅ 7-day history chart accessible from dashboard
  - ✅ Quick insights on recent trends
  - ✅ Links to detailed breakdown and recommendations

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

#### 5. Wellness Audit Lenses
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

#### 6. Suggestion Engine
- **Synergy suggestions:**
  - "Add bell pepper (vitamin C) to boost iron absorption from lentils"
  - "Space coffee 2 hours from this iron-rich meal"
  - "Avoid taking calcium supplement with this meal (reduce iron absorption)"
- **Gap fixes (prioritized):**
  - **Food-first:** "Add 1 cup sauerkraut (fermented, gut-friendly)"
  - **Meal timing:** "Move protein to breakfast for better distribution"
  - **Product options (optional):** "Consider magnesium glycinate supplement" (with disclaimer)
- **Warm/cooked priority:** Always suggest cooked/warm options first for digestibility

#### 7. Dashboard
- **GBDI Score Hero Card:** Large animated card with current score, trend vs yesterday, status badge (Excellent/Good/Fair/Poor/Critical)
- **Streak Tracker Card:** Current streak, best streak, last 7 days visual calendar
- **Today's Summary:** Total calories, macros, fiber, gut score
- **Nutrient Grid:** Visual %DV bars for all tracked nutrients
- **Top 3 Fixes:** Highest-impact, lowest-friction improvements
- **Achievements Panel:** Show unlocked/locked achievements with progress bars
- **Gut Health Panel:** Fermented food count, fiber grams, plant diversity
- **Legal Disclaimer Banner:** Persistent, prominent

#### 8. Educational Content
- **In-app cards:** "Why Vitamin C + Iron?", "Gut-Friendly Snack Ideas", "Adrenal Support Foods"
- **Nutrient tags:** Each card tagged with relevant nutrients
- **Beginner-friendly:** Plain language, no medical jargon

#### 9. Settings & Profile
- **User preferences:**
  - Age, sex, activity level (for future DV customization)
  - Dietary pattern (omnivore, vegetarian, vegan)
  - Staple commitments (liver 2-3x/week, cultured dairy 2x/week, pumpkin seeds daily)
- **Toggle:** "Show supplement suggestions" (default: off)
- **Future:** Connect wearables (stubbed)

#### 10. User Authentication & Data Privacy (🔄 PLANNED - Phase 8)
**Goal:** Enable secure multi-user access while protecting privacy

**⚠️ IMPORTANT: Developer Data Isolation**
- System MUST NOT store or expose developer's personal health data
- Development/testing data stored separately from production user data
- Clear separation between test accounts and real user accounts
- Developer food logs, stress data, and health metrics kept private

**Authentication Requirements:**
- **Login system:** Users must authenticate to access the application
- **Account types:**
  - Regular users (standard nutrition tracking)
  - Developer/admin accounts (testing, support, analytics access)
  - Guest/demo mode (optional, limited features, no data persistence)

**Database & Backend Needs:**
> **USER ACTION REQUIRED:** To implement this feature, you will need to provide:
> - Supabase project URL and anon key (recommended)
> - OR alternative database credentials (PostgreSQL, Firebase, etc.)
> - Authentication provider configuration (email/password, OAuth, magic link)
> - S3 or cloud storage credentials (if storing food images in future)

**Recommended Tech Stack:**
- **Supabase** (Preferred):
  - Built-in authentication (email/password, OAuth providers, magic links)
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions for multi-device sync
  - Edge functions for serverless backend logic
  - Free tier: 500MB database, 2GB file storage, 50k monthly active users
  
- **Alternative Options:**
  - Firebase Auth + Firestore
  - Auth0 + your own PostgreSQL
  - AWS Cognito + DynamoDB
  - Clerk + Neon PostgreSQL

**Data Architecture with Authentication:**
```typescript
// User table (authentication)
User {
  id: uuid (primary key),
  email: string,
  created_at: timestamp,
  last_login: timestamp,
  account_type: "user" | "developer" | "admin",
  is_developer: boolean // Flag to exclude from user analytics
}

// User profile (nutrition preferences)
UserProfile {
  user_id: uuid (foreign key → User.id),
  age?: number,
  sex?: string,
  activity_level?: string,
  dietary_pattern?: string,
  staples?: json,
  preferences?: json,
  created_at: timestamp,
  updated_at: timestamp
}

// Food logs (user-specific)
FoodLog {
  id: uuid,
  user_id: uuid (foreign key → User.id),
  timestamp: timestamp,
  food_id: string,
  quantity: number,
  meal_type: string,
  meal_time?: string,
  notes?: string,
  RLS: WHERE user_id = auth.uid() // Row Level Security
}

// Meal templates (user-specific)
MealTemplate {
  id: uuid,
  user_id: uuid (foreign key → User.id),
  name: string,
  meal_type: string,
  ingredients: json,
  supplements: json,
  is_public: boolean, // For future community sharing
  created_at: timestamp,
  RLS: WHERE user_id = auth.uid()
}

// Stress logs (user-specific, private)
StressLog {
  id: uuid,
  user_id: uuid (foreign key → User.id),
  date: date,
  stress_level: number,
  sleep_quality: number,
  energy_level: number,
  physical_symptoms: string[],
  mental_symptoms: string[],
  notes?: string,
  RLS: WHERE user_id = auth.uid()
}

// Developer data exclusion
// All analytics queries MUST include:
// WHERE is_developer = FALSE
// This ensures developer's personal health data never appears in:
// - User statistics
// - Aggregate metrics
// - Public leaderboards (future)
// - Research data exports (future)
```

**Privacy & Security Requirements:**
1. **Row Level Security (RLS):**
   - Each user can ONLY access their own food logs, stress data, meal templates
   - Developers cannot access other users' private health data
   - Admin queries explicitly exclude developer accounts from aggregates

2. **Data Encryption:**
   - All data encrypted at rest (database level)
   - All API calls over HTTPS/TLS
   - Sensitive fields (stress logs, notes) encrypted in database

3. **Developer Data Isolation:**
   - Developer accounts flagged with `is_developer: true`
   - Developer food logs excluded from:
     - Global statistics ("X users logged Y meals this week")
     - Recommendation algorithms (if trained on aggregate data)
     - Public sharing features (future community features)
   - Separate test database for development (optional but recommended)

4. **Data Export & Deletion:**
   - Users can export their data (JSON, CSV)
   - Users can delete their accounts (GDPR/CCPA compliance)
   - Cascade delete: User deletion removes ALL associated logs, templates, profiles

5. **Session Management:**
   - JWT tokens with expiration (24 hours default)
   - Refresh token rotation
   - Logout invalidates tokens
   - Multi-device support with per-device sessions

**Migration Path from Current spark.kv:**
- Current local data stored in `spark.kv` (browser local storage)
- Upon implementing auth:
  - Prompt existing users to create account
  - One-time migration: upload local data to cloud database
  - Post-migration: spark.kv used as offline cache only
  - Sync logic: local changes pushed to cloud when online

**Implementation Steps (Phase 8):**
1. Set up Supabase project (or alternative)
2. Create database schema with RLS policies
3. Implement authentication UI (login, signup, forgot password)
4. Migrate spark.kv hooks to Supabase queries
5. Add offline sync logic (local-first, cloud backup)
6. Test developer data isolation
7. Implement data export/deletion features

**User Experience:**
- **First-time users:** Sign up → start logging immediately
- **Returning users:** Log in → see their historical data
- **Guest mode (optional):** Try app without account (data not saved)
- **Multi-device:** Log in on phone, tablet, desktop → data syncs automatically

---

### Version 1.1 — Monetization & Depth
**Goal:** Validate affiliate model, add premium tier

#### New Features:
1. **Affiliate Product Catalog**
   - Map nutrient gaps → recommended products
   - Categories: probiotics, fiber supplements, electrolytes, vitamin D, magnesium, omega-3
   - Clear labeling: "This may contain affiliate links"
   
2. **Premium Tier ($7-12/month)**
   - Deeper analysis: meal timing optimization, weekly trends
   - Wearable data integration (Apple Health, Fitbit)
   - Custom DV targets based on activity
   - Export reports (CSV, PDF)

3. **Recipe Suggestions**
   - "Here's a 300-calorie gut-friendly snack idea to close today's gaps"
   - Pre-built meal ideas: "High-Iron Warm Bowl", "Gut Reset Smoothie"

4. **Weekly Reports**
   - Trend: "You've improved fiber intake by 40% this week"
   - Streak tracking: "7-day logging streak 🔥"

---

### Version 2.0 — Intelligence & Automation
**Goal:** Reduce friction to near-zero, integrate biometrics

#### New Features:
1. **Wearable Integration (Apple Watch, Fitbit, Whoop)**
   - Auto-pull: activity level, heart rate variability, sleep quality
   - Refine recommendations: "Low HRV today → suggest magnesium-rich, adaptogenic foods"
   
2. **Photo Logging (Future)**
   - Snap a photo → AI estimates nutrients (partner with API)

3. **Voice Logging**
   - "Hey NutriWell, I just ate 2 eggs and a cup of oatmeal"

4. **Smart Timing Suggestions**
   - "Based on your sleep data, try moving protein to breakfast"
   - "Coffee at 7am, iron-rich lunch at 1pm — good spacing ✓"

5. **Community Features**
   - Share meal templates
   - "What other users with gut-sensitive profiles eat"

---

### Version 3.0 — Advanced Intelligence & Personalization (IDEAL FEATURES)
**Goal:** Deep personalization, predictive intelligence, comprehensive tracking

#### Ideal Features for Long-Term Roadmap:

1. **Supplement Auto-Detection & Management**
   - **Amazon order history integration:** Automatically detect supplement purchases
   - Parse product names to identify vitamins, minerals, probiotics, adaptogens
   - Track dosing schedules and adherence
   - Restocking alerts based on serving size and purchase date
   - Price tracking: notify when supplements on sale
   - Brand comparison: suggest alternatives based on value/quality
   - Interaction warnings: flag potential supplement-supplement or supplement-medication conflicts

2. **Advanced Synergy Intelligence**
   - **Real-time bioavailability optimization:** 
     - Detects when user logs iron-rich food → prompts "Add vitamin C source to this meal?"
     - Tracks fat intake with fat-soluble vitamins (A, D, E, K) → suggests adding healthy fat if missing
     - Monitors black pepper consumption with turmeric for curcumin absorption
   - **Spice & garnish tracking for enhanced benefits:**
     - Garlic + allicin formation timing (crush and wait 10 min before cooking)
     - Ginger + anti-inflammatory compounds
     - Cinnamon + blood sugar regulation
     - Herbs (basil, oregano, rosemary) + antioxidant compounds
   - **Meal sequence optimization:**
     - Vinegar or lemon before carb-heavy meals (blood sugar management)
     - Protein distribution across meals for muscle synthesis
     - Pre-meal rituals: apple cider vinegar, bitters, digestive enzymes
   - **Anti-nutrient management:**
     - Phytic acid in grains/legumes → soaking recommendations
     - Oxalates in spinach → pairing advice or cooking methods
     - Lectins in beans → proper cooking guidance
     - Tannins in tea → spacing from iron-rich meals

3. **Personalized Lab Integration**
   - Import blood work results (CBC, CMP, vitamin levels, hormones)
   - Map nutrient intake to biomarkers over time
   - Identify if dietary changes correlate with lab improvements
   - Specific recommendations based on actual deficiencies (not just DV)
   - Track ferritin, B12, vitamin D, magnesium RBC, homocysteine, etc.

4. **Genetic Nutrition (Nutrigenomics)**
   - Upload 23andMe/AncestryDNA raw data
   - Screen for SNPs affecting nutrient needs:
     - MTHFR (folate metabolism) → methylfolate recommendations
     - VDR (vitamin D receptor) → personalized D3 dosing
     - FTO (fat metabolism) → macronutrient ratio guidance
     - COMT (dopamine) → protein timing, coffee sensitivity
     - DAO (histamine) → fermented food tolerance
   - Personalize DV targets based on genetic predispositions

5. **Microbiome Integration**
   - Import gut microbiome test results (Viome, Thorne, DayTwo, etc.)
   - Map beneficial/pathogenic bacteria to food recommendations
   - Track prebiotic/probiotic intake against microbiome composition
   - Suggest foods that feed beneficial strains
   - Identify trigger foods based on microbiome profile
   - Monitor diversity score improvements over time

6. **Meal Timing Circadian Optimization**
   - Advanced circadian rhythm tracking beyond SleepSync
   - Optimal protein timing (morning for muscle synthesis)
   - Carb timing for performance (pre-workout) vs. sleep (low at dinner)
   - Chronotype-based eating windows (early bird vs. night owl)
   - Shift worker special protocols
   - Jet lag nutritional support

7. **Symptom Tracking & Pattern Detection**
   - Log symptoms: bloating, energy dips, headaches, skin issues, mood
   - AI pattern detection: "You report bloating 2-3 hours after dairy"
   - Elimination diet guidance and reintroduction protocols
   - Food sensitivity probability scores
   - Correlate symptoms with specific ingredients, meal timing, combinations

8. **Budget-Conscious Shopping Assistant**
   - Price tracking for staple foods at local stores
   - Generate shopping lists from meal plans with cost estimates
   - Suggest budget-friendly swaps (frozen vs. fresh, seasonal produce)
   - Bulk buying recommendations for shelf-stable items
   - Compare cost-per-nutrient across foods (best iron per dollar, etc.)
   - Coupon integration and sales alerts

9. **Restaurant & Travel Mode**
   - Restaurant database integration (MenuStat, Nutritionix)
   - Quick-log common restaurant meals
   - Travel-friendly meal suggestions (airport, hotel, convenience stores)
   - Maintain streaks while traveling with flexible logging
   - International food database (when traveling abroad)

10. **Social Accountability & Challenges**
    - Friend groups for shared goals
    - Weekly challenges: "Eat 30 plants this week", "7-day fermented food streak"
    - Leaderboards (optional, privacy-first)
    - Share achievements and meal templates
    - Cooking challenges and recipe swaps

11. **Menstrual Cycle Nutrition**
    - Track cycle phase (follicular, ovulatory, luteal, menstrual)
    - Phase-specific nutrient recommendations:
      - Follicular: Iron-rich foods post-period
      - Ovulatory: Antioxidants, fiber for estrogen metabolism
      - Luteal: Magnesium, B6 for PMS
      - Menstrual: Iron, vitamin C, anti-inflammatory foods
    - Craving management with nutrient-dense alternatives

12. **Performance & Athletic Optimization**
    - Training load integration (from Strava, Garmin, Whoop)
    - Periodized nutrition (base, build, peak, recovery phases)
    - Electrolyte optimization for endurance activities
    - Glycogen loading protocols for events
    - Recovery nutrition timing and macros
    - Hydration tracking with sweat loss estimates

13. **Longevity & Healthspan Focus**
    - Track longevity markers: polyphenol intake, omega-3:6 ratio, glycemic load
    - mTOR modulation: protein cycling, fasting protocols
    - Autophagy support: fasting windows, polyphenols, spermidine-rich foods
    - Senolytic food compounds (quercetin, fisetin)
    - NAD+ boosting foods (niacin, NMN precursors)
    - Telomere-supporting nutrients (folate, B12, omega-3)

14. **AI Meal Generation**
    - "Generate a 500-calorie, high-iron, gut-friendly dinner"
    - Respects dietary restrictions, preferences, available ingredients
    - Adapts to seasonal produce
    - Learns from user ratings and frequency of logged meals
    - Generates shopping lists automatically

15. **Family & Household Management**
    - Multiple user profiles (different DV targets)
    - Shared meal planning for families
    - Kid-friendly nutrient tracking (age-appropriate DVs)
    - Batch cooking suggestions for meal prep
    - Allergen management across family members

---

## Non-Goals (Out of Scope)

1. **Medical diagnosis or treatment** — This is educational, not clinical
2. **Prescription-level recommendations** — No dosing, no disease management
3. **Replacement for RD/MD** — Always encourage professional consultation
4. **Complex meal planning** — Focus on gap-filling, not full meal plans (v1)
5. **Social network** — No feeds, likes, comments (v1)
6. **Calorie restriction focus** — This is about nutrient sufficiency, not weight loss
7. **Restaurant database** — Use simple manual entry (v1)

---

## Technical Architecture (High-Level)

### Stack
- **Frontend:** React + TypeScript (Spark/Vite template)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State:** React state + spark.kv for persistence
- **Data:** In-memory food database (JSON), user data in spark.kv
- **Future:** API integrations (wearables, affiliate tracking)

### Key Modules
- **/lib/nutritionEngine.ts** — Core analysis logic with unit conversion system
- **/lib/dailyValues.ts** — Reference DV constants
- **/lib/synergies.ts** — Nutrient pairing rules with bioavailability calculations
- **/lib/affiliate.ts** — Product matching logic
- **/lib/unitConverter.ts** — (NEW) Intelligent unit conversion system
  - Handles metric ↔ imperial conversions (g ↔ oz, ml ↔ fl oz, kg ↔ lb)
  - Distinguishes weight vs. volume measurements
  - Context-aware: "100g chicken" (weight) vs "20oz water" (volume)
  - Validation: prevents nonsensical conversions (e.g., converting fluid volume to weight without density)
  - Standardized internal storage format (grams for solids, ml for liquids)
  - Display format respects user preference or regional standards
- **/data/foods.ts** — Comprehensive food database with 200+ items including:
  - **Proteins:** meats (chicken, beef, pork, turkey, lamb), fish (salmon, tuna, sardines, cod), eggs, plant proteins (tofu, tempeh, seitan, legumes)
  - **Vegetables:** leafy greens (spinach, kale, arugula, chard), cruciferous (broccoli, cauliflower, brussels sprouts), starchy (sweet potato, potato), nightshades (tomato, bell pepper, eggplant), root vegetables (carrot, beet, turnip)
  - **Fruits:** berries (blueberry, strawberry, raspberry, blackberry), tropical (mango, pineapple, papaya), citrus (orange, lemon, lime, grapefruit), stone fruits (peach, plum, cherry), apples, pears, bananas
  - **Grains & Starches:** whole grains (quinoa, brown rice, oats, barley, farro, buckwheat), bread (sourdough, whole wheat, rye), pasta (whole wheat, regular, rice noodles), tortillas
  - **Dairy & Alternatives:** yogurt (Greek, regular, Icelandic), kefir (plain, flavored), cheese (cheddar, mozzarella, feta, parmesan, cottage), milk (whole, 2%, skim, almond, oat, coconut)
  - **Fermented Foods:** sauerkraut, kimchi, kombucha, miso, tempeh, natto, pickles, fermented vegetables
  - **Oils & Fats:** olive oil (EVOO, regular), coconut oil, avocado oil, butter, ghee, sesame oil, grapeseed oil, flaxseed oil, MCT oil
  - **Nuts & Seeds:** almonds, walnuts, cashews, pecans, pumpkin seeds, sunflower seeds, chia seeds, flaxseeds, hemp seeds, sesame seeds
  - **Legumes:** lentils (red, green, brown), chickpeas, black beans, kidney beans, pinto beans, navy beans, split peas, edamame
  - **Spices & Seasonings:** turmeric, garlic, ginger, cinnamon, cumin, paprika, oregano, basil, thyme, rosemary, parsley, cilantro, dill, mint, black pepper, sea salt, pink salt, cayenne, curry powder, nutritional yeast
  - **Condiments & Sauces:** hot sauce, mustard (yellow, dijon, whole grain), vinegar (apple cider, balsamic, white, rice), soy sauce, tamari, coconut aminos, tahini, hummus, salsa, pesto
  - **Processed foods:** protein bars, granola, chips, crackers, cookies, protein powder, meal replacement shakes
  - **Beverages:** coffee (black, with cream), tea (green, black, herbal, matcha), water, sparkling water, coconut water, juices (orange, apple, vegetable), bone broth, protein shakes
  - **Sweeteners:** honey, maple syrup, agave, stevia, monk fruit, dates, coconut sugar
  - **Supplements:** 
    - Vitamins: D3, B12, B-complex, C, A, E, K2
    - Minerals: magnesium (glycinate, citrate, threonate), zinc, iron, calcium, selenium, iodine
    - Probiotics: multi-strain, specific strains (L. reuteri, L. plantarum, etc.)
    - Omega-3: fish oil, algae oil, krill oil
    - Specialty: collagen, creatine, ashwagandha, rhodiola, lion's mane, cordyceps, chlorella, spirulina
    - Digestive: betaine HCL, digestive enzymes, l-glutamine, psyllium husk

### Data Model
```typescript
Food {
  id, name, servingSize, servingUnit (g/ml/oz/fl oz/cup/etc),
  calories,
  protein, carbs, fat, fiber,
  vitamins: { C, D, A, E, K, B12, B6, folate, thiamin, riboflavin, niacin, ... },
  minerals: { iron, zinc, calcium, magnesium, potassium, selenium, copper, manganese, ... },
  electrolytes: { sodium, potassium, magnesium },
  phytonutrients: { polyphenols, carotenoids, flavonoids, ... },
  tags: ["fermented", "polyphenol-rich", "ultra-processed", "warm-suitable", "prebiotic"],
  gutStressors: boolean,
  measurementType: "weight" | "volume" | "count"
}

Supplement {
  id, name, brand?, 
  type: "vitamin" | "mineral" | "probiotic" | "omega3" | "adaptogen" | "digestive" | "other",
  dosage: { amount: number, unit: "mg" | "mcg" | "IU" | "g" | "billion CFU" },
  nutrients: { ... }, // Similar to Food but supplement-specific
  timing: "morning" | "with-food" | "before-bed" | "empty-stomach",
  tags: ["daily", "as-needed"],
  amazonASIN?: string, // For future Amazon integration
  purchaseDate?: timestamp,
  servingsRemaining?: number
}

UserLog {
  timestamp, 
  food?, 
  supplement?,
  quantity, 
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  mealTime?: string, // For SleepSync timing analysis
  notes?: string
}

MealTemplate {
  id, name, mealType,
  ingredients: [{ foodId, quantity, unit }],
  supplements: [{ supplementId, quantity }],
  totalNutrition: { ... }, // Pre-calculated for speed
  tags: ["quick", "gut-friendly", "high-protein", "warm"],
  createdBy: "user" | "preset"
}

UserProfile {
  staples: { liver: "2-3x/week", culturedDairy: "2x/week", pumpkinSeeds: "daily" },
  preferences: { 
    warmFoods: true, 
    showSupplements: false,
    unitSystem: "imperial" | "metric" | "auto"
  },
  demographics: { age, sex, activityLevel },
  sleepSchedule?: { wakeTime, sleepTime, targetLastMeal },
  activeGoals: [{ goalId, milestones: [...] }],
  recurringActivities: [{ name, category, days, time, duration }]
}

SynergyRule {
  type: "positive" | "negative",
  nutrients: [nutrientA, nutrientB],
  effect: "enhances-absorption" | "reduces-absorption" | "requires-together",
  magnitude: "high" | "medium" | "low",
  explanation: string,
  timeWindow?: number // minutes between meals for timing conflicts
}
```

---

## Legal & Compliance

### Disclaimers (Required)
1. **Main Banner (persistent):**
   > "This application is for informational and educational purposes only. This is not medical advice. Consult a qualified healthcare professional before making dietary changes."

2. **Supplement Page:**
   > "These are general suggestions based on nutrient gaps. We may earn affiliate commissions. This is not medical advice."

3. **Footer Links:**
   - Full Legal Disclaimer (separate page)
   - Privacy Policy (basic: data stored locally, no third-party sharing in v1)
   - Terms of Service

### Data Privacy
- All user data stored locally (spark.kv) in MVP
- No server-side storage in v1
- Future: clearly communicate any cloud sync (premium tier)

---

## Open Questions & Decisions Needed

1. **DV Customization:** Should MVP customize DVs by age/sex, or use RDA baseline for all?
   - **Decision:** Start with single baseline (adult RDA), add customization in v1.1

2. **Food Database:** Build custom, or integrate API (e.g., USDA, Nutritionix)?
   - **Decision:** Start with curated 200-food mock database with comprehensive coverage, migrate to API in v1.1

3. **Affiliate Partners:** Which brands to partner with?
   - **Decision:** Start with Amazon Associates (broad), add specialized brands (Thorne, Garden of Life) in v1.1

4. **Freemium Limits:** How much to give away free?
   - **Decision:** Free = 7-day lookback, 3 gap suggestions/day. Premium = unlimited history, full suggestions, wearables.

5. **Unit System Default:** Imperial (oz, lb) vs Metric (g, kg)?
   - **Decision:** Default to imperial for US users, metric for international. Allow toggle in settings. Backend calculations standardized to metric for accuracy.

6. **Supplement Tracking Depth:** How detailed should supplement tracking be in MVP?
   - **Decision:** MVP = basic supplement logging with name, dose, timing. v1.1 = Amazon integration. v2.0+ = interaction warnings, restocking alerts.

7. **User Authentication & Database:** When to implement login system?
   - **Decision:** Phase 8 (post-MVP). Current version uses local storage (spark.kv). 
   - **Implementation needs:** Supabase credentials (project URL, anon key) OR alternative database config
   - **Critical requirement:** Developer health data MUST be isolated from user analytics and statistics
   - **Benefits:** Multi-device sync, data backup, user accounts, social features (future)
   - **Migration path:** One-time upload of local data to cloud database upon first login

8. **GBDI Scoring Logic:** Should GBDI be a "destruction index" (lower = better) or health score (higher = better)?
   - **Decision:** GBDI is a **Gut Biome Destruction Index** where lower scores indicate better health
   - **Rationale:** Focuses on measuring harmful factors (ultra-processed foods, gut stressors, inflammatory compounds)
   - **Includes:** Gut-brain axis components (omega-3s, neurotransmitter precursors, vagus nerve support)
   - **Display:** Inverse visualization where green = low destruction, red = high destruction

---

## Implementation Priority Guide

This section outlines the recommended order of implementation for maximum user value with minimal complexity.

### Phase 1: Core Functionality (Weeks 1-2)
**Goal:** Users can log food, see basic analysis, understand gaps

1. **Food Database Foundation**
   - Build comprehensive 200+ item food database
   - Include all basic foods: proteins, vegetables, fruits, grains, dairy, oils, spices
   - Add processed foods and common packaged items
   - Implement basic supplements as "food" items initially

2. **Unit Conversion System** ⚠️ CRITICAL
   - Build `/lib/unitConverter.ts` with robust conversion logic
   - Weight vs. volume detection ("100g chicken" vs "20oz water")
   - Standardize backend storage (grams for solids, ml for liquids)
   - Test edge cases: "6oz chicken" (weight), "20 fl oz water" (volume)
   - Validation to prevent user errors

3. **Logging Interface (Log Food page)**
   - Text input with smart parsing
   - Manual search and add ingredients
   - Meal type selection (breakfast, lunch, dinner, snack)
   - Display logged foods with portions

4. **Nutrition Analysis Engine**
   - Calculate daily totals for macros and micros
   - Compare against Daily Values (DV)
   - Color-coded status (red/yellow/green)

5. **Basic Dashboard**
   - Today's summary
   - Nutrient grid with %DV
   - Top 3 nutrient gaps

### Phase 2: Gamification & Engagement (Week 3)
**Goal:** Users return daily, feel progress, discover patterns

6. **GBDI Score System**
   - Calculate gut health score based on fiber, fermented foods, diversity
   - Animated hero card on Dashboard
   - Trend indicators (↑↓ vs yesterday)

7. **Streak Tracker**
   - Count consecutive logging days
   - Visual calendar (last 7 days)
   - Milestone celebrations

8. **Achievement System**
   - Define 15-20 achievements across rarity tiers
   - Unlock logic based on logs
   - Achievements panel with progress bars

### Phase 3: Meal Planning & Templates (Week 4)
**Goal:** Reduce friction, enable meal prep, build habits

9. **Preset Meal Templates**
   - 20-30 pre-built healthy meal templates
   - Organized by meal type
   - One-click logging from templates

10. **Custom Meal Templates**
    - Create template from current logs
    - Manual ingredient builder
    - Name and save for reuse

11. **AI Autofill (optional for MVP)**
    - User types meal description
    - AI suggests ingredients using spark.llm
    - Validate suggestions against food database
    - Allow manual override

12. **Weekly Meal Planner**
    - Assign templates to days/meals
    - Drag-and-drop interface
    - Copy meals across days

### Phase 4: Budget Tracker & Deep Analysis (Week 5)
**Goal:** Users understand patterns over time

13. **Food Budget Page**
    - Time period selector (today, 7d, 30d)
    - Nutrient "spending" vs "budget" (DV)
    - Critical gap alerts (<50% DV)
    - Trend indicators

14. **Nutrient Timeline**
    - Visual charts showing intake over days
    - Identify deficiency patterns

### Phase 5: Supplements & Synergies (Week 6)
**Goal:** Track supplements, understand interactions

15. **Supplement Data Model**
    - Separate supplement type from food
    - Dosing units (mg, mcg, IU)
    - Timing preferences

16. **Supplements UI**
    - "Add Supplement" button on Log Food and Meal Planner
    - Supplement-specific input form
    - Display supplements separately in logs

17. **Basic Synergy Detection**
    - Build `/lib/synergies.ts` with rule engine
    - Detect positive synergies (vitamin C + iron)
    - Detect antagonisms (calcium + iron in same meal)
    - Display warnings/suggestions in Dashboard

### Phase 6: SleepSync Mode (Week 7)
**Goal:** Optimize meal timing for sleep

18. **Meal Time Tracking**
    - Add time input to food logging
    - Default times by meal type
    - Store timestamps in logs

19. **SleepSync Dashboard**
    - Visual timeline of meals
    - Last meal to sleep time calculation
    - Sleep readiness score
    - Recommendations for earlier eating

20. **Sleep Schedule Configuration**
    - User sets typical wake/sleep times
    - Calculate optimal eating window
    - Adjust recommendations accordingly

### Phase 7: LifeFlow Mode (Week 8)
**Goal:** Time-block scheduling with goals

21. **Recurring Activities**
    - Input form: name, category, days, time, duration
    - Minutes/hours toggle for duration input
    - Visual icon and color per category

22. **Schedule Generation**
    - Auto-generate 3-7 day schedule
    - Pull in meals from NutriWell logs
    - Detect conflicts and gaps
    - Completion tracking

23. **Goal System**
    - Create goals with milestones
    - Track progress with checkboxes
    - Suggest goal tasks during free time blocks

### Phase 8: User Authentication & Multi-User Support (Week 9-10)
**Goal:** Enable secure login, protect privacy, allow multi-device access

24. **Database Setup**
    - Set up Supabase project (or alternative database)
    - Create tables: users, user_profiles, food_logs, meal_templates, stress_logs
    - Implement Row Level Security (RLS) policies
    - Configure developer account exclusion from analytics

25. **Authentication UI**
    - Sign up page (email/password or magic link)
    - Login page with "remember me" option
    - Forgot password flow
    - Account verification (email confirmation)
    - Logout functionality

26. **Data Migration System**
    - Detect existing spark.kv data on first login
    - Prompt user: "Upload local data to cloud?"
    - One-time migration: push all local logs to database
    - Post-migration: mark local data as synced
    - Keep spark.kv as offline cache

27. **Multi-Device Sync**
    - Replace spark.kv hooks with database queries
    - Implement optimistic UI updates (local-first)
    - Background sync when online
    - Conflict resolution (last-write-wins for MVP)
    - Offline mode: queue changes, sync when reconnected

28. **Developer Data Isolation**
    - Flag developer accounts with `is_developer: true`
    - Exclude developer data from:
      - User count statistics
      - Aggregate nutrient averages
      - Public leaderboards (future)
      - Recommendation training data (future)
    - Test isolation with queries
    - Document data privacy practices

29. **Data Export & Deletion**
    - Export data to JSON (all user data)
    - Export to CSV (food logs, stress logs)
    - Account deletion with cascade delete
    - GDPR/CCPA compliance documentation

30. **Security Hardening**
    - Implement JWT token refresh
    - Rate limiting on auth endpoints
    - SQL injection prevention (parameterized queries)
    - XSS protection
    - CSRF tokens for sensitive actions

### Phase 9: Education Content Expansion (Week 11)
**Goal:** Educate users, refine UX

31. **Education Content Library**
    - 10-15 educational cards
    - Topics: synergies, gut health, meal timing
    - Searchable by nutrient/topic

32. **Recommendations Page**
    - Personalized suggestions based on gaps
    - Food-first recommendations
    - Synergy-aware suggestions

33. **Settings & Preferences**
    - Dietary pattern selection
    - Unit system toggle
    - Supplement visibility toggle

### Phase 10: Polish & Testing (Week 12)
**Goal:** Production-ready quality

34. **Error Handling**
    - Graceful failures for invalid inputs
    - Toast notifications for user actions
    - Loading states

35. **Performance Optimization**
    - Lazy load historical data
    - Memoize expensive calculations
    - Optimize re-renders

36. **User Testing**
    - Beta test with 10-20 users (diverse dietary patterns)
    - Gather feedback on friction points
    - Iterate on confusing UI elements

37. **Legal & Compliance**
    - Finalize disclaimer language
    - Persistent banner on all pages
    - Privacy policy and ToS pages
    - GDPR/CCPA compliance review

---

## Design Principles

1. **Calm, Not Chaotic:** Soft colors, generous spacing, no alarm bells
2. **Food First, Products Second:** Always prioritize whole food solutions
3. **Warm & Digestible:** Default to cooked/room-temp suggestions
4. **Educate, Don't Nag:** Explain *why* (synergy), not just *what* (eat more X)
5. **Respect User Rituals:** Honor staples like liver, cultured dairy, pumpkin seeds
6. **Transparency:** Clear disclaimers, honest about limitations, visible affiliate links
7. **Data Accuracy:** Precise unit conversions and calculations are non-negotiable for user trust
8. **Privacy First:** User health data is sacred - protect it rigorously, isolate developer data

---

## UI/UX Design Guidelines

### Visual Design System

**Color Palette:**
- **Primary Green (oklch(0.42 0.19 160)):** Health, growth, nature - used for CTAs and positive actions
- **Secondary Sage (oklch(0.88 0.05 130)):** Calm, supportive - used for secondary UI elements
- **Accent Teal (oklch(0.70 0.15 150)):** Energy, vitality - used for highlights and active states
- **Background Warm Cream (oklch(0.98 0.005 85)):** Soft, non-clinical - reduces eye strain
- **Text Charcoal (oklch(0.15 0.01 85)):** Clear, readable - high contrast with background

**Typography:**
- **Headings:** Crimson Pro (serif) - elegant, trustworthy, health-conscious
- **Body:** Inter (sans-serif) - clean, modern, highly readable
- **Hierarchy:**
  - H1 (App Title): Crimson Pro Bold, 32-40px
  - H2 (Page Title): Crimson Pro Semibold, 24-28px
  - H3 (Section): Inter Semibold, 18-20px
  - Body: Inter Regular, 16px, line-height 1.6
  - Small: Inter Regular, 14px (for metadata, timestamps)

**Spacing & Layout:**
- Container max-width: 1200px (7xl)
- Content padding: 4-6 units (1-1.5rem)
- Card padding: 6 units (1.5rem)
- Section gaps: 8 units (2rem)
- Element gaps: 4 units (1rem)
- Grid: 12-column responsive grid

**Border Radius:**
- Cards: 0.75rem (rounded-xl)
- Buttons: 0.75rem
- Inputs: 0.75rem
- Badges: 9999px (fully rounded)
- Consistent rounding creates visual harmony

**Shadows:**
- Subtle elevation for cards (no harsh shadows)
- Hover states: slight shadow increase
- Focus states: ring with primary color

### Component Design Patterns

**Navigation:**
- Horizontal tab navigation for main pages
- Active tab highlighted with primary color
- Icons + labels for clarity
- Sticky navigation on scroll (optional)

**Cards:**
- White background (#FFFFFF) on cream page background
- Subtle border (border-border)
- Generous padding (6-8 units)
- Clear hierarchy: title → metadata → content → actions
- Hover states for interactive cards

**Buttons:**
- Primary: Solid primary color, white text, bold
- Secondary: Outline, primary color border and text
- Ghost: Text only, subtle hover background
- Destructive: Red color for dangerous actions
- Icon buttons: Phosphor icons, consistent size (20-24px)

**Forms & Inputs:**
- Clear labels above inputs
- Placeholder text for examples
- Inline validation (success/error states)
- Helper text below for guidance
- Focus states with ring

**Data Visualization:**
- Progress bars for nutrient %DV (color-coded by status)
- Line charts for trends over time (Recharts)
- Badge indicators for status (Excellent, Good, Fair, Poor)
- Trend arrows (↑↓) for day-over-day changes
- Color coding:
  - Green: Optimal, sufficient, positive
  - Yellow: Approaching, moderate, caution
  - Orange: Low, needs attention
  - Red: Critical, urgent, danger

**Feedback & Notifications:**
- Toast notifications (Sonner) for actions
- Success: Green with checkmark icon
- Error: Red with warning icon
- Info: Blue with info icon
- Loading states: Skeleton screens or spinners
- Empty states: Friendly illustrations + CTA

**Gamification Elements:**
- Achievement badges with rarity colors (common, rare, epic, legendary)
- Progress bars with smooth animations
- Streak counter with fire emoji 🔥
- Score cards with large numbers and trend indicators
- Celebration animations on milestones (Framer Motion)

### Responsive Design

**Breakpoints:**
- Mobile: < 768px (sm)
- Tablet: 768px - 1024px (md)
- Desktop: > 1024px (lg)

**Mobile Adaptations:**
- Navigation: Collapse to hamburger menu or bottom nav
- Cards: Full-width, stack vertically
- Tables: Horizontal scroll or card view
- Forms: Full-width inputs, larger touch targets (44px min)
- Charts: Simplified, key metrics only

**Desktop Enhancements:**
- Multi-column layouts (sidebar + content)
- Hover states and tooltips
- Keyboard shortcuts (future)
- Expanded charts and visualizations

### Accessibility

**WCAG AA Compliance:**
- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- All interactive elements have focus states
- Form inputs have labels (not just placeholders)
- Error messages are descriptive and actionable
- Semantic HTML (headings, landmarks, lists)

**Keyboard Navigation:**
- Tab through interactive elements in logical order
- Enter/Space to activate buttons
- Escape to close modals/dialogs
- Arrow keys for navigation menus (future)

**Screen Reader Support:**
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content (toast notifications)
- Descriptive alt text for images
- Landmarks (header, main, nav, footer)

**Motion Preferences:**
- Respect `prefers-reduced-motion` media query
- Disable animations for users who opt out
- Provide instant feedback instead of transitions

---

## Data Quality & Accuracy Standards

Given the critical importance of accurate nutritional calculations, especially with unit conversions, the following standards must be maintained:

### Unit Conversion Accuracy
1. **Weight Conversions:**
   - 1 oz (weight) = 28.3495 g (use full precision in calculations, round for display)
   - 1 lb = 453.592 g
   - Always clarify "oz" vs "fl oz" to users

2. **Volume Conversions:**
   - 1 fl oz = 29.5735 ml
   - 1 cup = 236.588 ml = 8 fl oz
   - 1 tbsp = 14.7868 ml
   - 1 tsp = 4.9289 ml

3. **Context Detection Rules:**
   - Liquids (water, milk, juice, oil) → default to volume (fl oz, ml, cups)
   - Solids (meat, vegetables, fruits, grains) → default to weight (oz, g, lb)
   - Ambiguous inputs → prompt user for clarification
   - Examples:
     - "20oz water" → interpret as 20 fl oz (volume)
     - "6oz chicken" → interpret as 6 oz weight
     - "100g chicken" → store as 100g, display oz equivalent (3.5 oz)

4. **Validation Rules:**
   - Prevent nonsensical entries (e.g., "1000g water glass")
   - Warn on unusual quantities (e.g., "50 cups oatmeal")
   - Suggest typical serving sizes when user enters atypical amounts

### Nutritional Database Standards
1. **Source Priority:**
   - USDA FoodData Central (primary reference)
   - Manufacturer nutrition labels (branded items)
   - Peer-reviewed nutritional databases
   - Never estimate or guess nutritional values

2. **Serving Size Standardization:**
   - All foods have standardized serving size in database
   - Nutritional values stored per 100g (solids) or 100ml (liquids)
   - User quantities scaled proportionally with high precision

3. **Micronutrient Coverage:**
   - Aim for complete micronutrient profiles (20+ nutrients per food)
   - Mark missing data explicitly (null vs. 0)
   - Prioritize foods with complete data for MVP database

4. **Regular Updates:**
   - Review and update nutritional data quarterly
   - Flag items needing review when new data published
   - Version database for audit trail

### Calculation Precision
1. **Internal Calculations:**
   - Use floating-point precision for all calculations
   - Never round intermediate values
   - Only round for final display to user

2. **Display Rounding:**
   - Calories: whole numbers
   - Macros: 1 decimal place (e.g., 23.5g protein)
   - Micros: contextual (vitamin C: whole numbers mg, B12: 1 decimal mcg)
   - Percentages: whole numbers (e.g., 85% DV)

3. **Aggregation Logic:**
   - Sum nutrients across all logged foods per day
   - Handle missing data gracefully (don't count as 0)
   - Flag incomplete data to user when significant

### Testing & Validation
1. **Unit Test Coverage:**
   - 100% coverage for unit conversion functions
   - Edge cases: very small amounts, very large amounts, zero
   - Boundary testing for all conversion factors

2. **Integration Testing:**
   - End-to-end logging scenarios with various units
   - Cross-verify calculations against known meal totals
   - Test AI autofill suggestions for accuracy

3. **User Acceptance Testing:**
   - Beta testers verify real meal logs against manual calculations
   - Spot-check random logs for accuracy
   - Gather feedback on confusing unit interpretations

---

## Launch Plan

### Pre-Launch (Weeks 1-4)
- Build MVP
- Test with 10-20 beta users (diverse dietary patterns)
- Refine suggestion engine based on feedback
- Finalize legal disclaimers with counsel review

### Launch (Week 5)
- Soft launch on Product Hunt, Reddit (r/nutrition, r/biohacking)
- SEO content: "How to fix iron absorption", "Gut-friendly meal ideas"
- Free tier only

### Post-Launch (Weeks 6-12)
- Gather user feedback on gap suggestions
- A/B test affiliate placement
- Introduce premium tier in week 8
- Begin wearable integration planning

---

## Appendix: Competitive Landscape

| Competitor | Strengths | Weaknesses | NutriWell Advantage |
|------------|-----------|------------|---------------------|
| **MyFitnessPal** | Huge food database, popular | Calorie-focused, weak micronutrient tracking, cluttered UI | Micronutrient depth, synergy insights, gut focus |
| **Cronometer** | Excellent micronutrient tracking | Complex UI, steep learning curve, not gut-focused | Simpler UX, gut health scoring, warm food prioritization |
| **Cara** | Gut health focus (CGM integration) | Expensive, requires CGM, narrow focus | Broader nutrient tracking, no hardware required, food synergies |
| **ZOE** | Microbiome testing, personalized | $300+ upfront, UK-focused | Immediate value, no testing required, US-friendly |

**Positioning:** *"The missing link between macro tracking and gut health — without the complexity or cost."*

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Owner:** Product Team
