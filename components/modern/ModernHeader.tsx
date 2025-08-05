import { useState } from 'react'
import { Bell, Search, Settings, MapPin, Sun, Moon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { LiveNotifications } from '../realtime/LiveNotifications'
import { cn } from '../ui/utils'

interface ModernHeaderProps {
  currentView: string
  userLocation?: string
  isDarkMode?: boolean
  onToggleDarkMode?: () => void
  onProfileClick?: () => void
  isLive?: boolean
  onSearchClick?: () => void
  currentUser?: {
    id: string
    username: string
    email: string
    displayName: string
    location?: string
    avatar?: string
  }
}

const viewTitles = {
  chats: 'Messages',
  videos: 'Discover',
  communities: 'Communities',
  marketplace: 'Marketplace',
  learning: 'Learning Hub'
}

const viewGradients = {
  chats: 'from-pink-400 to-rose-500',
  videos: 'from-teal-400 to-cyan-500',
  communities: 'from-blue-400 to-indigo-500',
  marketplace: 'from-emerald-400 to-green-500',
  learning: 'from-yellow-400 to-orange-500'
}

export function ModernHeader({ 
  currentView, 
  userLocation = 'Cape Town, SA',
  isDarkMode = false,
  onToggleDarkMode,
  onProfileClick,
  isLive = false,
  onSearchClick,
  currentUser
}: ModernHeaderProps) {
  const currentTitle = viewTitles[currentView as keyof typeof viewTitles] || 'SupaApp'
  const currentGradient = viewGradients[currentView as keyof typeof viewGradients] || 'from-purple-400 to-pink-500'

  return (
    <div className="flex items-center justify-between w-full">
      {/* Left Section - Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className={cn(
            "w-10 h-10 rounded-2xl bg-gradient-to-br shadow-lg flex items-center justify-center",
            currentGradient
          )}>
            <span className="text-white font-bold text-lg">S</span>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
          </div>
        </div>
        
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {currentTitle}
          </h1>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{userLocation}</span>
            <div className="w-1 h-1 bg-green-500 rounded-full ml-1" />
          </div>
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 h-10 rounded-full hover:bg-gray-100/80"
          onClick={onSearchClick}
        >
          <Search className="w-4 h-4 text-gray-600" />
        </Button>

        {/* Live Notifications */}
        {currentUser && (
          <div className="relative">
            <LiveNotifications
              userId={currentUser.id}
              isLive={isLive}
            />
          </div>
        )}

        {/* Dark Mode Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 h-10 rounded-full hover:bg-gray-100/80"
          onClick={onToggleDarkMode}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-gray-600" />
          ) : (
            <Moon className="w-4 h-4 text-gray-600" />
          )}
        </Button>

        {/* Profile Avatar */}
        <Button
          variant="ghost"
          className="relative p-0 h-auto rounded-full hover:bg-transparent group"
          onClick={onProfileClick}
        >
          <Avatar className="w-9 h-9 border-2 border-white shadow-md group-hover:scale-105 transition-transform">
            <AvatarImage src={currentUser?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"} />
            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
              {currentUser?.displayName?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          {/* Online Status */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          {/* Hover indicator */}
          <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </div>
    </div>
  )
}