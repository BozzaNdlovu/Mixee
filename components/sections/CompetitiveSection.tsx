import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Users, MessageSquare, Video, MapPin, Shield, DollarSign } from "lucide-react"

const competitors = [
  {
    name: "TikTok",
    category: "Primary - Short Video",
    marketCap: "$150B+",
    strengths: ["Powerful AI recommendation", "Viral content creation", "Global reach", "Creator tools"],
    weaknesses: ["No messaging", "Privacy concerns", "Addictive concerns", "No local discovery"],
    userBase: "1B+ MAU",
    revenue: "$11B (2023)",
    differentiators: ["Hyperlocal discovery", "Integrated messaging", "Privacy-first"]
  },
  {
    name: "WhatsApp", 
    category: "Primary - Messaging",
    marketCap: "Part of Meta",
    strengths: ["E2E encryption", "Global adoption", "Group messaging", "Voice/video calls"],
    weaknesses: ["No content discovery", "Limited social features", "No creator economy", "Status-only broadcasting"],
    userBase: "2.8B+ MAU", 
    revenue: "Limited monetization",
    differentiators: ["Content integration", "Local rooms", "Creator monetization"]
  },
  {
    name: "Instagram",
    category: "Primary - Visual Social",
    marketCap: "Part of Meta",
    strengths: ["Visual storytelling", "Stories format", "Creator tools", "Shopping integration"],
    weaknesses: ["Algorithm changes", "Declining reach", "Complex interface", "No geographic focus"],
    userBase: "2B+ MAU",
    revenue: "$33B+ (2023)",
    differentiators: ["Geographic discovery", "Unified messaging", "Local creator bonuses"]
  },
  {
    name: "Discord",
    category: "Secondary - Community",
    marketCap: "$15B",
    strengths: ["Community building", "Voice channels", "Gaming focus", "Server organization"],
    weaknesses: ["Complex onboarding", "Not mobile-first", "Limited discovery", "Niche audience"],
    userBase: "150M+ MAU",
    revenue: "$500M+ (2023)",
    differentiators: ["Geographic communities", "Mobile-first", "Mainstream appeal"]
  },
  {
    name: "Snapchat",
    category: "Secondary - Ephemeral",
    marketCap: "$25B",
    strengths: ["AR filters", "Map features", "Ephemeral content", "Young demographic"],
    weaknesses: ["Declining growth", "Interface complexity", "Limited creator tools", "Monetization struggles"],
    userBase: "750M+ MAU",
    revenue: "$4.6B (2023)",
    differentiators: ["Better local integration", "Creator economy", "Unified platform"]
  }
]

const featureComparison = [
  {
    feature: "Short Video",
    mixee: "✓ With local boost",
    tiktok: "✓ Global algorithm",
    instagram: "✓ Reels",
    whatsapp: "✗ Status only",
    snapchat: "✓ Spotlight"
  },
  {
    feature: "E2E Messaging",
    mixee: "✓ Full encryption",
    tiktok: "✗ No messaging",
    instagram: "✓ Basic DMs",
    whatsapp: "✓ Industry leading",
    snapchat: "✓ Ephemeral"
  },
  {
    feature: "Live Streaming",
    mixee: "✓ Local rooms", 
    tiktok: "✓ TikTok Live",
    instagram: "✓ Instagram Live",
    whatsapp: "✗ None",
    snapchat: "✓ Limited"
  },
  {
    feature: "Geographic Discovery",
    mixee: "✓ Core feature",
    tiktok: "✗ Limited",
    instagram: "✓ Location tags",
    whatsapp: "✗ None",
    snapchat: "✓ Snap Map"
  },
  {
    feature: "Creator Monetization",
    mixee: "✓ Local bonuses",
    tiktok: "✓ Creator Fund",
    instagram: "✓ Multiple streams",
    whatsapp: "✗ None",
    snapchat: "✓ Limited"
  }
]

export function CompetitiveSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Competitive Analysis</h1>
        <Card>
          <CardHeader>
            <CardTitle>Market Landscape</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The social media landscape is dominated by specialized platforms, each excelling in specific 
              areas but failing to provide a unified experience. Mixee's opportunity lies in combining 
              the best features while introducing geographic-first discovery that none of these platforms offer.
            </p>
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
              <h4 className="mb-2">Market Gap</h4>
              <p>
                No existing platform successfully combines short-form video, encrypted messaging, 
                live streaming, and hyperlocal discovery in a single, cohesive experience.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Competitive Landscape</h2>
        <div className="space-y-6">
          {competitors.map((competitor, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    {competitor.name}
                    <Badge variant="outline">{competitor.category}</Badge>
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-sm">{competitor.userBase}</div>
                    <div className="text-sm text-muted-foreground">{competitor.marketCap}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-chart-1">Strengths</h4>
                    <ul className="space-y-1">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 text-destructive">Weaknesses</h4>
                    <ul className="space-y-1">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <h4 className="mb-2">Mixee Differentiators</h4>
                  <div className="flex flex-wrap gap-2">
                    {competitor.differentiators.map((diff, i) => (
                      <Badge key={i} variant="secondary">{diff}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Feature Comparison Matrix</h2>
        <Card>
          <CardHeader>
            <CardTitle>Core Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Feature</th>
                    <th className="text-left p-3">Mixee</th>
                    <th className="text-left p-3">TikTok</th>
                    <th className="text-left p-3">Instagram</th>
                    <th className="text-left p-3">WhatsApp</th>
                    <th className="text-left p-3">Snapchat</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{row.feature}</td>
                      <td className="p-3 text-primary">{row.mixee}</td>
                      <td className="p-3">{row.tiktok}</td>
                      <td className="p-3">{row.instagram}</td>
                      <td className="p-3">{row.whatsapp}</td>
                      <td className="p-3">{row.snapchat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Competitive Advantages</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-chart-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Geographic-First Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                No major platform has built geographic proximity into their core algorithm. 
                Mixee's location-based discovery creates stronger connections and higher engagement.
              </p>
              <div className="text-sm space-y-1">
                <div>• 3x higher engagement for local content</div>
                <div>• 75% higher retention in local communities</div>
                <div>• Unique network effects within cities</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy-First Design
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                While competitors face privacy backlash, Mixee leads with transparency, 
                user control, and end-to-end encryption by default.
              </p>
              <div className="text-sm space-y-1">
                <div>• E2E encryption for all private communications</div>
                <div>• User-controlled data retention</div>
                <div>• Transparent algorithm explanations</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6">Market Positioning</h2>
        <Card>
          <CardHeader>
            <CardTitle>Strategic Positioning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Against TikTok</h4>
                <p className="text-sm text-muted-foreground">
                  "TikTok for local communities with integrated messaging"
                </p>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Against Instagram</h4>
                <p className="text-sm text-muted-foreground">
                  "Instagram with real privacy and local discovery"
                </p>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Against WhatsApp</h4>
                <p className="text-sm text-muted-foreground">
                  "WhatsApp with content discovery and creator tools"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}