# Next Steps: Profile System & Gut Health UI

## Summary of Current State

### ✅ Already Implemented (Phase 7l - Gut Health UI)
1. **Renamed to "Gut Health"** throughout the app
   - `GBDIDisplay.tsx` now shows "Gut Health Score" 
   - `GBDIHistory.tsx` now shows "Gut Health Trend"
   
2. **Calculation explanation tooltips** are present
   - Info icons with detailed breakdown of scoring components
   - Shows fiber (25%), fermented foods (20%), plant diversity (20%), etc.
   
3. **Happy/sad icons on 7-day trend graph**
   - 😊 Smiley icon for scores ≥70 (green)
   - 😐 Neutral icon for scores 50-69 (yellow)
   - 😔 Frown icon for scores <50 (red)
   - Icons display directly on trend line at each data point

4. **Animated gut visualization** documented in PRD for future implementation

### ✅ Partially Implemented (Phase 7k - Personalized Profiles)
1. **Existing Components:**
   - `ProfileSetup.tsx` - Essential profile setup form
   - `ProfileReminder.tsx` - 7-day re-evaluation reminder system
   - `LifestyleFactorsSetup.tsx` - Caffeine, stress, medications tracking
   - `ExerciseProfileSetup.tsx` - BMI calculation and fitness profile
   - `personalizedNutrition.ts` - Dynamic DV calculator

2. **What Still Needs Implementation:**
   - Multi-stage popup trigger system (Stage 1-5 with conditions)
   - Integration between profile stages and app flow
   - Lifecycle tracking (account creation date, login count, page clicks)
   - Exercise Creator pre-fill from Stage 1 profile data
   - Goal setting popup after 7 page clicks

## Recommended Next Implementation Steps

### Step 1: Fix ProfilePopupManager.tsx TypeScript Errors
The new `ProfilePopupManager.tsx` component has type errors that need resolving:
- Ensure all `setPopupState` calls return complete `PopupState` objects
- Handle `undefined` cases properly with null coalescing
- Match existing type definitions from `personalizedNutrition.ts`

###Step 2: Integrate ProfilePopupManager into App.tsx
Add the popup manager to the main app to trigger multi-stage prompts:
```typescript
// In App.tsx
import ProfilePopupManager from './components/ProfilePopupManager'

// Inside App component:
<ProfilePopupManager 
  appMode={mode}
  onPageClick={() => {}} 
/>
```

### Step 3: Implement Stage-Specific Triggers
- **Stage 1 (Essential Profile)**: Show on first app launch if no profile exists
- **Stage 2 (Sleep & Timing)**: Trigger when user switches to SleepSync mode for first time
- **Stage 3 (Exercise Goals)**: Trigger when user opens Exercise Creator for first time
- **Stage 4 (Lifestyle Factors)**: Pop up 7 days after account creation OR 5 logins (whichever is later)
- **Stage 5 (Goal Setting)**: Pop up after 7 page navigation clicks

### Step 4: Track User Lifecycle Metrics
Store in KV:
```typescript
{
  firstLaunchTimestamp: number,
  loginCount: number,
  pageClickCount: number,
  profileStage1Complete: boolean,
  profileStage2Complete: boolean,
  // ... etc
}
```

### Step 5: Exercise Creator Integration
Update `ExerciseProfileSetup.tsx` to:
- Check if Stage 1 profile exists
- Pre-fill weight, height, age, sex from main profile
- Sync changes back to main profile for DV calculations
- Show "Profile already set up!" message if data exists

### Step 6: Goal Creation Integration
After Stage 5 goal input:
- Save goal to LifeFlow goal system
- Create initial milestones
- Link to LifeFlow scheduling
- Show success confirmation with next steps

## Files That Need Attention

1. **`/src/components/ProfilePopupManager.tsx`** (NEW - needs TS fixes)
   - Fix type errors with PopupState updates
   - Ensure all branches return valid PopupState objects
   
2. **`/src/components/ProfileSetup.tsx`** (EXISTS - needs review)
   - Check if it's compatible with popup manager integration
   - Verify all required fields are captured
   
3. **`/src/components/ExerciseProfileSetup.tsx`** (EXISTS - needs enhancement)
   - Add profile pre-fill logic
   - Add bidirectional sync with main profile
   
4. **`/src/App.tsx`** (EXISTS - needs ProfilePopupManager added)
   - Import and render ProfilePopupManager
   - Pass appropriate props (appMode, page click handler)
   
5. **`/src/lib/personalizedNutrition.ts`** (EXISTS - verify types)
   - Ensure UserNutritionProfile type includes all needed fields
   - Add any missing fields for Stage 4-5

## Testing Checklist

Once implemented, test:
- [ ] Stage 1 shows on first launch
- [ ] Profile data persists correctly
- [ ] Stage 2 triggers when switching to SleepSync
- [ ] Stage 4 triggers after 7 days OR 5 logins
- [ ] Stage 5 triggers after 7 page clicks
- [ ] Exercise Creator pre-fills from profile
- [ ] Changes in Exercise Creator update main profile DVs
- [ ] 7-day re-evaluation reminder shows correctly
- [ ] Profile updates recalculate daily values
- [ ] All popups are dismissible
- [ ] Popups don't re-trigger after completion

## Phase 7l (Gut Health UI) - COMPLETE ✅

All Phase 7l tasks are complete:
- ✅ Renamed "GBDI" to "Gut Health"
- ✅ Added calculation explanation tooltips
- ✅ Added happy/sad icons on 7-day trend graph
- ✅ Documented animated gut visualization for future

**Phase 7l can be marked as complete in PRD.md**

## Phase 7k (Personalized Profiles) - IN PROGRESS 🔄

Remaining tasks:
- [ ] Complete ProfilePopupManager implementation
- [ ] Fix TypeScript errors
- [ ] Integrate into App.tsx
- [ ] Test all trigger conditions
- [ ] Verify Exercise Creator integration
- [ ] Test goal creation flow

**Estimated time to complete:** 2-4 hours of focused development
