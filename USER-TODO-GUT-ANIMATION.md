# Gut Health Animation 2.0 - Implementation Plan

**Goal:** Transform the "Animated Gut" from a simple status indicator into a core, immersive feature that visualizes the user's microbiome health and digestion in real-time.

## 📋 Phase 1: Visual Redesign & Core Mechanics
- [x] **Redesign "Empty Gut" Icon**
  - [x] Create a more polished, organic SVG shape for the gut container.
  - [x] Design a "waiting/hungry" state that is engaging, not just empty.
  - [x] Ensure the shape can accommodate floating particles/icons.

- [x] **"Inside the Gut" Visualization Engine**
  - [x] Implement a physics-based or semi-random floating system for food particles.
  - [x] Create distinct visual representations for different food types:
    - 🟢 **Fiber/Prebiotics:** Glowing green orbs/leaves.
    - 🟣 **Polyphenols:** Purple sparks/berries.
    - 🦠 **Fermented Foods:** Active, bubbling particles (probiotics).
    - 🔴 **Ultra-Processed:** Jagged, slow-moving or "sludge" particles.
    - ⚪ **Neutral:** Simple bubbles.
  - [x] Implement "crowding" logic: As more food is logged, the gut fills up visually.

- [x] **3-Day Persistence Logic**
  - [x] Update `AnimatedGut` component to accept a history of food logs (last 72 hours).
  - [x] Implement a "digestion decay" visual:
    - Recent foods (0-4 hours): Large, distinct icons.
    - Digested foods (4-24 hours): Smaller particles.
    - Microbiome fuel (24-72 hours): Background glow/texture.

## 🚀 Phase 2: Interaction & Feedback Loops
- [ ] **"Feed Your Gut" Animation Trigger**
  - [ ] Create a global event/context for "Food Logged".
  - [ ] When food is logged (from LogFood or QuickAdd), trigger a full-screen or modal overlay.
  - [ ] Animation: Food icon "falls" into the gut container and bursts into relevant particles.
  - [ ] Haptic feedback (if supported) or sound effect.

- [ ] **Real-Time Feedback Messages**
  - [ ] Dynamic captions based on input:
    - "Yum! The microbiome loves fiber."
    - "Oof, that's a lot of sugar. Maybe some kimchi next?"
    - "Perfect combo! (Iron + Vitamin C)"

## 🛠 Phase 3: Demo & Preview Mode
- [x] **"Preview Animation" Feature**
  - [x] Add a "Demo Mode" toggle in Settings or Dev Tools.
  - [x] Create a "Feed Me" button in the Gut Health view to instantly add random "good" or "bad" foods to see the reaction.
  - [x] **Example Foods Set:**
    - Kimchi (Explosion of good bacteria)
    - Pizza (Grease/sludge effect)
    - Apple (Fiber glow)

## 📅 Sprint Plan (Top Priority)

### Day 1: Visuals & Physics
- Design new SVG assets.
- Set up Framer Motion layout for floating particles.

### Day 2: Logic & Persistence
- Connect to `foodLogs` store.
- Implement the 72-hour filter and "decay" logic.

### Day 3: Integration & Polish
- Wire up the "Food Logged" trigger.
- Add the "Demo/Preview" buttons.
- Final tuning of animations.
