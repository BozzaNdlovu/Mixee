import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Image, Video, MapPin, Shield, ArrowLeft, Phone, VideoIcon, MoreVertical, Clock, Check, CheckCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface Message {
  id: string
  content: string
  timestamp: string
  isOwn: boolean
  type: 'text' | 'voice' | 'image' | 'video' | 'location'
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  duration?: string // for voice messages
  location?: { lat: number, lng: number, name: string }
}

interface ChatConversationProps {
  contactName: string
  contactAvatar?: string
  isOnline: boolean
  distance?: string
  isEncrypted: boolean
  onBack: () => void
}

const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey! How are you doing?',
    timestamp: '10:30 AM',
    isOwn: false,
    type: 'text',
    status: 'read'
  },
  {
    id: '2', 
    content: 'I\'m good! Just finished my morning run at Table Mountain 🏃‍♂️',
    timestamp: '10:32 AM',
    isOwn: true,
    type: 'text',
    status: 'read'
  },
  {
    id: '3',
    content: 'That sounds amazing! I love running there too',
    timestamp: '10:33 AM', 
    isOwn: false,
    type: 'text',
    status: 'read'
  },
  {
    id: '4',
    content: 'Check out this view I captured!',
    timestamp: '10:35 AM',
    isOwn: true,
    type: 'image',
    status: 'delivered'
  },
  {
    id: '5',
    content: '🎵 Voice message (0:12)',
    timestamp: '10:37 AM',
    isOwn: false,
    type: 'voice',
    status: 'read',
    duration: '0:12'
  },
  {
    id: '6',
    content: 'We should meet up for a run sometime!',
    timestamp: '10:40 AM',
    isOwn: true,
    type: 'text',
    status: 'sending'
  }
]

export function ChatConversation({ 
  contactName, 
  contactAvatar, 
  isOnline, 
  distance, 
  isEncrypted,
  onBack 
}: ChatConversationProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
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
      console.log('Sending message:', message)
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

  const getStatusIcon = (status?: Message['status']) => {
    switch (status) {
      case 'sending': return <Clock className="w-3 h-3 text-muted-foreground" />
      case 'sent': return <Check className="w-3 h-3 text-muted-foreground" />
      case 'delivered': return <CheckCheck className="w-3 h-3 text-muted-foreground" />
      case 'read': return <CheckCheck className="w-3 h-3 text-chart-1" />
      default: return null
    }
  }

  const renderMessage = (msg: Message) => {
    const isOwn = msg.isOwn

    return (
      <div
        key={msg.id}
        className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-end gap-2 max-w-[80%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {!isOwn && (
            <Avatar className="w-8 h-8">
              <AvatarImage src={contactAvatar} />
              <AvatarFallback>
                {contactName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}
          
          <div className={`rounded-2xl p-3 ${
            isOwn 
              ? 'bg-primary text-primary-foreground rounded-br-md' 
              : 'bg-accent text-accent-foreground rounded-bl-md'
          }`}>
            {msg.type === 'text' && (
              <p className="text-sm break-words">{msg.content}</p>
            )}
            
            {msg.type === 'voice' && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="w-8 h-8 rounded-full p-0">
                  <Mic className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <div className="w-20 h-1 bg-current opacity-30 rounded-full">
                    <div className="w-8 h-1 bg-current rounded-full"></div>
                  </div>
                </div>
                <span className="text-xs opacity-70">{msg.duration}</span>
              </div>
            )}
            
            {msg.type === 'image' && (
              <div className="space-y-2">
                <div className="w-48 h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            )}
            
            <div className={`flex items-center justify-between mt-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="text-xs opacity-70">{msg.timestamp}</span>
              {isOwn && getStatusIcon(msg.status)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={contactAvatar} />
                <AvatarFallback>
                  {contactName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-chart-1 rounded-full border-2 border-background" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm">{contactName}</h2>
                {isEncrypted && (
                  <Shield className="w-3 h-3 text-chart-1" />
                )}
                {distance && (
                  <Badge variant="outline" className="text-xs px-1">
                    <MapPin className="w-2 h-2 mr-1" />
                    {distance}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {isOnline ? 'Active now' : 'Last seen recently'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm">
            <Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <VideoIcon className="w-4 h-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-48">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  View Profile
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Share Location
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  Clear Chat
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4">
            {/* Encryption Notice */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-full">
                <Shield className="w-3 h-3" />
                Messages are end-to-end encrypted
              </div>
            </div>
            
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
              placeholder="Type a message..."
              className="pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                <Video className="w-4 h-4" />
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
            Recording... Release to send
          </div>
        )}
      </div>
    </div>
  )
}