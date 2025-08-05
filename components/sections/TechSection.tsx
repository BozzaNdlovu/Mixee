import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Server, Database, Cloud, Monitor } from "lucide-react"

const microservices = [
  {
    domain: "Feed Service",
    technology: "Go + gRPC",
    responsibility: "Content aggregation, ranking, and delivery",
    scalability: "Horizontal scaling with load balancing"
  },
  {
    domain: "Chat Service", 
    technology: "Elixir/Phoenix",
    responsibility: "Real-time messaging and E2E encryption",
    scalability: "Actor model for concurrent connections"
  },
  {
    domain: "Video Service",
    technology: "Node.js + FFmpeg",
    responsibility: "Video processing, streaming, and storage",
    scalability: "GPU-accelerated processing clusters"
  },
  {
    domain: "ML Service",
    technology: "Python + TensorFlow",
    responsibility: "Personalization and recommendation engine",
    scalability: "Model serving with auto-scaling"
  },
  {
    domain: "Geo Service",
    technology: "PostGIS + Redis",
    responsibility: "Location-based features and Radar Rooms",
    scalability: "Geospatial indexing and caching"
  }
]

const infrastructure = [
  {
    component: "CDN & Edge",
    technology: "CloudFront + Edge Lambda",
    purpose: "Local-cache routing and content delivery",
    icon: Cloud
  },
  {
    component: "Streaming",
    technology: "RTMP/HLS + MQTT/WebSockets", 
    purpose: "Real-time video and messaging",
    icon: Monitor
  },
  {
    component: "Database",
    technology: "PostgreSQL + Redis + S3",
    purpose: "Data persistence and caching",
    icon: Database
  },
  {
    component: "Orchestration",
    technology: "Kubernetes + Docker",
    purpose: "Container orchestration and scaling",
    icon: Server
  }
]

export function TechSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Tech Stack & Infrastructure</h1>
        <Card>
          <CardHeader>
            <CardTitle>Architecture Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Mixee's architecture is built for scale, real-time performance, and geographic distribution. 
              The microservices architecture ensures each domain can scale independently while maintaining 
              low latency for real-time features.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Microservices by Domain</h2>
        <div className="space-y-4">
          {microservices.map((service, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{service.domain}</CardTitle>
                  <Badge variant="secondary">{service.technology}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="mb-1">Responsibility</h4>
                  <p className="text-sm text-muted-foreground">{service.responsibility}</p>
                </div>
                <div>
                  <h4 className="mb-1">Scalability</h4>
                  <p className="text-sm">{service.scalability}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Infrastructure Components</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {infrastructure.map((infra, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <infra.icon className="h-5 w-5 text-primary" />
                  {infra.component}
                </CardTitle>
                <Badge variant="outline">{infra.technology}</Badge>
              </CardHeader>
              <CardContent>
                <p>{infra.purpose}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">DevOps & Observability</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>CI/CD Pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Source Control</Badge>
                  <span className="text-sm">GitHub + GitOps</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">CI/CD</Badge>
                  <span className="text-sm">GitHub Actions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Deployment</Badge>
                  <span className="text-sm">Kubernetes + Helm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Testing</Badge>
                  <span className="text-sm">Chaos Engineering (Gremlin)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Stack</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Metrics</Badge>
                  <span className="text-sm">Prometheus + Grafana</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Tracing</Badge>
                  <span className="text-sm">Jaeger</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Logging</Badge>
                  <span className="text-sm">ELK Stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Alerting</Badge>
                  <span className="text-sm">PagerDuty</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6">Performance Targets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Message Latency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">&lt;200ms</div>
              <p className="text-sm text-muted-foreground">P95</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Video Start Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">&lt;2s</div>
              <p className="text-sm text-muted-foreground">Time to first frame</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">99.9%</div>
              <p className="text-sm text-muted-foreground">Service availability</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Crash Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-4">&lt;1%</div>
              <p className="text-sm text-muted-foreground">Mobile app crashes</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}