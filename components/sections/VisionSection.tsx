import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

const personas = [
  {
    title: "Gen Z Creator",
    description: "18-24 year old content creators seeking viral fame",
    jobsToBeDone: ["Create engaging short-form content", "Build follower base", "Monetize creativity"],
    painPoints: ["Algorithm unpredictability", "Platform fragmentation", "Revenue inconsistency"],
    delightMoments: ["Viral video breakthrough", "First brand partnership", "Fan community growth"]
  },
  {
    title: "Micro-influencer", 
    description: "10K-100K followers across platforms",
    jobsToBeDone: ["Maintain audience engagement", "Collaborate with brands", "Diversify content"],
    painPoints: ["Managing multiple platforms", "Declining engagement rates", "Brand negotiation complexity"],
    delightMoments: ["Successful campaign launch", "Cross-platform growth", "Community milestone"]
  },
  {
    title: "Professional Networker",
    description: "Business professionals building industry connections",
    jobsToBeDone: ["Expand professional network", "Share industry insights", "Build personal brand"],
    painPoints: ["Time management across platforms", "Professional vs personal balance", "ROI measurement"],
    delightMoments: ["Career opportunity", "Thought leadership recognition", "Meaningful connection"]
  },
  {
    title: "Family Communicator",
    description: "Parents and relatives staying connected",
    jobsToBeDone: ["Share family moments", "Coordinate family events", "Maintain long-distance relationships"],
    painPoints: ["Privacy concerns", "Platform complexity", "Generational tech gaps"],
    delightMoments: ["Grandparent engagement", "Family reunion planning", "Milestone celebrations"]
  },
  {
    title: "Casual Watcher",
    description: "Passive consumers seeking entertainment",
    jobsToBeDone: ["Discover entertaining content", "Stay informed on trends", "Light social interaction"],
    painPoints: ["Content overload", "Time wasting", "Privacy invasion"],
    delightMoments: ["Perfect content recommendation", "Unexpected laugh", "Learning something new"]
  }
]

export function VisionSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">High-Level Vision & User Personas</h1>
        <Card>
          <CardHeader>
            <CardTitle>Mixee Vision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Mixee combines the ultra-short-video magic of TikTok, the end-to-end encrypted chat of WhatsApp, 
              the broadcasting power of YouTube, the visual storytelling of Instagram, and the community graph 
              of Facebook — plus the most-loved features of South Africa's original Mixit chat app, turbo-charged 10× better.
            </p>
            <div className="rounded-lg border border-accent bg-accent/50 p-4">
              <h4 className="mb-2">Unique Value Proposition</h4>
              <p>
                <strong>Geo-Proximity Chat Rooms</strong> and <strong>Local Radar Rooms</strong> create hyperlocal 
                communities that existing platforms cannot match, turning geographic proximity into social connection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Target User Personas</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {personas.map((persona, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {persona.title}
                  <Badge variant="secondary">{index + 1}</Badge>
                </CardTitle>
                <p className="text-muted-foreground">{persona.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2">Jobs to be Done</h4>
                  <ul className="space-y-1">
                    {persona.jobsToBeDone.map((job, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {job}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Pain Points</h4>
                  <ul className="space-y-1">
                    {persona.painPoints.map((pain, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-destructive">
                        <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Delight Moments</h4>
                  <ul className="space-y-1">
                    {persona.delightMoments.map((delight, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-chart-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-chart-1" />
                        {delight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}