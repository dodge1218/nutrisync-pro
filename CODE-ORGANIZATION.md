# Code Organization Guide

This document provides an overview of the NutriWell codebase structure and organization conventions.

## 📁 Project Structure

```
/workspaces/spark-template/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components (40+ pre-built)
│   │   ├── auth/           # Authentication components
│   │   ├── pages/          # Main page components
│   │   ├── profile/        # Profile management components
│   │   └── *.tsx           # Shared components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Business logic and utilities
│   ├── data/               # Static data and configuration
│   ├── styles/             # Additional stylesheets
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── docs/                   # Additional documentation
├── PRD.md                  # Product Requirements Document
├── README.md               # Project overview
├── CLEANUP-COMPLETE.md     # Cleanup summary
└── cleanup-old-files.sh    # Cleanup script

```

## 🎯 Component Organization

### Pages (`src/components/pages/`)
Main application pages with routing:
- **Dashboard.tsx** - Overview, metrics, insights
- **LogFood.tsx** - Food logging interface
- **MealPlanner.tsx** - Weekly meal planning
- **FoodBudget.tsx** - Nutrient budget tracking
- **Recommendations.tsx** - Personalized suggestions
- **Achievements.tsx** - Gamification system
- **Education.tsx** - Educational content
- **Settings.tsx** - User preferences and profile
- **SleepSync.tsx** - Meal timing optimization
- **LifeFlow.tsx** - Time-blocked scheduling
- **ExerciseCreator.tsx** - Exercise tracking

### Shared Components (`src/components/`)
Reusable UI components:
- **Navigation.tsx** - Main navigation tabs
- **DisclaimerBanner.tsx** - Legal disclaimer
- **WelcomeFlow.tsx** - Onboarding wizard
- **TutorialOverlay.tsx** - Interactive tutorials
- **ProfileReminder.tsx** - Profile update reminders
- **StressTracker.tsx** - Stress logging interface
- **AnimatedGut.tsx** - Visual gut health indicator
- **GBDIDisplay.tsx** - Gut health score card
- **StreakTracker.tsx** - Logging streak visualization
- And more...

### UI Components (`src/components/ui/`)
shadcn/ui library components (40+ components):
- button, card, dialog, input, table, etc.
- Pre-configured with Tailwind styling
- Do not modify - use as-is

## 🔧 Library Modules (`src/lib/`)

### Core Engines
- **nutritionEngine.ts** - Nutrient analysis and calculations
- **adrenalEngine.ts** - Stress and adrenal load scoring
- **exerciseEngine.ts** - Exercise calorie calculations (MET-based)
- **mealPatternEngine.ts** - Meal prediction and cook time estimation
- **circadianEngine.ts** - Sleep-meal timing analysis
- **crossModeSynergyEngine.ts** - Multi-mode correlation detection

### Data & Configuration
- **dailyValues.ts** - RDA/DV reference values
- **personalizedDVs.ts** - Custom DV calculations (BMR, TDEE)
- **historyTracking.ts** - Historical data utilities

### User Management
- **onboardingEngine.ts** - Welcome flow logic
- **profileHistoryEngine.ts** - Body metrics tracking
- **checkInEngine.ts** - Daily check-in system

### Integrations
- **supabase.ts** - Database client configuration
- **cloudSync.ts** - Multi-device sync logic
- **dataExport.ts** - Export to JSON/CSV

## 🪝 Custom Hooks (`src/hooks/`)

- **useAuth.ts** - Authentication state and actions
- **useCloudSync.ts** - Cloud sync management
- **usePersonalizedDVs.ts** - Personalized daily values
- **use-mobile.ts** - Responsive breakpoint detection

## 🎨 Styling Convention

### Color System (oklch)
- **Background**: oklch(0.98 0.005 250) - Light cream
- **Text**: #000000 - Pure black (consistent throughout)
- **Primary**: oklch(0.50 0.20 260) - Purple
- **Secondary**: oklch(0.68 0.16 280) - Light purple
- **Accent**: oklch(0.62 0.20 330) - Pink

