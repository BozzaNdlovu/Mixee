import { useState, useEffect } from 'react'
import { User, Camera, MapPin, Phone, Mail, Lock, Bell, Moon, Sun, Globe, Shield, Heart, Edit2, Check, X, Upload, Star, Crown, Zap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Switch } from '../ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { MediaUpload } from '../upload/MediaUpload'
import { cn } from '../ui/utils'
import { auth } from '../../utils/supabase/client'

interface ProfileSettingsProps {
  user: {
    id: string
    username: string
    email: string
    displayName: string
    location?: string
    avatar?: string
  }
  onClose: () => void
  onUserUpdate: (updatedUser: any) => void
}

export function ProfileSettings({ user, onClose, onUserUpdate }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    displayName: user.displayName,
    username: user.username,
    location: user.location || '',
    avatar: user.avatar || '',
    bio: '',
    phone: '',
    website: ''
  })
  
  const [preferences, setPreferences] = useState({
    darkMode: localStorage.getItem('supaapp_dark_mode') === 'true',
    notifications: true,
    locationSharing: true,
    onlineStatus: true,
    messageEncryption: true
  })

  const [stats] = useState({
    connections: 156,
    videosWatched: 1247,
    postsShared: 89,
    communitiesJoined: 12,
    coursesCompleted: 7,
    joinDate: 'March 2024'
  })

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    setUploadStatus(null)
    
    try {
      console.log('📝 Updating profile with data:', profileData)
      
      // Update user metadata in Supabase auth
      const { error } = await auth.updateUser({
        data: {
          display_name: profileData.displayName,
          username: profileData.username,
          location: profileData.location,
          avatar_url: profileData.avatar,
          bio: profileData.bio,
          phone: profileData.phone,
          website: profileData.website
        }
      })

      if (error) {
        console.error('❌ Error updating profile:', error)
        setUploadStatus(`Failed to update profile: ${error.message}`)
        return
      }

      // Update the user in the parent component
      onUserUpdate({
        ...user,
        displayName: profileData.displayName,
        username: profileData.username,
        location: profileData.location,
        avatar: profileData.avatar
      })

      setIsEditing(false)
      setUploadStatus('Profile updated successfully!')
      console.log('✅ Profile updated successfully')
      
      // Clear status after a few seconds
      setTimeout(() => setUploadStatus(null), 3000)
    } catch (error) {
      console.error('❌ Error updating profile:', error)
      setUploadStatus('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (fileUrl: string) => {
    console.log('🖼️ Avatar uploaded successfully:', fileUrl)
    setProfileData(prev => ({ ...prev, avatar: fileUrl }))
    setShowUpload(false)
    setUploadStatus('Avatar uploaded! Click "Save Changes" to apply.')
    
    // Auto-save the avatar URL
    try {
      const { error } = await auth.updateUser({
        data: {
          avatar_url: fileUrl
        }
      })

      if (error) {
        console.error('Error updating avatar:', error)
        setUploadStatus('Avatar uploaded but failed to save. Please try saving manually.')
      } else {
        // Update the user in the parent component
        onUserUpdate({
          ...user,
          avatar: fileUrl
        })
        setUploadStatus('Avatar updated successfully!')
        
        // Clear status after a few seconds
        setTimeout(() => setUploadStatus(null), 3000)
      }
    } catch (error) {
      console.error('Error updating avatar:', error)
      setUploadStatus('Avatar uploaded but failed to save. Please try saving manually.')
    }
  }

  const handlePreferenceChange = (key: string, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
    
    // Apply certain preferences immediately
    if (key === 'darkMode') {
      localStorage.setItem('supaapp_dark_mode', value.toString())
      document.documentElement.classList.toggle('dark', value)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Profile Settings</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            {/* Profile Picture Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={profileData.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white text-2xl">
                    {profileData.displayName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  onClick={() => setShowUpload(true)}
                  className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-white text-purple-500 hover:bg-gray-100 rounded-full shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-lg">{profileData.displayName}</h3>
                <p className="text-white/80">@{profileData.username}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-white/20 text-white border-white/20">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro User
                  </Badge>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Star className="w-3 h-3" />
                    <span>4.9</span>
                  </div>
                </div>
                {uploadStatus && (
                  <p className="text-white/90 text-sm mt-2 bg-white/10 rounded px-2 py-1">
                    {uploadStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Profile Stats */}
          <div className="p-4 border-b">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-purple-600">{stats.connections}</div>
                <div className="text-xs text-gray-500">Connections</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">{stats.videosWatched}</div>
                <div className="text-xs text-gray-500">Videos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{stats.postsShared}</div>
                <div className="text-xs text-gray-500">Posts</div>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">Profile Information</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="h-8"
              >
                {isEditing ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Edit2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="displayName" className="text-sm text-gray-600">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-sm text-gray-600">Username</Label>
                <Input
                  id="username"
                  value={profileData.username}
                  onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-sm text-gray-600">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    className="pl-10 mt-1"
                    placeholder="Cape Town, South Africa"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm text-gray-600">Bio</Label>
                <Input
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  className="mt-1"
                  placeholder="Tell people about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isLoading}
                  className="flex-1 bg-purple-500 hover:bg-purple-600"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <Separator />

          {/* Preferences */}
          <div className="p-4 space-y-4">
            <h4 className="font-semibold text-gray-900">Preferences</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Push Notifications</div>
                    <div className="text-xs text-gray-500">Get notified about messages and updates</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.notifications}
                  onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Location Sharing</div>
                    <div className="text-xs text-gray-500">Share your location with nearby users</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.locationSharing}
                  onCheckedChange={(checked) => handlePreferenceChange('locationSharing', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Online Status</div>
                    <div className="text-xs text-gray-500">Show when you're active</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.onlineStatus}
                  onCheckedChange={(checked) => handlePreferenceChange('onlineStatus', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium">Message Encryption</div>
                    <div className="text-xs text-gray-500">Encrypt all your messages</div>
                  </div>
                </div>
                <Switch
                  checked={preferences.messageEncryption}
                  onCheckedChange={(checked) => handlePreferenceChange('messageEncryption', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Info */}
          <div className="p-4 space-y-3">
            <h4 className="font-semibold text-gray-900">Account Information</h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">{stats.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-xs text-gray-500">{user.id.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="pt-3">
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => {
                  if (confirm('Are you sure you want to sign out?')) {
                    onClose()
                    // The logout will be handled by the parent component
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Upload Modal */}
      {showUpload && (
        <MediaUpload
          title="Upload Profile Picture"
          acceptedTypes={['image/*']}
          maxSizeMB={5}
          uploadType="avatar"
          onUploadSuccess={handleAvatarUpload}
          onCancel={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}