# Product Requirements Document: NutriWell

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
- **Quick presets:** "usual breakfast", "usual lunch", "copy yesterday"
- **Simple meal buttons:** "add a fruit", "add fermented food", "add greens"
- **Timestamp tracking:** For meal timing analysis (future)

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
- **Gut health markers:**
  - Fermented food presence (y/n)
  - Fiber grams
  - Polyphenol-rich foods
  - Ultra-processed flag
  - Plant food diversity count

#### 4. Gap Detection & Scoring
- **Daily Value (DV) comparison:** Show % of DV achieved for each nutrient
- **Color-coded status:**
  - 🟢 Green: ≥80% DV
  - 🟡 Yellow: 50-79% DV
  - 🔴 Red: <50% DV
- **Gut Support Score:** 0-100 based on fiber, fermented foods, diversity, ultra-processed burden
- **Adrenal Load Score:** Based on caffeine, sugar spikes, ultra-processed foods (future refinement)

#### 5. Wellness Audit Lenses
- **GBDI (Gut-Brain-Digestive Index):** Composite score
- **Adrenal Load:** Caffeine + refined sugar + stress markers
- **Warm vs. Cold:** Preference for cooked/room-temp foods (digestibility)
- **Fermented/Probiotic Frequency:** Track 2x/week target
- **Timing Conflicts:**
  - Coffee near iron-rich meal (−30 min to +60 min)
  - High calcium + iron in same meal
- **Mineral Trio Sufficiency:** Magnesium + potassium + calcium balance
- **Gut Stressors:** NSAIDs mention, ultra-processed food %, alcohol
- **User Staples Compliance:**
  - Liver 2-3x/week
  - Cultured dairy 2x/week
  - Pumpkin seeds daily

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
- **/lib/nutritionEngine.ts** — Core analysis logic
- **/lib/dailyValues.ts** — Reference DV constants
- **/lib/synergies.ts** — Nutrient pairing rules
- **/lib/affiliate.ts** — Product matching logic
- **/data/foods.ts** — Mock food database with nutrients

### Data Model
```typescript
Food {
  id, name, servingSize, calories,
  protein, carbs, fat, fiber,
  vitamins: { C, D, A, E, K, B12, ... },
  minerals: { iron, zinc, calcium, magnesium, potassium },
  electrolytes: { sodium, potassium, magnesium },
  tags: ["fermented", "polyphenol-rich", "ultra-processed", "warm-suitable"],
  gutStressors: boolean
}

UserLog {
  timestamp, food, quantity, mealType
}

UserProfile {
  staples: { liver: "2-3x/week", culturedDairy: "2x/week", pumpkinSeeds: "daily" },
  preferences: { warmFoods: true, showSupplements: false },
  demographics: { age, sex, activityLevel }
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
   - **Decision:** Start with curated 100-food mock database, migrate to API in v1.1

3. **Affiliate Partners:** Which brands to partner with?
   - **Decision:** Start with Amazon Associates (broad), add specialized brands (Thorne, Garden of Life) in v1.1

4. **Freemium Limits:** How much to give away free?
   - **Decision:** Free = 7-day lookback, 3 gap suggestions/day. Premium = unlimited history, full suggestions, wearables.

---

## Design Principles

1. **Calm, Not Chaotic:** Soft colors, generous spacing, no alarm bells
2. **Food First, Products Second:** Always prioritize whole food solutions
3. **Warm & Digestible:** Default to cooked/room-temp suggestions
4. **Educate, Don't Nag:** Explain *why* (synergy), not just *what* (eat more X)
5. **Respect User Rituals:** Honor staples like liver, cultured dairy, pumpkin seeds
6. **Transparency:** Clear disclaimers, honest about limitations, visible affiliate links

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
