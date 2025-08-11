import { useState, useEffect } from 'react'
import { AuthScreen } from '../components/auth/AuthScreen'
import { ProfilePage } from '../components/profile/ProfilePage'
import { ChatRoom } from '../components/chat/ChatRoom'
import { ChatList } from '../components/chat/ChatList'
import { ModernVideoFeed } from '../components/modern/ModernVideoFeed'
import { ModernCommunities } from '../components/modern/ModernCommunities'
import { ModernMarketplace } from '../components/modern/ModernMarketplace'
import { ModernLearningHub } from '../components/modern/ModernLearningHub'
import { cn } from '../components/ui/utils'
import { Zap, Sparkles, Flame, Star, Trophy, Users, ChevronDown, User, LogOut, Settings, ArrowLeft, Play, ShoppingBag, Users2 } from 'lucide-react'

interface User {
  id: string
  username: string
  email: string
  displayName: string
  location?: string
  avatar?: string
}

type AppView = 'main' | 'profile' | 'chat' | 'chatList' | 'videos' | 'communities' | 'market' | 'learning'

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [currentView, setCurrentView] = useState<AppView>('main')
  const [selectedChatPartner, setSelectedChatPartner] = useState<User | null>(null)
  const [realtimeStats, setRealtimeStats] = useState({
    activeNow: 12
  })
  const [globalActivity, setGlobalActivity] = useState({
    reactions: 0
  })

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('⏰ Loading timeout - proceeding to demo mode')
        setIsLoading(false)
      }
    }, 2000) // 2 second timeout

    initializeApp()

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('supaapp_dark_mode')
    if (savedDarkMode === 'true') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Real-time stats updater
  useEffect(() => {
    const updateStats = () => {
      setRealtimeStats(prev => ({
        activeNow: Math.max(10, Math.min(25, prev.activeNow + (Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0)))
      }))

      setGlobalActivity(prev => ({
        reactions: prev.reactions + Math.floor(Math.random() * 20) + 8
      }))
    }

    // Initialize with basic stats
    setRealtimeStats({
      activeNow: 12
    })

    setGlobalActivity({
      reactions: Math.floor(Math.random() * 300) + 150
    })

    const interval = setInterval(updateStats, 6000)
    return () => clearInterval(interval)
  }, [])

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing Mixee App...')
      
      // Demo mode setup
      console.log('🎭 Running in demo mode')
      
      // Check for existing demo session
      const demoSession = localStorage.getItem('mixee_demo_session')
      if (demoSession) {
        try {
          const user = JSON.parse(demoSession)
          setCurrentUser(user)
          console.log('👤 Demo user session found:', user.username)
        } catch (e) {
          console.log('📱 No valid demo session found')
        }
      }
      
    } catch (error: any) {
      console.error('❌ Error initializing app:', error)
    } finally {
      setIsLoading(false)
      console.log('✨ Mixee App initialization complete')
    }
  }

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem('mixee_demo_session', JSON.stringify(user))
    console.log('🎉 Authentication successful:', user.username)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('mixee_demo_session')
    setShowProfileDropdown(false)
    setCurrentView('main')
    setSelectedChatPartner(null)
    console.log('👋 User logged out')
  }

  const handleProfileClick = () => {
    setShowProfileDropdown(false)
    setCurrentView('profile')
    console.log('👤 Profile clicked')
  }

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    localStorage.setItem('mixee_demo_session', JSON.stringify(updatedUser))
    setCurrentView('main')
    console.log('✅ User profile updated')
  }

  const handleBackToMain = () => {
    setCurrentView('main')
    setSelectedChatPartner(null)
  }

  const handleStartChat = () => {
    setCurrentView('chatList')
    console.log('💬 Starting chat list')
  }

  const handleStartChatWithUser = (user: User) => {
    setSelectedChatPartner(user)
    setCurrentView('chat')
    console.log('💬 Starting chat with:', user.displayName)
  }

  const handleShareStory = () => {
    console.log('📖 Share story clicked')
    // You can implement story sharing functionality here
  }

  const handleJoinLiveEvent = () => {
    console.log('🎥 Join live event clicked')
    // You can implement live event functionality here
  }

  const handleRewardsClick = () => {
    console.log('🏆 Rewards clicked')
    // You can implement rewards functionality here
  }

  const handleLiveClick = () => {
    console.log('📺 Live clicked')
    // You can implement live functionality here
  }

  const handleBottomNavClick = (section: string) => {
    console.log(`📱 ${section} section clicked`)
    switch (section) {
      case 'Chats':
        setCurrentView('chatList')
        break
      case 'Videos':
        setCurrentView('videos')
        break
      case 'Communities':
        setCurrentView('communities')
        break
      case 'Market':
        setCurrentView('market')
        break
      case 'Learning':
        setCurrentView('learning')
        break
      default:
        console.log(`Unknown section: ${section}`)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
    localStorage.setItem('supaapp_dark_mode', (!isDarkMode).toString())
    console.log('🌓 Dark mode:', !isDarkMode ? 'enabled' : 'disabled')
  }

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto p-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-4xl">M</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-ping" />
          </div>
          
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          
          <div className="text-center">
            <p className="text-gray-800 font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Loading Mixee...
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Initializing social platform
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show authentication screen if user is not logged in
  if (!currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />
  }

  // Show Profile page
  if (currentView === 'profile') {
    return (
      <ProfilePage
        user={currentUser}
        onBack={handleBackToMain}
        onUpdateUser={handleUpdateUser}
      />
    )
  }

  // Show Chat List
  if (currentView === 'chatList') {
    return (
      <ChatList
        currentUser={currentUser}
        onBack={handleBackToMain}
        onStartChat={handleStartChatWithUser}
      />
    )
  }

  // Show Chat room
  if (currentView === 'chat' && selectedChatPartner) {
    return (
      <ChatRoom
        currentUser={currentUser}
        chatPartner={selectedChatPartner}
        onBack={() => setCurrentView('chatList')}
      />
    )
  }

  // Show Videos page
  if (currentView === 'videos') {
    return <ModernVideoFeed onBack={handleBackToMain} />
  }

  // Show Communities page
  if (currentView === 'communities') {
    return <ModernCommunities onBack={handleBackToMain} />
  }

  // Show Market page
  if (currentView === 'market') {
    return <ModernMarketplace onBack={handleBackToMain} />
  }

  // Show Learning Hub page
  if (currentView === 'learning') {
    return <ModernLearningHub onBack={handleBackToMain} />
  }

  // Main app interface
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 relative",
      isDarkMode 
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black" 
        : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
    )}>
      {/* Enhanced Floating Orbs Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 max-w-md mx-auto bg-white/95 backdrop-blur-xl h-screen shadow-2xl border-x border-white/20 overflow-hidden flex flex-col">
        {/* Demo Mode Banner */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-green-800">🎭 Demo Mode - Full Features Available</span>
              <Zap className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Flame className="w-3 h-3" />
              <span className="font-medium">{realtimeStats.activeNow} active now</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="relative flex-shrink-0">
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Mixee</h1>
                  <p className="text-xs text-gray-600">Social Platform</p>
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRewardsClick}
                  className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full hover:scale-105 transition-transform"
                  title="Achievements & Rewards"
                >
                  <Trophy className="w-3 h-3 text-yellow-600" />
                  <span className="text-xs text-yellow-700 font-medium">Rewards</span>
                </button>
                
                <button
                  onClick={handleLiveClick}
                  className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 px-2 py-1 rounded-full hover:scale-105 transition-transform"
                  title="Live Events & Spaces"
                >
                  <Users className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-700 font-medium">Live</span>
                </button>

                {/* Global Activity Counter */}
                <div className="flex items-center gap-1 bg-gradient-to-r from-pink-100 to-purple-100 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 text-pink-600" />
                  <span className="text-xs text-pink-700 font-medium">
                    {globalActivity.reactions}
                  </span>
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-1 bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-1 rounded-full hover:scale-105 transition-transform"
                    title="User Profile"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {currentUser.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-blue-700 font-medium hidden sm:inline">
                      {currentUser.displayName}
                    </span>
                    <ChevronDown className="w-3 h-3 text-blue-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{currentUser.displayName}</p>
                        <p className="text-xs text-gray-500">{currentUser.email}</p>
                      </div>
                      
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back, {currentUser.displayName}! 👋</h2>
              <p className="text-gray-600 mb-4">
                Your Mixee social platform is ready. Explore all the features below:
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-2">💬 Chats</h3>
                  <p className="text-sm text-blue-700">Connect with friends</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-2">📹 Videos</h3>
                  <p className="text-sm text-green-700">Watch trending content</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-900 mb-2">👥 Communities</h3>
                  <p className="text-sm text-purple-700">Join groups & discussions</p>
                </div>
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-900 mb-2">🛒 Marketplace</h3>
                  <p className="text-sm text-orange-700">Shop & sell items</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleStartChat}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Start a New Chat
                </button>
                <button 
                  onClick={handleShareStory}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Share a Story
                </button>
                <button 
                  onClick={handleJoinLiveEvent}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:scale-105 transition-transform"
                >
                  Join Live Event
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom Navigation */}
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-2 flex-shrink-0">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => handleBottomNavClick('Chats')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <div className="relative">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">💬</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Chats</span>
            </button>
            <button 
              onClick={() => handleBottomNavClick('Videos')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">📹</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Videos</span>
            </button>
            <button 
              onClick={() => handleBottomNavClick('Communities')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <div className="relative">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👥</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">9+</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700">Communities</span>
            </button>
            <button 
              onClick={() => handleBottomNavClick('Market')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🛒</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Shop</span>
            </button>
            <button 
              onClick={() => handleBottomNavClick('Learning')}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">🎓</span>
              </div>
              <span className="text-xs font-medium text-gray-700">Learn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}