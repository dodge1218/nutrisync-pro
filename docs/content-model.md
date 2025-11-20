# Content Model: Educational Content System

## Overview

This document defines how educational content is structured, stored, and delivered within NutriWell. Educational content helps users understand *why* certain nutrients matter, *how* to optimize absorption, and *what* practical steps to take.

**Core Principle:** Educate, don't overwhelm. Every piece of content should answer a specific user question at the moment of need.

---

## Content Categories

### 1. **Nutrient Deep Dives**
Explain what a specific nutrient does, why it matters, sources, and deficiency symptoms.

**Examples:**
- "Why Magnesium Matters for Sleep & Stress"
- "Iron: Heme vs. Non-Heme Sources"
- "Vitamin D: The Sunshine Nutrient"
- "B-Vitamins: Energy & Brain Function"
- "Omega-3 Fatty Acids: Brain & Heart Health"

### 2. **Synergy & Timing Guides**
Teach users about nutrient interactions—enhancers and inhibitors.

**Examples:**
- "Vitamin C + Iron: The Absorption Booster"
- "Why Coffee Blocks Iron Absorption"
- "Calcium & Iron: Don't Mix"
- "Protein Timing: Spread Throughout the Day"
- "Fat-Soluble Vitamins: Take with Healthy Fats"

### 3. **Gut Health Education**
Explain gut microbiome, fermented foods, fiber, and digestive wellness.

**Examples:**
- "What is the Gut Microbiome?"
- "Fermented Foods 101: Yogurt, Kefir, Sauerkraut"
- "Fiber: Soluble vs. Insoluble"
- "Polyphenols: Feeding Your Good Bacteria"
- "Ultra-Processed Foods: Gut Health Stressors"
- "Gut-Brain Axis: How Your Gut Affects Mood"

### 4. **Practical Meal Ideas**
Quick, actionable meal and snack suggestions for specific goals.

**Examples:**
- "High-Iron Breakfast Ideas"
- "Gut-Friendly Snacks Under 200 Calories"
- "Post-Workout Recovery Meals"
- "Warm, Cooked Meals for Sensitive Digestion"
- "Magnesium-Rich Dinner Recipes"

### 5. **Lifestyle & Wellness Context**
Broader wellness topics that connect to nutrition.

**Examples:**
- "Adrenal Support: Foods to Reduce Stress"
- "Sleep Hygiene & Evening Nutrition"
- "Hydration & Electrolyte Balance"
- "Inflammation: Foods That Heal"
- "Mineral Trio: Magnesium, Potassium, Calcium"

---

## Content Data Model

### TypeScript Interface

```typescript
interface EducationalCard {
  id: string                    // Unique identifier (slug-style, e.g., "vitamin-c-iron-synergy")
  title: string                 // Display title (e.g., "Vitamin C + Iron: The Absorption Booster")
  shortDescription: string      // 1-2 sentence summary for card previews
  category: ContentCategory     // One of the 5 categories above
  nutrientTags: string[]        // e.g., ["iron", "vitamin-c", "zinc"]
  keywordTags: string[]         // e.g., ["absorption", "timing", "vegetarian"]
  level: "beginner" | "intermediate" | "advanced"
  readTime: number              // Estimated minutes to read (e.g., 3)
  content: string               // Full markdown content
  tldr: string                  // Key takeaway in one sentence
  actionableSteps: string[]     // 2-4 bullet points of "what to do"
  relatedCards: string[]        // IDs of related educational cards
  createdAt: string             // ISO 8601 timestamp
  updatedAt: string             // ISO 8601 timestamp
  reviewedBy?: string           // Name of RD or expert who reviewed content (optional)
}

type ContentCategory = 
  | "nutrient-deep-dive"
  | "synergy-timing"
  | "gut-health"
  | "meal-ideas"
  | "lifestyle-wellness"
```

### Example Card: Vitamin C + Iron Synergy

