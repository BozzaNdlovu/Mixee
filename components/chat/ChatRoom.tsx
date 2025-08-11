import { useState, useEffect, useRef } from 'react'
import { Send, ArrowLeft, MoreVertical, Phone, Video, Search, Smile } from 'lucide-react'
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

interface Message {
  id: string
  text: string
  sender: User
  timestamp: Date
  isOwn: boolean
}

interface ChatRoomProps {
  currentUser: User
  chatPartner: User
  onBack: () => void
}

export function ChatRoom({ currentUser, chatPartner, onBack }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Simulate typing indicator
  useEffect(() => {
    if (messages.length > 0 && Math.random() > 0.7) {
      setIsTyping(true)
      const timer = setTimeout(() => {
        setIsTyping(false)
        // Add a random response
        const responses = [
          "That's interesting! 🤔",
          "I see what you mean!",
          "Thanks for sharing! 😊",
          "Great point!",
          "I agree with you on that.",
          "Tell me more about that!",
          "That sounds awesome! 🚀",
          "Interesting perspective!",
          "I'm glad you shared that.",
          "What do you think about that?",
          "That's a good question!",
          "I'm here to help! 💪"
        ]
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        addMessage(randomResponse, chatPartner, false)
      }, 2000 + Math.random() * 3000)
      return () => clearTimeout(timer)
    }
  }, [messages, chatPartner])

  const addMessage = (text: string, sender: User, isOwn: boolean) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      isOwn
    }
    setMessages(prev => [...prev, message])
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      addMessage(newMessage.trim(), currentUser, true)
      setNewMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="relative z-10 max-w-md mx-auto bg-white/95 backdrop-blur-xl h-screen shadow-2xl border-x border-white/20 overflow-hidden flex flex-col">
      {/* Chat Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {chatPartner.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{chatPartner.displayName}</h2>
              <p className="text-xs text-gray-500">@{chatPartner.username}</p>
              {chatPartner.location && (
                <p className="text-xs text-gray-500">{chatPartner.location}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Search className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Video className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MoreVertical className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation!</h3>
            <p className="text-gray-600">Send a message to begin chatting with {chatPartner.displayName}</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isOwn ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                message.isOwn
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                  : "bg-white shadow-sm border border-gray-200 text-gray-900"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p className={cn(
                "text-xs mt-1",
                message.isOwn ? "text-purple-100" : "text-gray-500"
              )}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border border-gray-200 text-gray-900 px-4 py-2 rounded-2xl">
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Smile className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-1 relative">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pr-12 rounded-full border-gray-300 focus:border-purple-400"
            />
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full p-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 