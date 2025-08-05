import { useState, useEffect } from 'react'
import { Check, Copy, AlertCircle, ExternalLink, Database, Key, Globe, Zap } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'
import { setConfig, getConnectionStatus, isConnectedToRealBackend } from '../../utils/supabase/info'

interface SupabaseSetupProps {
  onComplete: () => void
}

export function SupabaseSetup({ onComplete }: SupabaseSetupProps) {
  const [config, setConfigState] = useState({
    url: '',
    anonKey: '',
    serviceKey: ''
  })
  const [isValidating, setIsValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<{
    url: boolean
    anonKey: boolean
    serviceKey: boolean
  }>({
    url: false,
    anonKey: false,
    serviceKey: false
  })
  const [connectionStatus, setConnectionStatus] = useState(getConnectionStatus())

  useEffect(() => {
    setConnectionStatus(getConnectionStatus())
  }, [])

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'url':
        return value.includes('supabase.co') && value.startsWith('https://')
      case 'anonKey':
        return value.startsWith('eyJ') && value.length > 100 // JWT token characteristics
      case 'serviceKey':
        return value.startsWith('eyJ') && value.length > 100 // JWT token characteristics
      default:
        return false
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setConfigState(prev => ({ ...prev, [field]: value }))
    
    // Validate in real-time
    setValidationResults(prev => ({
      ...prev,
      [field]: validateField(field, value)
    }))
  }

  const handleSubmit = async () => {
    setIsValidating(true)
    
    try {
      // Set the configuration
      setConfig({
        SUPABASE_URL: config.url,
        SUPABASE_ANON_KEY: config.anonKey,
        SUPABASE_SERVICE_ROLE_KEY: config.serviceKey
      })
      
      // Give a moment for the config to be set
      setTimeout(() => {
        onComplete()
      }, 1000)
    } catch (error) {
      console.error('Failed to apply configuration:', error)
      setIsValidating(false)
    }
  }

  const isFormValid = validationResults.url && validationResults.anonKey && validationResults.serviceKey

  const pasteFromClipboard = async (field: string) => {
    try {
      const text = await navigator.clipboard.readText()
      handleInputChange(field, text)
    } catch (error) {
      console.error('Failed to read clipboard:', error)
    }
  }

  if (isConnectedToRealBackend()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Connected to Supabase!
            </h2>
            <p className="text-gray-600 mb-6">
              Your SupaApp is now connected to your Supabase project and ready for live use.
            </p>
            <Button 
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600"
            >
              Continue to App
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Connect to Supabase
          </h1>
          <p className="text-gray-600">
            Configure your Supabase project to enable live features
          </p>
          
          {/* Current Status */}
          <div className="mt-4">
            <Badge variant="secondary" className="inline-flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full" />
              Currently in {connectionStatus.mode} mode
            </Badge>
          </div>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
          {/* Setup Instructions */}
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Get Your Supabase Credentials
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 ml-4">
              <li>1. Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline">supabase.com/dashboard</a></li>
              <li>2. Select your project (or create a new one)</li>
              <li>3. Go to Settings → API</li>
              <li>4. Copy the URL and keys below</li>
            </ol>
          </div>

          {/* Configuration Form */}
          <div className="space-y-6">
            {/* Project URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Project URL *
              </label>
              <div className="flex gap-2">
                <Input
                  value={config.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className={cn(
                    "flex-1",
                    config.url && (validationResults.url ? "border-green-500" : "border-red-500")
                  )}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pasteFromClipboard('url')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {config.url && !validationResults.url && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid Supabase URL
                </p>
              )}
            </div>

            {/* Anonymous Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                Anonymous Key (anon/public) *
              </label>
              <div className="flex gap-2">
                <Input
                  value={config.anonKey}
                  onChange={(e) => handleInputChange('anonKey', e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className={cn(
                    "flex-1 font-mono text-xs",
                    config.anonKey && (validationResults.anonKey ? "border-green-500" : "border-red-500")
                  )}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pasteFromClipboard('anonKey')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {config.anonKey && !validationResults.anonKey && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid JWT token
                </p>
              )}
            </div>

            {/* Service Role Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-1" />
                Service Role Key *
              </label>
              <div className="flex gap-2">
                <Input
                  value={config.serviceKey}
                  onChange={(e) => handleInputChange('serviceKey', e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className={cn(
                    "flex-1 font-mono text-xs",
                    config.serviceKey && (validationResults.serviceKey ? "border-green-500" : "border-red-500")
                  )}
                  type="password"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pasteFromClipboard('serviceKey')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              {config.serviceKey && !validationResults.serviceKey && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Please enter a valid JWT token
                </p>
              )}
            </div>

            {/* Warning */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Keep your service role key secure. Don't share it publicly or commit it to version control.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isValidating}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            >
              {isValidating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting to Supabase...
                </div>
              ) : (
                'Connect to Supabase'
              )}
            </Button>

            {/* Continue in Demo Mode */}
            <div className="text-center">
              <button
                onClick={onComplete}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Continue in Demo Mode
              </button>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-3">Connecting to Supabase enables:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="text-xs">
              🔄 Real-time Updates
            </Badge>
            <Badge variant="secondary" className="text-xs">
              ☁️ Cloud Storage
            </Badge>
            <Badge variant="secondary" className="text-xs">
              👥 Multi-user Support
            </Badge>
            <Badge variant="secondary" className="text-xs">
              🔐 Secure Authentication
            </Badge>
            <Badge variant="secondary" className="text-xs">
              📊 Live Analytics
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}