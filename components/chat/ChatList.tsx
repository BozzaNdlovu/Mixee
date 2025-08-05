import { useState } from 'react'
import { ArrowLeft, Search, Plus, MoreVertical, Phone, Video, Camera, Bell, Moon, Shield, MapPin, Flag, Sparkles, Trophy } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { cn } from '../ui/utils'

interface User {
  id: string
  username: string
  email: string
  displayName: string
  location?: string
  avatar?: string
}

interface Chat {
  id: string
  user: User
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  isGroup: boolean
  groupMembers?: number
  isPinned?: boolean
  isTyping?: boolean
  distance?: string
  hasSpecialFeature?: boolean
  specialFeatureText?: string
}

interface ChatListProps {
  currentUser: User
  onBack: () => void
  onStartChat: (user: User) => void
}

export function ChatList({ currentUser, onBack, onStartChat }: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showContacts, setShowContacts] = useState(false)

  const [chats] = useState<Chat[]>([
    {
      id: '1',
      user: {
        id: '1',
        username: 'sarah_ct',
        email: 'sarah@example.com',
        displayName: 'Sarah Johnson',
        location: 'Cape Town, SA'
      },
      lastMessage: "Hey! Just saw your story from Table Mountain. Looks amazing! 🏔️",
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      unreadCount: 2,
      isOnline: true,
      isGroup: false,
      isPinned: true,
      distance: '1.2km'
    },
    {
      id: '2',
      user: {
        id: '2',
        username: 'coffee_lovers',
        email: 'group@example.com',
        displayName: 'Coffee Lovers CT',
        location: 'Cape Town, SA'
      },
      lastMessage: "typing...",
      timestamp: new Date(),
      unreadCount: 0,
      isOnline: false,
      isGroup: true,
      groupMembers: 24,
      isTyping: true,
      distance: '0.8km',
      hasSpecialFeature: true,
      specialFeatureText: '10x'
    }
  ])

  const [contacts] = useState<User[]>([
    {
      id: '3',
      username: 'marcus_dev',
      email: 'marcus@example.com',
      displayName: 'Marcus Chen',
      location: 'Cape Town, SA'
    },
    {
      id: '4',
      username: 'lisa_design',
      email: 'lisa@example.com',
      displayName: 'Lisa Rodriguez',
      location: 'Cape Town, SA'
    },
    {
      id: '5',
      username: 'alex_tech',
      email: 'alex@example.com',
      displayName: 'Alex Thompson',
      location: 'Cape Town, SA'
    }
  ])

  const filteredChats = chats.filter(chat => 
    chat.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredContacts = contacts.filter(contact => 
    contact.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'now'
    if (diffInMinutes < 60) return `${diffInMinutes}m`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`
    return date.toLocaleDateString()
  }

  const handleStartNewChat = () => {
    setShowContacts(true)
  }

  const handleBackToChats = () => {
    setShowContacts(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container - Match main app width */}
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl border-x border-white/20">
        {/* Top Status Bar */}
        <div className="bg-green-500 px-4 py-1 text-white text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>Live Platform - Real-time across all features</span>
          </div>
          <div className="flex items-center gap-2">
            <span>24 active now</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={onBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div>
                <h1 className="text-lg font-bold text-gray-900">Messages</h1>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Search className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-4 h-4 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Moon className="w-4 h-4 text-gray-600" />
              </button>
              <button className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full">
                <Trophy className="w-3 h-3 text-yellow-600" />
                <span className="text-xs text-yellow-700 font-medium">Rewards</span>
              </button>
              <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">U</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Stories Section */}
        <div className="px-4 py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Stories</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-purple-500">
                  <span className="text-white font-bold text-sm">Y</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Camera className="w-3 h-3 text-white" />
                </div>
              </div>
              <span className="text-xs text-gray-600">Your story</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-pink-500">
                <span className="text-black font-bold text-sm">S</span>
              </div>
              <span className="text-xs text-gray-600">Sarah</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-full flex items-center justify-center border-2 border-pink-500">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xs text-gray-600">Marcus</span>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Messages (5)</h3>
              <button
                onClick={handleStartNewChat}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">New</span>
              </button>
            </div>
          </div>

          {showContacts ? (
            // Contacts View
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={handleBackToChats}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-lg font-bold text-gray-900">Start New Chat</h2>
              </div>
              
              <div className="space-y-3">
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onStartChat(contact)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {contact.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{contact.displayName}</h4>
                      <p className="text-sm text-gray-600">@{contact.username}</p>
                      {contact.location && (
                        <p className="text-xs text-gray-500">{contact.location}</p>
                      )}
                    </div>
                    <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Chats View
            <div className="space-y-1">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onStartChat(chat.user)}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors relative"
                >
                  {chat.isPinned && (
                    <div className="absolute top-2 right-2">
                      <Flag className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-blue-500">
                      <span className="text-white font-bold text-sm">
                        {chat.user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 truncate">{chat.user.displayName}</h4>
                      <Shield className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-gray-500">@{chat.user.username}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{chat.distance}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{formatTime(chat.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {chat.isTyping ? (
                          <span className="text-blue-600">typing...</span>
                        ) : (
                          chat.lastMessage
                        )}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {chat.hasSpecialFeature && (
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{chat.specialFeatureText}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}