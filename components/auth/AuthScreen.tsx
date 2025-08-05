import { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, User, MapPin, ArrowRight, Sparkles, AlertCircle, CheckCircle, Wifi } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'
import { auth, checkClientHealth } from '../../utils/supabase/client'
import { checkBackendHealth, validators, appConfig } from '../../utils/supabase/info'

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [backendStatus, setBackendStatus] = useState<{ healthy: boolean; message: string } | null>(null)
  const [clientHealth, setClientHealth] = useState<boolean>(true)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    location: 'Cape Town, SA'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    // Check both backend and client health on component mount with timeout
    const checkHealth = async () => {
      try {
        // Set a timeout for health checks
        const healthTimeout = new Promise<{ healthy: boolean; message: string }>((resolve) => {
          setTimeout(() => {
            resolve({
              healthy: false,
              message: 'Connection timeout - limited features available'
            })
          }, 5000)
        })

        const [backend, client] = await Promise.all([
          Promise.race([checkBackendHealth(), healthTimeout]),
          checkClientHealth()
        ])

        setBackendStatus(backend)
        setClientHealth(client)
        
        if (!backend.healthy) {
          setIsOfflineMode(true)
          console.warn('Backend not available, running in limited mode')
        }
      } catch (error) {
        console.error('Health check failed:', error)
        setBackendStatus({
          healthy: false,
          message: 'Unable to connect - running in offline mode'
        })
        setClientHealth(false)
        setIsOfflineMode(true)
      }
    }

    checkHealth()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validators.email(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validators.password(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      } else if (!validators.username(formData.username)) {
        newErrors.username = 'Username must be 3-30 characters (letters, numbers, underscore only)'
      }

      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      } else if (!validators.displayName(formData.displayName)) {
        newErrors.displayName = 'Display name must be 2-50 characters long'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAuth = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      let result

      if (isLogin) {
        // Sign in existing user
        result = await auth.signIn(formData.email, formData.password)
      } else {
        // Sign up new user
        result = await auth.signUp(formData.email, formData.password, {
          username: formData.username,
          display_name: formData.displayName,
          location: formData.location,
          app_version: appConfig.version
        })
      }

      if (result.error) {
        // Handle specific offline mode scenarios
        if (isOfflineMode && (result.error.message.includes('fetch') || result.error.message.includes('network'))) {
          // In offline mode, create a demo user for testing
          if (formData.email === 'demo@supaapp.com' && formData.password === 'demo123') {
            const demoUser = {
              id: 'demo-user-id',
              email: formData.email,
              username: formData.username || 'demo_user',
              displayName: formData.displayName || 'Demo User',
              location: formData.location,
              avatar: null
            }
            
            // Store demo user
            localStorage.setItem('supaapp_user', JSON.stringify(demoUser))
            localStorage.setItem('supaapp_session', JSON.stringify({
              access_token: 'demo-token',
              expires_at: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
            }))
            
            onAuthSuccess(demoUser)
            return
          } else {
            throw new Error('Backend unavailable. Use demo@supaapp.com / demo123 to try the app in offline mode.')
          }
        }
        throw new Error(result.error.message)
      }

      if (result.data?.user) {
        // Create user object for the app
        const user = {
          id: result.data.user.id,
          email: result.data.user.email!,
          username: result.data.user.user_metadata?.username || formData.username,
          displayName: result.data.user.user_metadata?.display_name || formData.displayName,
          location: result.data.user.user_metadata?.location || formData.location,
          avatar: result.data.user.user_metadata?.avatar_url || null
        }

        // Store user data for persistence
        localStorage.setItem('supaapp_user', JSON.stringify(user))
        if (result.data.session) {
          localStorage.setItem('supaapp_session', JSON.stringify(result.data.session))
        }

        onAuthSuccess(user)
      } else {
        throw new Error('Authentication failed - no user data received')
      }
    } catch (error: any) {
      console.error('Authentication error:', error)
      
      // Handle specific Supabase error messages
      let errorMessage = error.message || 'An unexpected error occurred'
      
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        if (isOfflineMode) {
          errorMessage += ' (In offline mode, try demo@supaapp.com / demo123)'
        }
      } else if (errorMessage.includes('Email already registered') || errorMessage.includes('already been taken')) {
        errorMessage = 'This email is already registered. Try signing in instead.'
        setIsLogin(true) // Switch to login mode
      } else if (errorMessage.includes('Password should be at least')) {
        errorMessage = 'Password must be at least 6 characters long.'
      } else if (errorMessage.includes('User not found')) {
        errorMessage = 'No account found with this email.'
        if (isOfflineMode) {
          errorMessage += ' In offline mode, try demo@supaapp.com / demo123 or switch to sign up.'
        } else {
          errorMessage += ' Try signing up instead.'
          setIsLogin(false) // Switch to signup mode
        }
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connection')) {
        if (isOfflineMode) {
          errorMessage = 'Backend unavailable. Try demo@supaapp.com with password: demo123'
        } else {
          errorMessage = 'Unable to connect to SupaApp servers. Please check your internet connection and try again.'
          // Re-check backend status
          setTimeout(() => {
            checkBackendHealth().then(setBackendStatus)
          }, 1000)
        }
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleAuth()
    }
  }

  const refreshConnectionStatus = async () => {
    try {
      const [backend, client] = await Promise.all([
        checkBackendHealth(),
        checkClientHealth()
      ])
      setBackendStatus(backend)
      setClientHealth(client)
      
      if (backend.healthy) {
        setIsOfflineMode(false)
      } else {
        setIsOfflineMode(true)
      }
    } catch (error) {
      console.error('Connection refresh failed:', error)
    }
  }

  const tryDemoMode = () => {
    setFormData({
      email: 'demo@supaapp.com',
      password: 'demo123',
      username: 'demo_user',
      displayName: 'Demo User',
      location: 'Cape Town, SA'
    })
    setIsLogin(true)
  }

  const isSystemHealthy = backendStatus?.healthy && clientHealth

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl mb-4">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome to SupaApp
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your SupaApp account'}
          </p>
          
          {/* System Status */}
          <div className="mt-4">
            {backendStatus ? (
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
                isSystemHealthy
                  ? "bg-green-100 text-green-700 border-green-200"
                  : "bg-amber-100 text-amber-700 border-amber-200"
              )}>
                {isSystemHealthy ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    <span>Platform Ready</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>{isOfflineMode ? 'Offline Mode' : 'Connection Issues'}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-xs font-medium">
                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                <span>Checking Status...</span>
              </div>
            )}
          </div>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
          {/* Tab Switch */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={cn(
                "flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200",
                !isLogin
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Sign Up
            </button>
          </div>

          {/* System Status Warning */}
          {isOfflineMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
              <div className="flex items-start gap-2">
                <Wifi className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-blue-800 text-sm">Running in offline mode with limited features.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={tryDemoMode}
                      className="text-blue-700 text-xs bg-blue-100 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      Try Demo Mode
                    </button>
                    <button 
                      onClick={refreshConnectionStatus}
                      className="text-blue-700 text-xs underline hover:no-underline"
                    >
                      Check Connection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            {/* Display Name (Signup only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-11 rounded-xl border-gray-200 focus:border-purple-400 transition-colors"
                    maxLength={appConfig.limits.displayNameLength}
                  />
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.displayName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.displayName}
                  </p>
                )}
              </div>
            )}

            {/* Username (Signup only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
                    onKeyPress={handleKeyPress}
                    className="pl-11 rounded-xl border-gray-200 focus:border-purple-400 transition-colors"
                    maxLength={appConfig.limits.usernameLength}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                </div>
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder={isOfflineMode ? "Email (try demo@supaapp.com)" : "Email address"}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-11 rounded-xl border-gray-200 focus:border-purple-400 transition-colors"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isOfflineMode ? "Password (try demo123)" : "Password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-11 pr-11 rounded-xl border-gray-200 focus:border-purple-400 transition-colors"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Location (Signup only) */}
            {!isLogin && (
              <div>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Location (e.g., Cape Town, SA)"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-11 rounded-xl border-gray-200 focus:border-purple-400 transition-colors"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {errors.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl py-3 shadow-lg disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{isLogin ? 'Sign In to SupaApp' : 'Join SupaApp'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>

            {/* Demo Mode Info */}
            {isOfflineMode && (
              <div className="text-center p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-700">
                  <strong>Demo Mode:</strong> Use demo@supaapp.com / demo123 to explore the app
                </p>
              </div>
            )}
          </div>

          {/* Features Preview (Signup only) */}
          {!isLogin && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 text-center">Join thousands of users on SupaApp:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="secondary" className="text-xs">
                  💬 Real-time Chat
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  📹 Video Sharing
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🏪 Marketplace
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🎓 Learning Hub
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  👥 Communities
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  🔒 Encrypted &amp; Secure
                </Badge>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By {isLogin ? 'signing in' : 'signing up'}, you agree to our{' '}
          <button className="text-purple-600 hover:underline">Terms of Service</button> and{' '}
          <button className="text-purple-600 hover:underline">Privacy Policy</button>
        </p>
      </div>
    </div>
  )
}