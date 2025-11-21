# Product Requirements Document: NutriWell & Wellness Suite

**Status**: Production Ready - All Core Features Complete  
**Last Updated**: January 2025  
**Version**: 2.4

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
- [x] **Phase 7g**: GBDI history tracking with 7-day trends and insights - COMPLETE
- [x] **Phase 7h**: Multi-metric health correlations visualization - COMPLETE
- [x] **Phase 7i**: AI-powered weekly insights and recommendations - COMPLETE

### 📋 Current Sprint (Phase 7k-7l)
- [🔄] **Phase 7k**: Personalized nutrition profiles with multi-stage setup
  - [ ] Stage 1: Essential profile setup (weight, height, age, sex, activity level, primary goal)
  - [ ] Stage 2: Sleep & timing setup (triggered on first SleepSync use)
  - [ ] Stage 3: Exercise goals (integrated with Exercise Creator)
  - [ ] Stage 4: Lifestyle factors pop-up (7 days after account OR 5 logins)
  - [ ] Stage 5: Goal setting pop-up (after 7 page clicks)
  - [ ] Periodic 7-day re-evaluation system
  - [ ] Dynamic DV calculator based on profile
  - [ ] Profile history and weight tracking
- [🔄] **Phase 7l**: Gut Health UI improvements and future animation feature
  - [ ] Rename "GBDI" to "Gut Health" throughout app
  - [ ] Add calculation explanation tooltip/modal
  - [ ] Add happy/sad icons on 7-day trend graph
  - [ ] Document animated gut visualization for future implementation

### 📋 Future Enhancements (Post-MVP)
- [ ] **Phase 8**: User Authentication & Multi-User Support
- [ ] **Phase 8a**: New User Tutorial & Onboarding Flow
- [ ] **Phase 8b**: Daily Check-In Commitment System with Task History
- [ ] **Phase 8c**: LifeFlow Auto-Task Generation (common daily activities)
- [ ] **Phase 8d**: Goal Progress Tracking with Input-Based Milestones
- [ ] **Phase 8e**: Cross-Mode Synergy Detection (NutriWell ↔ SleepSync ↔ LifeFlow)
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

#### 1.8 LifeFlow - Time-Blocked Schedule Builder (🔄 ENHANCED)
**Status**: Fully implemented with intelligent meal autofill and goal tracking. Exercise creator with BMI calculation in progress. Additional enhancements planned for Phase 8c-8d.

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

- **Exercise Creator & Fitness Profile (🔄 IN PROGRESS - Phase 7j):**
  - **Comprehensive user profile questionnaire (integrated with Phase 7k):**
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

- **NutriWell Integration - Exercise Calorie Toggle (🔄 NEW - Phase 7j):**
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
  - 🔄 **Enhanced cross-mode synergy (Phase 8e):**
    - Nutrient-aware activity scheduling (high-protein breakfast → morning workout)
    - GBDI-informed stress breaks (low gut health day → schedule meditation)
    - Sleep quality feedback loop (poor sleep → suggest earlier dinner time)
    - Energy level tracking → reschedule demanding tasks
    - Bidirectional insights: "Low magnesium days correlate with missed yoga sessions"

- **Auto-Task Generation System (🔄 Phase 8c):**
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

- **Daily Check-In Commitment System (🔄 Phase 8b):**
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

#### 2.5 New User Onboarding & Tutorial (🔄 Phase 8a)
**Goal:** Reduce friction for first-time users, teach core concepts, drive early engagement

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

#### 4.9 Animated Gut Visualization (🔄 NEW - Phase 7l - FUTURE FEATURE)
**Goal:** Fun, engaging visual representation of gut health in real-time
**Status**: Planned for future implementation - animation-intensive but should aim for simplicity

- **Animated Gut Character:**
  - Pretty, friendly animated gut illustration
  - Reacts dynamically as users input foods
  - Smooth, delightful animations using Framer Motion
  - Minimalist design to keep performance high
  
