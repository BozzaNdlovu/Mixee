import { useState, useEffect } from 'react'
import { Activity, Users, MessageCircle, Eye, TrendingUp, AlertCircle, MapPin, Video, Flame, Zap } from 'lucide-react'
import { cn } from '../ui/utils'

interface ActivityStats {
  nearbyUsers: number
  activeNow: number
  totalConnections: number
  videosWatched: number
  newPosts: number
}

interface RecentActivity {
  id: string
  type: 'message' | 'post' | 'community' | 'marketplace' | 'learning' | 'video' | 'connection'
  user: string
  action: string
  timestamp: Date
  location?: string
}

interface ActivityPulseProps {
  isLive: boolean
  className?: string
}

export function ActivityPulse({ isLive, className }: ActivityPulseProps) {
  const [stats, setStats] = useState<ActivityStats>({
    nearbyUsers: 23, // Your specific requirement
    activeNow: 12, // Your specific requirement
    totalConnections: 156, // Your specific requirement
    videosWatched: 6058, // Your specific requirement
    newPosts: 63 // Your specific requirement
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!isLive) {
      setStats({
        nearbyUsers: 0,
        activeNow: 0,
        totalConnections: 0,
        videosWatched: 0,
        newPosts: 0
      })
      setRecentActivity([])
      return
    }

    // Initialize with your specific stats
    setStats({
      nearbyUsers: 23,
      activeNow: 12,
      totalConnections: 156,
      videosWatched: 6058,
      newPosts: 63
    })

    const generateActivity = (): RecentActivity => {
      const activities = [
        { type: 'message' as const, actions: ['sent a message to someone nearby', 'shared a location', 'started chatting'] },
        { type: 'video' as const, actions: ['watched a video', 'shared a video', 'liked a video', 'commented on a video'] },
        { type: 'post' as const, actions: ['shared a new post', 'posted an update', 'uploaded content'] },
        { type: 'community' as const, actions: ['joined a local community', 'created a discussion', 'shared in community'] },
        { type: 'connection' as const, actions: ['connected with someone nearby', 'made a new friend', 'accepted connection'] },
        { type: 'marketplace' as const, actions: ['listed an item', 'made a purchase', 'browsed marketplace'] },
        { type: 'learning' as const, actions: ['started a course', 'completed a lesson', 'earned points'] }
      ]

      const users = ['Alex', 'Sarah', 'Mike', 'Emma', 'Chris', 'Zara', 'Liam', 'Maya', 'Nomsa', 'Thabo', 'Katlego', 'Sipho']
      const locations = ['Cape Town CBD', 'Woodstock', 'Observatory', 'Sea Point', 'Camps Bay', 'Claremont', 'Rondebosch']
      
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      const randomAction = randomActivity.actions[Math.floor(Math.random() * randomActivity.actions.length)]
      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomLocation = Math.random() > 0.3 ? locations[Math.floor(Math.random() * locations.length)] : undefined

      return {
        id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: randomActivity.type,
        user: randomUser,
        action: randomAction,
        timestamp: new Date(),
        location: randomLocation
      }
    }

    // Generate initial activity
    const initialActivity = Array.from({ length: 8 }, generateActivity)
    setRecentActivity(initialActivity)

    // Set up real-time updates to keep stats dynamic
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        nearbyUsers: Math.max(20, prev.nearbyUsers + (Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        activeNow: Math.max(10, prev.activeNow + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        totalConnections: prev.totalConnections + (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0),
        videosWatched: prev.videosWatched + Math.floor(Math.random() * 12) + 3,
        newPosts: prev.newPosts + (Math.random() > 0.85 ? Math.floor(Math.random() * 2) + 1 : 0)
      }))
      
      setPulse(true)
      setTimeout(() => setPulse(false), 500)
    }, 8000) // Update every 8 seconds

    const activityInterval = setInterval(() => {
      const newActivity = generateActivity()
      setRecentActivity(prev => [newActivity, ...prev.slice(0, 11)])
    }, Math.random() * 6000 + 2000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(activityInterval)
    }
  }, [isLive])

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'message': return MessageCircle
      case 'video': return Video
      case 'post': return Eye
      case 'community': return Users
      case 'connection': return Zap
      case 'marketplace': return TrendingUp
      case 'learning': return Activity
      default: return Activity
    }
  }

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'message': return 'text-blue-500'
      case 'video': return 'text-purple-500'
      case 'post': return 'text-green-500'
      case 'community': return 'text-orange-500'
      case 'connection': return 'text-pink-500'
      case 'marketplace': return 'text-emerald-500'
      case 'learning': return 'text-indigo-500'
      default: return 'text-gray-500'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    
    if (seconds < 10) return 'just now'
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  if (!isLive) {
    return (
      <div className={cn("bg-gray-100 rounded-lg p-3", className)}>
        <div className="flex items-center gap-2 text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Live Activity (Backend Required)</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-gradient-to-r from-green-50 to-blue-50 rounded-lg transition-all duration-300", className)}>
      {/* Main Stats Bar */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full p-3 flex items-center justify-between hover:bg-white/30 rounded-lg transition-all duration-200",
          pulse && "animate-pulse"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Flame className={cn(
              "w-5 h-5 text-red-500 transition-all duration-300",
              pulse && "scale-110"
            )} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">{stats.nearbyUsers}</span>
              <span className="text-green-600">nearby</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-800">{stats.activeNow}</span>
              <span className="text-blue-600">active now</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-700 font-medium">🔥 Live</span>
          </div>
          <Activity className={cn(
            "w-4 h-4 text-green-600 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-3 pb-3 animate-fadeIn">
          {/* Your Specific Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-purple-600">{stats.totalConnections.toLocaleString()}</div>
              <div className="text-xs text-purple-600">Connections</div>
            </div>
            <div className="bg-white/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-indigo-600">{stats.videosWatched.toLocaleString()}</div>
              <div className="text-xs text-indigo-600">Videos Watched</div>
            </div>
            <div className="bg-white/50 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-emerald-600">{stats.newPosts}</div>
              <div className="text-xs text-emerald-600">New Posts</div>
            </div>
          </div>

          {/* Enhanced Activity Metrics */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-purple-700 font-medium">{(stats.videosWatched / 100).toFixed(1)}k today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                <span className="text-pink-700 font-medium">+{stats.nearbyUsers} this hour</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-700 font-medium">{stats.activeNow} chatting now</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700 font-medium">{stats.newPosts} posts today</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Live Activity
            </h4>
            
            <div className="max-h-40 overflow-y-auto space-y-1">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-center gap-2 text-xs animate-slideInLeft">
                    <Icon className={cn("w-3 h-3", getActivityColor(activity.type))} />
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className="text-gray-600">{activity.action}</span>
                    {activity.location && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-2 h-2" />
                        <span>{activity.location}</span>
                      </div>
                    )}
                    <span className="text-gray-400 ml-auto">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}