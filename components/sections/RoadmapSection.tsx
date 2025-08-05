import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Calendar, Target, Users, TrendingUp } from "lucide-react"

const quarters = [
  {
    quarter: "Q1",
    title: "MVP",
    focus: "MixFeed + Chat + Geo-Radar Rooms",
    deliverables: [
      "Universal Feed with basic algorithm",
      "End-to-end encrypted chat",
      "Local Radar Room alpha",
      "Mobile app (iOS/Android)",
      "Basic user onboarding"
    ],
    killSwitchMetrics: [
      "Crash rate <1%",
      "Message latency <200ms",
      "Video load time <2s"
    ],
    ceoKpi: "DAU ≥ 100K",
    icon: Target
  },
  {
    quarter: "Q2", 
    title: "ML & Personalization",
    focus: "Cold-start, Ranking Models, Duet Polls",
    deliverables: [
      "Personalized content ranking",
      "Cold-start onboarding flow", 
      "Duet Polls with geo-stickers",
      "Creator tools v1",
      "Basic analytics dashboard"
    ],
    killSwitchMetrics: [
      "Content relevance >70%",
      "New user engagement >40%",
      "Duet completion rate >60%"
    ],
    ceoKpi: "DAU ≥ 500K",
    icon: TrendingUp
  },
  {
    quarter: "Q3",
    title: "Monetization", 
    focus: "Story Slots, Duet Sponsorships, Creator Tools",
    deliverables: [
      "Native ad integration",
      "Creator revenue sharing",
      "Brand partnership tools",
      "Advanced video editing",
      "Community moderation"
    ],
    killSwitchMetrics: [
      "Ad fill rate >75%",
      "Creator retention >80%",
      "Revenue per user >$2"
    ],
    ceoKpi: "Revenue ≥ $1M ARR",
    icon: Users
  },
  {
    quarter: "Q4",
    title: "Scale & Community",
    focus: "Groups, Threads, Local Events", 
    deliverables: [
      "Community groups",
      "Thread-to-room transitions",
      "Local event integration",
      "Advanced privacy controls",
      "International expansion"
    ],
    killSwitchMetrics: [
      "Group engagement >50%",
      "Event participation >25%",
      "International DAU >20%"
    ],
    ceoKpi: "DAU ≥ 2M",
    icon: Calendar
  }
]

export function RoadmapSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Roadmap & Milestones</h1>
        <Card>
          <CardHeader>
            <CardTitle>2024 Product Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Our roadmap prioritizes user acquisition and engagement in Q1-Q2, followed by 
              monetization and scaling in Q3-Q4. Each quarter has clear deliverables, 
              kill-switch metrics, and CEO-level KPIs.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Quarterly Milestones</h2>
        <div className="space-y-8">
          {quarters.map((quarter, index) => (
            <Card key={index} className={index === 0 ? "border-primary bg-primary/5" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <quarter.icon className="h-6 w-6 text-primary" />
                    {quarter.quarter} - {quarter.title}
                  </CardTitle>
                  <Badge variant={index === 0 ? "default" : "secondary"}>
                    {quarter.focus}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-3">Key Deliverables</h4>
                  <div className="grid gap-2">
                    {quarter.deliverables.map((deliverable, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg bg-accent/30 p-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="mb-3">Kill-Switch Metrics</h4>
                    <div className="space-y-2">
                      {quarter.killSwitchMetrics.map((metric, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Badge variant="destructive" className="text-xs">CRITICAL</Badge>
                          <span>{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-3">CEO KPI</h4>
                    <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
                      <div className="text-lg">{quarter.ceoKpi}</div>
                      <p className="text-sm text-muted-foreground">Primary success metric</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Success Metrics Timeline</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q1 Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">100K</div>
              <p className="text-sm text-muted-foreground">Daily Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q2 Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">500K</div>
              <p className="text-sm text-muted-foreground">Daily Active Users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q3 Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">$1M</div>
              <p className="text-sm text-muted-foreground">Annual Recurring Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q4 Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-4">2M</div>
              <p className="text-sm text-muted-foreground">Daily Active Users</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}