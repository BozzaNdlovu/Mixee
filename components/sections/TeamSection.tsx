import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Users, Lightbulb, Target } from "lucide-react"

const squads = [
  {
    name: "Feed Squad",
    size: "6-8 people",
    focus: "Content discovery & ranking",
    roles: ["Product Manager", "2x Backend Engineers", "Frontend Engineer", "ML Engineer", "Designer", "QA Engineer"],
    kpis: ["Feed engagement rate", "Content discovery score", "Algorithm performance"]
  },
  {
    name: "Chat Squad", 
    size: "6-8 people",
    focus: "Messaging & real-time features",
    roles: ["Product Manager", "2x Backend Engineers", "Mobile Engineer", "Security Engineer", "Designer", "QA Engineer"],
    kpis: ["Message delivery rate", "E2E encryption adoption", "Chat engagement"]
  },
  {
    name: "ML Squad",
    size: "6-8 people", 
    focus: "Personalization & recommendations",
    roles: ["ML Product Manager", "2x ML Engineers", "Data Engineer", "Data Scientist", "Backend Engineer", "DevOps Engineer"],
    kpis: ["Model accuracy", "Recommendation CTR", "Cold-start performance"]
  },
  {
    name: "Growth Squad",
    size: "6-8 people",
    focus: "User acquisition & retention", 
    roles: ["Growth PM", "Growth Engineer", "Data Analyst", "Marketing Engineer", "Designer", "Content Strategist"],
    kpis: ["User acquisition cost", "Viral coefficient", "Retention rates"]
  },
  {
    name: "Monetization Squad",
    size: "6-8 people",
    focus: "Revenue & creator economy",
    roles: ["Monetization PM", "Backend Engineer", "Frontend Engineer", "Partnership Manager", "Data Analyst", "Designer"],
    kpis: ["ARPU", "Creator retention", "Ad performance"]
  },
  {
    name: "Ops Squad",
    size: "6-8 people",
    focus: "Infrastructure & reliability",
    roles: ["Platform PM", "2x DevOps Engineers", "Site Reliability Engineer", "Security Engineer", "Backend Engineer"],
    kpis: ["Uptime", "Performance metrics", "Security incidents"]
  }
]

export function TeamSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Talent & Team Structure</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Squad-Based Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Mixee organizes around autonomous squads (6-8 people each) with clear ownership, 
              KPIs, and decision-making authority. This structure enables rapid iteration and 
              maintains startup agility at scale.
            </p>
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
              <h4 className="mb-2">Total Team Size</h4>
              <p>
                <strong>36-48 people</strong> across 6 squads, with each squad being fully 
                cross-functional and capable of delivering end-to-end features independently.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Squad Structure</h2>
        <div className="space-y-6">
          {squads.map((squad, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{squad.name}</CardTitle>
                  <Badge variant="secondary">{squad.size}</Badge>
                </div>
                <p className="text-muted-foreground">{squad.focus}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-3">Team Composition</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {squad.roles.map((role, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3">Key KPIs</h4>
                  <div className="flex flex-wrap gap-2">
                    {squad.kpis.map((kpi, i) => (
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
        <h2 className="mb-6">Innovation & Culture</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-l-4 border-l-chart-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Innovation Days
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">Bi-weekly Hackathons</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Every two weeks, all squads pause regular work for local engagement-focused innovation
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Duration</Badge>
                    <span>24 hours</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Focus</Badge>
                    <span>Local engagement hooks</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Output</Badge>
                    <span>Working prototype + roadmap impact</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-chart-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Culture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-2">Squad Autonomy</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Each squad owns their metrics and has full authority to experiment and iterate
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Decision Making</Badge>
                    <span>Decentralized</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Accountability</Badge>
                    <span>Squad-level KPIs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">Coordination</Badge>
                    <span>Weekly cross-squad demos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6">Hiring Plan</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q1 Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">18</div>
              <p className="text-sm text-muted-foreground">Core team members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q2 Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">12</div>
              <p className="text-sm text-muted-foreground">Growth & ML focus</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q3 Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">10</div>
              <p className="text-sm text-muted-foreground">Monetization expansion</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Q4 Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-4">8</div>
              <p className="text-sm text-muted-foreground">International scaling</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}