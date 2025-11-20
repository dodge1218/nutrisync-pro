# Wearable & Biometric Integration Plan

## Overview

This document outlines the strategy for integrating wearable devices and biometric data into NutriWell to enhance nutrient recommendations, meal timing suggestions, and personalized insights.

**Timeline:** Version 2.0 (Months 10-12 after MVP launch)

**Premium Feature:** Wearable integration will be exclusive to premium subscribers

---

## Supported Devices & Platforms

### Phase 1 (Months 10-12)

#### Apple Ecosystem
- **Apple Health (HealthKit)**
  - Data source for: iPhone, Apple Watch
  - Integration: React Native HealthKit wrapper or web-based OAuth (future native app)
  
#### Google/Fitbit Ecosystem
- **Google Fit API**
  - Data source for: Android devices, Wear OS watches
  
- **Fitbit Web API**
  - Data source for: Fitbit trackers and smartwatches (Charge, Versa, Sense)

### Phase 2 (Months 13-18)
- **Whoop API** (for advanced recovery metrics)
- **Oura Ring API** (for sleep and HRV data)
- **Garmin Health API** (for endurance athletes)

---

## Data Points to Sync

### Activity & Exercise
- **Step count** (daily total)
- **Active minutes** (moderate + vigorous)
- **Workout type & duration** (running, weightlifting, yoga, etc.)
- **Calories burned** (total daily energy expenditure estimate)

**Use Case:**
- Adjust protein recommendations on strength training days
- Increase electrolyte suggestions on high-sweat days
- Boost carb intake recommendations on high-activity days

---

### Heart Rate & HRV
- **Resting heart rate** (morning baseline)
- **Heart rate variability (HRV)** (daily average)
- **Active heart rate zones** (during workouts)

**Use Case:**
- **Low HRV = stress indicator** → suggest magnesium-rich foods, adaptogens, reduce caffeine
- **Elevated resting HR** → check electrolyte balance (potassium, magnesium)
- **Poor recovery metrics** → increase anti-inflammatory foods (omega-3, polyphenols)

---

### Sleep Quality
- **Total sleep duration** (hours)
- **Sleep stages** (deep, REM, light)
- **Sleep score** (if provided by device)

**Use Case:**
- **Poor sleep (<6 hours or low quality)** → suggest magnesium glycinate, reduce evening caffeine
- **Good sleep** → reinforce current dietary patterns
- **Timing insight:** "Your iron-rich dinner might be too close to bedtime (sleep disruption)"

---

### Weight & Body Metrics
- **Daily weight** (for trend analysis, not obsessive tracking)
- **Body composition** (if available from smart scales)

**Use Case:**
- Track correlation between dietary patterns and weight trends
- Adjust calorie/macro recommendations for goals (if user opts in)
- Not emphasized in UI to avoid triggering disordered eating

---

### Stress & Recovery (Advanced)
- **Stress score** (from HRV, respiratory rate)
- **Recovery score** (Whoop, Oura)
- **Readiness score** (Oura, Fitbit)

**Use Case:**
- **High stress / low recovery** → prioritize:
  - Magnesium-rich foods (spinach, pumpkin seeds, dark chocolate)
  - Adaptogenic foods (medicinal mushrooms, ashwagandha tea)
  - Reduce gut stressors (alcohol, NSAIDs, ultra-processed foods)
  - Warm, cooked meals for easier digestion

---

## Integration Architecture

### Technical Approach (Web App)

#### Option 1: OAuth + API Polling (MVP)
1. **User authorizes NutriWell** to access their Apple Health / Fitbit / Google Fit data via OAuth
2. **Backend service** (Vercel serverless functions or separate API) polls data daily
3. **Data stored** in user's encrypted cloud profile (premium tier)
4. **Sync frequency:** Once per day (morning refresh)

**Pros:**
- No native app required (web-only)
- Works across platforms
- Lower development cost

**Cons:**
- Requires backend infrastructure
- Cannot access real-time data

#### Option 2: Native App with HealthKit/Google Fit SDK (Future)
1. Build React Native or Swift/Kotlin native apps
2. Direct integration with device SDKs
3. Real-time data sync

**Pros:**
- Real-time data
- Better user experience
- Offline capability

**Cons:**
- Requires native app development (3-6 months additional work)
- Separate iOS and Android codebases

**Recommendation:** Start with Option 1 (web OAuth), build native app in Phase 2 if demand validates investment

---

## API Endpoints (Stubbed in MVP)

### `/api/sync-wearables`
**Method:** POST  
**Auth:** Required (premium user)

**Request:**
```json
{
  "provider": "apple_health" | "fitbit" | "google_fit",
  "authCode": "OAuth_authorization_code"
}
```

**Response:**
```json
{
  "success": true,
  "lastSync": "2024-01-15T08:00:00Z",
  "dataPoints": {
    "steps": 8234,
    "activeMinutes": 45,
    "sleepHours": 7.2,
    "hrv": 62,
    "restingHR": 58
  }
}
```

