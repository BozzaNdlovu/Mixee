import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Brain, Database, Zap, MapPin, MessageSquare, Play } from "lucide-react"

const coldStartModel = {
  components: [
    "Mixit-style interest quiz (5 questions)",
    "GPS-inferred Radar Preferences",
    "Contact graph analysis", 
    "Device usage patterns"
  ],
  timeline: "First 7 days",
  accuracy: "65% prediction accuracy"
}

const pipelines = [
  {
    name: "Event Ingestion",
    technology: "Kafka",
    specialFeature: "Local affinity scoring",
    description: "Real-time event stream processing with geographic weighting",
    icon: Zap
  },
  {
    name: "Feature Store",
    technology: "Redis/Presto", 
    specialFeature: "Geo-Engagement Score",
    description: "Cached user features with location-based engagement metrics",
    icon: Database
  },
  {
    name: "Ranking Model",
    technology: "TensorFlow/PyTorch",
    specialFeature: "Weekly retraining for local creators",
    description: "Personalized content ranking with local creator boosting",
    icon: Brain
  }
]

const proprietarySignals = [
  {
    signal: "Chat-to-Watch Time Ratio",
    description: "WhatsApp + YouTube hybrid metric",
    insight: "Users who balance messaging and video consumption have 3x higher retention",
    weight: "25%",
    icon: MessageSquare
  },
  {
    signal: "Duet Completion Rate", 
    description: "TikTok + Mixit reply loops combined",
    insight: "Local duet completion rates are 4x higher than global duets",
    weight: "30%",
    icon: Play
  },
  {
    signal: "Geo-Social Graph Density",
    description: "Local friend connection strength",
    insight: "Users with 5+ local friends have 80% higher engagement",
    weight: "20%",
    icon: MapPin
  },
  {
    signal: "Story-to-Stream Conversion",
    description: "Passive to active engagement transition",
    insight: "High converters become power users within 30 days",
    weight: "25%",
    icon: Zap
  }
]

export function MLSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Personalization & ML Strategy</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              ML-Driven Personalization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Mixee's ML strategy combines traditional social platform signals with unique geographic 
              and local community data to create hyper-personalized experiences that feel both global 
              and neighborhood-specific.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Cold-Start Model</h2>
        <Card className="border-l-4 border-l-chart-1">
          <CardHeader>
            <CardTitle>New User Onboarding Intelligence</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary">{coldStartModel.timeline}</Badge>
              <Badge variant="outline">{coldStartModel.accuracy}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-3">Model Components</h4>
              <div className="grid gap-2">
                {coldStartModel.components.map((component, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg bg-accent/30 p-3">
                    <div className="h-2 w-2 rounded-full bg-chart-1" />
                    <span>{component}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-accent bg-accent/50 p-4">
              <p>
                The cold-start model prioritizes local content discovery, ensuring new users see 
                relevant geographic content within their first session, leading to higher initial engagement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">ML Pipelines Architecture</h2>
        <div className="grid gap-6">
          {pipelines.map((pipeline, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <pipeline.icon className="h-5 w-5 text-primary" />
                  {pipeline.name}
                  <Badge variant="outline">{pipeline.technology}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <h4 className="mb-1">Special Feature</h4>
                  <p>{pipeline.specialFeature}</p>
                </div>
                <p className="text-muted-foreground">{pipeline.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Proprietary ML Signals</h2>
        <div className="grid gap-4">
          {proprietarySignals.map((signal, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <signal.icon className="h-5 w-5 text-primary" />
                    {signal.signal}
                  </CardTitle>
                  <Badge variant="secondary">Weight: {signal.weight}</Badge>
                </div>
                <p className="text-muted-foreground">{signal.description}</p>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-chart-2/20 bg-chart-2/10 p-4">
                  <h4 className="mb-2">Key Insight</h4>
                  <p>{signal.insight}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Model Performance Targets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Content Relevance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">0.85</div>
              <p className="text-sm text-muted-foreground">Target accuracy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Local Content Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">2.5x</div>
              <p className="text-sm text-muted-foreground">Engagement multiplier</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Model Refresh Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">Weekly</div>
              <p className="text-sm text-muted-foreground">Retraining cycle</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}