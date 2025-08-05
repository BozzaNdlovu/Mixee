import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, Bookmark, MoreVertical, Users, Eye, Zap } from 'lucide-react'
import { LiveReactions, CompactLiveReactions } from '../realtime/LiveReactions'
import { UserPresence, MultiUserPresence } from '../realtime/UserPresence'
import { cn } from '../ui/utils'
import { isConnectedToRealBackend } from '../../utils/supabase/info'

interface VideoData {
  id: string
  title: string
  creator: string
  creatorAvatar: string
  thumbnail: string
  views: number
  likes: number
  comments: number
  duration: string
  isLive?: boolean
  liveViewers?: number
  tags: string[]
  description: string
}

interface LiveStats {
  viewers: number
  likes: number
  comments: number
  shares: number
}

interface EnhancedVideoFeedProps {
  className?: string
}

export function EnhancedVideoFeed({ className }: EnhancedVideoFeedProps) {
  const [videos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'Building the Future: South African Tech Startups 🚀',
      creator: 'TechZA',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
      thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=600&fit=crop',
      views: 12400,
      likes: 892,
      comments: 156,
      duration: '3:45',
      isLive: true,
      liveViewers: 234,
      tags: ['Tech', 'Startups', 'South Africa'],
      description: 'Exploring the incredible tech ecosystem growing in South Africa...'
    },
    {
      id: '2',
      title: 'Cape Town Street Food Adventure 🍕',
      creator: 'FoodieLife',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
      views: 8900,
      likes: 445,
      comments: 89,
      duration: '2:18',
      tags: ['Food', 'Cape Town', 'Street Food'],
      description: 'Discovering amazing local flavors in the heart of Cape Town...'
    },
    {
      id: '3',
      title: 'Learning React Native: Complete Guide ⚛️',
      creator: 'CodeMaster',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=code',
      thumbnail: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=600&fit=crop',
      views: 15600,
      likes: 1200,
      comments: 234,
      duration: '12:30',
      isLive: true,
      liveViewers: 89,
      tags: ['Coding', 'React Native', 'Tutorial'],
      description: 'Master React Native development with this comprehensive guide...'
    },
    {
      id: '4',
      title: 'Safari Adventures in Kruger 🦁',
      creator: 'WildlifeExplorer',
      creatorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wildlife',
      thumbnail: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&h=600&fit=crop',
      views: 22100,
      likes: 1800,
      comments: 567,
      duration: '8:45',
      tags: ['Wildlife', 'Safari', 'Nature'],
      description: 'Experience the Big Five up close in South Africa\'s premier game reserve...'
    }
  ])

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [liveStats, setLiveStats] = useState<LiveStats>({
    viewers: 0,
    likes: 0,
    comments: 0,
    shares: 0
  })
  const [watchPartyUsers, setWatchPartyUsers] = useState<string[]>([])
  const [connectionLive] = useState(isConnectedToRealBackend())
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentVideo = videos[currentVideoIndex]

  useEffect(() => {
    if (!connectionLive || !currentVideo.isLive) return

    // Initialize live stats
    setLiveStats({
      viewers: currentVideo.liveViewers || 0,
      likes: currentVideo.likes,
      comments: currentVideo.comments,
      shares: Math.floor(currentVideo.likes * 0.1)
    })

    // Initialize watch party users
    setWatchPartyUsers(['user1', 'user2', 'user3', 'user4', 'user5'])

    // Update stats in real-time
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        viewers: Math.max(1, prev.viewers + Math.floor(Math.random() * 3) - 1),
        likes: prev.likes + (Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0),
        comments: prev.comments + (Math.random() > 0.8 ? 1 : 0),
        shares: prev.shares + (Math.random() > 0.9 ? 1 : 0)
      }))
    }, 3000)

    // Update watch party users
    const usersInterval = setInterval(() => {
      setWatchPartyUsers(prev => {
        const shouldChange = Math.random() > 0.6
        if (!shouldChange) return prev

        const allUsers = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7']
        const shouldAdd = Math.random() > 0.5 && prev.length < 6

        if (shouldAdd) {
          const availableUsers = allUsers.filter(user => !prev.includes(user))
          if (availableUsers.length > 0) {
            const newUser = availableUsers[Math.floor(Math.random() * availableUsers.length)]
            return [...prev, newUser]
          }
        } else if (prev.length > 2) {
          const userToRemove = prev[Math.floor(Math.random() * prev.length)]
          return prev.filter(user => user !== userToRemove)
        }

        return prev
      })
    }, 8000)

    return () => {
      clearInterval(statsInterval)
      clearInterval(usersInterval)
    }
  }, [connectionLive, currentVideo, currentVideoIndex])

  const handleVideoTap = () => {
    setIsPlaying(!isPlaying)
  }

  const handleSwipeUp = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
    setIsPlaying(false)
  }

  const handleSwipeDown = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
    setIsPlaying(false)
  }

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <div className={cn("h-full bg-black relative overflow-hidden", className)}>
      {/* Video Container */}
      <div 
        className="relative w-full h-full cursor-pointer"
        onClick={handleVideoTap}
      >
        {/* Video Thumbnail/Player */}
        <div className="absolute inset-0">
          <img
            src={currentVideo.thumbnail}
            alt={currentVideo.title}
            className="w-full h-full object-cover"
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Play/Pause Button */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          )}
        </div>

        {/* Live Indicator */}
        {currentVideo.isLive && (
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <div className="flex items-center gap-1 bg-red-500 px-2 py-1 rounded-full animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full animate-ping" />
              <span className="text-white text-xs font-bold">LIVE</span>
            </div>
            
            {connectionLive && (
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                <Eye className="w-3 h-3 text-white" />
                <span className="text-white text-xs font-medium">
                  {formatCount(liveStats.viewers)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Watch Party Users */}
        {currentVideo.isLive && connectionLive && watchPartyUsers.length > 0 && (
          <div className="absolute top-4 right-4">
            <MultiUserPresence
              userIds={watchPartyUsers}
              isLive={connectionLive}
              maxVisible={4}
              className="bg-black/30 backdrop-blur-sm rounded-full px-2 py-1"
            />
          </div>
        )}

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Video Info */}
          <div className="mb-4">
            <h3 className="text-white font-semibold text-lg mb-2 leading-tight">
              {currentVideo.title}
            </h3>
            
            {/* Creator Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <img
                  src={currentVideo.creatorAvatar}
                  alt={currentVideo.creator}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
                <UserPresence
                  userId={currentVideo.creator}
                  isLive={connectionLive}
                  size="sm"
                  className="absolute -bottom-1 -right-1"
                />
              </div>
              <div>
                <p className="text-white font-medium">{currentVideo.creator}</p>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <span>{formatCount(currentVideo.views)} views</span>
                  {currentVideo.isLive && connectionLive && (
                    <>
                      <span>•</span>
                      <span>{formatCount(liveStats.viewers)} watching</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-3">
              {currentVideo.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/80 text-sm leading-relaxed">
              {currentVideo.description}
            </p>
          </div>

          {/* Live Reactions */}
          {currentVideo.isLive && connectionLive && (
            <div className="mb-4">
              <LiveReactions
                contentId={currentVideo.id}
                contentType="video"
                isLive={connectionLive}
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4">
          {/* Like Button */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-medium">
              {formatCount(connectionLive && currentVideo.isLive ? liveStats.likes : currentVideo.likes)}
            </span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-medium">
              {formatCount(connectionLive && currentVideo.isLive ? liveStats.comments : currentVideo.comments)}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <Share className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-medium">
              {formatCount(connectionLive && currentVideo.isLive ? liveStats.shares : Math.floor(currentVideo.likes * 0.1))}
            </span>
          </div>

          {/* Bookmark Button */}
          <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Bookmark className="w-6 h-6 text-white" />
          </button>

          {/* More Options */}
          <button className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>

          {/* Volume Control */}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6 text-white" />
            ) : (
              <Volume2 className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {!currentVideo.isLive && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div 
              className="h-full bg-white transition-all duration-1000"
              style={{ width: isPlaying ? '40%' : '0%' }}
            />
          </div>
        )}
      </div>

      {/* Swipe Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-2">
        <button
          onClick={handleSwipeUp}
          className="w-8 h-1 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
        />
        <div className="flex gap-1">
          {videos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1 h-1 rounded-full transition-colors",
                index === currentVideoIndex ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>
        <button
          onClick={handleSwipeDown}
          className="w-8 h-1 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
        />
      </div>

      {/* Live Stats Overlay */}
      {currentVideo.isLive && connectionLive && (
        <div className="absolute top-20 left-4 right-4">
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm font-medium">Live Activity</span>
              </div>
              <div className="text-white/70 text-xs">
                {formatCount(liveStats.viewers)} watching now
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-white font-bold">{formatCount(liveStats.likes)}</div>
                <div className="text-white/70 text-xs">Likes</div>
              </div>
              <div>
                <div className="text-white font-bold">{formatCount(liveStats.comments)}</div>
                <div className="text-white/70 text-xs">Comments</div>
              </div>
              <div>
                <div className="text-white font-bold">{formatCount(liveStats.shares)}</div>
                <div className="text-white/70 text-xs">Shares</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}