# Archived Components

These components were created for **Phase 7k (Personalized Nutrition Profiles)** and **Phase 7j (Exercise Tracking)** but are not yet integrated into the application.

## Why Archived

1. **Not integrated** - These components are not imported or used in the main application
2. **TypeScript errors** - Some components have compilation errors due to incomplete implementation
3. **Production readiness** - Per PRD recommendations, cleaning these up before production deploy
4. **Future development** - These will be properly implemented when Phase 7k/7j are prioritized

## Archived Files

- `ProfileSetup.tsx` - Multi-step profile setup wizard (incomplete)
- `ProfilePopupManager.tsx` - Smart profile popup trigger system (incomplete)
- `ProfileReminder.tsx` - 7-day profile re-evaluation reminder (unused)
- `LifestyleFactorsSetup.tsx` - Caffeine, stress, medication tracking (unused)
- `ExerciseProfileSetup.tsx` - Exercise profile questionnaire (30% complete)
- `ExerciseLogger.tsx` - Exercise activity logging (not integrated)

## When to Re-implement

**After MVP launch and user feedback**, if users request:
- Personalized daily value calculations based on age/sex/activity
- Exercise and fitness tracking
- BMI and body composition monitoring

## How to Re-implement (Clean Slate Recommended)

See PRD.md "Phase 7k: Personalized Nutrition Profiles" for detailed implementation plan.

**Estimated effort:** 2-3 weeks for Phase 7k, 1-2 weeks for Phase 7j

---

**Archived:** January 2025  
**Reason:** Production deploy preparation  
**Status:** To be re-implemented when prioritized
