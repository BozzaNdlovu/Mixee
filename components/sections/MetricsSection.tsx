import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { BarChart3, TrendingUp, Users, DollarSign, Zap, MapPin, MessageSquare, Play } from "lucide-react"

const northStarMetrics = [
  {
    metric: "Daily Active Users (DAU)",
    target: "2M by EOY",
    current: "0 (Pre-launch)",
    frequency: "Daily",
    owner: "Growth Squad",
    icon: Users
  },
  {
    metric: "Local Network Density",
    target: "75% users with 5+ local friends",
    current: "N/A",
    frequency: "Weekly", 
    owner: "Growth Squad",
    icon: MapPin
  },
  {
    metric: "Revenue per User (ARPU)",
    target: "$3.50 monthly",
    current: "$0 (Pre-monetization)",
    frequency: "Monthly",
    owner: "Monetization Squad", 
    icon: DollarSign
  },
  {
    metric: "Content Engagement Rate",
    target: "25% daily engagement",
    current: "N/A",
    frequency: "Daily",
    owner: "Feed Squad",
    icon: TrendingUp
  }
]

const engagementMetrics = [
  {
    category: "Content Consumption",
    metrics: [
      { name: "Video Watch Time", target: "8 min/session", icon: Play },
      { name: "Story View Rate", target: "70% completion", icon: Zap },
      { name: "Feed Scroll Depth", target: "50+ items/session", icon: BarChart3 },
      { name: "Content Share Rate", target: "15% of views", icon: TrendingUp }
    ]
  },
  {
    category: "Social Interaction", 
    metrics: [
      { name: "Messages Sent", target: "25/user/day", icon: MessageSquare },
      { name: "Duet Creation Rate", target: "5% of videos", icon: Users },
      { name: "Live Room Participation", target: "20% weekly", icon: Play },
      { name: "Local Friend Connections", target: "10 new/month", icon: MapPin }
    ]
  },
  {
    category: "Creator Activity",
    metrics: [
      { name: "Content Creation Rate", target: "2 posts/week", icon: Zap },
      { name: "Creator Retention", target: "80% monthly", icon: TrendingUp },
      { name: "Revenue per Creator", target: "$150/month", icon: DollarSign },
      { name: "Local Expert Applications", target: "100/month", icon: Users }
    ]
  }
]

const businessMetrics = [
  {
    category: "Growth",
    metrics: [
      { name: "User Acquisition Cost (CAC)", target: "<$8", current: "TBD" },
      { name: "Viral Coefficient", target: "1.5x", current: "TBD" },
      { name: "App Store Rating", target: "4.5+ stars", current: "TBD" },
      { name: "Organic Growth Rate", target: "40% of new users", current: "TBD" }
    ]
  },
  {
    category: "Retention",
    metrics: [
      { name: "Day 1 Retention", target: "70%", current: "TBD" },
      { name: "Day 7 Retention", target: "45%", current: "TBD" },
      { name: "Day 30 Retention", target: "25%", current: "TBD" },
      { name: "Day 90 Retention", target: "15%", current: "TBD" }
    ]
  },
  {
    category: "Monetization",
    metrics: [
      { name: "Ad Fill Rate", target: "85%", current: "0%" },
      { name: "CPM", target: "$1.50", current: "TBD" },
      { name: "Creator Revenue Share", target: "$500K/month", current: "$0" },
      { name: "Premium Feature Adoption", target: "10%", current: "TBD" }
    ]
  }
]

const technicalMetrics = [
  {
    name: "App Performance",
    metrics: [
      { metric: "App Launch Time", target: "<2s", status: "green" },
      { metric: "Video Load Time", target: "<1s", status: "yellow" },
      { metric: "Message Delivery", target: "<200ms", status: "green" },
      { metric: "Crash Rate", target: "<1%", status: "green" }
    ]
  },
  {
    name: "Infrastructure",
    metrics: [
      { metric: "API Response Time", target: "<500ms", status: "green" },
      { metric: "Uptime", target: "99.9%", status: "green" },
      { metric: "CDN Hit Rate", target: ">90%", status: "yellow" },
      { metric: "Database Performance", target: "<100ms", status: "green" }
    ]
  }
]

