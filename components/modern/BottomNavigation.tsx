import { useState, useEffect } from 'react'
import { MessageCircle, Video, Users, ShoppingBag, GraduationCap, Plus, Sparkles, Flame } from 'lucide-react'
import { cn } from '../ui/utils'

interface NavigationItem {
  id: string
  icon: React.ComponentType<any>
  label: string
  badge?: number
  color: string
  gradient: string
}

const navigationItems: NavigationItem[] = [
  {
    id: 'chats',
    icon: MessageCircle,
    label: 'Chats',
    badge: 3,
    color: '#FF6B9D',
    gradient: 'from-pink-400 to-rose-500'
  },
  {
    id: 'videos',
    icon: Video,
    label: 'Videos',
    color: '#4ECDC4',
    gradient: 'from-teal-400 to-cyan-500'
  },
  {
    id: 'communities',
    icon: Users,
    label: 'Communities',
    badge: 12,
    color: '#45B7D1',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'marketplace',
    icon: ShoppingBag,
    label: 'Shop',
    color: '#96CEB4',
    gradient: 'from-emerald-400 to-green-500'
  },
  {
    id: 'learning',
    icon: GraduationCap,
    label: 'Learn',
    color: '#FFEAA7',
    gradient: 'from-yellow-400 to-orange-500'
  }
]

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const [ripple, setRipple] = useState<string | null>(null)
  const [liveBadges, setLiveBadges] = useState({
    chats: 3,
    videos: 0,
    communities: 12,
    marketplace: 0,
    learning: 0
  })

  // Update badges with real-time activity including new engagement features
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveBadges(prev => ({
        chats: Math.max(0, prev.chats + (Math.random() > 0.8 ? (Math.random() > 0.6 ? 1 : -1) : 0)),
        videos: prev.videos + (Math.random() > 0.9 ? 1 : 0), // Stories activity affects video tab
        communities: Math.max(10, prev.communities + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)), // Live events boost community activity
        marketplace: prev.marketplace + (Math.random() > 0.95 ? 1 : 0),
        learning: prev.learning + (Math.random() > 0.92 ? 1 : 0) // Gamification challenges can affect learning
      }))
    }, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  const handleTabClick = (tabId: string) => {
    setRipple(tabId)
    onTabChange(tabId)
    
    // Reset ripple animation
    setTimeout(() => setRipple(null), 300)
  }

  return (
    <div className="relative">
      {/* Floating Navigation Container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-2 shadow-2xl border border-white/20">
          <div className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-300 group",
                    isActive 
                      ? "bg-gradient-to-br shadow-lg transform scale-105" 
                      : "hover:bg-gray-50/50"
                  )}
                  style={{
                    backgroundImage: isActive ? `linear-gradient(135deg, ${item.color}20, ${item.color}10)` : undefined
                  }}
                >
                  {/* Ripple Effect */}
                  {ripple === item.id && (
                    <div className="absolute inset-0 rounded-2xl bg-white/30 animate-ping" />
                  )}
                  
                  {/* Icon Container */}
                  <div className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300",
                    isActive ? `bg-gradient-to-br ${item.gradient} shadow-md` : "bg-gray-100"
                  )}>
                    <Icon 
                      className={cn(
                        "w-4 h-4 transition-colors duration-300",
                        isActive ? "text-white" : "text-gray-600"
                      )} 
                    />
                    
                    {/* Dynamic Live Badge */}
                    {(liveBadges[item.id as keyof typeof liveBadges] > 0) && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {liveBadges[item.id as keyof typeof liveBadges] > 9 ? '9+' : liveBadges[item.id as keyof typeof liveBadges]}
                      </div>
                    )}
                    
                    {/* Live Activity Pulse for active tabs */}
                    {isActive && item.id === 'chats' && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-ping" />
                    )}
                    {isActive && item.id === 'communities' && (
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium transition-colors duration-300",
                    isActive ? "text-gray-900" : "text-gray-500"
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Active Indicator Dot - removed animate-pulse */}
                  {isActive && (
                    <div 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Enhanced 10× Engagement Floating Action Button */}
      <div className="fixed bottom-32 right-6 z-40">
        <div className="relative">
          <button className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
          </button>
          
          {/* Live Engagement Ring */}
          <div className="absolute -inset-2 rounded-full border-2 border-yellow-500 animate-ping opacity-40" />
          <div className="absolute -inset-4 rounded-full border border-purple-300 animate-pulse" />
          
          {/* 10× Engagement Indicator */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
            <span className="text-white text-xs font-bold">10×</span>
          </div>
          
          {/* Live Features Tooltip */}
          <div className="absolute bottom-16 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            🏆 Rewards • 📹 Stories • 🎪 Live Events
          </div>
        </div>
      </div>
    </div>
  )
}