- **Food Reaction System:**
  - **Happy foods (gut-supportive):**
    - Fermented foods (kefir, sauerkraut, kimchi) → gut glows with sparkles ✨
    - High-fiber foods (vegetables, legumes) → gut shows happy movement
    - Polyphenol-rich foods (berries, olive oil) → rainbow shimmer effect
    - Prebiotic foods (garlic, onions) → feeding animation with tiny beneficial bacteria icons
    - Animation: Gentle pulsing, warm colors (greens, blues), smiling expression
  
  - **Evil foods (destructive to gut biome):**
    - Ultra-processed foods → gut shows distress, darker colors
    - High sugar foods → warning flash, jittery movement
    - Gut stressors (NSAIDs, alcohol) → red warning glow
    - Lack of fiber → sluggish, sad movement
    - Animation: Choppy movement, muted/gray colors, concerned expression
  
- **Real-Time Updates:**
  - Updates immediately when user logs food
  - Smooth transitions between states (not jarring)
  - Cumulative effect: more good food → happier gut throughout the day
  - Daily reset: gut starts neutral each morning
  
- **Interaction Elements:**
  - Tap gut to see current health score
  - Hover to see tooltip: "Your gut is happy today! Keep it up!"
  - Click for detailed breakdown of what's helping/hurting
  - Optional: Feeding animation when user logs a meal
  
- **Visual Design Principles:**
  - **Simple over complex:** Avoid overwhelming animations
  - **Fun over clinical:** This should delight, not educate through fear
  - **Performance-first:** Lightweight SVG animation, no heavy assets
  - **Accessible:** Works without animation for users with motion sensitivity
  - **Responsive:** Scales beautifully on mobile and desktop
  
- **Technical Considerations:**
  - Use Framer Motion for smooth, performant animations
  - SVG-based illustration (scalable, small file size)
  - State-driven animation (gut.state: 'happy' | 'neutral' | 'struggling')
  - Preload animation states to prevent lag
  - Optional: Reduce motion respect (prefers-reduced-motion)
  
- **Placement in UI:**
  - Option 1: Dashboard widget (prominent but not intrusive)
  - Option 2: Floating widget (available across all pages)
  - Option 3: Dedicated "My Gut" page with expanded animations
  - Option 4: Food Budget page integration (reacts to nutrient gaps)
  
- **Future Enhancements:**
  - Seasonal outfits/themes for the gut character
  - Unlockable gut "skins" via achievements
  - Sound effects (gentle, optional, can be muted)
  - Weekly "gut report card" animation
  - Share gut status as image to social media

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
    unitSystem: "imperial" | "metric" | "auto",
    autoTasksEnabled: boolean,
    autoTaskCategories: string[],
  },
  demographics: { age, sex, activityLevel },
  sleepSchedule?: { wakeTime, sleepTime, targetLastMeal },
  activeGoals: [{ goalId, milestones: [...] }],
  recurringActivities: [{ name, category, days, time, duration }],
  onboardingComplete: boolean,
  tutorialProgress: { step: number, mode: string, completed: boolean },
  dismissedTooltips: string[]
}

Goal {
  id: uuid,
  title: string,
  description?: string,
  targetDate?: timestamp,
  status: "active" | "completed" | "paused",
  milestones: [
    {
      id: uuid,
      title: string,
      type: "checkbox" | "numeric" | "frequency" | "habit",
      target?: number,              // For numeric/frequency goals
      unit?: string,                // "miles", "minutes", "times", etc.
      currentProgress?: number,     // Current value for quantitative goals
      progressHistory?: [           // Historical tracking
        { date: timestamp, value: number }
      ],
      completed: boolean,
      completedAt?: timestamp
    }
  ],
  createdAt: timestamp,
  updatedAt: timestamp
}

CheckInSession {
  id: uuid,
  date: string,                     // YYYY-MM-DD
  checkInTime: timestamp,
  committedTasks: [
    {
      id: uuid,
      description: string,
      category: "goal" | "wellness" | "health" | "habit" | "productivity" | "custom",
      source: "suggested" | "user-created",
      sourceGoalId?: uuid,          // If derived from a goal
      completed: boolean,
      completedAt?: timestamp,
      deferred: boolean,            // Moved to next day
      reminder?: {
        time: string,
        enabled: boolean
      }
    }
  ],
  completionRate: number,           // 0-100
  reviewedIncompleteFromYesterday: boolean
}