### Typography
- **Font Family**: Inter (all text elements)
- **Headings**: Bold (700), black color
- **Body**: Regular (400), black color
- **Tables**: 0.875rem (14px) for condensed display

### Spacing
- Cards: p-6 (1.5rem padding)
- Sections: gap-8 (2rem gap)
- Elements: gap-4 (1rem gap)

## 📦 State Management

### Persistent Storage (useKV)
Use for data that survives page refreshes:
```typescript
import { useKV } from '@github/spark/hooks'
const [value, setValue, deleteValue] = useKV('key', defaultValue)
```

### Temporary State (useState)
Use for UI state that doesn't need persistence:
```typescript
import { useState } from 'react'
const [value, setValue] = useState(defaultValue)
```

## 🔐 Authentication

- **Provider**: Supabase
- **Flow**: Email/password with verification
- **Protection**: Row Level Security (RLS) policies
- **Setup**: See `USER-TODO-SUPABASE-SETUP.md`

## 🚀 Development Workflow

### Starting Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## 📝 Coding Standards

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'

// 2. Type definitions
interface Props {
  // ...
}

// 3. Component
export default function MyComponent({ ...props }: Props) {
  // 4. Hooks (useKV first, then useState)
  const [persisted, setPersisted] = useKV('key', default)
  const [temp, setTemp] = useState(default)
  
  // 5. Effects
  useEffect(() => {}, [])
  
  // 6. Handlers
  const handleClick = () => {}
  
  // 7. JSX
  return <div>...</div>
}
```

### File Naming
- **Components**: PascalCase (MyComponent.tsx)
- **Utilities**: camelCase (myUtility.ts)
- **Constants**: UPPER_SNAKE_CASE (MY_CONSTANT)

### Import Conventions
- Use `@/` alias for `src/` directory
- Group imports: external → internal → components → styles
- No unused imports

## 🧪 Testing Strategy

### Manual Testing Checklist
- [ ] Food logging works across all meal types
- [ ] Nutrient calculations are accurate
- [ ] Auth flow completes successfully
- [ ] Cloud sync uploads and downloads data
- [ ] Mobile responsive (test at 768px breakpoint)

## 📚 Key Documentation

- **PRD.md** - Full product specification
- **CLEANUP-COMPLETE.md** - Recent cleanup details
- **USER-TODO-DEPLOYMENT.md** - Deployment guide
- **USER-TODO-SUPABASE-SETUP.md** - Database setup

## ⚠️ Important Notes

### Do Not Modify
- `src/main.tsx` - Application mount point
- `src/main.css` - System CSS file
- `vite.config.ts` - Optimized for runtime
- `src/components/ui/*` - shadcn components

### Always Include
- `id` attributes on form inputs (for persistence)
- Loading states for async operations
- Error handling with toast notifications
- TypeScript types for all props and state

### Never Use
- `localStorage` directly (use `useKV` instead)
- `alert()`, `confirm()` (use dialog components)
- Inline styles (use Tailwind classes)
- `any` type (use proper TypeScript types)

## 🎯 Performance Tips

1. **Lazy Loading**: Import heavy components with React.lazy()
2. **Memoization**: Use useMemo() for expensive calculations
3. **Debouncing**: Debounce user inputs (search, filters)
4. **Pagination**: Limit list rendering (20-50 items per page)
5. **Image Optimization**: Use appropriate formats and sizes

## 🐛 Common Issues

### Issue: "Module not found"
**Solution**: Check import path uses `@/` alias correctly

### Issue: "useKV not updating"
**Solution**: Use functional updates: `setValue(current => newValue)`

### Issue: Auth not persisting
**Solution**: Check Supabase environment variables are set

### Issue: Styles not applying
**Solution**: Rebuild Tailwind cache: `npm run dev` (restart)

## 📞 Support

For questions or issues:
1. Check PRD.md for feature specifications
2. Review CLEANUP-COMPLETE.md for recent changes
3. Consult this guide for code organization
4. Check component comments for inline documentation

---

**Last Updated**: January 2025
**Codebase Status**: ✅ Clean, Organized, Production-Ready
