import { useState, useEffect, useRef } from 'react'
import { Camera, X, Circle, Square, Send, Type, Smile, Palette, Music, Timer, Users, Eye, Heart, MessageCircle, Share } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '../ui/utils'
import { ImageWithFallback } from '../figma/ImageWithFallback'

interface Story {
  id: string
  userId: string
  username: string
  displayName: string
  avatar?: string
  content: {
    type: 'image' | 'video' | 'text'
    url?: string
    text?: string
    backgroundColor?: string
    filter?: string
  }
  timestamp: string
  expiresAt: string
  views: number
  reactions: { userId: string; emoji: string }[]
  isViewed?: boolean
}

interface StoryUser {
  userId: string
  username: string
  displayName: string
  avatar?: string
  stories: Story[]
  hasUnviewed: boolean
}

interface StoriesHubProps {
  currentUserId: string
  className?: string
  onClose?: () => void
}

interface StoryCameraProps {
  onCapture: (data: { type: 'image' | 'video' | 'text'; content: any }) => void
  onClose: () => void
}

function StoryCamera({ onCapture, onClose }: StoryCameraProps) {
  const [mode, setMode] = useState<'photo' | 'video' | 'text'>('photo')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [textContent, setTextContent] = useState('')
  const [textColor, setTextColor] = useState('#FFFFFF')
  const [backgroundColor, setBackground] = useState('#FF6B6B')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const filters = [
    { name: 'None', class: '', value: null },
    { name: 'Vintage', class: 'sepia(0.5) contrast(1.2)', value: 'vintage' },
    { name: 'Cool', class: 'hue-rotate(240deg) saturate(1.5)', value: 'cool' },
    { name: 'Warm', class: 'hue-rotate(25deg) saturate(1.3)', value: 'warm' },
    { name: 'B&W', class: 'grayscale(1) contrast(1.2)', value: 'bw' },
    { name: 'Bright', class: 'brightness(1.3) saturate(1.2)', value: 'bright' }
  ]

  const backgrounds = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ]

  useEffect(() => {
    if (mode !== 'text') {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [mode])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: mode === 'video' 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Apply filter
    if (selectedFilter) {
      const filterValue = filters.find(f => f.value === selectedFilter)?.class
      if (filterValue) {
        ctx.filter = filterValue
      }
    }
    
    ctx.drawImage(video, 0, 0)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        onCapture({
          type: 'image',
          content: { url, filter: selectedFilter }
        })
      }
    }, 'image/jpeg', 0.9)
  }

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      setRecordingTime(0)
      // In a real app, would stop media recorder and process video
      onCapture({
        type: 'video',
        content: { url: 'demo_video.mp4', duration: recordingTime, filter: selectedFilter }
      })
    } else {
      // Start recording
      setIsRecording(true)
      setRecordingTime(0)
    }
  }

  const createTextStory = () => {
    if (!textContent.trim()) return
    
    onCapture({
      type: 'text',
      content: {
        text: textContent,
        textColor,
        backgroundColor
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
          
          {/* Mode Toggle */}
          <div className="flex items-center gap-2 bg-black/30 rounded-full p-1">
            <button
              onClick={() => setMode('photo')}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                mode === 'photo' ? "bg-white text-black" : "text-white"
              )}
            >
              Photo
            </button>
            <button
              onClick={() => setMode('video')}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                mode === 'video' ? "bg-white text-black" : "text-white"
              )}
            >
              Video
            </button>
            <button
              onClick={() => setMode('text')}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors",
                mode === 'text' ? "bg-white text-black" : "text-white"
              )}
            >
              Text
            </button>
          </div>

          {isRecording && (
            <div className="flex items-center gap-2 text-white">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono">
                {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Camera/Content Area */}
      <div className="flex-1 relative">
        {mode === 'text' ? (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{ backgroundColor }}
          >
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Type your story..."
              className="w-full h-32 bg-transparent border-none outline-none text-center text-2xl font-bold resize-none placeholder-white/70"
              style={{ color: textColor }}
              maxLength={200}
            />
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "w-full h-full object-cover",
                selectedFilter && `filter-${selectedFilter}`
              )}
              style={{
                filter: selectedFilter ? filters.find(f => f.value === selectedFilter)?.class : undefined
              }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Filters/Tools */}
      {mode !== 'text' && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <div className="flex flex-col gap-2">
            {filters.map((filter) => (
              <button
                key={filter.name}
                onClick={() => setSelectedFilter(filter.value)}
                className={cn(
                  "w-12 h-12 rounded-full text-xs font-medium transition-all",
                  selectedFilter === filter.value
                    ? "bg-white text-black scale-110"
                    : "bg-black/50 text-white hover:bg-black/70"
                )}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text Mode Tools */}
      {mode === 'text' && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="space-y-4">
            {/* Background Colors */}
            <div className="space-y-2">
              {backgrounds.map((color) => (
                <button
                  key={color}
                  onClick={() => setBackground(color)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2",
                    backgroundColor === color ? "border-white" : "border-white/30"
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Text Color Toggle */}
            <button
              onClick={() => setTextColor(textColor === '#FFFFFF' ? '#000000' : '#FFFFFF')}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <Type className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center">
          {mode === 'photo' && (
            <Button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 p-0"
            >
              <Circle className="w-8 h-8 text-black" />
            </Button>
          )}
          
          {mode === 'video' && (
            <Button
              onClick={toggleRecording}
              className={cn(
                "w-16 h-16 rounded-full p-0 transition-colors",
                isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-white hover:bg-gray-100"
              )}
            >
              {isRecording ? (
                <Square className="w-6 h-6 text-white" />
              ) : (
                <Circle className="w-8 h-8 text-red-500" />
              )}
            </Button>
          )}
          
          {mode === 'text' && (
            <Button
              onClick={createTextStory}
              disabled={!textContent.trim()}
              className="w-16 h-16 rounded-full bg-white hover:bg-gray-100 p-0 disabled:opacity-50"
            >
              <Send className="w-6 h-6 text-black" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function StoriesHub({ currentUserId, className, onClose }: StoriesHubProps) {
  const [storyUsers, setStoryUsers] = useState<StoryUser[]>([])
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentUserStoryIndex, setCurrentUserStoryIndex] = useState(0)
  const [showCamera, setShowCamera] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadStories()
  }, [])

  useEffect(() => {
    // Auto-advance stories
    if (storyUsers.length > 0 && currentStoryIndex < storyUsers.length) {
      const currentUser = storyUsers[currentStoryIndex]
      const currentStory = currentUser.stories[currentUserStoryIndex]
      
      if (currentStory) {
        const duration = currentStory.content.type === 'text' ? 5000 : 8000
        setProgress(0)
        
        timerRef.current = setInterval(() => {
          setProgress(prev => {
            const newProgress = prev + (100 / (duration / 100))
            if (newProgress >= 100) {
              nextStory()
              return 0
            }
            return newProgress
          })
        }, 100)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentStoryIndex, currentUserStoryIndex, storyUsers])

  const loadStories = async () => {
    try {
      // Mock data - in real app would fetch from backend
      const mockStories: StoryUser[] = [
        {
          userId: currentUserId,
          username: 'your_stories',
          displayName: 'Your Story',
          avatar: undefined,
          hasUnviewed: false,
          stories: []
        },
        {
          userId: 'user1',
          username: 'sarah_tech',
          displayName: 'Sarah Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          hasUnviewed: true,
          stories: [
            {
              id: 'story1',
              userId: 'user1',
              username: 'sarah_tech',
              displayName: 'Sarah Johnson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
              content: {
                type: 'image',
                url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=600&fit=crop'
              },
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
              views: 45,
              reactions: [
                { userId: 'user2', emoji: '❤️' },
                { userId: 'user3', emoji: '😍' }
              ]
            }
          ]
        },
        {
          userId: 'user2',
          username: 'mike_dev',
          displayName: 'Mike Chen',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
          hasUnviewed: true,
          stories: [
            {
              id: 'story2',
              userId: 'user2',
              username: 'mike_dev',
              displayName: 'Mike Chen',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
              content: {
                type: 'text',
                text: 'Just deployed my new app! 🚀',
                backgroundColor: '#4ECDC4',
                textColor: '#FFFFFF'
              },
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
              views: 23,
              reactions: [
                { userId: 'user1', emoji: '🔥' },
                { userId: currentUserId, emoji: '👏' }
              ]
            }
          ]
        }
      ]
      
      setStoryUsers(mockStories)
    } catch (error) {
      console.error('Failed to load stories:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const nextStory = () => {
    const currentUser = storyUsers[currentStoryIndex]
    
    if (currentUserStoryIndex < currentUser.stories.length - 1) {
      setCurrentUserStoryIndex(prev => prev + 1)
    } else if (currentStoryIndex < storyUsers.length - 1) {
      setCurrentStoryIndex(prev => prev + 1)
      setCurrentUserStoryIndex(0)
    } else {
      onClose?.()
    }
    
    setProgress(0)
  }

  const previousStory = () => {
    if (currentUserStoryIndex > 0) {
      setCurrentUserStoryIndex(prev => prev - 1)
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1)
      const prevUser = storyUsers[currentStoryIndex - 1]
      setCurrentUserStoryIndex(prevUser.stories.length - 1)
    }
    
    setProgress(0)
  }

  const handleStoryCapture = async (data: { type: 'image' | 'video' | 'text'; content: any }) => {
    try {
      // In real app, would upload to backend
      const newStory: Story = {
        id: `story_${Date.now()}`,
        userId: currentUserId,
        username: 'you',
        displayName: 'You',
        content: data.content,
        timestamp: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        views: 0,
        reactions: []
      }

      setStoryUsers(prev => 
        prev.map(user => 
          user.userId === currentUserId 
            ? { ...user, stories: [newStory, ...user.stories] }
            : user
        )
      )
      
      setShowCamera(false)
    } catch (error) {
      console.error('Failed to create story:', error)
    }
  }

  const addReaction = (emoji: string) => {
    // Optimistic update
    setStoryUsers(prev => 
      prev.map(user => 
        user.userId === storyUsers[currentStoryIndex].userId
          ? {
              ...user,
              stories: user.stories.map((story, index) => 
                index === currentUserStoryIndex
                  ? {
                      ...story,
                      reactions: [
                        ...story.reactions.filter(r => r.userId !== currentUserId),
                        { userId: currentUserId, emoji }
                      ]
                    }
                  : story
              )
            }
          : user
      )
    )
  }

  if (showCamera) {
    return (
      <StoryCamera
        onCapture={handleStoryCapture}
        onClose={() => setShowCamera(false)}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading stories...</p>
        </div>
      </div>
    )
  }

  // Story viewer mode
  if (currentStoryIndex >= 0 && storyUsers[currentStoryIndex]) {
    const currentUser = storyUsers[currentStoryIndex]
    const currentStory = currentUser.stories[currentUserStoryIndex]

    // Show "Add Story" for current user if no stories
    if (currentUser.userId === currentUserId && currentUser.stories.length === 0) {
      return (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
          <div className="text-center text-white">
            <Camera className="w-16 h-16 mx-auto mb-4 text-white/70" />
            <h2 className="text-xl font-bold mb-2">Share Your Story</h2>
            <p className="text-white/70 mb-6">Create your first story to share with friends</p>
            <div className="space-y-3">
              <Button 
                onClick={() => setShowCamera(true)}
                className="w-full bg-white text-black hover:bg-gray-100"
              >
                <Camera className="w-5 h-5 mr-2" />
                Create Story
              </Button>
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="w-full text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )
    }

    if (!currentStory) {
      nextStory()
      return null
    }

    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4">
          <div className="flex gap-1">
            {currentUser.stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: index === currentUserStoryIndex 
                      ? `${progress}%` 
                      : index < currentUserStoryIndex 
                        ? '100%' 
                        : '0%' 
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Story content */}
        <div 
          className="w-full h-full cursor-pointer flex"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const width = rect.width
            
            if (x < width / 2) {
              previousStory()
            } else {
              nextStory()
            }
          }}
        >
          {currentStory.content.type === 'image' && (
            <ImageWithFallback
              src={currentStory.content.url!}
              alt="Story"
              className="w-full h-full object-cover"
            />
          )}
          
          {currentStory.content.type === 'text' && (
            <div 
              className="w-full h-full flex items-center justify-center p-8"
              style={{ backgroundColor: currentStory.content.backgroundColor }}
            >
              <p 
                className="text-center text-2xl font-bold"
                style={{ color: currentStory.content.textColor }}
              >
                {currentStory.content.text}
              </p>
            </div>
          )}
          
          {currentStory.content.type === 'video' && (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            >
              <source src={currentStory.content.url} type="video/mp4" />
            </video>
          )}
        </div>

        {/* Story header */}
        <div className="absolute top-12 left-0 right-0 z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentUser.avatar ? (
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded-full border-2 border-white"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white font-bold">
                    {currentUser.displayName[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-semibold">{currentUser.displayName}</p>
                <p className="text-white/70 text-sm">
                  {new Date(currentStory.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Story actions */}
        <div className="absolute bottom-4 left-0 right-0 z-10 p-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => addReaction('❤️')}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <Heart className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Share className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex items-center gap-1 text-white/70 text-sm">
              <Eye className="w-4 h-4" />
              <span>{currentStory.views}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}