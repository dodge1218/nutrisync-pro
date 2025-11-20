import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs'
import { Book, Lightbulb, FireSimple, Clock } from '@phosphor-icons/react'

interface EducationalCard {
  id: string
  title: string
  category: string
  description: string
  keyTakeaway: string
  tags: string[]
}

const educationalContent: EducationalCard[] = [
  {
    id: 'vitamin-c-iron',
    title: 'Vitamin C + Iron: The Absorption Booster',
    category: 'synergy',
    description: 'Pairing vitamin C with plant-based iron can triple absorption. Add bell peppers, citrus, or broccoli to lentils, spinach, or fortified grains.',
    keyTakeaway: 'Always pair plant iron with vitamin C for 3x better absorption',
    tags: ['iron', 'vitamin-c', 'absorption']
  },
  {
    id: 'coffee-iron-conflict',
    title: 'Coffee & Iron: The Timing Conflict',
    category: 'timing',
    description: 'Coffee and tea contain tannins that block iron absorption by up to 60%. Space coffee at least 2 hours from iron-rich meals.',
    keyTakeaway: 'Drink coffee between meals, not with iron-rich foods',
    tags: ['iron', 'timing', 'coffee']
  },
  {
    id: 'magnesium-stress',
    title: 'Magnesium: The Relaxation Mineral',
    category: 'nutrient',
    description: 'Magnesium supports 300+ bodily functions including sleep, stress response, muscle relaxation, and energy production. Most people are deficient.',
    keyTakeaway: 'Eat pumpkin seeds, spinach, dark chocolate, or consider magnesium glycinate',
    tags: ['magnesium', 'stress', 'sleep']
  },
  {
    id: 'fermented-foods',
    title: 'Fermented Foods for Gut Health',
    category: 'gut-health',
    description: 'Kefir, sauerkraut, kimchi, and yogurt contain live probiotics that support gut microbiome diversity, digestion, and immune function.',
    keyTakeaway: 'Aim for 2+ servings of fermented foods per week',
    tags: ['gut-health', 'probiotics', 'fermented']
  },
  {
    id: 'fiber-microbiome',
    title: 'Fiber: Your Microbiome\'s Favorite Food',
    category: 'gut-health',
    description: 'Dietary fiber feeds beneficial gut bacteria, producing short-chain fatty acids that reduce inflammation and support gut lining health.',
    keyTakeaway: 'Aim for 25-35g fiber daily from diverse plant sources',
    tags: ['fiber', 'gut-health', 'prebiotics']
  },
  {
    id: 'warm-foods-digestion',
    title: 'Warm Foods for Sensitive Digestion',
    category: 'wellness',
    description: 'Cooked, warm foods are easier to digest and reduce strain on the digestive system. Ideal for those with IBS, bloating, or low digestive fire.',
    keyTakeaway: 'Prioritize soups, stews, cooked vegetables, and warm grains',
    tags: ['digestion', 'warm-foods', 'gut-health']
  },
  {
    id: 'adrenal-support',
    title: 'Adrenal Support Through Nutrition',
    category: 'wellness',
    description: 'Chronic stress depletes magnesium, vitamin C, and B vitamins. Support your adrenals with nutrient-dense foods and reduced caffeine/sugar.',
    keyTakeaway: 'Prioritize magnesium, vitamin C, and B vitamins when stressed',
    tags: ['stress', 'adrenal', 'magnesium']
  },
  {
    id: 'mineral-trio',
    title: 'The Mineral Trio: Calcium, Magnesium, Potassium',
    category: 'nutrient',
    description: 'These three minerals work together for bone health, muscle function, blood pressure regulation, and nerve signaling. Balance is key.',
    keyTakeaway: 'Don\'t over-supplement one without considering the others',
    tags: ['calcium', 'magnesium', 'potassium']
  },
  {
    id: 'vitamin-d-importance',
    title: 'Vitamin D: The Sunshine Nutrient',
    category: 'nutrient',
    description: 'Vitamin D supports immune function, bone health, and mood. Most people are deficient, especially in winter or with limited sun exposure.',
    keyTakeaway: 'Get 15-30 min sun daily or eat fatty fish, eggs, and consider D3 supplementation',
    tags: ['vitamin-d', 'immune', 'bone-health']
  },
  {
    id: 'omega-3-inflammation',
    title: 'Omega-3s: Anti-Inflammatory Powerhouse',
    category: 'nutrient',
    description: 'EPA and DHA from fatty fish reduce inflammation, support brain health, and improve cardiovascular function. Plant sources (ALA) convert poorly to EPA/DHA.',
    keyTakeaway: 'Eat fatty fish 2-3x/week (salmon, sardines, mackerel) for optimal omega-3s',
    tags: ['omega-3', 'inflammation', 'brain-health']
  },
  {
    id: 'b-vitamins-energy',
    title: 'B Vitamins: The Energy Complex',
    category: 'nutrient',
    description: 'B vitamins (B1, B2, B3, B6, B9, B12) convert food to energy, support nervous system, and are critical for DNA synthesis. Deficiency causes fatigue and brain fog.',
    keyTakeaway: 'Get B vitamins from whole grains, meat, eggs, and leafy greens',
    tags: ['b-vitamins', 'energy', 'metabolism']
  },
  {
    id: 'zinc-immune',
    title: 'Zinc: Immune System Guardian',
    category: 'nutrient',
    description: 'Zinc supports immune function, wound healing, and hormone production. Deficiency is common in vegetarians and leads to frequent infections.',
    keyTakeaway: 'Eat oysters, beef, pumpkin seeds, or chickpeas for zinc',
    tags: ['zinc', 'immune', 'healing']
  },
  {
    id: 'protein-timing',
    title: 'Protein Timing for Muscle & Recovery',
    category: 'timing',
    description: 'Distribute protein throughout the day (20-40g per meal) for optimal muscle protein synthesis. Post-workout protein within 2 hours maximizes recovery.',
    keyTakeaway: 'Aim for 0.8-1g protein per lb bodyweight, spread across meals',
    tags: ['protein', 'timing', 'muscle']
  },
  {
    id: 'fat-vitamins',
    title: 'Fat-Soluble Vitamins: Need Fat to Absorb',
    category: 'synergy',
    description: 'Vitamins A, D, E, K require dietary fat for absorption. Eat carrots with olive oil, take vitamin D with meals containing fat.',
    keyTakeaway: 'Always consume fat-soluble vitamins with a fat source',
    tags: ['vitamins', 'fat', 'absorption']
  },
  {
    id: 'polyphenols-gut',
    title: 'Polyphenols: Feed Your Good Bacteria',
    category: 'gut-health',
    description: 'Polyphenols from berries, dark chocolate, green tea, and olive oil act as prebiotics, selectively feeding beneficial gut bacteria and reducing inflammation.',
    keyTakeaway: 'Eat colorful plant foods rich in polyphenols daily',
    tags: ['polyphenols', 'gut-health', 'antioxidants']
  },
  {
    id: 'sodium-potassium-balance',
    title: 'Sodium-Potassium Balance: Blood Pressure Key',
    category: 'nutrient',
    description: 'Modern diets are too high in sodium and too low in potassium. Aim for 2:1 potassium to sodium ratio for optimal blood pressure and heart health.',
    keyTakeaway: 'Reduce processed foods (sodium), increase vegetables and fruits (potassium)',
    tags: ['sodium', 'potassium', 'blood-pressure']
  },
  {
    id: 'plant-diversity',
    title: '30 Plants Per Week for Microbiome',
    category: 'gut-health',
    description: 'Studies show eating 30+ different plant foods weekly dramatically increases microbiome diversity, which correlates with better health outcomes.',
    keyTakeaway: 'Count all plants: vegetables, fruits, nuts, seeds, grains, legumes, herbs',
    tags: ['gut-health', 'diversity', 'plants']
  },
  {
    id: 'meal-timing-sleep',
    title: 'Meal Timing for Better Sleep',
    category: 'timing',
    description: 'Large meals within 3 hours of bedtime disrupt sleep quality by raising body temperature and blood sugar. Light evening meals promote deeper sleep.',
    keyTakeaway: 'Finish eating 3+ hours before bed; keep dinner lighter',
    tags: ['sleep', 'timing', 'digestion']
  },
  {
    id: 'selenium-thyroid',
    title: 'Selenium: Essential for Thyroid Function',
    category: 'nutrient',
    description: 'Selenium is critical for converting T4 to active T3 thyroid hormone. Just 2-3 Brazil nuts provide your daily selenium needs.',
    keyTakeaway: 'Eat 2 Brazil nuts daily or consume fish, eggs, and mushrooms',
    tags: ['selenium', 'thyroid', 'metabolism']
  },
  {
    id: 'copper-zinc-balance',
    title: 'Copper-Zinc Balance: Don\'t Supplement Blindly',
    category: 'synergy',
    description: 'Copper and zinc compete for absorption. High zinc supplementation depletes copper, leading to anemia and immune issues. Balance is critical.',
    keyTakeaway: 'Get both from whole foods; avoid high-dose zinc without copper',
    tags: ['copper', 'zinc', 'balance']
  },
  {
    id: 'vitamin-k2-d3',
    title: 'Vitamin K2 + D3: The Bone Health Duo',
    category: 'synergy',
    description: 'Vitamin D increases calcium absorption, but K2 directs it to bones (not arteries). Take them together for optimal bone health and cardiovascular protection.',
    keyTakeaway: 'Pair D3 supplements with K2 (MK-7); eat natto, cheese, egg yolks',
    tags: ['vitamin-k', 'vitamin-d', 'bone-health']
  },
  {
    id: 'electrolytes-hydration',
    title: 'Electrolytes: More Than Just Water',
    category: 'nutrient',
    description: 'Sodium, potassium, magnesium, and calcium regulate hydration, nerve signals, and muscle contraction. Athletes and low-carb dieters need extra electrolytes.',
    keyTakeaway: 'Add sea salt, potassium-rich foods, and magnesium if active',
    tags: ['electrolytes', 'hydration', 'minerals']
  },
  {
    id: 'resistant-starch',
    title: 'Resistant Starch: Prebiotic from Cooked & Cooled Carbs',
    category: 'gut-health',
    description: 'Cooling cooked rice, potatoes, and pasta creates resistant starch that feeds gut bacteria and improves blood sugar control.',
    keyTakeaway: 'Cook and cool starches overnight for gut health benefits',
    tags: ['gut-health', 'prebiotic', 'blood-sugar']
  },
  {
    id: 'glycine-collagen',
    title: 'Glycine: The Missing Amino Acid',
    category: 'nutrient',
    description: 'Modern diets lack glycine, found abundantly in bone broth, skin, and connective tissue. Glycine supports sleep, skin health, and detoxification.',
    keyTakeaway: 'Drink bone broth or take collagen/glycine powder daily',
    tags: ['glycine', 'collagen', 'sleep']
  },
  {
    id: 'intermittent-fasting',
    title: 'Intermittent Fasting: Time-Restricted Eating Benefits',
    category: 'timing',
    description: 'Eating within an 8-12 hour window allows digestive rest, improves insulin sensitivity, and promotes autophagy (cellular cleanup).',
    keyTakeaway: 'Try eating between 10am-6pm; avoid late-night snacking',
    tags: ['fasting', 'timing', 'metabolism']
  },
  {
    id: 'vitamin-e-forms',
    title: 'Vitamin E: All 8 Forms Matter',
    category: 'nutrient',
    description: 'Vitamin E has 8 forms (tocopherols and tocotrienols). Most supplements only contain alpha-tocopherol. Get all forms from whole foods like nuts and seeds.',
    keyTakeaway: 'Eat mixed nuts, seeds, and wheat germ; avoid isolated alpha-tocopherol',
    tags: ['vitamin-e', 'antioxidants', 'whole-foods']
  }
]