CheckInHistory {
  sessions: CheckInSession[],
  stats: {
    totalSessions: number,
    averageCompletionRate: number,
    currentStreak: number,          // Consecutive days with 100% completion
    longestStreak: number,
    categoryPerformance: {          // Completion rate by category
      [category: string]: number
    },
    mostCommittedTasks: [           // Frequency analysis
      { description: string, count: number }
    ],
    mostCompletedTasks: [
      { description: string, completionRate: number }
    ]
  }
}

AutoTask {
  id: string,
  name: string,
  category: "morning" | "hygiene" | "hydration" | "evening" | "pet-care" | "household",
  defaultTime?: string,             // Relative or absolute time
  duration?: number,                // Minutes
  frequency: "daily" | "custom",
  enabled: boolean,
  customDays?: string[],            // ["monday", "wednesday", ...]
  userDeleted: boolean,             // Learning flag
  deletionCount: number             // How many times user removed this
}

CrossModeInsight {
  id: uuid,
  type: "correlation" | "recommendation" | "alert" | "celebration",
  modes: string[],                  // ["nutriwell", "sleepsync", "lifeflow"]
  title: string,
  description: string,
  metrics: {
    [metricName: string]: any      // Relevant data points
  },
  confidence: number,               // 0-100
  actionable: boolean,
  suggestedAction?: string,
  createdAt: timestamp,
  dismissed: boolean
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

### Phase 8a: New User Onboarding & Tutorial (Week 11)
**Goal:** Reduce friction for first-time users, drive early engagement

31. **Welcome Flow Implementation**
    - Create multi-step onboarding wizard
    - Profile setup (age, goals, dietary preferences)
    - Mode selection screen
    - Legal disclaimer acceptance
    - Persist onboarding completion state

32. **Interactive Tutorial System**
    - Step-by-step guided tours for each mode
    - Highlight UI elements with overlays
    - Tooltip component with positioning logic
    - Progress tracking (which steps completed)
    - Skip and replay functionality

33. **Tutorial Content Creation**
    - Write copy for all tutorial steps
    - Create tutorial state machine
    - NutriWell tutorial (5 steps)
    - SleepSync tutorial (3 steps)
    - LifeFlow tutorial (4 steps)

34. **Contextual Help System**
    - Tooltip component for first-time feature use
    - Help button icons throughout app
    - Link tooltips to tutorial replay
    - User preference storage for dismissed tooltips

35. **Empty States & Onboarding Checklist**
    - Design empty state illustrations/messages
    - Create onboarding checklist component
    - Track checklist progress in KV
    - Auto-dismiss after completion or 7 days

### Phase 8b: Daily Check-In Commitment System (Week 12)
**Goal:** Daily accountability and task completion tracking

36. **Check-In UI Components**
    - Morning check-in modal/page
    - Task suggestion algorithm
    - Task selection interface (3-5 tasks)
    - Custom task input
    - Commitment confirmation screen

37. **Task Invention Algorithm**
    - Pull from active goals → micro-actions
    - Analyze nutrient gaps → health tasks
    - Check stress levels → wellness tasks
    - Review unscheduled time → productivity tasks
    - Suggest habit-building tasks

38. **Throughout-Day Tracking**
    - Quick-check task interface
    - Swipe-to-complete gesture
    - Progress indicator widget
    - Defer to tomorrow option
    - Completion timestamp recording

39. **Historical Tracking System**
    - `check-in-history` KV store implementation
    - Calendar view component
    - Weekly/monthly completion rate charts
    - Category breakdown visualization
    - Pattern detection algorithm

40. **Insights & Accountability**
    - Review incomplete tasks at next check-in
    - Recommit option for yesterday's tasks
    - Streak tracking for perfect days
    - Achievement integration
    - Celebration animations

### Phase 8c: LifeFlow Auto-Task Generation (Week 13)
**Goal:** Automatically populate schedule with common daily activities

41. **Auto-Task Library**
    - Define common task categories
    - Morning routine tasks (brush teeth, water, stretch)
    - Hygiene tasks (shower, floss, skincare)
    - Hydration reminders (every 2-3 hours)
    - Evening routine tasks
    - Pet care tasks (if applicable)
    - Household tasks

42. **Smart Scheduling Algorithm**
    - Place morning tasks after wake time
    - Place evening tasks before sleep time
    - Distribute hydration throughout day
    - Avoid conflicts with existing activities
    - Respect user deletions (learning system)

43. **Auto-Task Settings**
    - Toggle system on/off
    - Category selection (which to auto-generate)
    - Custom timing configuration
    - Personal task additions to auto-list
    - Frequency settings per task

44. **Learning System**
    - Track which auto-tasks user deletes
    - Store deletion patterns in KV
    - Don't re-suggest frequently removed tasks
    - Adapt to user preferences over time

### Phase 7k: Personalized Nutrition Profiles & Re-evaluation System (🔄 IN PROGRESS - CURRENT)
**Goal:** Calculate personalized daily nutrient needs based on individual characteristics

54. **Comprehensive User Profile System**
    - Physical characteristics: weight, height, age, sex
    - Activity level (integrated with exercise tracking)
    - Sleep schedule: Goal sleep time, wake time (for SleepSync integration)
    - Health goals (weight loss, maintenance, gain, athletic performance)
    - Special conditions (pregnancy, lactation, vegetarian/vegan)
    - Lifestyle factors:
      - **Caffeine intake tracking:** Daily caffeine consumption for adrenal load
      - **Drug/supplement intake:** Other substances affecting health (nicotine, alcohol, medications)
      - **Stress level baseline:** Used for personalized recommendations
    - **Exercise goals:** Integrated with exercise creator
      - Current fitness level
      - Target activities and frequency
      - Weight/body composition goals
    
55. **Personalized Daily Value Calculator**
    - **Calorie needs:** Based on BMR (Basal Metabolic Rate) and activity level
      - Harris-Benedict equation for BMR calculation
      - Activity multipliers from exercise profile
      - Goal adjustments (deficit for weight loss, surplus for gain)
    - **Protein requirements:** 
      - Sedentary: 0.8g per kg body weight
      - Active/Athletes: 1.2-2.0g per kg
      - Older adults (65+): 1.0-1.2g per kg
    - **Vitamins & Minerals:** Adjusted for:
      - Age-specific RDAs (children, adults, elderly)
      - Sex-specific needs (iron for menstruating females, etc.)
      - Activity level (increased B-vitamins, magnesium for athletes)
      - Special conditions (pregnancy, lactation)
    - **Fiber:** 14g per 1000 calories consumed
    - **Hydration:** 30-35ml per kg body weight, increased for exercise
    
56. **Multi-Stage Profile Setup Strategy** (✅ NEW)
    - **Stage 1: Initial Setup (During Tutorial/Onboarding)**
      - Collects ONLY essential data needed immediately:
        - Weight, height (for BMI/BMR)
        - Age, sex (for basic RDA calculations)
        - Activity level (sedentary to very active)
        - Primary health goal (maintenance, weight loss, muscle gain, general wellness)
      - Takes <2 minutes to complete
      - Provides immediate value (personalized DVs calculated)
    
    - **Stage 2: Sleep & Timing Setup (First SleepSync use OR on-demand)**
      - Goal sleep time and wake time
      - Current sleep quality (optional)
      - Eating window preferences
      - Triggered: When user first switches to SleepSync mode
      - Dismissible but recommended
    
    - **Stage 3: Exercise Goals (First Exercise Creator use OR on-demand)**
      - Current fitness level
      - Preferred exercise types
      - Exercise frequency goals
      - Body composition targets
      - Triggered: When user first opens Exercise Creator
      - Integrated with workout generator
    
    - **Stage 4: Lifestyle Factors (Pop-up 7 days after account creation OR 5 logins, whichever is later)**
      - Caffeine intake (cups/day, timing)
      - Alcohol consumption (drinks/week)
      - Smoking/nicotine use
      - Regular medications/supplements
      - Stress level (baseline)
      - Triggered: 7 days after account OR 5 logins (whichever is later)
      - Helps refine adrenal load calculations and recommendations
      - Dismissible with "Remind me later" option
    
    - **Stage 5: Goal Setting (Pop-up after 7 page clicks)**
      - "What's one goal you're working toward?"
      - Quick goal input form
      - Suggests connecting goal to LifeFlow scheduling
      - If exercise goals not already added, prompts for exercise goals
      - Triggered: After 7 distinct page navigation clicks
      - Encourages active goal pursuit beyond nutrition
    
57. **Periodic Re-evaluation System (✅ ENHANCED)**
    - **7-day recurring reminder:** If user hasn't updated profile in 7+ days, prompt re-evaluation
    - **Quick check-in questions:**
      - "Has your weight changed?"
      - "Has your activity level changed?"
      - "Are you working toward a new fitness goal?"
      - "Any new health considerations?"
      - "How's your stress level been?" (if previously tracked)
      - "Have your exercise habits changed?" (if exercise profile exists)
    - **Smart timing:** Show prompt when user opens app, non-intrusive modal
    - **Dismissible:** Can skip if nothing changed ("All good, check back in 7 days")
    - **Snooze options:** "Remind me tomorrow" or "Skip this week"
    - **Tracks last update:** Stores `lastProfileUpdate` timestamp
    - **Visual indicator:** Subtle notification badge in Settings when update overdue
    
58. **Dynamic Daily Values Dashboard**
    - All nutrient percentages calculated against personalized DVs
    - Clear indication that values are personalized
    - "Your daily needs" vs. "General RDA"
    - Recalculates automatically when profile updates
    - Shows what factors influenced DV calculation (hover tooltip)
    
59. **Profile History & Trends**
    - Track weight changes over time
    - Monitor BMI progression
    - Adjust recommendations as profile evolves
    - Compare nutrient adequacy before/after profile updates
    - Historical activity level tracking
    - Goal progress correlation with nutrition adequacy

### Phase 8d: Enhanced Goal Progress Tracking (Week 14)
**Goal:** Input-based milestone tracking beyond checkboxes

60. **Quantitative Goal Types**
    - Numeric input milestones ("Run 5 miles")
    - Frequency counters ("Meditate 5x this week")
    - Daily habits with check-in ("8 glasses water")
    - Time-based goals (minutes, hours)
    - Custom units (pages read, pushups, etc.)

46. **Progress Input UI**
    - Input field for quantitative goals
    - Increment/decrement buttons
    - Quick-add presets (e.g., +1, +5, +10)
    - Voice input option (future)
    - Historical input log

47. **Progress Visualization**
    - Line charts showing progress over time
    - Comparison to target (on track, ahead, behind)
    - Completion predictions based on pace
    - Trend analysis (improving, steady, declining)
    - Milestone celebration animations

48. **Goal Analytics**
    - Average progress per day/week
    - Consistency score (regular vs. sporadic)
    - Correlation with other metrics (nutrient intake, stress, sleep)
    - Success factors identification
    - Recommendations for improvement

### Phase 8e: Cross-Mode Synergy Enhancement (Week 15)
**Goal:** Create intelligent connections between NutriWell, SleepSync, and LifeFlow

49. **Nutrient-Aware Scheduling**
    - High-protein breakfast → schedule morning workout
    - Low energy nutrient days → suggest lighter activities
    - Magnesium intake → correlate with stress/sleep
    - Caffeine timing → adjust activity scheduling

50. **GBDI-Informed Recommendations**
    - Low GBDI day → schedule meditation/walk
    - High ultra-processed intake → suggest cooking time next day
    - Fermented food gaps → schedule grocery shopping
    - Plant diversity low → meal planning reminder

51. **Sleep Quality Feedback Loop**
    - Poor sleep quality → suggest earlier dinner time in SleepSync
    - Late meals detected → push notifications to LifeFlow
    - Sleep debt → adjust activity intensity recommendations
    - Optimal sleep nights → identify what worked (meal timing, activities)

52. **Bidirectional Insights**
    - "Low magnesium days correlate with missed yoga sessions"
    - "Best sleep occurs when last meal before 6pm"
    - "Highest productivity on days with morning exercise"
    - "Stress spikes on days with <5 plant foods"
    - Cross-mode insight cards on dashboard

53. **Unified Dashboard Enhancements**
    - Show cross-mode connections visually
    - "Your week at a glance" - all three modes
    - Synergy alerts: "Your schedule supports your nutrition goals"
    - Conflict warnings: "Late dinner scheduled conflicts with sleep goal"
    - Unified achievement system across all modes

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
