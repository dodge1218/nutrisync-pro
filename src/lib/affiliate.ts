import type { NutrientGap } from './nutritionEngine'

export interface AffiliateProduct {
  id: string
  name: string
  category: 'probiotic' | 'vitamin' | 'mineral' | 'electrolyte' | 'fiber' | 'omega-3' | 'multi'
  fillsNutrientGap: string[]
  description: string
  price: string
  link: string
  commissionInfo: string
}

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: 'magnesium-glycinate',
    name: 'Magnesium Glycinate 400mg',
    category: 'mineral',
    fillsNutrientGap: ['magnesium'],
    description: 'Highly absorbable magnesium for sleep, stress relief, and muscle relaxation. Glycinate form is gentle on digestion.',
    price: '$22-28',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'vitamin-d3-k2',
    name: 'Vitamin D3 + K2 Combo',
    category: 'vitamin',
    fillsNutrientGap: ['vitaminD', 'vitaminK'],
    description: 'D3 for immune and bone health, paired with K2 for optimal calcium utilization. Essential for those with limited sun exposure.',
    price: '$18-25',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'probiotic-broad-spectrum',
    name: 'Broad Spectrum Probiotic (30B CFU)',
    category: 'probiotic',
    fillsNutrientGap: [],
    description: '10+ probiotic strains to support gut diversity, digestion, and immune function. Shelf-stable, no refrigeration needed.',
    price: '$35-45',
    link: '#',
    commissionInfo: '10-15%'
  },
  {
    id: 'electrolyte-mix',
    name: 'Electrolyte Hydration Mix',
    category: 'electrolyte',
    fillsNutrientGap: ['sodium', 'potassium', 'magnesium'],
    description: 'Zero-sugar electrolyte powder with optimal sodium, potassium, and magnesium ratios. Great for active days or low-carb diets.',
    price: '$25-35',
    link: '#',
    commissionInfo: '10-15%'
  },
  {
    id: 'omega-3-fish-oil',
    name: 'High-Quality Omega-3 Fish Oil',
    category: 'omega-3',
    fillsNutrientGap: [],
    description: 'Molecularly distilled for purity, high EPA/DHA for brain, heart, and anti-inflammatory support.',
    price: '$30-50',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'fiber-supplement',
    name: 'Prebiotic Fiber Blend',
    category: 'fiber',
    fillsNutrientGap: ['fiber'],
    description: 'Mix of soluble and insoluble fibers plus prebiotics to feed beneficial gut bacteria. Gentle, non-bloating formula.',
    price: '$20-30',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'iron-gentle',
    name: 'Gentle Iron Complex (with Vitamin C)',
    category: 'mineral',
    fillsNutrientGap: ['iron', 'vitaminC'],
    description: 'Non-constipating iron bisglycinate with built-in vitamin C for enhanced absorption. Ideal for plant-based diets.',
    price: '$15-22',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'b-complex',
    name: 'B-Complex Vitamins (Methylated)',
    category: 'vitamin',
    fillsNutrientGap: ['vitaminB1', 'vitaminB2', 'vitaminB3', 'vitaminB6', 'vitaminB9', 'vitaminB12'],
    description: 'Methylated B vitamins for energy, brain function, and stress support. Better absorption than synthetic forms.',
    price: '$18-28',
    link: '#',
    commissionInfo: '10-12%'
  },
  {
    id: 'zinc-immune',
    name: 'Zinc Picolinate 30mg',
    category: 'mineral',
    fillsNutrientGap: ['zinc'],
    description: 'Highly bioavailable zinc for immune support, wound healing, and skin health. Picolinate form for better absorption.',
    price: '$12-18',
    link: '#',
    commissionInfo: '10-12%'
  }
]

export function matchProductsToGaps(gaps: NutrientGap[]): AffiliateProduct[] {
  const criticalGaps = gaps
    .filter(gap => gap.severity === 'critical' || gap.severity === 'moderate')
    .filter(gap => gap.status === 'low')

  const matchedProducts: AffiliateProduct[] = []

  criticalGaps.forEach(gap => {
    const products = AFFILIATE_PRODUCTS.filter(product => 
      product.fillsNutrientGap.includes(gap.nutrient)
    )
    products.forEach(product => {
      if (!matchedProducts.find(p => p.id === product.id)) {
        matchedProducts.push(product)
      }
    })
  })

  if (matchedProducts.length === 0 && criticalGaps.length > 0) {
    const gutHealthProducts = AFFILIATE_PRODUCTS.filter(p => 
      p.category === 'probiotic' || p.category === 'fiber'
    )
    matchedProducts.push(...gutHealthProducts)
  }

  return matchedProducts.slice(0, 5)
}

export function getProductsByCategory(category: AffiliateProduct['category']): AffiliateProduct[] {
  return AFFILIATE_PRODUCTS.filter(p => p.category === category)
}

export function getProductById(id: string): AffiliateProduct | undefined {
  return AFFILIATE_PRODUCTS.find(p => p.id === id)
}
