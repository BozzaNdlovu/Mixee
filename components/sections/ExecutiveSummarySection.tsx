import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { TrendingUp, Users, DollarSign, Zap, Globe, Shield } from "lucide-react"

const keyMetrics = [
  {
    metric: "Market Opportunity",
    value: "$50B+",
    description: "Global social media market by 2025",
    icon: Globe
  },
  {
    metric: "Target Users",
    value: "2M DAU",
    description: "Year 1 target across key markets",
    icon: Users
  },
  {
    metric: "Revenue Target", 
    value: "$3M ARR",
    description: "End of Year 1 recurring revenue",
    icon: DollarSign
  },
  {
    metric: "Competitive Advantage",
    value: "3x Higher",
    description: "Local engagement vs global platforms",
    icon: Zap
  }
]

const strategicPillars = [
  {
    title: "Hyperlocal Social Graph",
    description: "Geographic proximity drives stronger connections and higher engagement than global networks",
    impact: "3x higher engagement rates for local content"
  },
  {
    title: "Unified Platform Experience", 
    description: "Seamless integration of messaging, video, and broadcasting eliminates platform switching",
    impact: "40% increase in session duration"
  },
  {
    title: "Privacy-First Architecture",
    description: "End-to-end encryption with user-controlled privacy settings builds trust and differentiation",
    impact: "60% of users cite privacy as key factor"
  },
  {
    title: "Creator Economy Focus",
    description: "Local performance bonuses and community building incentives attract and retain creators",
    impact: "25% higher creator revenue share than competitors"
  }
]

export function ExecutiveSummarySection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Executive Summary</h1>
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle>Mixee: The Hyperlocal Social Revolution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">
              Mixee represents the next evolution in social media: a unified platform that combines the best features 
              of TikTok, WhatsApp, YouTube, Instagram, and Facebook with revolutionary hyperlocal discovery powered 
              by geographic proximity.
            </p>
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
              <h4 className="mb-2">Investment Thesis</h4>
              <p>
                The social media landscape is fragmented, forcing users to manage multiple apps for different needs. 
                Mixee unifies these experiences while introducing hyperlocal discovery that creates stronger, more 
                meaningful connections. Our geographic-first approach generates 3x higher engagement than global platforms.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Key Business Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {keyMetrics.map((item, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-sm">{item.metric}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl mb-1">{item.value}</div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Strategic Pillars</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {strategicPillars.map((pillar, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{pillar.title}</CardTitle>
                <p className="text-muted-foreground">{pillar.description}</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-chart-2/20 bg-chart-2/10 p-4">
                  <h4 className="mb-1">Business Impact</h4>
                  <p className="text-sm">{pillar.impact}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Financial Projections</h2>
        <Card>
          <CardHeader>
            <CardTitle>3-Year Financial Outlook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Year 1 (2024)</h4>
                <div className="text-2xl text-chart-1 mb-1">$3M</div>
                <p className="text-sm text-muted-foreground">ARR | 2M DAU</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Year 2 (2025)</h4>
                <div className="text-2xl text-chart-2 mb-1">$15M</div>
                <p className="text-sm text-muted-foreground">ARR | 8M DAU</p>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Year 3 (2026)</h4>
                <div className="text-2xl text-chart-3 mb-1">$45M</div>
                <p className="text-sm text-muted-foreground">ARR | 20M DAU</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Critical Success Factors</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Network Effects & Local Density
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                Success depends on achieving critical mass in local markets. Each city needs 10,000+ active users 
                to create meaningful network effects and content discovery.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Target: 75% local friend density</Badge>
                <Badge variant="secondary">Timeline: 6 months per major market</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Trust Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                Differentiation through privacy-first design and transparent data practices. Users must trust 
                Mixee with both personal communications and location data.
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">E2E encryption for all private content</Badge>
                <Badge variant="secondary">User-controlled data retention</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5">
          <CardHeader>
            <CardTitle>Investment Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2">Series A (Current)</h4>
                <div className="text-2xl mb-1">$12M</div>
                <p className="text-sm text-muted-foreground">18 months runway, MVP to monetization</p>
              </div>
              <div>
                <h4 className="mb-2">Series B (Projected)</h4>
                <div className="text-2xl mb-1">$35M</div>
                <p className="text-sm text-muted-foreground">International expansion, advanced AI features</p>
              </div>
            </div>
            <p className="text-sm">
              Funds will be allocated to team scaling (40%), marketing & user acquisition (35%), 
              infrastructure & technology (20%), and operations (5%).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}