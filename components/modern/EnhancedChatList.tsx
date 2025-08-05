import { useState, useRef } from 'react'
import { MessageSquare, Phone, Video, MapPin, Shield, Heart, Smile, Camera, Mic, Image as ImageIcon, MoreHorizontal, Pin, Archive } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Input } from '../ui/input'
import { PullToRefresh } from '../ui/pull-to-refresh'
import { HapticFeedback } from '../../utils/haptics'
import { cn } from '../ui/utils'

interface ChatItem {
  id: string
  name: string
  username?: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  isOnline: boolean
  isTyping?: boolean
  isPinned?: boolean
  lastMessageType: 'text' | 'voice' | 'image' | 'video' | 'call'
  distance?: string
  isGroup?: boolean
  memberCount?: number
  storyAvailable?: boolean
}

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    username: '@sarah_ct',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Hey! Just saw your story from Table Mountain 📸',
    timestamp: '2m',
    unread: 2,
    isOnline: true,
    isPinned: true,
    lastMessageType: 'text',
    distance: '1.2km',
    storyAvailable: true
  },
  {
    id: '2',
    name: 'Coffee Lovers CT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Anyone up for coffee at Truth?',
    timestamp: '15m',
    unread: 0,
    isOnline: true,
    isTyping: true,
    lastMessageType: 'text',
    isGroup: true,
    memberCount: 24,
    distance: '0.8km'
  },
  {
    id: '3',
    name: 'Marcus Williams',
    username: '@marcus_dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: '🎵 Voice message',
    timestamp: '1h',
    unread: 0,
    isOnline: false,
    lastMessageType: 'voice',
    distance: '2.1km',
    storyAvailable: true
  },
  {
    id: '4',
    name: 'Emma Davis',
    username: '@emma_cape',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Loved the sunset photo! 😍',
    timestamp: '3h',
    unread: 1,
    isOnline: true,
    lastMessageType: 'image',
    distance: '0.5km'
  },
  {
    id: '5',
    name: 'Family Squad 👨‍👩‍👧‍👦',
    lastMessage: 'Mom: Don\'t forget Sunday lunch!',
    timestamp: '5h',
    unread: 3,
    isOnline: true,
    lastMessageType: 'text',
    isGroup: true,
    memberCount: 8
  }
]

interface EnhancedChatListProps {
  onChatSelect: (chat: ChatItem) => void
}

