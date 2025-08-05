import { useState, useRef, useEffect } from 'react'
import { Search, X, MessageCircle, Video, Users, ShoppingBag, BookOpen, MapPin, User } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'

interface SearchResult {
  id: string
  type: 'user' | 'chat' | 'video' | 'community' | 'product' | 'course'
  title: string
  subtitle?: string
  avatar?: string
  badge?: string
  location?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (result: SearchResult) => void
}

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'user',
    title: 'Sarah Johnson',
    subtitle: '@sarahj',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    location: 'Cape Town'
  },
  {
    id: '2',
    type: 'chat',
    title: 'Tech Innovators',
    subtitle: '12 members • 3 new messages',
    badge: '3'
  },
  {
    id: '3',
    type: 'video',
    title: 'React Native Tips',
    subtitle: 'By John Doe • 2.1k views',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    type: 'community',
    title: 'Cape Town Developers',
    subtitle: '1.2k members • Very active',
    badge: 'Hot'
  },
  {
    id: '5',
    type: 'product',
    title: 'MacBook Pro 16"',
    subtitle: 'R45,000 • Electronics',
    location: 'Johannesburg'
  },
  {
    id: '6',
    type: 'course',
    title: 'Advanced React Course',
    subtitle: 'By Tech Academy • 4.8★',
    badge: 'New'
  }
]

export function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    // Simulate search delay
    const timeout = setTimeout(() => {
      const filtered = mockSearchResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
      setResults(filtered)
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return User
      case 'chat': return MessageCircle
      case 'video': return Video
      case 'community': return Users
      case 'product': return ShoppingBag
      case 'course': return BookOpen
      default: return Search
    }
  }

  const getResultColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'user': return 'text-blue-500'
      case 'chat': return 'text-pink-500'
      case 'video': return 'text-teal-500'
      case 'community': return 'text-purple-500'
      case 'product': return 'text-green-500'
      case 'course': return 'text-orange-500'
      default: return 'text-gray-500'
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onSelect(result)
    onClose()
    setQuery('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 mx-4 animate-scaleIn">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, chats, videos, and more..."
            className="flex-1 border-none bg-transparent focus:ring-0 text-lg"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {!query.trim() ? (
            /* Recent/Suggestions */
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent searches</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600">React tutorials</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-600">Local developers</span>
                </div>
              </div>
            </div>
          ) : isLoading ? (
            /* Loading */
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Searching...</p>
            </div>
          ) : results.length === 0 ? (
            /* No Results */
            <div className="p-8 text-center">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No results found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for users, chats, or content</p>
            </div>
          ) : (
            /* Results */
            <div className="p-2">
              {results.map((result) => {
                const Icon = getResultIcon(result.type)
                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {result.avatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={result.avatar} />
                        <AvatarFallback>
                          {result.title[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className={cn(
                        "w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center",
                        getResultColor(result.type)
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {result.title}
                        </p>
                        {result.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {result.badge}
                          </Badge>
                        )}
                      </div>
                      {result.subtitle && (
                        <p className="text-sm text-gray-500 truncate">
                          {result.subtitle}
                        </p>
                      )}
                      {result.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">{result.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Search Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Search across all SupaApp content</span>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white rounded border text-xs">ESC</kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}