```json
{
  "id": "vitamin-c-iron-synergy",
  "title": "Vitamin C + Iron: The Absorption Booster",
  "shortDescription": "Learn how adding vitamin C to iron-rich meals can triple non-heme iron absorption.",
  "category": "synergy-timing",
  "nutrientTags": ["iron", "vitamin-c"],
  "keywordTags": ["absorption", "vegetarian", "anemia", "plant-based"],
  "level": "beginner",
  "readTime": 3,
  "content": "# Vitamin C + Iron: The Absorption Booster\n\n## Why This Matters\n\nIron is essential for oxygen transport, energy production, and immune function. But here's the catch: not all iron is absorbed equally.\n\n**Heme iron** (from meat) is absorbed at 15-35%.  \n**Non-heme iron** (from plants) is absorbed at only 2-20%.\n\nFor vegetarians, vegans, or anyone eating iron-rich plants like lentils, spinach, or tofu, this low absorption rate can be frustrating.\n\n**Good news:** Vitamin C can *triple* non-heme iron absorption.\n\n## How It Works\n\nVitamin C (ascorbic acid) converts iron into a form that's easier for your intestines to absorb. It also counteracts compounds like phytates and tannins (found in grains, legumes, tea, and coffee) that normally inhibit iron absorption.\n\n## Practical Examples\n\n- **Lentil soup** + **red bell pepper** (vitamin C)\n- **Spinach salad** + **strawberries** or **orange slices**\n- **Tofu stir-fry** + **broccoli** or **tomatoes**\n- **Fortified cereal** + **kiwi** or **grapefruit**\n- **Chickpea curry** + **lemon juice** squeezed on top\n\n## How Much Vitamin C?\n\nYou don't need megadoses. Just **25-100mg of vitamin C** (the amount in half a bell pepper or one orange) is enough to significantly boost iron absorption.\n\n## What to Avoid\n\nDon't pair iron-rich meals with:\n- **Coffee or tea** (within 1 hour before or 2 hours after)\n- **High-calcium foods** (milk, cheese, yogurt) in the same meal\n- These block iron absorption.\n\n## Bottom Line\n\nIf you eat plant-based iron, always add a vitamin C source to the same meal. It's one of the easiest, most effective nutrition hacks.\n\n---\n\n*Reviewed by: Jane Doe, RD*",
  "tldr": "Pair plant-based iron (lentils, spinach) with vitamin C (peppers, citrus) to triple absorption.",
  "actionableSteps": [
    "Add bell peppers, tomatoes, or citrus to iron-rich meals",
    "Squeeze lemon juice on lentils, chickpeas, or leafy greens",
    "Avoid coffee/tea within 1 hour before or 2 hours after iron-rich meals"
  ],
  "relatedCards": [
    "iron-heme-vs-non-heme",
    "coffee-iron-conflict",
    "calcium-iron-antagonism"
  ],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "reviewedBy": "Jane Doe, RD"
}
```

---

## Content Delivery Strategy

### 1. **Contextual In-App Placement**
Educational cards appear at moments of need:

- **Gap Detection:** User is low on iron → Show "Iron: Heme vs. Non-Heme Sources"
- **Synergy Alert:** User logs lentils but no vitamin C → Show "Vitamin C + Iron: The Absorption Booster"
- **Dashboard Widget:** "Learn Something New Today" card rotates daily
- **Settings:** Full library browsable by category or search

