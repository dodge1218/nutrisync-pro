export interface WellnessSupplement {
  id: string
  name: string
  description: string
  category: 'beverage' | 'activity' | 'supplement' | 'practice'
  bestFor: ('breakfast' | 'lunch' | 'dinner' | 'snack')[]
  icon?: string
}

export const WELLNESS_SUPPLEMENTS: WellnessSupplement[] = [
  {
    id: 'herbal-tea-chamomile',
    name: 'Chamomile Tea',
    description: 'Calming herbal tea for relaxation and digestion',
    category: 'beverage',
    bestFor: ['breakfast', 'snack', 'dinner']
  },
  {
    id: 'herbal-tea-peppermint',
    name: 'Peppermint Tea',
    description: 'Refreshing tea that aids digestion and focus',
    category: 'beverage',
    bestFor: ['breakfast', 'lunch', 'snack']
  },
  {
    id: 'herbal-tea-ginger',
    name: 'Ginger Tea',
    description: 'Warming tea that supports digestion and immunity',
    category: 'beverage',
    bestFor: ['breakfast', 'lunch', 'snack']
  },
  {
    id: 'green-tea',
    name: 'Green Tea',
    description: 'Antioxidant-rich tea for energy and focus',
    category: 'beverage',
    bestFor: ['breakfast', 'lunch', 'snack']
  },
  {
    id: 'water-reminder',
    name: 'Glass of Water',
    description: 'Stay hydrated - aim for 8 glasses daily',
    category: 'beverage',
    bestFor: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  {
    id: 'lemon-water',
    name: 'Warm Lemon Water',
    description: 'Alkalizing drink to support digestion',
    category: 'beverage',
    bestFor: ['breakfast']
  },
  {
    id: 'walk-10min',
    name: '10-Minute Walk',
    description: 'Brief walk to aid digestion and boost mood',
    category: 'activity',
    bestFor: ['lunch', 'dinner']
  },
  {
    id: 'walk-15min',
    name: '15-Minute Walk',
    description: 'Moderate walk for digestion and mental clarity',
    category: 'activity',
    bestFor: ['lunch', 'dinner']
  },
  {
    id: 'sunlight-exposure',
    name: '10 Minutes of Sunlight',
    description: 'Natural vitamin D and circadian rhythm support',
    category: 'activity',
    bestFor: ['breakfast', 'lunch']
  },
  {
    id: 'deep-breathing',
    name: 'Deep Breathing (5 min)',
    description: 'Calm your nervous system and reduce stress',
    category: 'practice',
    bestFor: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  {
    id: 'stretching',
    name: 'Light Stretching',
    description: 'Gentle movement to improve circulation',
    category: 'activity',
    bestFor: ['breakfast', 'lunch', 'snack']
  },
  {
    id: 'meditation-5min',
    name: '5-Minute Meditation',
    description: 'Mindful moment to reduce stress',
    category: 'practice',
    bestFor: ['breakfast', 'lunch', 'dinner']
  },
  {
    id: 'apple-cider-vinegar',
    name: 'Apple Cider Vinegar Shot',
    description: '1 tbsp in water to support digestion',
    category: 'supplement',
    bestFor: ['breakfast', 'lunch', 'dinner']
  },
  {
    id: 'probiotic',
    name: 'Probiotic Supplement',
    description: 'Support gut microbiome health',
    category: 'supplement',
    bestFor: ['breakfast']
  },
  {
    id: 'omega3',
    name: 'Omega-3 (Fish Oil)',
    description: 'Anti-inflammatory essential fatty acids',
    category: 'supplement',
    bestFor: ['breakfast', 'lunch']
  },
  {
    id: 'vitamin-d3',
    name: 'Vitamin D3',
    description: 'Support bone health and immunity',
    category: 'supplement',
    bestFor: ['breakfast']
  },
  {
    id: 'magnesium',
    name: 'Magnesium Supplement',
    description: 'Support relaxation and muscle function',
    category: 'supplement',
    bestFor: ['dinner']
  },
  {
    id: 'turmeric-golden-milk',
    name: 'Golden Milk (Turmeric)',
    description: 'Anti-inflammatory warm beverage',
    category: 'beverage',
    bestFor: ['dinner', 'snack']
  },
  {
    id: 'bone-broth',
    name: 'Bone Broth',
    description: 'Gut-healing collagen-rich beverage',
    category: 'beverage',
    bestFor: ['lunch', 'dinner', 'snack']
  },
  {
    id: 'posture-check',
    name: 'Posture Check',
    description: 'Take a moment to correct your posture',
    category: 'practice',
    bestFor: ['lunch', 'snack']
  },
  {
    id: 'gratitude-moment',
    name: 'Gratitude Practice',
    description: 'Reflect on 3 things you\'re grateful for',
    category: 'practice',
    bestFor: ['breakfast', 'dinner']
  },
  {
    id: 'nature-connection',
    name: 'Step Outside',
    description: 'Connect with nature for 5 minutes',
    category: 'activity',
    bestFor: ['lunch', 'snack']
  }
]
