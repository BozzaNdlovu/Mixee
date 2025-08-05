import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Shield, Lock, Eye, EyeOff } from "lucide-react"

export function PrivacySection() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4">End-to-End Encryption & Privacy</h1>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy-First Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Mixee prioritizes user privacy through end-to-end encryption for all private communications 
              while maintaining the social discovery features that make the platform engaging.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              E2E Encryption
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2">Implementation</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Signal Protocol for DMs and group chats with forward secrecy and metadata minimization
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Protocol</Badge>
                  <span>Signal Protocol</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Key Exchange</Badge>
                  <span>X3DH + Double Ratchet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Forward Secrecy</Badge>
                  <span>Perfect Forward Secrecy</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="h-5 w-5" />
              Stealth Rooms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2">Mixit-Inspired Feature</h4>
              <p className="text-sm text-muted-foreground mb-3">
                No-trace, auto-expiring chat rooms with user-controlled privacy defaults
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Auto-Expire</Badge>
                  <span>24h default, user configurable</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">No Logs</Badge>
                  <span>Zero server-side message storage</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary">Anonymous</Badge>
                  <span>Optional pseudonymous participation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-6">Privacy Controls</h2>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Granular Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-accent bg-accent/30 p-4">
                  <h4 className="mb-2">Location Sharing</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Exact location (friends only)</li>
                    <li>• City-level (public)</li>
                    <li>• Country-level (public)</li>
                    <li>• Hidden (private mode)</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent bg-accent/30 p-4">
                  <h4 className="mb-2">Content Visibility</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Public feed</li>
                    <li>• Friends only</li>
                    <li>• Local radius only</li>
                    <li>• Stealth room only</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent bg-accent/30 p-4">
                  <h4 className="mb-2">Data Retention</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Messages: User controlled</li>
                    <li>• Stories: 24h auto-delete</li>
                    <li>• Videos: User controlled</li>
                    <li>• Analytics: 90 days max</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}