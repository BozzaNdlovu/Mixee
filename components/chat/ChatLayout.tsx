import { useState } from 'react'
import { MessageSquare, MapPin, Video, Users, Camera, Settings, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'

interface ChatLayoutProps {
  children: React.ReactNode
}

const bottomNavItems = [
  { id: 'chats', icon: MessageSquare, label: 'Chats' },
  { id: 'radar', icon: MapPin, label: 'Radar' },
  { id: 'feed', icon: Video, label: 'Feed' },
  { id: 'rooms', icon: Users, label: 'Rooms' },
]

export function ChatLayout({ children }: ChatLayoutProps) {
  const [activeTab, setActiveTab] = useState('chats')
  const [location] = useState('Cape Town, ZA') // Mock location

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background border-x">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-chart-1 to-chart-2 flex items-center justify-center">
              <span className="text-xs text-white">M</span>
            </div>
            <h1 className="text-lg">Mixee</h1>
          </div>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Camera className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="flex items-center justify-around p-4 border-t bg-card">
        {bottomNavItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
            {item.id === 'radar' && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            )}
          </Button>
        ))}
      </nav>
    </div>
  )
}