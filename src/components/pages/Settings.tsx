import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { BellRinging, FileText } from '@phosphor-icons/react'
import ProfileDashboard from '../profile/ProfileDashboard'

export default function Settings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Settings & Preferences
          </CardTitle>
          <CardDescription>
            Manage your profile and app preferences
          </CardDescription>
        </CardHeader>
      </Card>
      
      <ProfileDashboard />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BellRinging weight="fill" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Show Supplement Suggestions</div>
              <div className="text-sm text-muted-foreground">Display affiliate product recommendations</div>
            </div>
            <Badge variant="secondary">Off (Default)</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Warm Food Preference</div>
              <div className="text-sm text-muted-foreground">Prioritize cooked/warm options for digestion</div>
            </div>
            <Badge variant="default">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Dietary Pattern</div>
              <div className="text-sm text-muted-foreground">Affects recommendations and analysis</div>
            </div>
            <Badge variant="outline">Omnivore</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText weight="fill" />
            Legal & Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-medium text-sm mb-1">Full Legal Disclaimer</div>
            <p className="text-sm text-muted-foreground">
              View complete terms, limitations, and medical disclaimers
            </p>
            <p className="text-xs text-primary mt-1">📄 See /docs/legal-disclaimer.md in repository</p>
          </div>
          <Separator />
          <div>
            <div className="font-medium text-sm mb-1">Product Requirements (PRD)</div>
            <p className="text-sm text-muted-foreground">
              Review app features, roadmap, and design philosophy
            </p>
            <p className="text-xs text-primary mt-1">📄 See /PRD.md in repository</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">About This App</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            NutriWell is a nutrition intelligence platform designed to help you identify and fix specific
            nutrient gaps through food-first recommendations, synergy insights, and gut health optimization.
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Version: 1.0.0 (MVP + Phase 7k)</div>
            <div>Built with: React, TypeScript, Tailwind CSS, shadcn/ui</div>
            <div>Data: Local storage (spark.kv) - your data stays private</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
