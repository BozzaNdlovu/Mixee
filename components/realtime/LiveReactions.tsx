import { useState, useEffect, useRef } from 'react'
import { Heart, Smile, ThumbsUp, Star, Zap, Flame, Sparkles, Trophy, Gift } from 'lucide-react'
import { cn } from '../ui/utils'

interface Reaction {
  id: string
  type: 'heart' | 'smile' | 'thumbsup' | 'star' | 'zap' | 'flame' | 'sparkles' | 'trophy' | 'gift'
  x: number
  y: number
  timestamp: Date
  userId: string
  userName?: string
}

interface FloatingReaction extends Reaction {
  opacity: number
  scale: number
  deltaY: number
}

interface LiveReactionsProps {
  contentId: string
  contentType: 'message' | 'video' | 'post' | 'community' | 'marketplace' | 'course'
  isLive: boolean
  onReaction?: (type: Reaction['type']) => void
  className?: string
}

export function LiveReactions({ 
  contentId, 
  contentType, 
  isLive, 
  onReaction,
  className 
}: LiveReactionsProps) {
  const [reactions, setReactions] = useState<FloatingReaction[]>([])
  const [reactionCounts, setReactionCounts] = useState<Record<Reaction['type'], number>>({
    heart: 0,
    smile: 0,
    thumbsup: 0,
    star: 0,
    zap: 0,
    flame: 0,
    sparkles: 0,
    trophy: 0,
    gift: 0
  })
  const [isReacting, setIsReacting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const reactionIcons = {
    heart: { icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
    smile: { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    thumbsup: { icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-100' },
    star: { icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
    zap: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100' },
    flame: { icon: Flame, color: 'text-red-600', bg: 'bg-red-100' },
    sparkles: { icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-100' },
    trophy: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100' },
    gift: { icon: Gift, color: 'text-green-500', bg: 'bg-green-100' }
  }

  useEffect(() => {
    if (!isLive) return

    // Initialize with live data from backend
    // TODO: Replace with actual API call to get reaction counts
    setReactionCounts({
      heart: Math.floor(Math.random() * 50) + 10,
      smile: Math.floor(Math.random() * 30) + 5,
      thumbsup: Math.floor(Math.random() * 40) + 8,
      star: Math.floor(Math.random() * 25) + 3,
      zap: Math.floor(Math.random() * 20) + 2,
      flame: Math.floor(Math.random() * 35) + 6,
      sparkles: Math.floor(Math.random() * 15) + 1,
      trophy: Math.floor(Math.random() * 10) + 1,
      gift: Math.floor(Math.random() * 5) + 1
    })

    // Set up real-time subscription for incoming reactions
    // TODO: Replace with actual Supabase real-time subscription
    const simulateReaction = () => {
      if (!containerRef.current) return

      const reactionTypes = Object.keys(reactionIcons) as Reaction['type'][]
      const randomType = reactionTypes[Math.floor(Math.random() * reactionTypes.length)]
      
      const containerRect = containerRef.current.getBoundingClientRect()
      const reaction: FloatingReaction = {
        id: `reaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: randomType,
        x: Math.random() * (containerRect.width - 40) + 20,
        y: containerRect.height - 20,
        timestamp: new Date(),
        userId: `user_${Math.floor(Math.random() * 100)}`,
        opacity: 1,
        scale: 1,
        deltaY: 0
      }

      setReactions(prev => [...prev, reaction])
      setReactionCounts(prev => ({ ...prev, [randomType]: prev[randomType] + 1 }))
    }

    const interval = setInterval(simulateReaction, Math.random() * 6000 + 2000)
    return () => clearInterval(interval)
  }, [isLive, contentId])

  // Animate floating reactions
  useEffect(() => {
    const animateReactions = () => {
      setReactions(prev => {
        return prev.map(reaction => ({
          ...reaction,
          opacity: Math.max(0, reaction.opacity - 0.02),
          scale: Math.max(0.3, reaction.scale - 0.01),
          deltaY: reaction.deltaY - 2
        })).filter(reaction => reaction.opacity > 0)
      })
    }

    const animationInterval = setInterval(animateReactions, 50)
    return () => clearInterval(animationInterval)
  }, [])

  const handleReactionClick = (type: Reaction['type']) => {
    if (!isLive || !containerRef.current) return

    setIsReacting(true)
    setTimeout(() => setIsReacting(false), 300)

    // TODO: Send reaction to backend via API call
    const containerRect = containerRef.current.getBoundingClientRect()
    const reaction: FloatingReaction = {
      id: `reaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      x: Math.random() * (containerRect.width - 40) + 20,
      y: containerRect.height - 20,
      timestamp: new Date(),
      userId: 'current_user',
      opacity: 1,
      scale: 1.2,
      deltaY: 0
    }

    setReactions(prev => [...prev, reaction])
    setReactionCounts(prev => ({ ...prev, [type]: prev[type] + 1 }))
    onReaction?.(type)
  }

  const getTopReactions = () => {
    return Object.entries(reactionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .filter(([,count]) => count > 0)
  }

  if (!isLive) {
    return (
      <div className={cn("bg-gray-100 rounded-lg p-4", className)}>
        <div className="text-center text-gray-500">
          <Heart className="w-8 h-8 mx-auto mb-2" />
          <p>Live reactions unavailable</p>
          <p className="text-sm">Backend connection required</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Floating Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {reactions.map((reaction) => {
          const ReactionIcon = reactionIcons[reaction.type].icon
          return (
            <div
              key={reaction.id}
              className="absolute animate-bounce"
              style={{
                left: `${reaction.x}px`,
                bottom: `${-reaction.deltaY}px`,
                opacity: reaction.opacity,
                transform: `scale(${reaction.scale})`,
              }}
            >
              <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shadow-lg",
                reactionIcons[reaction.type].bg
              )}>
                <ReactionIcon className={cn("w-4 h-4", reactionIcons[reaction.type].color)} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Reaction Controls */}
      <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-2xl p-2 border border-gray-200/50">
        {/* Top Reactions Display */}
        <div className="flex items-center gap-1 px-2">
          {getTopReactions().map(([type, count]) => {
            const ReactionIcon = reactionIcons[type as Reaction['type']].icon
            return (
              <div key={type} className="flex items-center gap-1">
                <ReactionIcon className={cn(
                  "w-4 h-4", 
                  reactionIcons[type as Reaction['type']].color
                )} />
                <span className="text-sm font-medium text-gray-600">
                  {count > 999 ? `${Math.floor(count / 1000)}k` : count}
                </span>
              </div>
            )
          })}
        </div>

        {/* Reaction Buttons */}
        <div className="flex items-center gap-1">
          {Object.entries(reactionIcons).slice(0, 5).map(([type, config]) => {
            const ReactionIcon = config.icon
            return (
              <button
                key={type}
                onClick={() => handleReactionClick(type as Reaction['type'])}
                className={cn(
                  "p-2 rounded-full transition-all duration-200 hover:scale-110 hover:bg-gray-100 active:scale-95",
                  isReacting && "animate-pulse"
                )}
              >
                <ReactionIcon className={cn("w-4 h-4", config.color)} />
              </button>
            )
          })}
        </div>

        {/* Live Indicator */}
        <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Live</span>
        </div>
      </div>

      {/* Celebration Effect */}
      {isReacting && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-ping" />
        </div>
      )}
    </div>
  )
}

// Compact version for smaller spaces
export function CompactLiveReactions({ 
  contentId, 
  contentType, 
  isLive,
  className 
}: Omit<LiveReactionsProps, 'onReaction'>) {
  const [reactionCount, setReactionCount] = useState(0)
  const [lastReactionType, setLastReactionType] = useState<Reaction['type']>('heart')
  const [showReactionBurst, setShowReactionBurst] = useState(false)

  useEffect(() => {
    if (!isLive) return

    // TODO: Replace with actual API call to get reaction count
    setReactionCount(Math.floor(Math.random() * 100) + 20)

    const interval = setInterval(() => {
      const types: Reaction['type'][] = ['heart', 'smile', 'thumbsup', 'flame']
      const randomType = types[Math.floor(Math.random() * types.length)]
      
      setLastReactionType(randomType)
      setReactionCount(prev => prev + 1)
      setShowReactionBurst(true)
      setTimeout(() => setShowReactionBurst(false), 500)
    }, Math.random() * 8000 + 3000)

    return () => clearInterval(interval)
  }, [isLive, contentId])

  const reactionIcons = {
    heart: { icon: Heart, color: 'text-red-500', bg: 'bg-red-100' },
    smile: { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    thumbsup: { icon: ThumbsUp, color: 'text-blue-500', bg: 'bg-blue-100' },
    star: { icon: Star, color: 'text-purple-500', bg: 'bg-purple-100' },
    zap: { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-100' },
    flame: { icon: Flame, color: 'text-red-600', bg: 'bg-red-100' },
    sparkles: { icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-100' },
    trophy: { icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-100' },
    gift: { icon: Gift, color: 'text-green-500', bg: 'bg-green-100' }
  }

  if (!isLive) {
    return (
      <div className={cn("flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full", className)}>
        <Heart className="w-3 h-3 text-gray-400" />
        <span className="text-xs text-gray-500">Offline</span>
      </div>
    )
  }

  const ReactionIcon = reactionIcons[lastReactionType].icon

  return (
    <div className={cn("relative flex items-center gap-2", className)}>
      <div className={cn(
        "flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-300",
        showReactionBurst 
          ? "bg-gradient-to-r from-pink-100 to-purple-100 scale-110" 
          : "bg-gray-100"
      )}>
        <ReactionIcon className={cn(
          "w-3 h-3 transition-all duration-300",
          reactionIcons[lastReactionType].color,
          showReactionBurst && "animate-bounce"
        )} />
        <span className="text-xs font-medium text-gray-600">
          {reactionCount > 999 ? `${Math.floor(reactionCount / 1000)}k` : reactionCount}
        </span>
      </div>

      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
    </div>
  )
}