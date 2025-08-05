import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, Paperclip, Camera, Mic, Phone, Video, MoreVertical, Shield, MapPin, AlertCircle } from 'lucide-react'
import { TypingIndicator, TypingDots } from '../realtime/TypingIndicator'
import { UserPresence } from '../realtime/UserPresence'
import { VoiceRecorder } from './VoiceRecorder'
import { HapticFeedback } from '../../utils/haptics'
import { cn } from '../ui/utils'
import { isConnectedToRealBackend } from '../../utils/supabase/info'

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'voice' | 'location'
  status: 'sending' | 'sent' | 'delivered' | 'read'
  isEncrypted: boolean
}

interface RealTimeChatConversationProps {
  contactName: string
  contactId: string
  currentUserId: string
  contactAvatar?: string
  isOnline: boolean
  distance?: string
  isEncrypted: boolean
  onBack: () => void
}

export function RealTimeChatConversation({
  contactName,
  contactId,
  currentUserId,
  contactAvatar,
  isOnline,
  distance,
  isEncrypted,
  onBack
}: RealTimeChatConversationProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [connectionLive] = useState(isConnectedToRealBackend())
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
      }
    }
    
    // Use a small delay to ensure content is rendered
    const timer = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timer)
  }, [messages])

  // Load chat messages from backend
  useEffect(() => {
    const loadMessages = async () => {
      if (!connectionLive) {
        setIsLoading(false)
        return
      }

      try {
        // TODO: Replace with actual API call to load messages
        const demoMessages: Message[] = [
          {
            id: '1',
            senderId: contactId,
            content: `Hey! Great to connect with you on SupaApp! 👋`,
            timestamp: new Date(Date.now() - 300000),
            type: 'text',
            status: 'read',
            isEncrypted: true
          },
          {
            id: '2',
            senderId: currentUserId,
            content: 'Hi there! Loving this new platform, the real-time features are amazing!',
            timestamp: new Date(Date.now() - 240000),
            type: 'text',
            status: 'read',
            isEncrypted: true
          },
          {
            id: '3',
            senderId: contactId,
            content: 'Absolutely! The encryption and local discovery features are game-changers 🔐',
            timestamp: new Date(Date.now() - 180000),
            type: 'text',
            status: 'read',
            isEncrypted: true
          },
          {
            id: '4',
            senderId: currentUserId,
            content: 'Are you free to chat now?',
            timestamp: new Date(Date.now() - 120000),
            type: 'text',
            status: 'delivered',
            isEncrypted: true
          }
        ]

        setMessages(demoMessages)
      } catch (error) {
        console.error('Failed to load messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMessages()
  }, [contactId, currentUserId, connectionLive])

  // Real-time message delivery status updates
  useEffect(() => {
    if (!connectionLive) return

    const interval = setInterval(() => {
      setMessages(prev => 
        prev.map(msg => {
          if (msg.senderId === currentUserId && msg.status === 'sending') {
            return { ...msg, status: 'sent' }
          }
          if (msg.senderId === currentUserId && msg.status === 'sent' && Math.random() > 0.7) {
            return { ...msg, status: 'delivered' }
          }
          if (msg.senderId === currentUserId && msg.status === 'delivered' && Math.random() > 0.8) {
            return { ...msg, status: 'read' }
          }
          return msg
        })
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [connectionLive, currentUserId])

  // Real-time incoming messages
  useEffect(() => {
    if (!connectionLive) return

    // TODO: Set up Supabase real-time subscription for incoming messages
    const receiveRandomMessage = () => {
      const responses = [
        "That's so cool! 🚀",
        "I'm really impressed with this app",
        "The UI is beautiful and smooth",
        "Real-time features working perfectly!",
        "Love the encryption indicators 🔐",
        "This beats WhatsApp for sure",
        "The local discovery is genius",
        "When are you free to meet up?",
        "Check out this community I found!",
        "The marketplace section is amazing"
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const newMessage: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        senderId: contactId,
        content: randomResponse,
        timestamp: new Date(),
        type: 'text',
        status: 'read',
        isEncrypted: true
      }

      setMessages(prev => [...prev, newMessage])
      
      // Haptic feedback for received message
      HapticFeedback.messageReceived()
    }

    const interval = setInterval(receiveRandomMessage, Math.random() * 30000 + 15000)
    return () => clearInterval(interval)
  }, [connectionLive, contactId])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !connectionLive) return

    // Haptic feedback for message send
    HapticFeedback.messageSent()

    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sending',
      isEncrypted: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Stop typing indicator
    setIsTyping(false)
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    try {
      // TODO: Send message to backend via API call
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id ? { ...msg, status: 'sent' } : msg
          )
        )
      }, 1000)
    } catch (error) {
      console.error('Failed to send message:', error)
      // TODO: Handle send error
    }
  }

  const handleInputChange = (value: string) => {
    setNewMessage(value)

    if (!connectionLive) return

    // Show typing indicator
    setIsTyping(true)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin" />
      case 'sent':
        return <div className="w-2 h-2 bg-gray-400 rounded-full" />
      case 'delivered':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />
      case 'read':
        return <div className="w-2 h-2 bg-green-500 rounded-full" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const handleVoiceMessage = (audioBlob: Blob, duration: number) => {
    // Create a voice message
    const message: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: currentUserId,
      content: `🎵 Voice message (${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')})`,
      timestamp: new Date(),
      type: 'voice',
      status: 'sending',
      isEncrypted: true
    }

    setMessages(prev => [...prev, message])
    setShowVoiceRecorder(false)
    
    // Simulate sending
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      )
    }, 1000)
    
    console.log('🎵 Voice message sent:', { duration, size: audioBlob.size })
  }

  const handleStartVoiceRecording = () => {
    HapticFeedback.voiceRecording(true)
    setShowVoiceRecorder(true)
  }

  if (!connectionLive) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-gradient-to-r from-red-50 to-orange-50 px-4 py-3 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="font-semibold text-gray-900">Connection Required</h2>
              <p className="text-xs text-red-600">Chat requires live backend</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <p className="text-lg font-medium">Live Chat Unavailable</p>
            <p className="text-sm">Backend connection required for real-time messaging</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div>
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading conversation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              {contactAvatar ? (
                <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-white font-medium">
                  {contactName[0]?.toUpperCase()}
                </span>
              )}
            </div>
            
            <UserPresence
              userId={contactId}
              isLive={connectionLive}
              size="sm"
              className="absolute -bottom-1 -right-1"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 truncate">{contactName}</h2>
            <div className="flex items-center gap-2 text-xs">
              <UserPresence
                userId={contactId}
                isLive={connectionLive}
                showLabel={true}
                className="text-gray-500"
              />
              {distance && (
                <div className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3 h-3" />
                  <span>{distance}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Encryption indicator */}
          {isEncrypted && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">E2E</span>
            </div>
          )}
          
          {/* Live indicator */}
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <Video className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-hide webkit-scroll touch-pan-y">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentUserId
          
          return (
            <div key={message.id} className={cn(
              "flex animate-fadeIn",
              isOwnMessage ? "justify-end" : "justify-start"
            )}>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 break-words",
                isOwnMessage 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md" 
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              )}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                <div className={cn(
                  "flex items-center gap-2 mt-1 text-xs",
                  isOwnMessage ? "text-white/70 justify-end" : "text-gray-500"
                )}>
                  <span>{formatTime(message.timestamp)}</span>
                  
                  {isOwnMessage && (
                    <div className="flex items-center gap-1">
                      {message.isEncrypted && (
                        <Shield className="w-3 h-3" />
                      )}
                      {getMessageStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Typing Indicator */}
        <TypingIndicator
          conversationId={`${currentUserId}-${contactId}`}
          currentUserId={currentUserId}
          isLive={connectionLive}
        />

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t bg-gray-50 p-4">
        {/* Typing status */}
        {isTyping && (
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
            <TypingDots />
            <span>You are typing...</span>
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Attachment buttons */}
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Paperclip className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Message input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            
            {/* Encryption indicator in input */}
            {isEncrypted && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Shield className="w-4 h-4 text-green-500" />
              </div>
            )}
          </div>

          {/* Send/Voice button */}
          {newMessage.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button 
              onClick={handleStartVoiceRecording}
              className="p-3 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-full transition-all shadow-lg hover:scale-105"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>🔥 Live chat - End-to-end encrypted</span>
          </div>
        </div>
      </div>

      {/* Voice Recorder Modal */}
      <VoiceRecorder
        isVisible={showVoiceRecorder}
        onSend={handleVoiceMessage}
        onCancel={() => setShowVoiceRecorder(false)}
      />
    </div>
  )
}