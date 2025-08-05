import { useState, useEffect } from 'react'
import { Plus, Camera } from 'lucide-react'
import { cn } from '../ui/utils'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface StoryUser {
  userId: string
  username: string
  displayName: string
  avatar?: string
  hasUnviewed: boolean
  isLive?: boolean
  storyCount: number
  lastStoryTime?: string
}

interface StoriesRingProps {
  currentUserId: string
  onStoryClick: (userId: string) => void
  onCreateStory: () => void
  className?: string
}

export function StoriesRing({ currentUserId, onStoryClick, onCreateStory, className }: StoriesRingProps) {
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStoryUsers()
  }, [])

  const loadStoryUsers = async () => {
    try {
      // Mock data - in real app would fetch from backend
      const mockUsers: StoryUser[] = [
        {
          userId: currentUserId,
          username: 'your_stories',
          displayName: 'Your Story',
          hasUnviewed: false,
          storyCount: 0
        },
        {
          userId: 'user1',
          username: 'sarah_tech',
          displayName: 'Sarah',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          hasUnviewed: true,
          isLive: true,
          storyCount: 3,
          lastStoryTime: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          userId: 'user2',
          username: 'mike_dev',
          displayName: 'Mike',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          hasUnviewed: true,
          storyCount: 1,
          lastStoryTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: 'user3',
          username: 'emma_creates',
          displayName: 'Emma',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
          hasUnviewed: false,
          storyCount: 2,
          lastStoryTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: 'user4',
          username: 'alex_games',
          displayName: 'Alex',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
          hasUnviewed: true,
          storyCount: 1,
          lastStoryTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          userId: 'user5',
          username: 'lisa_travel',
          displayName: 'Lisa',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa',
          hasUnviewed: true,
          isLive: true,
          storyCount: 4,
          lastStoryTime: new Date(Date.now() - 15 * 60 * 1000).toISOString()
        }
      ]
      
      setStoryUsers(mockUsers)
    } catch (error) {
      console.error('Failed to load story users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return `${Math.floor(diffInMinutes / 1440)}d`
  }

  if (isLoading) {
    return (
      <div className={cn("flex gap-3 p-4", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex gap-3 p-4 overflow-x-auto scrollbar-hide", className)}>
      {storyUsers.map((user) => (
        <div key={user.userId} className="flex flex-col items-center gap-2 min-w-0">
          <div className="relative">
            {/* Story Ring */}
            <button
              onClick={() => {
                if (user.userId === currentUserId && user.storyCount === 0) {
                  onCreateStory()
                } else {
                  onStoryClick(user.userId)
                }
              }}
              className={cn(
                "relative w-16 h-16 rounded-full p-0.5 transition-all duration-200",
                user.hasUnviewed && user.storyCount > 0
                  ? "bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500"
                  : user.storyCount > 0
                    ? "bg-gray-300"
                    : "bg-transparent"
              )}
            >
              <div className="w-full h-full bg-white rounded-full p-0.5">
                {user.userId === currentUserId && user.storyCount === 0 ? (
                  // Add story button
                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-2 border-dashed border-purple-300">
                    <Plus className="w-6 h-6 text-purple-500" />
                  </div>
                ) : user.avatar ? (
                  <ImageWithFallback
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.displayName[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </button>

            {/* Live indicator */}
            {user.isLive && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}

            {/* Add story camera icon for current user */}
            {user.userId === currentUserId && user.storyCount === 0 && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <Camera className="w-2.5 h-2.5 text-white" />
              </div>
            )}

            {/* Story count indicator */}
            {user.storyCount > 1 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">{user.storyCount}</span>
              </div>
            )}
          </div>

          {/* User name and time */}
          <div className="text-center min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate max-w-16">
              {user.userId === currentUserId ? 'Your Story' : user.displayName}
            </p>
            {user.lastStoryTime && user.storyCount > 0 && (
              <p className="text-xs text-gray-500">
                {formatTimeAgo(user.lastStoryTime)}
              </p>
            )}
            {user.isLive && (
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs text-red-500 font-medium">LIVE</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}