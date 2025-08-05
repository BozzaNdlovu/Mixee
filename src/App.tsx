import { useState, useEffect } from 'react'
import { AuthScreen } from '../components/auth/AuthScreen'
import { OnboardingWelcome } from '../components/auth/OnboardingWelcome'
import { BottomNavigation } from '../components/modern/BottomNavigation'
import { ModernHeader } from '../components/modern/ModernHeader'
import { EnhancedChatList } from '../components/modern/EnhancedChatList'
import { RealTimeChatConversation } from '../components/chat/RealTimeChatConversation'
import { EnhancedVideoFeed } from '../components/modern/EnhancedVideoFeed'
import { RealTimeCommunities } from '../components/modern/RealTimeCommunities'
import { ModernMarketplace } from '../components/modern/ModernMarketplace'
import { ModernLearningHub } from '../components/modern/ModernLearningHub'
import { LiveNotifications } from '../components/realtime/LiveNotifications'
import { UserPresence } from '../components/realtime/UserPresence'
import { LiveCommunityEvents } from '../components/realtime/LiveCommunityEvents'
import { ProfileSettings } from '../components/profile/ProfileSettings'
import { SearchModal } from '../components/search/SearchModal'
import { GamificationHub } from '../components/gamification/GamificationHub'
import { StoriesHub } from '../components/stories/StoriesHub'
import { LiveEventsHub } from '../components/live/LiveEventsHub'
import { cn } from '../components/ui/utils'
// Mock auth and backend functions for frontend-only mode
const auth = {
  getSession: async () => ({ data: { session: null }, error: null }),
  onAuthStateChange: (callback: any) => ({ data: { subscription: null } }),
  signOut: async () => ({ error: null })
}

const checkBackendHealth = async () => ({ healthy: true, message: 'Frontend-only mode' })
const checkNetworkConnectivity = async () => true
const isConnectedToRealBackend = () => false
const appConfig = { name: 'Mixee', version: '2.0.0', mode: 'frontend-only' }
import { Zap, Sparkles, Flame, Star, Trophy, AlertCircle, RefreshCw, Gamepad2, Users, Calendar } from 'lucide-react'

type AppView = 'chats' | 'videos' | 'communities' | 'marketplace' | 'learning' | 'conversation' | 'gamification' | 'stories' | 'live-events'

interface User {
  id: string
  username: string
  email: string
  displayName: string
  location?: string
  avatar?: string
}

