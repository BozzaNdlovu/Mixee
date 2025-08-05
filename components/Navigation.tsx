import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sections = [
  { id: 'executive', title: 'Executive Summary' },
  { id: 'vision', title: 'Vision & Personas' },
  { id: 'features', title: 'Core Features' },
  { id: 'growth', title: 'Growth & Viral' },
  { id: 'ml', title: 'ML & Personalization' },
  { id: 'privacy', title: 'Privacy & Security' },
  { id: 'monetization', title: 'Monetization' },
  { id: 'tech', title: 'Tech Stack' },
  { id: 'roadmap', title: 'Roadmap' },
  { id: 'testing', title: 'A/B Testing' },
  { id: 'team', title: 'Team Structure' },
  { id: 'competitive', title: 'Competitive Analysis' },
  { id: 'risk', title: 'Risk Assessment' },
  { id: 'metrics', title: 'Success Metrics' }
]

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 border-r bg-card">
      <div className="p-6">
        <h1 className="mb-8 text-primary">Mixee PRD</h1>
        <p className="mb-6 text-muted-foreground">The world's first truly unified social-messaging-video platform</p>
        
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSectionChange(section.id)}
              >
                {section.title}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}