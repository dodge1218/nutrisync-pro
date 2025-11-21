# Next Phase: Future Enhancement Todos

**Current Status**: All Phase 8 complete - MVP is 100% production-ready  
**Last Updated**: January 2025  
**Next Phase**: TBD based on user feedback

---

## Overview

The NutriWell application has successfully completed all MVP features through Phase 8e. The following items are **optional future enhancements** that should be prioritized based on user feedback and engagement data after launch.

---

## 📋 Phase 9: Optional Future Enhancements

### Priority 1: User-Requested Features
**Trigger**: Build only if users explicitly request these features

#### Phase 7k: Personalized Nutrition Profiles
**Status**: NOT STARTED (archived scaffolding exists but not integrated)

**Components Needed**:
- [ ] ProfileSetup.tsx - Multi-stage profile wizard
- [ ] ProfilePopupManager.tsx - Smart trigger system
- [ ] ProfileReminder.tsx - 7-day re-evaluation
- [ ] LifestyleFactorsSetup.tsx - Caffeine/stress/medication tracking
- [ ] Personalized DV calculator integration

**Estimated Effort**: 2-3 weeks clean implementation

**User Signals to Build**:
- "How do I customize daily values for my age/activity level?"
- "Recommendations don't fit my needs"
- Requests for pregnancy/athlete/elderly-specific calculations

**Implementation Notes**:
- DO NOT use archived components (they have TS errors)
- Start fresh with simple, focused UI
- Refer to PRD.md lines 2080-2196 for detailed specs
- Test thoroughly before integration

---

#### Phase 7j: Exercise Creator & Fitness Tracking
**Status**: PARTIALLY IMPLEMENTED (~30% complete, archived)

**Components Exist**:
- ExerciseProfileSetup.tsx - Needs testing
- ExerciseLogger.tsx - Needs integration
- `/lib/exerciseEngine.ts` - MET calculations exist

**Remaining Work**:
- [ ] Complete MET-based calorie calculations
- [ ] Integrate exercise schedule with LifeFlow
- [ ] Add progress tracking and history
- [ ] Test BMI calculation accuracy
- [ ] Polish UI and user experience
- [ ] Connect to Food Budget (net calories)

**Estimated Effort**: 1-2 weeks

**User Signals to Build**:
- "Can I track exercise?"
- "I want to see calories burned vs consumed"
- Fitness-focused user segment emerges

---

### Priority 2: Advanced Features

#### Phase 10: Enhanced Synergy Detection
**Ideas**:
- [ ] More sophisticated correlation algorithms
- [ ] Predictive insights ("You're trending toward magnesium deficiency")
- [ ] Automated A/B testing of recommendations
- [ ] Machine learning for pattern recognition

**Estimated Effort**: 3-4 weeks

---

#### Phase 11: Performance Optimization
**Ideas**:
- [ ] Virtualized lists for very long histories
- [ ] Service worker for offline functionality
- [ ] Lazy loading of chart libraries
- [ ] Bundle size optimization

**Estimated Effort**: 1-2 weeks

---

#### Phase 12: Wearable Integration
**Ideas**:
- [ ] Apple Health sync (sleep, activity, heart rate)
- [ ] Fitbit integration
- [ ] Whoop integration
- [ ] Automated meal timing from sleep data

**Estimated Effort**: 4-6 weeks (requires native APIs)

---

### Priority 3: User Authentication (Phase 8 - Auth)
**Status**: NOT STARTED

**Requirements**:
- [ ] Supabase or Firebase setup
- [ ] Login/signup UI
- [ ] Multi-device sync
- [ ] Developer data isolation
- [ ] Migration from spark.kv to cloud DB
- [ ] Data export/deletion (GDPR)

**Estimated Effort**: 3-4 weeks

**User Signals to Build**:
- Requests for multi-device access
- "Can I access this on my phone and laptop?"
- Need for data backup/recovery

**Important**: Developer health data MUST be isolated from user analytics

---

## Current Phase: Phase 9 (Post-Launch)

### Immediate Next Steps (After Launch)

1. **Monitor User Engagement** (Week 1-2)
   - Track daily active users
   - Monitor feature usage (which pages most visited)
   - Identify drop-off points
   - Collect qualitative feedback

2. **Address Quick Wins** (Week 3-4)
   - Fix any UX confusion reported by users
   - Add tooltips for commonly asked questions
   - Optimize slow features
   - Improve mobile experience based on feedback

3. **Gather Feature Requests** (Week 5-8)
   - Survey users on missing features
   - Prioritize Phase 7k vs 7j vs Auth vs other
   - Determine what blocks user goals most
   - Build roadmap based on data, not assumptions

4. **Iterate on MVP** (Ongoing)
   - A/B test recommendation algorithms
   - Refine GBDI scoring based on user understanding
   - Improve AI insights quality
   - Enhance tutorial based on completion rates

---

## Decision Framework for New Features

Before building ANY feature in this list, ask:

1. **How many users requested this?** (Need 10+ explicit requests)
2. **Does it solve a blocker?** (Users can't achieve goals without it)
3. **Can we test demand first?** (Add "coming soon" button, measure clicks)
4. **What's the opportunity cost?** (What won't get built if we do this?)
5. **Is there a simpler solution?** (Can we achieve 80% value with 20% effort?)

---

## Non-Priority Items (Do NOT Build Unless Critical)

- ❌ Social features (sharing, friends, leaderboards)
- ❌ Recipe generator (too complex, low ROI)
- ❌ Restaurant database (use simple manual entry)
- ❌ Meal photo analysis (expensive API, accuracy issues)
- ❌ Voice logging (nice-to-have, not essential)
- ❌ Advanced analytics dashboard (for power users only)

---

## How to Use This Document

**For New Features**:
1. Check if it's listed here
2. Review estimated effort
3. Confirm user signals are present
4. Get team/stakeholder approval
5. Create implementation plan
6. Update PRD.md with new phase

**For Bug Fixes**:
- Create issues directly, don't wait
- Priority: P0 (broken feature) → P1 (UX issue) → P2 (nice-to-have)

**For Performance**:
- Profile first, optimize second
- Target metrics: <2s page load, 60fps animations
- Don't optimize prematurely

---

## Success Criteria Before Building New Features

Wait until MVP achieves:
- ✅ 100+ daily active users
- ✅ 40% 7-day retention rate
- ✅ 60% daily logging rate
- ✅ 4+ weeks of production stability
- ✅ Clear feature request patterns

Then revisit this document and prioritize.

---

**Philosophy**: Ship, learn, iterate. Don't build features users don't need.

**Maintained by**: Product Team  
**Review Frequency**: Monthly after launch
