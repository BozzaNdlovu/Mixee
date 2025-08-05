import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { AlertTriangle, Shield, TrendingDown, Users, Gavel, Zap } from "lucide-react"

const risks = [
  {
    category: "Market Risks",
    icon: TrendingDown,
    level: "High",
    risks: [
      {
        title: "Incumbent Platform Response",
        description: "TikTok, Instagram, or WhatsApp copies our local features",
        probability: "High",
        impact: "High", 
        mitigation: "Build defensible network effects in local markets first. Patent key innovations.",
        timeline: "6-12 months"
      },
      {
        title: "User Acquisition Costs",
        description: "Rising CAC due to platform competition and iOS privacy changes",
        probability: "Medium",
        impact: "High",
        mitigation: "Focus on organic growth through local referrals. Build strong product-market fit.",
        timeline: "Ongoing"
      },
      {
        title: "Market Saturation",
        description: "Users reach social media fatigue, reduce platform adoption",
        probability: "Medium", 
        impact: "Medium",
        mitigation: "Utility-first approach with messaging. Replace, don't add to app stack.",
        timeline: "12-24 months"
      }
    ]
  },
  {
    category: "Technical Risks",
    icon: Zap,
    level: "Medium",
    risks: [
      {
        title: "Scaling Infrastructure",
        description: "Real-time messaging and video at scale requires significant investment",
        probability: "High",
        impact: "Medium",
        mitigation: "Start with proven technologies. Plan infrastructure scaling roadmap.",
        timeline: "Q2-Q3 2024"
      },
      {
        title: "AI/ML Performance",
        description: "Personalization algorithms fail to achieve target engagement",
        probability: "Medium",
        impact: "High", 
        mitigation: "A/B test against simple algorithms. Incremental ML improvements.",
        timeline: "Q2 2024"
      },
      {
        title: "Mobile Platform Changes",
        description: "iOS/Android policy changes affect app functionality",
        probability: "Medium",
        impact: "Medium",
        mitigation: "Close platform relationships. Cross-platform web backup.",
        timeline: "Ongoing"
      }
    ]
  },
  {
    category: "Regulatory Risks",
    icon: Gavel,
    level: "High",
    risks: [
      {
        title: "Data Privacy Regulation",
        description: "GDPR, CCPA, and emerging laws limit data usage for personalization",
        probability: "High",
        impact: "Medium",
        mitigation: "Privacy-by-design architecture. User consent management.",
        timeline: "Ongoing"
      },
      {
        title: "Content Moderation",
        description: "Government pressure for content moderation at scale",
        probability: "High", 
        impact: "Medium",
        mitigation: "AI moderation + human review. Community-based moderation.",
        timeline: "Q3 2024"
      },
      {
        title: "Antitrust Scrutiny",
        description: "Platform growth attracts regulatory attention",
        probability: "Low",
        impact: "High",
        mitigation: "Open ecosystem approach. Avoid anti-competitive practices.",
        timeline: "18+ months"
      }
    ]
  },
  {
    category: "Business Risks", 
    icon: Users,
    level: "Medium",
    risks: [
      {
        title: "Network Effects Failure",
        description: "Unable to achieve critical mass in local markets",
        probability: "Medium",
        impact: "High",
        mitigation: "Focus on fewer markets initially. University campus strategy.",
        timeline: "Q1-Q2 2024"
      },
      {
        title: "Creator Exodus",
        description: "Key creators leave for established platforms with larger audiences",
        probability: "Medium",
        impact: "Medium",
        mitigation: "Superior monetization tools. Local creator partnerships.",
        timeline: "Q3-Q4 2024"
      },
      {
        title: "Monetization Challenges",
        description: "Unable to achieve target ARPU or ad fill rates",
        probability: "Medium",
        impact: "High",
        mitigation: "Multiple revenue streams. Local business partnerships.",
        timeline: "Q3-Q4 2024"
      }
    ]
  }
]

