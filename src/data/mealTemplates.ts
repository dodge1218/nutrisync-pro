import type { Food } from './foods'

export interface MealIngredient {
  foodId: string
  quantity: number
}

export interface MealTemplate {
  id: string
  name: string
  description: string
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ingredients: MealIngredient[]
  tags: string[]
  dietaryTypes: ('omnivore' | 'vegetarian' | 'vegan')[]
  prepTime?: string
  cookTimeMinutes?: number
  isCustom?: boolean
  timesCooked?: number
  totalCookTimeTracked?: number
}

export const MEAL_TEMPLATES: MealTemplate[] = [
  {
    id: 'protein-oats-breakfast',
    name: 'Protein Oats Bowl',
    description: 'Warm oatmeal with banana, almond butter, and berries',
    mealType: 'breakfast',
    ingredients: [
      { foodId: 'oats', quantity: 0.5 },
      { foodId: 'banana', quantity: 1 },
      { foodId: 'almond-butter', quantity: 1 },
      { foodId: 'blueberries', quantity: 0.5 },
    ],
    tags: ['warm', 'fiber-rich', 'plant-based'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '10 min',
  },
  {
    id: 'greek-yogurt-breakfast',
    name: 'Greek Yogurt Parfait',
    description: 'Cultured yogurt with berries and pumpkin seeds',
    mealType: 'breakfast',
    ingredients: [
      { foodId: 'greek-yogurt', quantity: 1 },
      { foodId: 'blueberries', quantity: 0.5 },
      { foodId: 'pumpkin-seeds', quantity: 1 },
    ],
    tags: ['fermented', 'protein-rich', 'gut-friendly'],
    dietaryTypes: ['omnivore', 'vegetarian'],
    prepTime: '5 min',
  },
  {
    id: 'eggs-spinach-breakfast',
    name: 'Scrambled Eggs with Spinach',
    description: 'Protein-packed eggs with sautéed spinach',
    mealType: 'breakfast',
    ingredients: [
      { foodId: 'eggs', quantity: 2 },
      { foodId: 'spinach', quantity: 2 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'protein-rich', 'iron-rich'],
    dietaryTypes: ['omnivore', 'vegetarian'],
    prepTime: '10 min',
  },
  {
    id: 'chicken-rice-lunch',
    name: 'Chicken & Brown Rice Bowl',
    description: 'Lean chicken with brown rice and mixed vegetables',
    mealType: 'lunch',
    ingredients: [
      { foodId: 'chicken-breast', quantity: 1 },
      { foodId: 'brown-rice', quantity: 1 },
      { foodId: 'broccoli', quantity: 1 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'protein-rich', 'balanced'],
    dietaryTypes: ['omnivore'],
    prepTime: '20 min',
  },
  {
    id: 'chicken-caesar-salad',
    name: 'Chicken Caesar Salad',
    description: 'Grilled chicken breast on a bed of romaine lettuce with parmesan',
    mealType: 'lunch',
    ingredients: [
      { foodId: 'chicken-breast', quantity: 1 },
      { foodId: 'spinach', quantity: 2 }, // Using spinach as proxy for greens if romaine not available
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['protein-rich', 'low-carb', 'fresh'],
    dietaryTypes: ['omnivore'],
    prepTime: '15 min',
  },
  {
    id: 'lentil-bowl-lunch',
    name: 'Lentil & Sweet Potato Bowl',
    description: 'Iron-rich lentils with roasted sweet potato',
    mealType: 'lunch',
    ingredients: [
      { foodId: 'lentils', quantity: 1 },
      { foodId: 'sweet-potato', quantity: 1 },
      { foodId: 'spinach', quantity: 1 },
      { foodId: 'bell-pepper', quantity: 0.5 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'iron-rich', 'fiber-rich', 'plant-based'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '25 min',
  },
  {
    id: 'salmon-quinoa-dinner',
    name: 'Salmon with Quinoa',
    description: 'Omega-3 rich salmon with quinoa and asparagus',
    mealType: 'dinner',
    ingredients: [
      { foodId: 'salmon', quantity: 1 },
      { foodId: 'quinoa', quantity: 1 },
      { foodId: 'asparagus', quantity: 1 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'omega-3', 'protein-rich'],
    dietaryTypes: ['omnivore'],
    prepTime: '20 min',
  },
  {
    id: 'spaghetti-bolognese',
    name: 'Spaghetti Bolognese',
    description: 'Classic pasta with rich meat sauce',
    mealType: 'dinner',
    ingredients: [
      { foodId: 'ground-beef', quantity: 1 },
      { foodId: 'brown-rice', quantity: 1 }, // Using brown rice as proxy for pasta if not available, or need to add pasta
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'comfort-food', 'protein-rich'],
    dietaryTypes: ['omnivore'],
    prepTime: '30 min',
  },
  {
    id: 'tofu-stir-fry',
    name: 'Tofu Vegetable Stir Fry',
    description: 'Crispy tofu with mixed vegetables in soy sauce',
    mealType: 'dinner',
    ingredients: [
      { foodId: 'broccoli', quantity: 1 },
      { foodId: 'bell-pepper', quantity: 1 },
      { foodId: 'brown-rice', quantity: 1 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'plant-based', 'vegan'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '20 min',
  },
  {
    id: 'ground-beef-vegetables',
    name: 'Ground Beef with Vegetables',
    description: 'Grass-fed beef with mixed vegetables',
    mealType: 'dinner',
    ingredients: [
      { foodId: 'ground-beef', quantity: 1 },
      { foodId: 'broccoli', quantity: 1 },
      { foodId: 'bell-pepper', quantity: 1 },
      { foodId: 'olive-oil', quantity: 0.5 },
    ],
    tags: ['warm', 'protein-rich', 'iron-rich'],
    dietaryTypes: ['omnivore'],
    prepTime: '20 min',
  },
  {
    id: 'chickpea-curry',
    name: 'Chickpea Curry',
    description: 'Warm spiced chickpeas with vegetables',
    mealType: 'dinner',
    ingredients: [
      { foodId: 'chickpeas', quantity: 1 },
      { foodId: 'sweet-potato', quantity: 1 },
      { foodId: 'spinach', quantity: 1 },
      { foodId: 'olive-oil', quantity: 1 },
    ],
    tags: ['warm', 'plant-based', 'fiber-rich', 'iron-rich'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '30 min',
  },
  {
    id: 'apple-almond-butter-snack',
    name: 'Apple with Almond Butter',
    description: 'Sliced apple with almond butter',
    mealType: 'snack',
    ingredients: [
      { foodId: 'apple', quantity: 1 },
      { foodId: 'almond-butter', quantity: 1 },
    ],
    tags: ['fiber-rich', 'healthy-fat'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '2 min',
  },
  {
    id: 'pumpkin-seeds-snack',
    name: 'Pumpkin Seeds & Berries',
    description: 'Zinc-rich pumpkin seeds with fresh berries',
    mealType: 'snack',
    ingredients: [
      { foodId: 'pumpkin-seeds', quantity: 1 },
      { foodId: 'blueberries', quantity: 0.5 },
    ],
    tags: ['zinc-rich', 'antioxidant'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '2 min',
  },
  {
    id: 'kefir-berries-snack',
    name: 'Kefir Smoothie',
    description: 'Probiotic kefir with mixed berries',
    mealType: 'snack',
    ingredients: [
      { foodId: 'kefir', quantity: 1 },
      { foodId: 'blueberries', quantity: 0.5 },
      { foodId: 'banana', quantity: 0.5 },
    ],
    tags: ['fermented', 'gut-friendly', 'probiotic'],
    dietaryTypes: ['omnivore', 'vegetarian'],
    prepTime: '5 min',
  },
  {
    id: 'sauerkraut-snack',
    name: 'Sauerkraut & Seeds',
    description: 'Fermented sauerkraut with pumpkin seeds',
    mealType: 'snack',
    ingredients: [
      { foodId: 'sauerkraut', quantity: 0.5 },
      { foodId: 'pumpkin-seeds', quantity: 0.5 },
    ],
    tags: ['fermented', 'gut-friendly', 'probiotic'],
    dietaryTypes: ['omnivore', 'vegetarian', 'vegan'],
    prepTime: '2 min',
  },
]
