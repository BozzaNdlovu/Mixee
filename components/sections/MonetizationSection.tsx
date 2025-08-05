import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { DollarSign, Target, TrendingUp, Users, MapPin } from "lucide-react"

const adProducts = [
  {
    title: "Seamless Story Slots",
    description: "Interactive 5-sec overlays with local brand geo-stickers",
    icon: Target,
    format: "Native story integration",
    targeting: "Hyperlocal + interest-based",
    revenue: "$0.15-0.30 CPM",
    engagement: "2.5x higher than standard ads"
  },
  {
    title: "Duet Sponsorships", 
    description: "Brand duets + pinned MixFeed spots",
    icon: Users,
    format: "Branded content collaboration",
    targeting: "Creator partnership + audience match",
    revenue: "$500-5000 per campaign",
    engagement: "85% completion rate"
  },
  {
    title: "Skill-Share Broadcasts",
    description: "Paid live lessons with Local Expert badges", 
    icon: TrendingUp,
    format: "Premium live streaming",
    targeting: "Local expertise + skill demand",
    revenue: "Creator keeps 70%",
    engagement: "3x longer session duration"
  }
]

export function MonetizationSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">Monetization Blueprint</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Mixee's monetization strategy balances user experience with revenue generation through 
              native advertising, creator economy features, and premium local services.
            </p>
            <div className="rounded-lg border border-chart-1/20 bg-chart-1/10 p-4">
              <h4 className="mb-2">Revenue Projections (Year 1)</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Ad Revenue (70%)</span>
                  <span>$2.1M</span>
                </div>
                <div className="flex justify-between">
                  <span>Creator Economy (25%)</span>
                  <span>$750K</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Features (5%)</span>
                  <span>$150K</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Ad Products</h2>
        <div className="space-y-6">
          {adProducts.map((product, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <product.icon className="h-5 w-5 text-primary" />
                  {product.title}
                </CardTitle>
                <p className="text-muted-foreground">{product.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <h4 className="mb-1">Format</h4>
                    <Badge variant="secondary">{product.format}</Badge>
                  </div>
                  <div>
                    <h4 className="mb-1">Targeting</h4>
                    <p className="text-sm text-muted-foreground">{product.targeting}</p>
                  </div>
                  <div>
                    <h4 className="mb-1">Revenue</h4>
                    <p className="text-sm">{product.revenue}</p>
                  </div>
                  <div>
                    <h4 className="mb-1">Performance</h4>
                    <p className="text-sm text-chart-1">{product.engagement}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-6">Creator Revenue Share</h2>
        <Card className="border-l-4 border-l-chart-2">
          <CardHeader>
            <CardTitle>Local Performance Bonus System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-3">Base Revenue Share</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Creator keeps:</span>
                    <span>55% (industry standard)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee:</span>
                    <span>45%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-3">Local Performance Bonus</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Top 10 Local Host:</span>
                    <span>+15% bonus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Builder:</span>
                    <span>+10% bonus</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Local Expert Badge:</span>
                    <span>+5% bonus</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-chart-2/20 bg-chart-2/10 p-4">
              <p className="text-sm">
                <strong>Example:</strong> A creator earning $1000/month base could earn up to $1300/month 
                with all local performance bonuses, incentivizing community building and local engagement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Revenue Targets</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">ARPU Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">$3.50</div>
              <p className="text-sm text-muted-foreground">Monthly per user</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ad Fill Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">85%</div>
              <p className="text-sm text-muted-foreground">Inventory utilization</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Creator Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">$500K</div>
              <p className="text-sm text-muted-foreground">Monthly to creators</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Revenue Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-4">25%</div>
              <p className="text-sm text-muted-foreground">Month-over-month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}