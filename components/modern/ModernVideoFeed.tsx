import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, Play, Pause, Volume2, VolumeX, MoreVertical, Plus, Music, Filter, Sparkles, MapPin, Send } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'
import { cn } from '../ui/utils'

interface VideoItem {
  id: string
  creator: {
    name: string
    username: string
    avatar: string
    isVerified: boolean
    isLocal: boolean
    distance?: string
  }
  video: {
    url: string
    thumbnail: string
    duration: number
    description: string
    music?: {
      title: string
      artist: string
    }
    location?: string
    effects?: string[]
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    isLiked: boolean
    isBookmarked: boolean
  }
  timestamp: string
}

const mockVideos: VideoItem[] = [
  {
    id: '1',
    creator: {
      name: 'Alex Thompson',
      username: 'alexcapetown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isVerified: false,
      isLocal: true,
      distance: '0.8km'
    },
    video: {
      url: '/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
      duration: 15,
      description: 'Beautiful sunrise over Table Mountain this morning! 🌅 #CapeTownSunrise #Nature',
      music: {
        title: 'Sunrise Vibes',
        artist: 'Local Artist'
      },
      location: 'Table Mountain, Cape Town',
      effects: ['Golden Hour', 'Soft Focus']
    },
    engagement: {
      likes: 1247,
      comments: 89,
      shares: 23,
      isLiked: false,
      isBookmarked: true
    },
    timestamp: '2h'
  },
  {
    id: '2',
    creator: {
      name: 'Sarah Mitchell',
      username: 'saraheats',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
      isVerified: true,
      isLocal: true,
      distance: '1.2km'
    },
    video: {
      url: '/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=700&fit=crop',
      duration: 22,
      description: 'Best coffee spots in Cape Town! ☕️ Which one should I try next? #CapeTownCoffee #LocalEats',
      music: {
        title: 'Coffee Shop Jazz',
        artist: 'Smooth Sounds'
      },
      location: 'Truth Coffee, Cape Town',
      effects: ['Warm Tone', 'Film Grain']
    },
    engagement: {
      likes: 856,
      comments: 124,
      shares: 45,
      isLiked: true,
      isBookmarked: false
    },
    timestamp: '4h'
  }
]

export function ModernVideoFeed() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})

  const currentVideo = mockVideos[currentVideoIndex]

  useEffect(() => {
    // Auto-play current video
    const video = videoRefs.current[currentVideo?.id]
    if (video && isPlaying) {
      video.play()
    }
  }, [currentVideoIndex, isPlaying, currentVideo?.id])

  const togglePlay = () => {
    const video = videoRefs.current[currentVideo?.id]
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRefs.current[currentVideo?.id]
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleLike = () => {
    console.log('Liked video:', currentVideo.id)
  }

  const handleShare = () => {
    console.log('Shared video:', currentVideo.id)
  }

  const handleComment = () => {
    setShowComments(!showComments)
  }

  const sendComment = () => {
    if (commentText.trim()) {
      console.log('Comment:', commentText)
      setCommentText('')
    }
  }

  const nextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % mockVideos.length)
    setIsPlaying(true)
  }

  const prevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + mockVideos.length) % mockVideos.length)
    setIsPlaying(true)
  }

  if (!currentVideo) return null

  return (
    <div className="relative h-full bg-black overflow-hidden">
      {/* Video Player */}
      <div 
        className="relative h-full flex items-center justify-center cursor-pointer"
        onClick={togglePlay}
      >
        <video
          ref={(el) => {
            if (el) videoRefs.current[currentVideo.id] = el
          }}
          className="h-full w-full object-cover"
          poster={currentVideo.video.thumbnail}
          muted={isMuted}
          loop
          playsInline
          onEnded={nextVideo}
        >
          <source src={currentVideo.video.url} type="video/mp4" />
        </video>

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleMute()
            }}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Creator Info Overlay */}
      <div className="absolute bottom-0 left-0 right-20 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
        {/* Creator Profile */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="w-12 h-12 border-2 border-white">
            <AvatarImage src={currentVideo.creator.avatar} />
            <AvatarFallback>{currentVideo.creator.name[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{currentVideo.creator.name}</h3>
              {currentVideo.creator.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {currentVideo.creator.isLocal && (
                <Badge variant="outline" className="text-xs px-2 border-white/50 text-white">
                  <MapPin className="w-2 h-2 mr-1" />
                  {currentVideo.creator.distance}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-300">@{currentVideo.creator.username}</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            Follow
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm mb-2">{currentVideo.video.description}</p>

        {/* Music & Location */}
        <div className="flex items-center gap-4 text-xs text-gray-300">
          {currentVideo.video.music && (
            <div className="flex items-center gap-1">
              <Music className="w-3 h-3" />
              <span>{currentVideo.video.music.title} - {currentVideo.video.music.artist}</span>
            </div>
          )}
          
          {currentVideo.video.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{currentVideo.video.location}</span>
            </div>
          )}
        </div>

        {/* Effects Tags */}
        {currentVideo.video.effects && currentVideo.video.effects.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <div className="flex gap-1">
              {currentVideo.video.effects.map((effect, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {effect}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-4">
        {/* Like Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            className={cn(
              "w-12 h-12 rounded-full backdrop-blur-sm transition-transform duration-200",
              currentVideo.engagement.isLiked 
                ? "bg-red-500/20 text-red-500 scale-110" 
                : "bg-black/30 hover:bg-black/50 text-white"
            )}
            onClick={handleLike}
          >
            <Heart className={cn(
              "w-6 h-6",
              currentVideo.engagement.isLiked && "fill-current"
            )} />
          </Button>
          <span className="text-white text-xs font-medium">
            {currentVideo.engagement.likes > 999 
              ? `${(currentVideo.engagement.likes / 1000).toFixed(1)}K`
              : currentVideo.engagement.likes
            }
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            onClick={handleComment}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs font-medium">{currentVideo.engagement.comments}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            size="lg"
            className="w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
            onClick={handleShare}
          >
            <Share2 className="w-6 h-6" />
          </Button>
          <span className="text-white text-xs font-medium">{currentVideo.engagement.shares}</span>
        </div>

        {/* Bookmark Button */}
        <Button
          variant="ghost"
          size="lg"
          className={cn(
            "w-12 h-12 rounded-full backdrop-blur-sm",
            currentVideo.engagement.isBookmarked
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-black/30 hover:bg-black/50 text-white"
          )}
        >
          <Bookmark className={cn(
            "w-5 h-5",
            currentVideo.engagement.isBookmarked && "fill-current"
          )} />
        </Button>
      </div>

      {/* Create Video FAB */}
      <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <Button className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl hover:scale-110 transition-transform duration-300">
          <Plus className="w-6 h-6 text-white" />
        </Button>
      </div>

      {/* Comments Panel */}
      {showComments && (
        <div className="absolute inset-0 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-2/3">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Comments ({currentVideo.engagement.comments})</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowComments(false)}>
                ✕
              </Button>
            </div>

            <ScrollArea className="h-48 mb-4">
              <div className="space-y-3">
                {/* Mock Comments */}
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" />
                    <AvatarFallback>J</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm"><span className="font-medium">john_ct</span> Amazing view! 😍</p>
                    <p className="text-xs text-gray-500">2h ago</p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Comment Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && sendComment()}
              />
              <Button onClick={sendComment} disabled={!commentText.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Hints */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-white/50 text-xs">
        Swipe up/down
      </div>
    </div>
  )
}