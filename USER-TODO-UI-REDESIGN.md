# 🎨 UI Redesign & Modernization Plan

This document tracks the progress of the complete UI overhaul for NutriWell.

## 1. Design System & Global Styles
- [x] **Refine Color Palette**: Update `index.css` with a sophisticated dark mode palette (zinc/slate based).
- [x] **Typography Update**: Adjust font sizes and weights for better hierarchy.
- [x] **Global Components**: Update `Button`, `Card`, `Input` styles in `src/components/ui`.

## 2. Layout Architecture
- [x] **Sidebar Navigation**: Create a `Sidebar` component to replace the top header navigation.
- [x] **App Layout**: Create a `DashboardLayout` wrapper for the main app content.
- [x] **Mobile Navigation**: Implement a bottom nav or responsive sidebar for mobile.


## 3. Dashboard Redesign
- [x] **Bento Grid**: Reorganize dashboard widgets into a responsive grid.
- [x] **Summary Cards**: Redesign the "Today's Summary" cards to be cleaner.
- [x] **Charts**: Style the Recharts components to match the new theme.

## 4. Core Feature Redesigns
- [x] **Log Food Page**: Simplify the search and logging interface.
- [x] **Food Budget Page**: Modernize the progress bars and nutrient breakdown.
- [x] **LifeFlow Page**: Improve the schedule visualization.
- [x] **SleepSync Page**: Clean up the timeline view.

## 5. Polish & Animations
- [x] **Transitions**: Add smooth page transitions (via CSS variables and component updates).
- [x] **Micro-interactions**: Add subtle hover and active states (via Button/Card updates).
- [x] **Loading States**: Improve skeletons and loading spinners.