interface ChatData {
  id: string
  name: string
  username?: string
  avatar?: string
  isOnline: boolean
  distance?: string
  isEncrypted: boolean
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<AppView>('chats')
  const [selectedChat, setSelectedChat] = useState<ChatData | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [backendStatus, setBackendStatus] = useState<{ healthy: boolean; message: string }>({
    healthy: false,
    message: 'Connecting to live backend...'
  })
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [realtimeStats, setRealtimeStats] = useState({
    activeNow: 12
  })
  const [globalActivity, setGlobalActivity] = useState({
    reactions: 0
  })
  const [showProfileSettings, setShowProfileSettings] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showStories, setShowStories] = useState(false)
  const [selectedStoryUser, setSelectedStoryUser] = useState<string | null>(null)

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('⏰ Loading timeout - proceeding to demo mode')
        setBackendStatus({
          healthy: false,
          message: 'Demo mode - using mock data'
        })
        setIsLoading(false)
      }
    }, 5000) // 5 second timeout

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

  useEffect(() => {
    // Set up auth state listener - only for real Supabase auth
    try {
      const authListener = auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id)
        
        if (event === 'SIGNED_OUT') {
          handleLogout()
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Update user data from session
          const user = {
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
            displayName: session.user.user_metadata?.display_name || session.user.email!.split('@')[0],
            location: session.user.user_metadata?.location,
            avatar: session.user.user_metadata?.avatar_url
          }
          setCurrentUser(user)
          console.log('👤 User authenticated:', user.username)
        }
      })

      // Handle both new and old auth listener formats
      const subscription = authListener?.data?.subscription || authListener
      
      return () => {
        try {
          if (subscription?.unsubscribe) {
            subscription.unsubscribe()
          }
        } catch (error) {
          console.warn('⚠️ Error unsubscribing from auth listener:', error)
        }
      }
    } catch (error) {
      console.error('❌ Error setting up auth listener:', error)
      return () => {} // Return empty cleanup function
    }
  }, [])

  // Real-time stats updater - only when backend is healthy
  useEffect(() => {
    if (!backendStatus.healthy) return

    const updateStats = () => {
      setRealtimeStats(prev => ({
        activeNow: Math.max(10, Math.min(25, prev.activeNow + (Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0))) // Fluctuate around 12
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
  }, [backendStatus.healthy])

  const initializeApp = async () => {
    try {
      console.log('🚀 Initializing SupaApp...')
      
      // Check if we have real Supabase configuration
      const isRealBackend = isConnectedToRealBackend()
      
      if (!isRealBackend) {
        console.log('⚠️ No real Supabase backend - running in demo mode')
        // Set up demo mode
        setBackendStatus({
          healthy: true,
          message: 'Demo mode - using mock data'
        })
        setIsLoading(false)
        return
      }

      console.log('🔌 Connecting to live Supabase backend...')
      
      // First check basic network connectivity
      const isNetworkAvailable = await checkNetworkConnectivity()
      if (!isNetworkAvailable) {
        console.log('⚠️ No network - running in offline mode')
        setBackendStatus({
          healthy: false,
          message: 'Offline mode - limited functionality'
        })
        setIsLoading(false)
        return
      }
      
      // Try health check with fallback approach
      let healthCheckPassed = false
      try {
        const status = await checkBackendHealth()
        setBackendStatus(status)
        healthCheckPassed = status.healthy
        
        if (status.healthy) {
          console.log('✅ Backend health check: HEALTHY')
        } else {
          console.warn('⚠️ Backend health check failed, but continuing...')
          // Don't fail completely - continue with auth check
        }
      } catch (error: any) {
        console.error('❌ Health check failed:', error)
        console.log('⚠️ Health check failed, attempting to continue with auth...')
        // Set backend as potentially healthy but unknown
        setBackendStatus({
          healthy: false,
          message: `Health check failed: ${error.message}`
        })
      }

      // Always try auth session check - don't depend on health check
      try {
        console.log('🔐 Checking for existing auth session...')
        const sessionResult = await auth.getSession()
        
        if (sessionResult.error) {
          console.error('❌ Auth session error:', sessionResult.error)
          // Continue anyway - user can still try to authenticate
        }

        if (sessionResult.data?.session?.user) {
          console.log('🔑 Active session found')
          const user = {
            id: sessionResult.data.session.user.id,
            email: sessionResult.data.session.user.email!,
            username: sessionResult.data.session.user.user_metadata?.username || sessionResult.data.session.user.email!.split('@')[0],
            displayName: sessionResult.data.session.user.user_metadata?.display_name || sessionResult.data.session.user.email!.split('@')[0],
            location: sessionResult.data.session.user.user_metadata?.location,
            avatar: sessionResult.data.session.user.user_metadata?.avatar_url
          }
          
          setCurrentUser(user)
          
          // Update backend status to healthy if we have a session
          if (!healthCheckPassed) {
            setBackendStatus({
              healthy: true,
              message: 'Connected via authentication session'
            })
          }
          
          // Check if user should see onboarding
          const hasSeenOnboarding = localStorage.getItem('supaapp_onboarding_completed')
          if (!hasSeenOnboarding) {
            setShowOnboarding(true)
          }
        } else {
          console.log('📱 No active session - user needs to authenticate')
        }
      } catch (authError: any) {
        console.error('❌ Auth check failed:', authError)
        // Only show connection error if both health check and auth failed
        if (!healthCheckPassed && authError.message.includes('Failed to fetch')) {
          console.log('⚠️ Connection failed - running in demo mode')
          setBackendStatus({
            healthy: false,
            message: 'Demo mode - limited functionality'
          })
        }
        console.log('⚠️ Auth check failed, but continuing to auth screen...')
      }
    } catch (error: any) {
      console.error('❌ Error initializing app:', error)
      setBackendStatus({
        healthy: false,
        message: 'Demo mode - using mock data'
      })
    } finally {
      setIsLoading(false)
      console.log('✨ SupaApp initialization complete - Live Mode')
    }
  }

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user)
    console.log('🎉 Authentication successful:', user.username)
    
    const hasSeenOnboarding = localStorage.getItem('supaapp_onboarding_completed')
    if (!hasSeenOnboarding) {
      setShowOnboarding(true)
    }
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
    localStorage.setItem('supaapp_onboarding_completed', 'true')
    console.log('👋 Onboarding completed')
  }

  const handleLogout = async () => {
    try {
      console.log('👋 Logging out...')
      await auth.signOut()
    } catch (error) {
      console.error('❌ Error signing out:', error)
    }
    
    localStorage.removeItem('supaapp_onboarding_completed')
    
    setCurrentUser(null)
    setCurrentView('chats')
    setSelectedChat(null)
    setShowOnboarding(false)
  }

  const handleViewChange = (view: string) => {
    if (view === currentView) return
    
    console.log('📱 Switching to view:', view)
    setCurrentView(view as AppView)
    setSelectedChat(null)
  }

  const handleChatSelect = (chatData: any) => {
    console.log('💬 Opening chat with:', chatData.name)
    setSelectedChat({
      id: chatData.id,
      name: chatData.name,
      username: chatData.username,
      avatar: chatData.avatar,
      isOnline: chatData.isOnline,
      distance: chatData.distance,
      isEncrypted: true
    })
    setCurrentView('conversation')
  }

  const handleBackToList = () => {
    console.log('🔙 Returning to chat list')
    setCurrentView('chats')
    setSelectedChat(null)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark', !isDarkMode)
    localStorage.setItem('supaapp_dark_mode', (!isDarkMode).toString())
    console.log('🌓 Dark mode:', !isDarkMode ? 'enabled' : 'disabled')
  }

  const retryConnection = async () => {
    console.log('🔄 Retrying connection...')
    setConnectionError(null)
    setIsLoading(true)
    await initializeApp()
  }

  const handleProfileClick = () => {
    setShowProfileSettings(true)
  }

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser)
    console.log('👤 User profile updated:', updatedUser.username)
  }

  const handleSearchClick = () => {
    setShowSearch(true)
  }

  const handleSearchSelect = (result: any) => {
    console.log('🔍 Search result selected:', result)
    // Handle navigation based on result type
    switch (result.type) {
      case 'chat':
        setCurrentView('chats')
        break
      case 'video':
        setCurrentView('videos')
        break
      case 'community':
        setCurrentView('communities')
        break
      case 'product':
        setCurrentView('marketplace')
        break
      case 'course':
        setCurrentView('learning')
        break
      case 'gamification':
        setCurrentView('gamification')
        break
      case 'story':
        setShowStories(true)
        break
      case 'live-event':
        setCurrentView('live-events')
        break
      default:
        break
    }
  }

  const handleStoryClick = (userId: string) => {
    setSelectedStoryUser(userId)
    setShowStories(true)
  }

  const handleCreateStory = () => {
    setShowStories(true)
  }

  // Show connection error screen if no backend
  if (connectionError && !backendStatus.healthy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 max-w-md mx-auto p-8 text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full animate-ping" />
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Required</h1>
            <p className="text-gray-600 mb-4">
              SupaApp requires a live Supabase backend to function.
            </p>
            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
              {connectionError}
            </p>
          </div>

          <div className="space-y-3 w-full">
            <button
              onClick={retryConnection}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Check your Supabase project URL and keys</p>
              <p>• Ensure your Edge Function is deployed</p>
              <p>• Verify your database is accessible</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading screen while connecting to backend
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto p-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-4xl">S</span>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full animate-ping" />
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          
          <div className="text-center">
            <p className="text-gray-800 font-medium flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Connecting to SupaApp...
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Establishing live backend connection
            </p>
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border bg-blue-100 text-blue-700 border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            <span>🚀 Live Platform Loading</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </div>
      </div>
    )
  }

  // Show authentication screen if user is not logged in
  if (!currentUser) {
    try {
      return <AuthScreen onAuthSuccess={handleAuthSuccess} />
    } catch (error) {
      console.error('Error rendering AuthScreen:', error)
      // Fallback to a simple login screen
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto p-8 text-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <span className="text-white font-bold text-4xl">M</span>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Mixee</h1>
              <p className="text-gray-600 mb-4">
                A modern social platform
              </p>
            </div>

            <div className="space-y-3 w-full">
              <button
                onClick={() => handleAuthSuccess({
                  id: 'demo-user',
                  email: 'demo@mixee.com',
                  username: 'demo_user',
                  displayName: 'Demo User'
                })}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium hover:scale-105 transition-transform shadow-lg"
              >
                Continue as Demo User
              </button>
            </div>
          </div>
        </div>
      )
    }
  }

  // Show onboarding for new users
  if (showOnboarding) {
    return (
      <OnboardingWelcome
        user={currentUser}
        onComplete={handleOnboardingComplete}
      />
    )
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'conversation':
        return selectedChat ? (
          <RealTimeChatConversation
            contactName={selectedChat.name}
            contactId={selectedChat.id}
            currentUserId={currentUser.id}
            contactAvatar={selectedChat.avatar}
            isOnline={selectedChat.isOnline}
            distance={selectedChat.distance}
            isEncrypted={selectedChat.isEncrypted}
            onBack={handleBackToList}
          />
        ) : null

      case 'chats':
        return <EnhancedChatList onChatSelect={handleChatSelect} />

      case 'videos':
        return <EnhancedVideoFeed />

      case 'communities':
        return (
          <div className="h-full overflow-y-auto">
            <RealTimeCommunities currentUserId={currentUser.id} />
            <div className="p-4">
              <LiveCommunityEvents
                communityId="main_community"
                isLive={backendStatus.healthy}
                currentUserId={currentUser.id}
              />
            </div>
          </div>
        )

      case 'marketplace':
        return <ModernMarketplace />

      case 'learning':
        return <ModernLearningHub />

      case 'gamification':
        return <GamificationHub currentUserId={currentUser.id} />

      case 'live-events':
        return <LiveEventsHub currentUserId={currentUser.id} />

      default:
        return <EnhancedChatList onChatSelect={handleChatSelect} />
    }
  }

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
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-green-300/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-gradient-to-br from-red-300/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Main App Container */}
      <div className="relative z-10 max-w-md mx-auto bg-white/95 backdrop-blur-xl min-h-screen shadow-2xl border-x border-white/20">
        {/* Live Mode Banner */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200 px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-green-800">🚀 Live Platform - Real-time across all features</span>
              <Zap className="w-3 h-3 text-green-600" />
            </div>
            <div className="flex items-center gap-2 text-green-700">
              <Flame className="w-3 h-3" />
              <span className="font-medium">{realtimeStats.activeNow} active now</span>
            </div>
          </div>
        </div>

        {/* Header - Hide on conversation view */}
        {currentView !== 'conversation' && (
          <div className="relative">
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <ModernHeader
                  currentView={currentView}
                  isDarkMode={isDarkMode}
                  onToggleDarkMode={toggleDarkMode}
                  userLocation={currentUser.location}
                  onProfileClick={handleProfileClick}
                  onSearchClick={handleSearchClick}
                  currentUser={currentUser}
                  isLive={backendStatus.healthy}
                />
                
                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('gamification')}
                    className="flex items-center gap-1 bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full hover:scale-105 transition-transform"
                    title="Achievements & Rewards"
                  >
                    <Trophy className="w-3 h-3 text-yellow-600" />
                    <span className="text-xs text-yellow-700 font-medium">Rewards</span>
                  </button>
                  
                  <button
                    onClick={() => setCurrentView('live-events')}
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
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* Main Content */}
        <main className={cn(
          "transition-all duration-300 overflow-hidden",
          currentView !== 'conversation' 
            ? "h-[calc(100vh-200px)]"
            : "h-screen"
        )}>
          {renderCurrentView()}
        </main>

        {/* Bottom Navigation - Hide on conversation view */}
        {currentView !== 'conversation' && (
          <BottomNavigation
            activeTab={currentView}
            onTabChange={handleViewChange}
          />
        )}

        {/* Profile Settings Modal */}
        {showProfileSettings && currentUser && (
          <ProfileSettings
            user={currentUser}
            onClose={() => setShowProfileSettings(false)}
            onUserUpdate={handleUserUpdate}
          />
        )}

        {/* Search Modal */}
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelect={handleSearchSelect}
        />

        {/* Stories Modal */}
        {showStories && (
          <StoriesHub
            currentUserId={currentUser.id}
            onClose={() => {
              setShowStories(false)
              setSelectedStoryUser(null)
            }}
          />
        )}
      </div>
    </div>
  )
}