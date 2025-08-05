import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { FlaskConical, Target, BarChart3, Users } from "lucide-react"

export function TestingSection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">A/B Testing & Iteration Plan</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Experimentation Framework
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Continuous experimentation drives product decisions through data-driven insights, 
              with special focus on local engagement patterns and geographic cohort analysis.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Feature Flags & Experiments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2">Radar Room Experiments</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Per-location feature flags allow testing different engagement mechanics
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Cohort Type</Badge>
                  <span>Geographic (by city)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Split Method</Badge>
                  <span>Location-based randomization</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Hold-out</Badge>
                  <span>20% control group</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Testing Cadence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2">Sprint Schedule</h4>
              <div className="space-y-3">
                <div className="rounded-lg border border-accent bg-accent/30 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span>Weekly Test Sprints</span>
                    <Badge variant="outline">Ongoing</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    New experiments launched weekly with 7-day minimum runtime
                  </p>
                </div>
                <div className="rounded-lg border border-accent bg-accent/30 p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span>Monthly Roadmap Pivots</span>
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Major feature decisions based on local-engagement lift data
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Key Experiments Pipeline</h2>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geo-Engagement Optimization</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Priority: High</Badge>
                <Badge variant="outline">Duration: 2 weeks</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="mb-2">Hypothesis</h4>
                  <p className="text-sm text-muted-foreground">
                    Local content promotion increases engagement by 25%
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">Variants</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Control: Global algorithm</li>
                    <li>• Test A: 2x local boost</li>
                    <li>• Test B: 3x local boost</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Success Metrics</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Session duration</li>
                    <li>• Content interaction rate</li>
                    <li>• Return rate (7-day)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Story-to-Stream Conversion</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Priority: High</Badge>
                <Badge variant="outline">Duration: 3 weeks</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="mb-2">Hypothesis</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatic story promotion increases stream participation
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">Variants</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Control: Manual promotion</li>
                    <li>• Test A: Auto at 100 views</li>
                    <li>• Test B: Auto at 50 views</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Success Metrics</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Stream join rate</li>
                    <li>• Stream duration</li>
                    <li>• Creator satisfaction</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Duet Poll Engagement</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">Priority: Medium</Badge>
                <Badge variant="outline">Duration: 2 weeks</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h4 className="mb-2">Hypothesis</h4>
                  <p className="text-sm text-muted-foreground">
                    Location-specific stickers increase duet completion by 40%
                  </p>
                </div>
                <div>
                  <h4 className="mb-2">Variants</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Control: Generic stickers</li>
                    <li>• Test A: City-specific pack</li>
                    <li>• Test B: Hyperlocal pack</li>
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2">Success Metrics</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Duet completion rate</li>
                    <li>• Sticker usage</li>
                    <li>• Viral coefficient</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-6">Statistical Framework</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Statistical Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-1">80%</div>
              <p className="text-sm text-muted-foreground">Minimum threshold</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Significance Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-2">95%</div>
              <p className="text-sm text-muted-foreground">Confidence interval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Minimum Effect Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-3">5%</div>
              <p className="text-sm text-muted-foreground">Relative improvement</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sample Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-chart-4">10K+</div>
              <p className="text-sm text-muted-foreground">Per variant minimum</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}