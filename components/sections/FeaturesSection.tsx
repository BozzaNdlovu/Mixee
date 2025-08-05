import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { ArrowRight, Play, MessageSquare, Users, Zap, MapPin } from "lucide-react"

const feedTypes = [
  {
    title: "Short-form Vertical Videos",
    duration: "15-60 sec",
    feature: "Instant Reply Snippets",
    description: "Voice/video reply bubbles inspired by Mixit",
    icon: Play,
    trigger: "Scroll through feed",
    action: "Watch & react with snippet",
    reward: "Dopamine hit + social validation",
    hook: "Next video auto-plays"
  },
  {
    title: "Ephemeral Stories",
    duration: "24h",
    feature: "Geo-Tagged Story Hubs",
    description: "Location-based story clusters from Mixit",
    icon: Zap,
    trigger: "Friend posts local story",
    action: "View & add to hub",
    reward: "Discover nearby events/people",
    hook: "FOMO for more local stories"
  },
  {
    title: "Long-form Broadcasts",
    duration: "up to 30 min",
    feature: "Community Live Jams",
    description: "Interactive live sessions with local audience",
    icon: Users,
    trigger: "Creator goes live locally",
    action: "Join live jam session",
    reward: "Real-time community interaction",
    hook: "Notification for next session"
  },
  {
    title: "Encrypted Chat Bubbles",
    duration: "persistent",
    feature: "Chat-to-Voice Drop",
    description: "Seamless voice message integration",
    icon: MessageSquare,
    trigger: "Receive message",
    action: "Reply with voice drop",
    reward: "Efficient communication",
    hook: "Conversation continues"
  },
  {
    title: "Community Threads",
    duration: "ongoing",
    feature: "Thread-to-Room Jump Links",
    description: "Direct links from discussion to live rooms",
    icon: ArrowRight,
    trigger: "Engage in thread",
    action: "Jump to related live room",
    reward: "Real-time discussion",
    hook: "Stay for live interaction"
  }
]

const novelHooks = [
  {
    title: "Duet Polls with Location-Based Stickers",
    description: "Mixes TikTok duets with Mixit geo-stickers for local engagement",
    mechanics: "Users can duet with local creators and add location-specific AR stickers, creating polls that only people in the same area can participate in"
  },
  {
    title: "Story-to-Stream Transitions", 
    description: "Auto-promote viral clips into 30-min Local Jam rooms",
    mechanics: "When a story reaches viral threshold in a geographic area, it automatically gets promoted to become a live stream room where locals can join and discuss"
  }
]

export function FeaturesSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Core Feature Set & Engagement Loops</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Universal Feed ("MixFeed")
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              The MixFeed merges all content types into a single, personalized stream that adapts to user preferences 
              and local context, creating seamless transitions between different engagement modes.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Feed Content Types & Engagement Loops</h2>
        <div className="space-y-4">
          {feedTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <type.icon className="h-5 w-5 text-primary" />
                  {type.title}
                  <Badge variant="outline">{type.duration}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-accent bg-accent/30 p-4">
                  <h4 className="mb-2">{type.feature}</h4>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Trigger</Badge>
                  <span>{type.trigger}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">Action</Badge>
                  <span>{type.action}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">Reward</Badge>
                  <span>{type.reward}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">Hook</Badge>
                  <span>{type.hook}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Novel Engagement Hooks</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {novelHooks.map((hook, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle>{hook.title}</CardTitle>
                <p className="text-muted-foreground">{hook.description}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{hook.mechanics}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card className="bg-gradient-to-r from-primary/5 to-chart-1/5">
          <CardHeader>
            <CardTitle>Example: Local Radar Room Story Unlock</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Watching a local "Radar Room" story unlocks an AR sticker pack specific to your city, 
              encouraging users to engage with hyperlocal content and creating a gamified discovery experience 
              that drives both content consumption and creation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}