export function MetricsSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Success Metrics Dashboard</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Metrics-Driven Culture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Mixee's success depends on data-driven decision making. Our metrics framework 
              balances growth, engagement, and business outcomes while maintaining focus on 
              long-term user value creation.
            </p>
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
              <h4 className="mb-2">Measurement Philosophy</h4>
              <p>
                We measure what matters: user engagement over vanity metrics, local network 
                effects over global reach, and sustainable growth over unsustainable spikes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">North Star Metrics</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {northStarMetrics.map((metric, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <metric.icon className="h-5 w-5 text-primary" />
                    {metric.metric}
                  </CardTitle>
                  <Badge variant="secondary">{metric.frequency}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <h4 className="mb-1">Target</h4>
                    <div className="text-lg text-chart-1">{metric.target}</div>
                  </div>
                  <div>
                    <h4 className="mb-1">Current</h4>
                    <div className="text-lg text-muted-foreground">{metric.current}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Owner: {metric.owner}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Engagement Metrics</h2>
        <div className="space-y-6">
          {engagementMetrics.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {category.metrics.map((metric, i) => (
                    <div key={i} className="rounded-lg border border-accent bg-accent/30 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className="h-4 w-4 text-primary" />
                        <h4 className="text-sm">{metric.name}</h4>
                      </div>
                      <div className="text-lg">{metric.target}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Business Metrics</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {businessMetrics.map((category, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.metrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm">{metric.name}</div>
                      <div className="text-xs text-muted-foreground">Current: {metric.current}</div>
                    </div>
                    <Badge variant="secondary">{metric.target}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Technical Performance</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {technicalMetrics.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{section.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {section.metrics.map((metric, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm">{metric.metric}</div>
                      <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${
                      metric.status === 'green' ? 'bg-chart-1' : 
                      metric.status === 'yellow' ? 'bg-chart-4' : 'bg-destructive'
                    }`} />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Metric Reporting Cadence</h2>
        <Card>
          <CardHeader>
            <CardTitle>Reporting Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Daily</h4>
                <ul className="text-sm space-y-1">
                  <li>• DAU/MAU</li>
                  <li>• Engagement rate</li>
                  <li>• Technical performance</li>
                  <li>• Creator activity</li>
                </ul>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Weekly</h4>
                <ul className="text-sm space-y-1">
                  <li>• Retention cohorts</li>
                  <li>• Local network density</li>
                  <li>• Content performance</li>
                  <li>• Squad KPIs</li>
                </ul>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Monthly</h4>
                <ul className="text-sm space-y-1">
                  <li>• Revenue metrics</li>
                  <li>• User acquisition cost</li>
                  <li>• Creator economics</li>
                  <li>• Feature adoption</li>
                </ul>
              </div>
              <div className="text-center p-4 rounded-lg border border-accent bg-accent/30">
                <h4 className="mb-2">Quarterly</h4>
                <ul className="text-sm space-y-1">
                  <li>• Business review</li>
                  <li>• Competitive analysis</li>
                  <li>• Roadmap adjustment</li>
                  <li>• Investor updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Success Thresholds</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-l-4 border-l-chart-1">
            <CardHeader>
              <CardTitle className="text-chart-1">Success (Green)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• DAU growth &gt;20% MoM</li>
                <li>• Retention above targets</li>
                <li>• Revenue on track</li>
                <li>• Technical performance green</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-chart-4">
            <CardHeader>
              <CardTitle className="text-chart-4">Warning (Yellow)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• DAU growth 10-20% MoM</li>
                <li>• Retention 10% below target</li>
                <li>• Revenue 20% below plan</li>
                <li>• Some technical issues</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Critical (Red)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• DAU growth &lt;10% MoM</li>
                <li>• Retention &gt;20% below target</li>
                <li>• Revenue &gt;30% below plan</li>
                <li>• Major technical problems</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}