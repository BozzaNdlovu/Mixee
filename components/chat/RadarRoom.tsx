import { useState, useRef, useEffect } from 'react'
import { MapPin, Users, Send, Mic, Heart, Share2, ArrowLeft, Settings, Volume2, VolumeX } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Card } from '../ui/card'

interface RoomMessage {
  id: string
  user: {
    name: string
    avatar?: string
    distance: string
  }
  content: string
  timestamp: string
  type: 'message' | 'join' | 'leave'
  reactions?: { emoji: string, count: number }[]
}

interface ActiveUser {
  id: string
  name: string
  avatar?: string
  distance: string
  isOnline: boolean
}

interface RadarRoomProps {
  roomId: string
  roomName: string
  description: string
  memberCount: number
  onBack: () => void
}

const mockMessages: RoomMessage[] = [
  {
    id: '1',
    user: {
      name: 'Alex',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
      distance: '0.2km'
    },
    content: 'Just arrived at the waterfront! The sunset is incredible tonight 🌅',
    timestamp: '18:32',
    type: 'message',
    reactions: [{ emoji: '❤️', count: 5 }, { emoji: '🔥', count: 2 }]
  },
  {
    id: '2',
    user: {
      name: 'Maya joined',
      distance: '0.5km'
    },
    content: 'Maya joined the room',
    timestamp: '18:35',
    type: 'join'
  },
  {
    id: '3',
    user: {
      name: 'Maya',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=50&h=50&fit=crop&crop=face',
      distance: '0.5km'
    },
    content: 'Hey everyone! I can see you guys from the pier 👋',
    timestamp: '18:36',
    type: 'message'
  },
  {
    id: '4',
    user: {
      name: 'Sam',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
      distance: '0.8km'
    },
    content: 'Anyone want to grab dinner at the food market?',
    timestamp: '18:40',
    type: 'message',
    reactions: [{ emoji: '🍽️', count: 3 }]
  }
]

const mockActiveUsers: ActiveUser[] = [
  {
    id: '1',
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face',
    distance: '0.2km',
    isOnline: true
  },
  {
    id: '2', 
    name: 'Maya',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=50&h=50&fit=crop&crop=face',
    distance: '0.5km',
    isOnline: true
  },
  {
    id: '3',
    name: 'Sam',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face',
    distance: '0.8km',
    isOnline: true
  },
  {
    id: '4',
    name: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face',
    distance: '1.1km',
    isOnline: true
  }
]

export function RadarRoom({ roomId, roomName, description, memberCount, onBack }: RadarRoomProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message sending logic here
      console.log('Sending message to room:', roomId, message)
      setMessage('')
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleReaction = (messageId: string, emoji: string) => {
    console.log('React to message:', messageId, emoji)
  }

  const renderMessage = (msg: RoomMessage) => {
    if (msg.type === 'join' || msg.type === 'leave') {
      return (
        <div key={msg.id} className="text-center my-2">
          <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
            {msg.content}
          </span>
        </div>
      )
    }

    return (
      <div key={msg.id} className="mb-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={msg.user.avatar} />
            <AvatarFallback>
              {msg.user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm">{msg.user.name}</h4>
              <Badge variant="outline" className="text-xs px-1">
                <MapPin className="w-2 h-2 mr-1" />
                {msg.user.distance}
              </Badge>
              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
            </div>
            
            <div className="bg-accent rounded-xl p-3 max-w-xs">
              <p className="text-sm">{msg.content}</p>
            </div>
            
            {msg.reactions && msg.reactions.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                {msg.reactions.map((reaction, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 text-xs"
                    onClick={() => handleReaction(msg.id, reaction.emoji)}
                  >
                    {reaction.emoji} {reaction.count}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 text-xs opacity-50"
                  onClick={() => handleReaction(msg.id, '❤️')}
                >
                  +
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Room Header */}
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg">{roomName}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {memberCount} members nearby
            </span>
            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
            <span className="text-sm text-chart-1">Live</span>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b">
        <h3 className="text-sm mb-3">Active Nearby ({mockActiveUsers.length})</h3>
        <div className="flex items-center gap-2">
          {mockActiveUsers.slice(0, 8).map((user) => (
            <div key={user.id} className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-chart-1 rounded-full border-2 border-background" />
              <Badge variant="secondary" className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs px-1 scale-75">
                {user.distance}
              </Badge>
            </div>
          ))}
          {mockActiveUsers.length > 8 && (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs">
              +{mockActiveUsers.length - 8}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4">
            {mockMessages.map(renderMessage)}
          </div>
        </ScrollArea>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share with nearby people..."
              className="pr-12"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {message.trim() ? (
            <Button size="sm" onClick={handleSendMessage} className="rounded-full">
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              variant={isRecording ? "destructive" : "default"}
              size="sm" 
              className="rounded-full"
              onMouseDown={() => setIsRecording(true)}
              onMouseUp={() => setIsRecording(false)}
              onMouseLeave={() => setIsRecording(false)}
            >
              <Mic className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {isRecording && (
          <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
            Recording... Release to send to room
          </div>
        )}
        
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3 mr-1" />
          Messages visible to people within 2km
        </div>
      </div>
    </div>
  )
}