import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Users, Gift, TrendingUp, Calendar, MapPin, Share } from "lucide-react"

const inviteLoops = [
  {
    title: "Contact Sync + Bonus Local GIFs",
    description: "Mixit's signature feature enhanced",
    icon: Gift,
    mechanics: "Users who sync contacts get access to exclusive GIF packs featuring local landmarks, culture, and memes"
  },
  {
    title: "Content-to-Chat Sharebacks",
    description: "Auto-transform Reels/shorts into chat threads", 
    icon: Share,
    mechanics: "When users share content, it automatically creates a private chat thread with viewers for continued discussion"
  },
  {
    title: "Leaderboard Invites",
    description: "Recognition for top Radar Room hosts",
    icon: TrendingUp,
    mechanics: "Top local hosts get special invite privileges and exclusive features to share with their network"
  }
]

const journeyStages = [
  {
    stage: "Acquisition",
    timeframe: "Day 0-7",
    mechanism: "Local-friend referrals",
    description: "Users discover Mixee through friends in their geographic area",
    kpis: ["Install rate", "Referral source attribution", "Local friend connections"]
  },
  {
    stage: "Onboarding", 
    timeframe: "Day 1-3",
    mechanism: "Geo-Radar Room introduction",
    description: "New users are automatically matched to their nearest active Radar Room",
    kpis: ["Room join rate", "First interaction time", "Profile completion"]
  },
  {
    stage: "WOW Moment",
    timeframe: "Day 3-14", 
    mechanism: "First Duet Poll in your city",
    description: "User creates or participates in their first location-specific interactive content",
    kpis: ["First duet creation", "Poll participation", "Local engagement rate"]
  },
  {
    stage: "Habit Zone",
    timeframe: "Day 14-90",
    mechanism: "Daily Story-to-Stream flip",
    description: "Users develop the habit of transitioning from story viewing to live stream participation",
    kpis: ["Daily active usage", "Story-to-stream conversion", "Retention rate"]
  }
]

export function GrowthSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Growth & Viral Mechanics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Growth Strategy Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Mixee's growth strategy leverages hyperlocal networks and geographic proximity to create 
              viral loops that are impossible to replicate on global platforms. By focusing on local 
              communities first, we create deeper engagement and stronger network effects.
            </p>
            <div className="rounded-lg border border-accent bg-accent/50 p-4">
              <h4 className="mb-2">Core Growth Hypothesis</h4>
              <p>
                Local connections drive higher engagement than global connections. Users are 3x more likely 
                to engage with content from people in their immediate geographic area (5km radius).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Built-in Invite Loops</h2>
        <div className="grid gap-6">
          {inviteLoops.map((loop, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <loop.icon className="h-5 w-5 text-primary" />
                  {loop.title}
                </CardTitle>
                <p className="text-muted-foreground">{loop.description}</p>
              </CardHeader>
              <CardContent>
                <p>{loop.mechanics}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">90-Day User Journey</h2>
        <div className="space-y-4">
          {journeyStages.map((stage, index) => (
            <Card key={index} className={index === 2 ? "border-primary bg-primary/5" : ""}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Badge variant={index === 2 ? "default" : "secondary"}>
                      Stage {index + 1}
                    </Badge>
                    {stage.stage}
                  </CardTitle>
                  <Badge variant="outline">{stage.timeframe}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2">Primary Mechanism</h4>
                  <p>{stage.mechanism}</p>
                </div>
                <div>
                  <h4 className="mb-2">Description</h4>
                  <p>{stage.description}</p>
                </div>
                <div>
                  <h4 className="mb-2">Key KPIs</h4>
                  <div className="flex flex-wrap gap-2">
                    {stage.kpis.map((kpi, i) => (
                      <Badge key={i} variant="outline">{kpi}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Growth Metrics & Targets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Viral Coefficient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">1.5x</div>
              <p className="text-sm text-muted-foreground">Target by Q2</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Local Network Density</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">75%</div>
              <p className="text-sm text-muted-foreground">Friends within 10km</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Story-to-Stream Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">25%</div>
              <p className="text-sm text-muted-foreground">Daily conversion</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">90-Day Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl">40%</div>
              <p className="text-sm text-muted-foreground">Target retention</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}