const mitigationStrategies = [
  {
    strategy: "Defensive Moats",
    description: "Build network effects and switching costs",
    tactics: ["Local community density", "Creator economy lock-in", "Data network effects", "Geographic market dominance"]
  },
  {
    strategy: "Technical Excellence",
    description: "Maintain performance and reliability advantages", 
    tactics: ["Infrastructure monitoring", "Performance benchmarking", "Chaos engineering", "Gradual rollouts"]
  },
  {
    strategy: "Regulatory Compliance",
    description: "Proactive legal and compliance framework",
    tactics: ["Privacy by design", "Transparent algorithms", "Content moderation AI", "Government relations"]
  },
  {
    strategy: "Financial Prudence", 
    description: "Manage burn rate and extend runway",
    tactics: ["Milestone-based funding", "Revenue diversification", "Cost optimization", "Strategic partnerships"]
  }
]

export function RiskSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Risk Assessment & Mitigation</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Strategic Risk Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Mixee faces significant risks common to social platforms: intense competition, 
              regulatory scrutiny, and technical challenges. Success requires proactive risk 
              management and contingency planning.
            </p>
            <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
              <h4 className="mb-2">Risk Management Philosophy</h4>
              <p>
                We prioritize transparent risk identification, data-driven mitigation strategies, 
                and maintaining operational flexibility to pivot when necessary.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Risk Categories</h2>
        <div className="space-y-8">
          {risks.map((category, index) => (
            <div key={index}>
              <div className="flex items-center gap-3 mb-4">
                <category.icon className="h-6 w-6 text-primary" />
                <h3>{category.category}</h3>
                <Badge variant={category.level === 'High' ? 'destructive' : category.level === 'Medium' ? 'secondary' : 'outline'}>
                  {category.level} Risk
                </Badge>
              </div>
              <div className="space-y-4">
                {category.risks.map((risk, riskIndex) => (
                  <Card key={riskIndex}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{risk.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="outline">P: {risk.probability}</Badge>
                          <Badge variant="outline">I: {risk.impact}</Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{risk.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="mb-2">Mitigation Strategy</h4>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Timeline: {risk.timeline}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Mitigation Strategies</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {mitigationStrategies.map((strategy, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{strategy.strategy}</CardTitle>
                <p className="text-muted-foreground">{strategy.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="mb-2">Key Tactics</h4>
                  {strategy.tactics.map((tactic, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                      {tactic}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Risk Monitoring Framework</h2>
        <Card>
          <CardHeader>
            <CardTitle>Early Warning Indicators</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-accent bg-accent/30 p-4">
                <h4 className="mb-2">Market Risks</h4>
                <ul className="text-sm space-y-1">
                  <li>• CAC increase &gt;50%</li>
                  <li>• Competitor feature copy</li>
                  <li>• User acquisition decline</li>
                  <li>• Market share loss</li>
                </ul>
              </div>
              <div className="rounded-lg border border-accent bg-accent/30 p-4">
                <h4 className="mb-2">Technical Risks</h4>
                <ul className="text-sm space-y-1">
                  <li>• Uptime &lt;99.5%</li>
                  <li>• Performance degradation</li>
                  <li>• Security incidents</li>
                  <li>• ML accuracy drop</li>
                </ul>
              </div>
              <div className="rounded-lg border border-accent bg-accent/30 p-4">
                <h4 className="mb-2">Business Risks</h4>
                <ul className="text-sm space-y-1">
                  <li>• Revenue target miss &gt;20%</li>
                  <li>• Creator churn &gt;25%</li>
                  <li>• User engagement decline</li>
                  <li>• Burn rate acceleration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Contingency Plans</h2>
        <div className="space-y-4">
          <Card className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle>Scenario: Major Competitor Copies Core Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  If TikTok or Instagram launches local discovery features similar to Radar Rooms.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2">Immediate Response (0-30 days)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Accelerate unique feature development</li>
                      <li>• Increase marketing spend in key markets</li>
                      <li>• Launch creator acquisition campaigns</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2">Strategic Pivot (30-90 days)</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Double down on privacy differentiation</li>
                      <li>• Expand creator monetization advantages</li>
                      <li>• Consider strategic partnerships</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3">
            <CardHeader>
              <CardTitle>Scenario: Unable to Achieve Local Network Effects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm">
                  If user density in target cities fails to reach critical mass for meaningful local discovery.
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2">Market Strategy Adjustment</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Focus on fewer, smaller markets</li>
                      <li>• University/college campus strategy</li>
                      <li>• Event-based community building</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2">Product Pivot Options</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Interest-based communities</li>
                      <li>• Professional networking focus</li>
                      <li>• Niche vertical specialization</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}