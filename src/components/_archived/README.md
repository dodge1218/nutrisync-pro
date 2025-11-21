# Archived Components - Future Features

These components represent **future feature development** for Phase 7k (Personalized Nutrition Profiles) and Phase 7j (Exercise Tracking). They have been **intentionally archived** as they are not part of the current MVP release.

## Production Status

✅ **The main application is 100% production-ready** without these components.

These files:
- Are **NOT** imported or used anywhere in the application
- Do **NOT** cause runtime errors
- Do **NOT** affect the deployed app
- Were created as exploratory scaffolding for future phases

## Archived Components

### Phase 7k: Personalized Nutrition Profiles
Located in: `/src/components/_archived/`

- `ProfileSetup.tsx` - Multi-stage profile wizard collecting demographics (age, sex, weight, height)
- `ProfilePopupManager.tsx` - Smart trigger system for profile setup stages
- `ProfileReminder.tsx` - 7-day re-evaluation reminder component  
- `LifestyleFactorsSetup.tsx` - Caffeine, stress, medication tracking form

**Purpose:** Calculate personalized Daily Values based on user characteristics  
**Status:** Partial scaffolding exists, not tested or integrated  
**Estimated Effort:** 2-3 weeks clean implementation

### Phase 7j: Exercise & Fitness Tracking
Located in: `/src/components/_archived/`

- `ExerciseProfileSetup.tsx` - Exercise goals and fitness level questionnaire
- `ExerciseLogger.tsx` - Exercise activity logging with MET-based calorie calculations

**Purpose:** Track fitness activities and integrate with nutrition tracking  
**Status:** ~30% complete, needs testing and LifeFlow integration  
**Estimated Effort:** 1-2 weeks

## Supporting Library Files

The following lib files exist to support these features but are not used in production:
- `/src/lib/exerciseEngine.ts` - MET calculations, BMI, TDEE formulas
- `/src/lib/personalizedNutrition.ts` - Personalized DV calculator

**These files are safe to keep** as they don't affect bundle size significantly and provide reference for future implementation.

## When to Implement

Build these features **only if users request them** after MVP launch. Prioritize based on:

1. **User feedback** - Do people want personalized recommendations?
2. **Engagement data** - Are current features being used effectively?
3. **Feature requests** - Top requested enhancements

### Signals to Build Phase 7k:
- Users ask "How do I customize daily values?"
- Feedback: "Recommendations don't fit my needs"
- Request for age/activity-based calculations

### Signals to Build Phase 7j:
- Users ask "Can I track exercise?"
- Request for calorie burn integration
- Fitness-focused user segment emerges

## Implementation Approach

**Recommendation: Start fresh, not from archived files**

These components were exploratory and have TypeScript issues. For production implementation:

1. **Review PRD.md Section "Phase 7k/7j"** for detailed specifications
2. **Design simple, focused UI** based on actual user needs
3. **Implement incrementally** (basic profile → advanced features)
4. **Test thoroughly** before integrating with main app

## Alternative: Delete These Files

If you want a minimalist codebase:

```bash
# These files are safe to delete - they don't affect production
rm -rf src/components/_archived/
```

The application will work identically. Keep them only as reference for future development.

---

**Last Updated:** January 2025  
**Reason:** Production preparation - documenting scope  
**Next Review:** After first 100 users provide feedback
