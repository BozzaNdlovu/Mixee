import { useState, useRef } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, Play, Pause, Volume2, VolumeX, MapPin, MoreVertical, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Card } from '../ui/card'

interface ContentItem {
  id: string
  type: 'video' | 'story' | 'photo'
  creator: {
    name: string
    username: string
    avatar: string
    isLocal: boolean
    distance?: string
    isVerified?: boolean
  }
  content: {
    url: string
    thumbnail?: string
    duration?: number
    description: string
    location?: string
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

const mockContent: ContentItem[] = [
  {
    id: '1',
    type: 'video',
    creator: {
      name: 'Alex Thompson',
      username: '@alexcapetown',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      isLocal: true,
      distance: '0.8km'
    },
    content: {
      url: '/video1.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      duration: 15,
      description: 'Beautiful sunrise over Table Mountain this morning! 🌅 Nothing beats Cape Town sunrises',
      location: 'Table Mountain, Cape Town'
    },
    engagement: {
      likes: 342,
      comments: 28,
      shares: 12,
      isLiked: false,
      isBookmarked: true
    },
    timestamp: '2h'
  },
  {
    id: '2',
    type: 'video',
    creator: {
      name: 'Sarah Mitchell',
      username: '@saraheats',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
      isLocal: true,
      distance: '1.2km',
      isVerified: true
    },
    content: {
      url: '/video2.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=600&fit=crop',
      duration: 22,
      description: 'Best local coffee spots in Cape Town! Starting with Truth Coffee ☕️ #CapeTownCoffee',
      location: 'Truth Coffee, Cape Town'
    },
    engagement: {
      likes: 156,
      comments: 45,
      shares: 8,
      isLiked: true,
      isBookmarked: false
    },
    timestamp: '4h'
  },
  {
    id: '3',
    type: 'photo',
    creator: {
      name: 'Jamie Roberts',
      username: '@jamieexplores',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      isLocal: true,
      distance: '2.1km'
    },
    content: {
      url: 'https://images.unsplash.com/photo-1580669652209-c0d5bf5c48ac?w=400&h=600&fit=crop',
      description: 'Hidden gem discovered! This local street art is incredible 🎨 #CapeTownArt #LocalFinds',
      location: 'Woodstock, Cape Town'
    },
    engagement: {
      likes: 89,
      comments: 12,
      shares: 5,
      isLiked: false,
      isBookmarked: false
    },
    timestamp: '6h'
  }
]

export function ContentFeed() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set())
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({})

  const togglePlay = (contentId: string) => {
    const video = videoRefs.current[contentId]
    if (!video) return

    if (playingVideo === contentId) {
      video.pause()
      setPlayingVideo(null)
    } else {
      // Pause other videos
      Object.values(videoRefs.current).forEach(v => v.pause())
      video.play()
      setPlayingVideo(contentId)
    }
  }

  const toggleMute = (contentId: string) => {
    const video = videoRefs.current[contentId]
    if (!video) return

    const newMuted = new Set(mutedVideos)
    if (mutedVideos.has(contentId)) {
      newMuted.delete(contentId)
      video.muted = false
    } else {
      newMuted.add(contentId)
      video.muted = true
    }
    setMutedVideos(newMuted)
  }

  const handleLike = (contentId: string) => {
    // Handle like logic
    console.log('Liked content:', contentId)
  }

  const handleComment = (contentId: string) => {
    // Handle comment logic
    console.log('Comment on content:', contentId)
  }

  const handleShare = (contentId: string) => {
    // Handle share logic
    console.log('Share content:', contentId)
  }

  const handleBookmark = (contentId: string) => {
    // Handle bookmark logic
    console.log('Bookmark content:', contentId)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Feed Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between">
          <h2>Local Feed</h2>
          <Badge variant="outline" className="text-xs">
            <MapPin className="w-3 h-3 mr-1" />
            Cape Town Area
          </Badge>
        </div>
      </div>

      {/* Content Stream */}
      <ScrollArea className="flex-1">
        <div className="space-y-6">
          {mockContent.map((item) => (
            <Card key={item.id} className="border-0 border-b rounded-none">
              {/* Creator Header */}
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.creator.avatar} />
                    <AvatarFallback>
                      {item.creator.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm">{item.creator.name}</h3>
                      {item.creator.isVerified && (
                        <div className="w-4 h-4 rounded-full bg-chart-1 flex items-center justify-center">
                          <div className="w-2 h-2 text-white">✓</div>
                        </div>
                      )}
                      {item.creator.isLocal && (
                        <Badge variant="outline" className="text-xs px-1">
                          <MapPin className="w-2 h-2 mr-1" />
                          {item.creator.distance}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.creator.username} • {item.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="relative">
                {item.type === 'video' ? (
                  <div className="relative">
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[item.id] = el
                      }}
                      className="w-full aspect-[9/16] max-h-[500px] object-cover bg-black"
                      poster={item.content.thumbnail}
                      muted={mutedVideos.has(item.id)}
                      loop
                      playsInline
                    >
                      <source src={item.content.url} type="video/mp4" />
                    </video>
                    
                    {/* Video Controls */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="lg"
                        className="w-16 h-16 rounded-full bg-black/20 hover:bg-black/40 text-white"
                        onClick={() => togglePlay(item.id)}
                      >
                        {playingVideo === item.id ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Audio Control */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
                      onClick={() => toggleMute(item.id)}
                    >
                      {mutedVideos.has(item.id) ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    
                    {/* Duration */}
                    <Badge className="absolute bottom-4 left-4 text-xs">
                      {item.content.duration}s
                    </Badge>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={item.content.url}
                      alt={item.content.description}
                      className="w-full aspect-[4/5] max-h-[500px] object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between p-4 pt-3">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleLike(item.id)}
                  >
                    <Heart className={`w-5 h-5 ${item.engagement.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm">{item.engagement.likes}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleComment(item.id)}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{item.engagement.comments}</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleShare(item.id)}
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">{item.engagement.shares}</span>
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(item.id)}
                >
                  <Bookmark className={`w-5 h-5 ${item.engagement.isBookmarked ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Description */}
              <div className="px-4 pb-4">
                <p className="text-sm">{item.content.description}</p>
                {item.content.location && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {item.content.location}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}