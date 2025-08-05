import { useState, useEffect } from 'react'
import { Bell, MessageCircle, Heart, Users, ShoppingBag, BookOpen, X } from 'lucide-react'
import { cn } from '../ui/utils'

interface Notification {
  id: string
  type: 'message' | 'like' | 'community' | 'marketplace' | 'learning' | 'system'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  avatar?: string
  actionUrl?: string
}

interface LiveNotificationsProps {
  userId: string
  isLive: boolean
}

export function LiveNotifications({ userId, isLive }: LiveNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!isLive) return

    // Simulate real-time notifications
    const generateNotification = (): Notification => {
      const types = ['message', 'like', 'community', 'marketplace', 'learning'] as const
      const type = types[Math.floor(Math.random() * types.length)]
      
      const notificationTemplates = {
        message: {
          title: 'New Message',
          messages: [
            'Hey! How are you doing?',
            'Check out this cool video I found!',
            'Are you free to chat?',
            'Thanks for the recommendation!',
            'Let\'s catch up soon!'
          ]
        },
        like: {
          title: 'New Like',
          messages: [
            'Someone liked your post',
            'Your video got a new like!',
            'Your community post is popular',
            'Someone appreciated your content'
          ]
        },
        community: {
          title: 'Community Update',
          messages: [
            'New member joined Cape Town Tech Hub',
            'Hot discussion in South African Startups',
            'Someone shared in Local Artists Network',
            'Community event starting soon!'
          ]
        },
        marketplace: {
          title: 'Marketplace Activity',
          messages: [
            'Someone is interested in your MacBook',
            'New item posted near you',
            'Price drop on item you liked',
            'Your item got a new view'
          ]
        },
        learning: {
          title: 'Learning Update',
          messages: [
            'New course available: Advanced React',
            'Your course has a new review',
            'Assignment deadline approaching',
            'Certificate ready for download'
          ]
        }
      }

      const template = notificationTemplates[type]
      const message = template.messages[Math.floor(Math.random() * template.messages.length)]

      return {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: template.title,
        message,
        timestamp: new Date(),
        isRead: false,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
      }
    }

    // Generate initial notifications
    const initialNotifications = Array.from({ length: 3 }, generateNotification)
    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.length)

    // Set up interval for new notifications
    const interval = setInterval(() => {
      const newNotification = generateNotification()
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]) // Keep last 10
      setUnreadCount(prev => prev + 1)
    }, Math.random() * 30000 + 15000) // Random interval 15-45 seconds

    return () => clearInterval(interval)
  }, [isLive, userId])

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message': return MessageCircle
      case 'like': return Heart
      case 'community': return Users
      case 'marketplace': return ShoppingBag
      case 'learning': return BookOpen
      default: return Bell
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'message': return 'text-blue-500'
      case 'like': return 'text-pink-500'
      case 'community': return 'text-purple-500'
      case 'marketplace': return 'text-green-500'
      case 'learning': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })))
    setUnreadCount(0)
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return `${Math.floor(minutes / 1440)}d ago`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={cn(
          "relative w-10 h-10 rounded-full transition-all duration-200 hover:bg-gray-100/80 flex items-center justify-center",
          unreadCount > 0 && "animate-pulse"
        )}
      >
        <Bell className="w-4 h-4 text-gray-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-scaleIn">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications yet</p>
                <p className="text-sm">Check back later for updates!</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type)
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors",
                      !notification.isRead && "bg-blue-50"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center bg-gray-100",
                        getNotificationColor(notification.type)
                      )}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900 text-sm">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 text-center">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}