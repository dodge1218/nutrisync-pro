import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Book, Lightbulb, FireSimple } from '@phosphor-icons/react'

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
  }
]

export default function Education() {
  const categories = ['All', 'Synergy', 'Timing', 'Nutrient', 'Gut Health', 'Wellness']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book weight="fill" className="text-primary" />
            Nutrition Education
          </CardTitle>
          <CardDescription>
            Learn about nutrient synergies, timing, and wellness strategies
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {educationalContent.map(content => (
          <Card key={content.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{content.category}</Badge>
                {content.category === 'synergy' && <Lightbulb weight="fill" className="text-primary" />}
                {content.category === 'gut-health' && <FireSimple weight="fill" className="text-accent" />}
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
