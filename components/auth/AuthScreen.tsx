import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, User, MapPin, ArrowRight, Sparkles, CheckCircle, AlertCircle, Wifi } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void
}

export function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: '',
    location: 'Cape Town, SA'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = 'Username is required'
      } else if (!/^[a-zA-Z0-9_]{3,30}$/.test(formData.username)) {
        newErrors.username = 'Username must be 3-30 characters (letters, numbers, underscore only)'
      }

      if (!formData.displayName) {
        newErrors.displayName = 'Display name is required'
      } else if (formData.displayName.length < 2) {
        newErrors.displayName = 'Display name must be at least 2 characters'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAuth = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Demo authentication
      const user = {
        id: isLogin ? 'demo-user' : `user-${Date.now()}`,
        email: formData.email,
        username: isLogin ? 'demo_user' : formData.username,
        displayName: isLogin ? 'Demo User' : formData.displayName,
        location: formData.location
      }
      
      onAuthSuccess(user)
    } catch (error) {
      console.error('Authentication failed:', error)
      setErrors({ general: 'Authentication failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAuth()
    }
  }

  const tryDemoMode = () => {
    setFormData({
      email: 'demo@mixee.com',
      password: 'demo123',
      username: 'demo_user',
      displayName: 'Demo User',
      location: 'Cape Town, SA'
    })
    setIsLogin(true)
  }

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
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome to Mixee
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to your account' : 'Create your Mixee account'}
          </p>
          
          {/* Demo Mode Status */}
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              <span>Demo Mode - Full Features Available</span>
            </div>
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

          {/* Demo Mode Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <Wifi className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium">Demo Mode Active</p>
                <p className="text-xs text-blue-600 mt-1">
                  All features are available for testing. No real authentication required.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Enter your display name"
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={cn(
                        "pl-10",
                        errors.displayName && "border-red-500 focus:border-red-500"
                      )}
                    />
                  </div>
                  {errors.displayName && (
                    <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={cn(
                        "pl-10",
                        errors.username && "border-red-500 focus:border-red-500"
                      )}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={cn(
                    "pl-10",
                    errors.email && "border-red-500 focus:border-red-500"
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  className={cn(
                    "pl-10 pr-10",
                    errors.password && "border-red-500 focus:border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10"
                  />
                </div>
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            <Button
              onClick={handleAuth}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>

          {/* Demo Mode Quick Access */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              onClick={tryDemoMode}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Try Demo Mode</span>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}