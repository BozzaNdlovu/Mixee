import { useState, useEffect } from 'react'
import { cn } from '../ui/utils'

interface TypingUser {
  id: string
  name: string
  avatar?: string
}

interface TypingIndicatorProps {
  conversationId: string
  currentUserId: string
  isLive: boolean
  className?: string
}

export function TypingIndicator({ conversationId, currentUserId, isLive, className }: TypingIndicatorProps) {
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])

  useEffect(() => {
    if (!isLive) return

    // Simulate typing users
    const simulateTyping = () => {
      const users = [
        { id: 'user1', name: 'Alex', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' },
        { id: 'user2', name: 'Sarah', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        { id: 'user3', name: 'Mike', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' }
      ]

      const randomUser = users[Math.floor(Math.random() * users.length)]
      
      // Random chance someone starts typing
      if (Math.random() > 0.7) {
        setTypingUsers(prev => {
          // Don't add if already typing or if it's current user
          if (prev.find(u => u.id === randomUser.id) || randomUser.id === currentUserId) {
            return prev
          }
          return [...prev, randomUser]
        })

        // Stop typing after 2-5 seconds
        setTimeout(() => {
          setTypingUsers(prev => prev.filter(u => u.id !== randomUser.id))
        }, Math.random() * 3000 + 2000)
      }
    }

    const interval = setInterval(simulateTyping, Math.random() * 10000 + 5000)
    return () => clearInterval(interval)
  }, [isLive, conversationId, currentUserId])

  if (typingUsers.length === 0) return null

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].name} is typing...`
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
    } else {
      return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`
    }
  }

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 text-sm text-gray-500 animate-fadeIn",
      className
    )}>
      {/* Avatar(s) */}
      <div className="flex -space-x-1">
        {typingUsers.slice(0, 3).map((user) => (
          <div
            key={user.id}
            className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
          >
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Typing text */}
      <span className="text-gray-600">{getTypingText()}</span>

      {/* Animated typing dots */}
      <div className="flex items-center gap-1 ml-1">
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}

// Enhanced typing dots animation
export function TypingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center space-x-1 p-2 bg-gray-100 rounded-full">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  )
}