export function EnhancedChatList({ onChatSelect }: EnhancedChatListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const touchStartRef = useRef<{ x: number, time: number } | null>(null)

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMessageIcon = (type: ChatItem['lastMessageType']) => {
    const iconClass = "w-3 h-3"
    switch (type) {
      case 'voice': return <Mic className={cn(iconClass, "text-blue-500")} />
      case 'image': return <ImageIcon className={cn(iconClass, "text-green-500")} />
      case 'video': return <Video className={cn(iconClass, "text-purple-500")} />
      case 'call': return <Phone className={cn(iconClass, "text-red-500")} />
      default: return null
    }
  }

  const handleChatClick = (chat: ChatItem) => {
    HapticFeedback.light()
    setSelectedChat(chat.id)
    setTimeout(() => onChatSelect(chat), 150) // Small delay for animation
  }

  const handleTouchStart = (e: React.TouchEvent, chatId: string) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      time: Date.now()
    }
  }

  const handleTouchEnd = (e: React.TouchEvent, chat: ChatItem) => {
    if (!touchStartRef.current) return
    
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x
    const deltaTime = Date.now() - touchStartRef.current.time
    
    // Swipe right for quick actions
    if (deltaX > 50 && deltaTime < 300) {
      HapticFeedback.swipeAction()
      console.log('Quick reply to', chat.name)
    }
    
    touchStartRef.current = null
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    HapticFeedback.pullToRefresh()
    
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    console.log('🔄 Refreshing chat list...')
    
    HapticFeedback.success()
    setIsRefreshing(false)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50/30">
      {/* Search Header */}
      <div className="p-4 pb-2">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl border-gray-200 bg-white/80 backdrop-blur-sm focus:bg-white transition-colors duration-300"
          />
          <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Stories Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Stories</span>
          <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
        </div>
        
        <div className="flex items-center gap-3 mt-3 pb-2 overflow-x-auto scrollbar-hide">
          {/* Your Story */}
          <div className="flex flex-col items-center gap-2 min-w-fit">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="text-xs text-gray-600">Your story</span>
          </div>

          {/* Friends' Stories */}
          {filteredChats.filter(chat => chat.storyAvailable).map((chat) => (
            <div key={`story-${chat.id}`} className="flex flex-col items-center gap-2 min-w-fit">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white p-0.5">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <span className="text-xs text-gray-600 max-w-16 truncate">{chat.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Messages</span>
            <Badge variant="secondary" className="text-xs">
              {filteredChats.length}
            </Badge>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
          </div>
        </div>

        <PullToRefresh onRefresh={handleRefresh} className="flex-1 scrollbar-hide webkit-scroll">
          <div className="px-2 pb-32">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={cn(
                  "relative mx-2 mb-2 rounded-2xl transition-all duration-300 hover:bg-white/80 cursor-pointer group",
                  selectedChat === chat.id && "bg-blue-50 scale-[0.98]",
                  chat.isPinned && "bg-yellow-50/50"
                )}
                onClick={() => handleChatClick(chat)}
                onTouchStart={(e) => handleTouchStart(e, chat.id)}
                onTouchEnd={(e) => handleTouchEnd(e, chat)}
              >
                {/* Pin Indicator */}
                {chat.isPinned && (
                  <Pin className="absolute top-2 right-2 w-3 h-3 text-yellow-500 fill-current" />
                )}

                <div className="flex items-center gap-3 p-3">
                  {/* Avatar with Online Status */}
                  <div className="relative flex-shrink-0">
                    <Avatar className={cn(
                      "w-14 h-14 transition-transform duration-300",
                      chat.unread > 0 && "ring-2 ring-blue-500 ring-offset-2"
                    )}>
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                        {chat.isGroup ? (
                          <MessageSquare className="w-6 h-6" />
                        ) : (
                          chat.name.split(' ').map(n => n[0]).join('').slice(0, 2)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Online Status */}
                    {chat.isOnline && !chat.isGroup && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                    
                    {/* Group Member Count */}
                    {chat.isGroup && chat.memberCount && (
                      <Badge className="absolute -bottom-1 -right-2 text-xs px-1.5 h-5">
                        {chat.memberCount}
                      </Badge>
                    )}
                  </div>

                  {/* Chat Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <h3 className={cn(
                          "text-sm truncate",
                          chat.unread > 0 ? "font-semibold text-gray-900" : "font-medium text-gray-800"
                        )}>
                          {chat.name}
                        </h3>
                        
                        {/* Username for non-groups */}
                        {chat.username && !chat.isGroup && (
                          <span className="text-xs text-gray-400 truncate">
                            {chat.username}
                          </span>
                        )}

                        {/* Encryption & Distance */}
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-green-500" />
                          {chat.distance && (
                            <Badge variant="outline" className="text-xs px-1 h-4">
                              <MapPin className="w-2 h-2 mr-1" />
                              {chat.distance}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Timestamp */}
                      <span className={cn(
                        "text-xs flex-shrink-0 ml-2",
                        chat.unread > 0 ? "text-blue-600 font-medium" : "text-gray-400"
                      )}>
                        {chat.timestamp}
                      </span>
                    </div>

                    {/* Last Message */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        {getMessageIcon(chat.lastMessageType)}
                        
                        {chat.isTyping ? (
                          <div className="flex items-center gap-1">
                            <div className="flex gap-1">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <span className="text-sm text-blue-500 italic">typing...</span>
                          </div>
                        ) : (
                          <p className={cn(
                            "text-sm truncate",
                            chat.unread > 0 ? "text-gray-700 font-medium" : "text-gray-500"
                          )}>
                            {chat.lastMessage}
                          </p>
                        )}
                      </div>

                      {/* Unread Count & Quick Actions */}
                      <div className="flex items-center gap-2">
                        {chat.unread > 0 && (
                          <Badge className="bg-blue-500 text-white rounded-full min-w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse">
                            {chat.unread > 99 ? '99+' : chat.unread}
                          </Badge>
                        )}
                        
                        {/* Quick Action Button (appears on hover) */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                          <MoreHorizontal className="w-3 h-3 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </PullToRefresh>
      </div>
    </div>
  )
}