export default function Education() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'synergy', label: 'Synergy' },
    { value: 'timing', label: 'Timing' },
    { value: 'nutrient', label: 'Nutrient' },
    { value: 'gut-health', label: 'Gut Health' },
    { value: 'wellness', label: 'Wellness' }
  ]

  const filteredContent = selectedCategory === 'all' 
    ? educationalContent 
    : educationalContent.filter(content => content.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'synergy': return <Lightbulb weight="fill" className="text-primary" />
      case 'gut-health': return <FireSimple weight="fill" className="text-accent" />
      case 'timing': return <Clock weight="fill" className="text-secondary" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book weight="fill" className="text-primary" />
            Nutrition Education
          </CardTitle>
          <CardDescription>
            Learn about nutrient synergies, timing, and wellness strategies ({educationalContent.length} articles)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {categories.map(cat => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredContent.map(content => (
          <Card key={content.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{content.category}</Badge>
                {getCategoryIcon(content.category)}
              </div>
              <CardTitle className="text-lg">{content.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{content.description}</p>
              
              <Separator />
              
              <div className="bg-primary/5 p-3 rounded-lg">
                <div className="text-xs font-medium text-primary mb-1">KEY TAKEAWAY</div>
                <p className="text-sm font-medium">{content.keyTakeaway}</p>
              </div>

              <div className="flex gap-1 flex-wrap">
                {content.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No articles found in this category.
          </CardContent>
        </Card>
      )}

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>More Content Coming Soon</CardTitle>
          <CardDescription>
            We're continuously adding new educational content based on user feedback and latest nutrition science.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Topics in development: Omega-3 benefits, B-vitamin synergies, electrolyte balance for athletes,
            anti-inflammatory foods, and meal timing for sleep optimization.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