---

### `/api/wearable-data`
**Method:** GET  
**Auth:** Required (premium user)

**Query Params:**
- `startDate` (ISO 8601)
- `endDate` (ISO 8601)

**Response:**
```json
{
  "data": [
    {
      "date": "2024-01-15",
      "steps": 8234,
      "activeMinutes": 45,
      "sleepHours": 7.2,
      "hrv": 62,
      "restingHR": 58,
      "caloriesBurned": 2100
    }
  ]
}
```

---

## Enhanced Recommendations (Wearable-Informed)

### Scenario 1: High Activity Day
**Wearable Data:**
- 15,000 steps
- 90 minutes vigorous exercise
- 2,800 calories burned

**Enhanced Recommendations:**
- ⬆️ **Increase protein:** +20g to support recovery
- ⬆️ **Increase electrolytes:** Sodium, potassium, magnesium (sweat loss)
- ⬆️ **Add carbs:** +50g to replenish glycogen
- 💧 **Hydration reminder:** "Drink extra water + electrolytes today"
- 🥑 **Post-workout meal:** "Within 2 hours, eat protein + carbs (e.g., salmon + sweet potato)"

---

### Scenario 2: Poor Sleep + Low HRV
**Wearable Data:**
- 5.5 hours sleep
- HRV: 35 (below user's baseline of 60)
- Elevated resting HR: 68 (baseline: 58)

**Enhanced Recommendations:**
- 🧘 **Adrenal support focus:** "Your body is under stress—prioritize magnesium today"
- 🥗 **Magnesium-rich foods:** Add spinach, pumpkin seeds, dark chocolate
- ☕ **Reduce caffeine:** "Consider skipping afternoon coffee today"
- 🍵 **Adaptogenic tea:** Suggest chamomile, ashwagandha, or reishi mushroom
- 🥘 **Warm, easy-to-digest meals:** Soups, stews, cooked veggies (less digestive burden)
- 😴 **Evening magnesium:** "Consider magnesium glycinate 1-2 hours before bed"

---

### Scenario 3: Rest Day (Low Activity)
**Wearable Data:**
- 3,000 steps
- No workouts
- 1,800 calories burned

**Enhanced Recommendations:**
- ⬇️ **Adjust calories:** Don't force excess food—listen to hunger cues
- 🥗 **Micronutrient focus:** Prioritize nutrient-dense, lower-calorie foods (leafy greens, berries)
- 🌿 **Gut health day:** "Today's a great day to focus on fermented foods and fiber"
- 📉 **No performance pressure:** "Rest days are for repair—focus on antioxidants"

---

### Scenario 4: Strength Training Day
**Wearable Data:**
- Workout type: Strength training (60 minutes)
- Heart rate zones: 70-85% max HR

**Enhanced Recommendations:**
- 💪 **Protein timing:** "Eat 25-30g protein within 2 hours post-workout"
- 🥩 **Protein distribution:** "Spread protein across 3-4 meals today (not one giant portion)"
- 🍠 **Carbs for recovery:** Moderate carbs (sweet potato, rice, oats)
- 🦴 **Bone health:** Ensure calcium + vitamin D + magnesium (for muscle contraction/relaxation)
- 🥜 **Zinc for recovery:** Add pumpkin seeds, beef, or chickpeas

---

## User Experience Flow

### 1. Connection Setup (One-Time)
1. User navigates to **Settings → Connect Wearable**
2. Selects device: Apple Health / Fitbit / Google Fit
3. Clicks **"Authorize"** → OAuth flow opens
4. Grants permissions (activity, sleep, heart rate)
5. Redirected back to NutriWell → ✅ "Connected successfully"

### 2. Daily Sync
- **Automatic:** Data syncs every morning at 6am (user's timezone)
- **Manual:** User can tap **"Sync Now"** button in dashboard
- **Status indicator:** "Last synced 2 hours ago" with green checkmark

### 3. Enhanced Dashboard
New panels appear when wearable is connected:
- **Activity Overview:** Steps, active minutes, calories burned
- **Recovery Insights:** HRV, sleep quality, stress score
- **Personalized Adjustments:** "Based on today's workout, we adjusted your protein target to 120g"

### 4. Contextual Suggestions
Throughout the app, wearable data informs suggestions:
- 📊 **In Gap Analysis:** "Low HRV detected—prioritizing magnesium-rich foods today"
- 🍽️ **In Meal Logging:** "Post-workout meal? Log it here to optimize timing"
- 📈 **In Weekly Report:** "Your best HRV days coincided with 30g+ fiber intake—keep it up!"

---

## Privacy & Security

### Data Handling
- **Encryption:** All wearable data encrypted at rest and in transit (TLS 1.3)
- **Minimal storage:** Only store aggregated daily metrics (not minute-by-minute)
- **User control:** User can disconnect wearable and delete all synced data anytime
- **No third-party sharing:** Wearable data never shared with affiliates or advertisers

### Permissions
- **Read-only:** We never write data back to wearables
- **Granular:** Users can choose which data types to share (e.g., sleep yes, weight no)

### Compliance
- **HIPAA considerations:** While wearable data may not be PHI, we treat it as such
- **GDPR/CCPA:** Clear consent, easy data deletion, transparency in processing

---

## Development Roadmap

### Milestone 1: API Research & Prototyping (Month 10)
- [ ] Research Apple HealthKit web integration options
- [ ] Set up Fitbit and Google Fit developer accounts
- [ ] Build OAuth flow prototype
- [ ] Test data retrieval with test devices

### Milestone 2: Backend Infrastructure (Month 10-11)
- [ ] Build `/api/sync-wearables` endpoint
- [ ] Set up encrypted storage for wearable data
- [ ] Implement daily sync scheduler
- [ ] Build data normalization layer (different APIs → unified format)

### Milestone 3: Frontend Integration (Month 11)
- [ ] Add "Connect Wearable" flow to Settings
- [ ] Display wearable data in dashboard
- [ ] Show sync status and history

### Milestone 4: Enhanced Recommendation Engine (Month 11-12)
- [ ] Integrate wearable data into nutrition analysis
- [ ] Build contextual recommendation rules (e.g., low HRV → magnesium)
- [ ] Add "Recommended Adjustments" panel to dashboard

### Milestone 5: Testing & Launch (Month 12)
- [ ] Beta test with 50 users (mix of Apple Watch, Fitbit, Google Fit)
- [ ] Collect feedback on accuracy and usefulness
- [ ] Refine recommendation logic
- [ ] Public launch as premium feature

---

## Success Metrics

### Adoption
- **Target:** 20% of premium users connect a wearable within 30 days
- **Stretch:** 40% by Month 18

### Engagement
- **Daily sync rate:** 80% of connected users sync ≥5 days/week
- **Retention:** Wearable users have 50% higher retention than non-wearable users

### Value Perception
- **Survey:** "Wearable integration made recommendations more useful" (80% agree)
- **NPS:** Wearable users have +15 NPS vs. non-wearable users

### Monetization
- **Conversion:** 30% of free users upgrade to premium specifically for wearable feature
- **Churn:** Wearable users have 30% lower churn than premium users without wearables

---

## Future Enhancements (Phase 3+)

### Continuous Glucose Monitor (CGM) Integration
- Partner with Dexcom, Freestyle Libre, or Levels
- Show blood sugar response to meals
- Suggest meal timing and composition to stabilize glucose

### Biomarker Integration (Lab Results)
- Allow users to upload blood work (vitamin D, ferritin, magnesium, lipid panel)
- Automatically adjust recommendations based on clinical deficiencies
- Partner with at-home lab testing companies (Everlywell, LetsGetChecked)

### Meal Timing Optimization Engine
- Analyze user's optimal meal timing based on:
  - HRV patterns (eat earlier when HRV is higher)
  - Sleep quality (avoid late-night heavy meals)
  - Workout schedule (protein timing around exercise)
- Auto-generate personalized meal timing recommendations

### Stress & Cortisol Insights
- Integrate with stress-tracking apps (Whoop Strain, Oura Stress)
- Flag high-stress days → adjust adrenal support foods
- Suggest meal timing to avoid blood sugar crashes (cortisol spikes)

---

## Open Questions

1. **Native App Necessity:** Can we delay native app and rely on web OAuth, or is real-time data critical?
   - **Decision:** Test demand with web OAuth in Phase 1, revisit native app if users request real-time features

2. **Data Retention:** How long should we store historical wearable data?
   - **Decision:** 90 days for free, unlimited for premium (with user consent)

3. **API Costs:** Fitbit and Apple charge for API access above certain limits—what's the break-even?
   - **Decision:** Model costs in Year 2 budget; worst case, wearable feature remains premium-only to offset

4. **Accuracy Concerns:** Wearable HRV/calorie data is often inaccurate—how do we communicate this?
   - **Decision:** Add disclaimer: "Wearable data is estimated. We use it for trends, not absolute values."

---

## Conclusion

Wearable integration transforms NutriWell from a reactive tracking tool into a proactive, context-aware nutrition assistant. By syncing activity, sleep, and recovery data, we can:
- Personalize recommendations in real-time
- Detect stress and adjust suggestions accordingly
- Optimize nutrient timing for performance and recovery
- Increase user engagement and retention
- Justify premium pricing with high-value features

**Next Steps:**
1. ✅ Stub API endpoints in MVP (Month 1-3)
2. 📋 Research OAuth flows for each platform (Month 10)
3. 🔨 Build backend sync infrastructure (Month 10-11)
4. 🎨 Design wearable dashboard UI (Month 11)
5. 🚀 Launch as premium feature (Month 12)

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Owner:** Product & Engineering Team