### 2. **Smart Recommendations**
Content is recommended based on:
- **Current nutrient gaps** (e.g., low magnesium → show "Why Magnesium Matters for Sleep")
- **User profile** (vegetarian → prioritize iron/B12 content)
- **Recent logs** (lots of fermented foods → show "Gut Microbiome 101")
- **Engagement history** (what they've already read)

### 3. **Progressive Disclosure**
- **Beginner users** see simplified, actionable content
- **Intermediate users** get deeper dives into mechanisms
- **Advanced users** access research references and nuanced details

### 4. **Multi-Channel Distribution**
- **In-app:** Primary delivery method
- **Email (optional):** Weekly "Nutrition Insight" with one featured card
- **Blog (public):** Republish cards as SEO content to drive acquisition
- **Social media:** Shareable graphics with key takeaways

---

## Content Creation Workflow

### 1. **Identify User Need**
- Analyze most common nutrient gaps in user data
- Track which synergy alerts appear most often
- Survey users: "What nutrition topics confuse you?"

### 2. **Research & Outline**
- Review scientific literature (PubMed, NIH, academic sources)
- Consult with RD advisor for accuracy
- Draft outline with clear structure: Why → How → What to Do

### 3. **Write in Plain Language**
- No jargon unless explained
- Use examples and analogies
- Focus on actionable steps
- Keep reading level at 8th-10th grade

### 4. **Review & Validate**
- **RD Review:** Ensure medical accuracy, appropriate disclaimers
- **Legal Review:** Avoid medical claims, disease treatment language
- **User Testing:** Show to 3-5 beta users, gather feedback

### 5. **Publish & Iterate**
- Add to content library with metadata (tags, category, level)
- Track engagement metrics (views, time on page, "helpful" votes)
- Update content quarterly based on new research or user feedback

---

## Content Quality Standards

### ✅ Every Card Must Have:
- **Clear purpose:** Answers a specific user question
- **Actionable steps:** 2-4 bullet points of "what to do now"
- **Plain language:** No unnecessary jargon
- **Evidence-based:** Backed by science, not trends or fads
- **Disclaimers:** Where appropriate (e.g., "This is not medical advice")
- **RD review:** Validated by a registered dietitian

### ❌ Avoid:
- **Medical claims:** "This cures X disease" or "This treats Y condition"
- **Fear-mongering:** "You're deficient and in danger!"
- **Absolute language:** "Everyone must eat X" (bioindividuality matters)
- **Overpromising:** "Lose 10 lbs in 7 days by eating Y"
- **Affiliate-first content:** Don't write cards just to sell products

---

## Content Library Structure

### MVP (30 Cards)

#### Nutrient Deep Dives (10 cards)
- Iron: Heme vs. Non-Heme
- Vitamin D: The Sunshine Nutrient
- Magnesium: The Relaxation Mineral
- Vitamin C: Immune Support & More
- Calcium: Beyond Bone Health
- Zinc: Immune & Wound Healing
- B-Vitamins: Energy & Brain Function
- Omega-3: Brain, Heart, Inflammation
- Potassium: Blood Pressure & Hydration
- Fiber: Soluble vs. Insoluble

#### Synergy & Timing (8 cards)
- Vitamin C + Iron Synergy
- Coffee & Iron: The Conflict
- Calcium & Iron: Don't Mix
- Fat-Soluble Vitamins: Take with Fats
- Protein Timing: Spread Throughout Day
- Iron & Tea: Tannins Block Absorption
- Magnesium + Calcium Balance
- Vitamin K + Vitamin D Synergy

#### Gut Health (6 cards)
- What is the Gut Microbiome?
- Fermented Foods 101
- Fiber: Your Microbiome's Favorite Food
- Polyphenols: Feeding Good Bacteria
- Ultra-Processed Foods & Gut Health
- Gut-Brain Axis

#### Meal Ideas (4 cards)
- High-Iron Breakfast Ideas
- Gut-Friendly Snacks
- Post-Workout Recovery Meals
- Magnesium-Rich Dinner Recipes

#### Lifestyle & Wellness (2 cards)
- Adrenal Support Foods
- Hydration & Electrolyte Balance

---

### V1.1 (50 Total Cards)
Add:
- Meal timing optimization content
- Supplement quality guides ("How to Choose a Probiotic")
- Advanced gut health (SIBO, leaky gut education—general, not diagnostic)
- Food preparation tips (raw vs. cooked nutrients)

---

## Content Metrics & Success

### Engagement Metrics
- **View rate:** % of users who view ≥1 card per week
- **Read time:** Avg. time spent per card (target: 80% of estimated read time)
- **Completion rate:** % who scroll to bottom
- **Helpful votes:** Users can mark cards as helpful (target: 70%+ helpful)

### Impact Metrics
- **Behavior change:** Did user add suggested foods after reading synergy card?
- **Retention:** Users who read 3+ cards have higher retention (hypothesis to test)
- **NPS:** Do educational features increase NPS?

### SEO Metrics (Public Blog)
- **Organic traffic:** Monthly visits from Google to blog republished cards
- **Keyword rankings:** Track positions for target keywords (e.g., "iron absorption tips")
- **Backlinks:** Other health sites linking to our educational content

---

## Localization & Accessibility

### Future: Multi-Language Support
- Start with English (MVP)
- Add Spanish (v1.1) — large US + international market
- Consider other languages based on user demand

### Accessibility Standards
- **Screen reader friendly:** Proper heading hierarchy, alt text for images
- **Plain language:** Readable by users with varying education levels
- **Font size:** Adjustable for vision-impaired users
- **Color contrast:** WCAG AA compliant (4.5:1 ratio)

---

## Content Roadmap

### Phase 1 (Months 1-3): MVP Library
- Write 30 foundational cards
- RD review all content
- Publish in-app with contextual delivery

### Phase 2 (Months 4-6): Blog + SEO
- Republish cards to public blog
- Optimize for SEO (keywords, meta descriptions, internal linking)
- Start ranking for target keywords

### Phase 3 (Months 7-9): Advanced Content
- Add 20 more cards (meal timing, advanced gut health, supplement quality)
- Create video explainers for top 5 cards (YouTube)
- Add "Ask a Dietitian" feature (Q&A with RD advisor, recorded as content)

### Phase 4 (Months 10-12): Personalization
- Use ML to recommend cards based on user behavior
- A/B test content formats (text vs. infographics vs. video)
- Build "Learning Path" feature (e.g., "Gut Health 101" → 5-card sequence)

---

## Open Questions

1. **User-Generated Content?** Should users be able to submit meal ideas or tips?
   - **Decision (MVP):** No. Focus on expert-created, RD-reviewed content. Revisit in v2 with moderation.

2. **Video vs. Text?** Should we invest in video explainers?
   - **Decision:** Start with text (faster, cheaper). Add video in v1.1 if engagement data shows demand.

3. **Content Update Frequency?** How often should we refresh cards with new research?
   - **Decision:** Quarterly review of top 10 most-viewed cards. Annual review of full library.

4. **Paywalled Content?** Should advanced cards be premium-only?
   - **Decision (MVP):** All educational content is free. Drives acquisition and trust. Premium value is in analysis features, not education.

---

## Conclusion

Educational content is a core differentiator for NutriWell. By teaching users *why* nutrients matter and *how* to optimize them, we:
- Build trust and authority
- Increase engagement and retention
- Drive SEO traffic (public blog)
- Reduce support burden (users self-educate)
- Create a moat (high-quality content is hard to replicate)

**Next Steps:**
1. ✅ Define content model and structure (this doc)
2. 📝 Write first 10 cards (Months 1-2)
3. 🩺 RD review and approval (Month 2)
4. 🚀 Publish in-app with contextual delivery (Month 3)
5. 📈 Track engagement and iterate (Months 3-6)

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Owner:** Content & Product Team
