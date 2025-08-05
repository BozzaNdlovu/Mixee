import { useState, useEffect } from 'react'
import { Circle, Wifi, WifiOff } from 'lucide-react'
import { cn } from '../ui/utils'

interface UserStatus {
  id: string
  isOnline: boolean
  lastSeen: Date
  status: 'online' | 'away' | 'busy' | 'offline'
  activity?: string
}

interface UserPresenceProps {
  userId: string
  isLive: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function UserPresence({ userId, isLive, size = 'md', showLabel = false, className }: UserPresenceProps) {
  const [userStatus, setUserStatus] = useState<UserStatus>({
    id: userId,
    isOnline: false,
    lastSeen: new Date(),
    status: 'offline'
  })

  useEffect(() => {
    if (!isLive) {
      setUserStatus(prev => ({ ...prev, isOnline: false, status: 'offline' }))
      return
    }

    // Initialize as online
    setUserStatus({
      id: userId,
      isOnline: true,
      lastSeen: new Date(),
      status: 'online',
      activity: 'Active in SupaApp'
    })

    // Simulate status changes
    const statusInterval = setInterval(() => {
      setUserStatus(prev => {
        const statuses: UserStatus['status'][] = ['online', 'away', 'busy']
        const activities = [
          'Active in SupaApp',
          'Browsing communities',
          'Watching videos',
          'In marketplace',
          'Learning',
          'Chatting'
        ]

        const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
        const newActivity = activities[Math.floor(Math.random() * activities.length)]

        return {
          ...prev,
          status: newStatus,
          isOnline: newStatus !== 'offline',
          lastSeen: new Date(),
          activity: newStatus === 'online' ? newActivity : undefined
        }
      })
    }, Math.random() * 30000 + 15000) // Random interval 15-45 seconds

    return () => clearInterval(statusInterval)
  }, [isLive, userId])

  const getStatusColor = () => {
    switch (userStatus.status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getStatusText = () => {
    switch (userStatus.status) {
      case 'online': return 'Online'
      case 'away': return 'Away'
      case 'busy': return 'Busy'
      default: return 'Offline'
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return { dot: 'w-2 h-2', container: 'w-3 h-3' }
      case 'lg': return { dot: 'w-4 h-4', container: 'w-5 h-5' }
      default: return { dot: 'w-3 h-3', container: 'w-4 h-4' }
    }
  }

  const sizes = getSizeClasses()

  const formatLastSeen = () => {
    if (userStatus.isOnline) return 'Active now'
    
    const now = new Date()
    const diff = now.getTime() - userStatus.lastSeen.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Last seen just now'
    if (minutes < 60) return `Last seen ${minutes}m ago`
    if (minutes < 1440) return `Last seen ${Math.floor(minutes / 60)}h ago`
    return `Last seen ${Math.floor(minutes / 1440)}d ago`
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status Indicator */}
      <div className={cn("relative flex items-center justify-center", sizes.container)}>
        <div className={cn(
          "rounded-full border-2 border-white transition-all duration-300",
          sizes.dot,
          getStatusColor(),
          userStatus.isOnline && "animate-pulse"
        )} />
        
        {/* Connection indicator */}
        {isLive && userStatus.isOnline && (
          <div className="absolute -inset-1">
            <div className={cn(
              "rounded-full border opacity-75 animate-ping",
              sizes.container,
              getStatusColor().replace('bg-', 'border-')
            )} />
          </div>
        )}
      </div>

      {/* Status Label */}
      {showLabel && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-sm font-medium",
              userStatus.isOnline ? "text-green-600" : "text-gray-500"
            )}>
              {getStatusText()}
            </span>
            {isLive && userStatus.isOnline && (
              <Wifi className="w-3 h-3 text-green-500" />
            )}
            {!isLive && (
              <WifiOff className="w-3 h-3 text-gray-400" />
            )}
          </div>
          
          <div className="text-xs text-gray-500 truncate">
            {userStatus.activity || formatLastSeen()}
          </div>
        </div>
      )}
    </div>
  )
}

// Multi-user presence for showing multiple users online
interface MultiUserPresenceProps {
  userIds: string[]
  isLive: boolean
  maxVisible?: number
  className?: string
}

export function MultiUserPresence({ userIds, isLive, maxVisible = 3, className }: MultiUserPresenceProps) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])

  useEffect(() => {
    if (!isLive) {
      setOnlineUsers([])
      return
    }

    // Simulate some users being online
    const initialOnline = userIds.filter(() => Math.random() > 0.3)
    setOnlineUsers(initialOnline)

    // Simulate users going online/offline
    const interval = setInterval(() => {
      setOnlineUsers(prev => {
        const shouldChange = Math.random() > 0.7
        if (!shouldChange) return prev

        const availableUsers = userIds.filter(id => !prev.includes(id))
        const shouldAdd = Math.random() > 0.5 && availableUsers.length > 0

        if (shouldAdd) {
          const userToAdd = availableUsers[Math.floor(Math.random() * availableUsers.length)]
          return [...prev, userToAdd]
        } else if (prev.length > 0) {
          const userToRemove = prev[Math.floor(Math.random() * prev.length)]
          return prev.filter(id => id !== userToRemove)
        }

        return prev
      })
    }, Math.random() * 20000 + 10000)

    return () => clearInterval(interval)
  }, [isLive, userIds])

  const visibleUsers = onlineUsers.slice(0, maxVisible)
  const hiddenCount = Math.max(0, onlineUsers.length - maxVisible)

  if (onlineUsers.length === 0) return null

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* User avatars */}
      <div className="flex -space-x-1">
        {visibleUsers.map((userId, index) => (
          <div key={userId} className="relative">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full border-2 border-white flex items-center justify-center animate-scaleIn">
              <span className="text-white text-xs font-bold">
                {String.fromCharCode(65 + index)}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
        ))}
      </div>

      {/* Count indicator */}
      <div className="flex items-center gap-1 text-xs text-gray-600">
        <Circle className="w-2 h-2 text-green-500 fill-current" />
        <span>
          {onlineUsers.length} online
          {hiddenCount > 0 && ` (+${hiddenCount} more)`}
        </span>
      </div>
    </div>
  )
}