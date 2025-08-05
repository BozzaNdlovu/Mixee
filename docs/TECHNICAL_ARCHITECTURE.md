# SupaApp Technical Architecture

## 🏗️ System Architecture

### Overview
SupaApp follows a modern three-tier architecture with real-time capabilities:

```
Frontend (React/TypeScript) 
    ↕️ 
Server (Hono on Supabase Edge Functions)
    ↕️ 
Database (PostgreSQL with Realtime)
```

## 🔧 Technology Stack

### Frontend Technologies
```typescript
// Core Framework
React 18+ with TypeScript for type safety and modern development

// UI Framework  
Tailwind CSS v4 with custom design tokens
ShadCN/UI components for consistent design system

// State Management
React hooks (useState, useEffect, useContext)
Local storage for persistence
Real-time subscriptions for live data

// Animations & Interactions
Motion (Framer Motion) for smooth animations
Haptic feedback via navigator.vibrate API
Pull-to-refresh with custom implementation

// Media & Assets
Lucide React for icons
Unsplash for placeholder images
Canvas API for drawing features
```

### Backend Technologies
```typescript
// Runtime Environment
Supabase Edge Functions (Deno runtime)
Hono web framework for API routes

// Database
PostgreSQL with Row Level Security (RLS)
Supabase Realtime for live subscriptions
Key-value store pattern for flexible data

// Authentication
Supabase Auth with JWT tokens
Multi-provider OAuth (Google, Facebook, GitHub)
User metadata management

// Storage
Supabase Storage with private buckets
Signed URLs for secure file access
Media processing capabilities
```

## 🗄️ Data Architecture

### Storage Strategy
```typescript
// Primary Storage: Supabase KV Store
interface KVStore {
  key: string        // Hierarchical key pattern
  value: any         // JSON data
  created_at: Date   // Timestamp
  updated_at: Date   // Last modified
}

// Key Patterns
user:{user_id}                    // User profiles
chat:{chat_id}                    // Chat metadata
message:{chat_id}:{message_id}    // Messages
community:{community_id}          // Community data
video:{video_id}                  // Video metadata
gamification:{user_id}            // Points, badges, streaks
story:{user_id}:{story_id}        // Stories content
event:{event_id}                  // Live events
```

### Real-time Subscriptions
```typescript
// Chat Messages
supabase
  .channel(`chat:${chatId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'kv_store_0e8b25fb',
    filter: `key=like.message:${chatId}:%`
  }, handleNewMessage)

// User Presence
supabase
  .channel('presence')
  .on('presence', { event: 'sync' }, handlePresenceSync)
  .track({ user_id: currentUser.id, status: 'online' })
```

## 🔌 API Architecture

### Edge Function Structure
```typescript
// Server Entry Point: /supabase/functions/server/index.tsx
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))

// Route Prefix
app.route('/make-server-0e8b25fb', routes)

// Route Handlers
app.get('/health', healthCheck)
app.post('/auth/signup', signupHandler)
app.get('/chats/:userId', getChatHandler)
app.post('/messages', sendMessageHandler)
// ... additional routes

Deno.serve(app.fetch)
```

### Authentication Flow
```typescript
// Frontend Auth
const { data, error } = await supabase.auth.signInWithPassword({
  email: user.email,
  password: user.password
})

// Access Token Usage
const response = await fetch(`${serverUrl}/protected-route`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  }
})

// Server-side Verification
const accessToken = request.headers.get('Authorization')?.split(' ')[1]
const { data: { user }, error } = await supabase.auth.getUser(accessToken)
if (!user) return new Response('Unauthorized', { status: 401 })
```

## 🎨 Frontend Architecture

### Component Structure
```typescript
// App.tsx - Main Application
interface AppState {
  currentUser: User | null
  currentView: AppView
  selectedChat: ChatData | null
  isDarkMode: boolean
  backendStatus: HealthStatus
}

// Component Hierarchy
App
├── AuthScreen (when not authenticated)
├── OnboardingWelcome (for new users)
├── ModernHeader (navigation & search)
├── ViewComponents (based on currentView)
│   ├── EnhancedChatList
│   ├── RealTimeChatConversation
│   ├── EnhancedVideoFeed
│   ├── RealTimeCommunities
│   ├── ModernMarketplace
│   ├── ModernLearningHub
│   ├── GamificationHub
│   ├── StoriesHub
│   └── LiveEventsHub
├── BottomNavigation
├── ProfileSettings (modal)
├── SearchModal
└── RealTimeComponents
    ├── LiveNotifications
    ├── UserPresence
    └── LiveCommunityEvents
```

### State Management Pattern
```typescript
// Centralized state in App.tsx
const [currentUser, setCurrentUser] = useState<User | null>(null)
const [currentView, setCurrentView] = useState<AppView>('chats')

// Props drilling for shared state
<EnhancedChatList 
  onChatSelect={handleChatSelect} 
  currentUserId={currentUser.id}
/>

// Local state for component-specific data
const [messages, setMessages] = useState<Message[]>([])
const [typingUsers, setTypingUsers] = useState<string[]>([])
```

## 🔄 Real-time System

### Connection Management
```typescript
// Health Check System
export const checkBackendHealth = async () => {
  const endpoints = [
    `${baseUrl}/health`,
    `${baseUrl}/auth/health`,
    `${restUrl}/`
  ]
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, { timeout: 8000 })
      if (response.ok) return { healthy: true }
    } catch (error) {
      continue // Try next endpoint
    }
  }
  
  return { healthy: false, message: 'All endpoints failed' }
}

// Automatic Reconnection
useEffect(() => {
  const handleConnectionLoss = () => {
    console.log('Connection lost, attempting reconnection...')
    setTimeout(initializeApp, 2000)
  }
  
  window.addEventListener('online', handleConnectionLoss)
  return () => window.removeEventListener('online', handleConnectionLoss)
}, [])
```

### Message Synchronization
```typescript
// Real-time Message Handling
useEffect(() => {
  if (!selectedChat) return

  const channel = supabase
    .channel(`chat:${selectedChat.id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'kv_store_0e8b25fb',
      filter: `key=like.message:${selectedChat.id}:%`
    }, (payload) => {
      const newMessage = JSON.parse(payload.new.value)
      setMessages(prev => [...prev, newMessage])
      
      // Haptic feedback for new messages
      if (navigator.vibrate && newMessage.senderId !== currentUser.id) {
        navigator.vibrate(50)
      }
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [selectedChat?.id])
```

## 🛡️ Security Implementation

### Authentication Security
```typescript
// JWT Token Validation
const verifyToken = async (token: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) throw new Error('Invalid token')
    return user
  } catch (error) {
    throw new Error('Authentication failed')
  }
}

// Row Level Security (RLS) Policies
-- Example RLS policy for chat messages
CREATE POLICY "Users can only see their own messages"
ON kv_store_0e8b25fb
FOR SELECT
USING (
  key LIKE 'message:%' AND 
  (value->>'senderId')::text = auth.uid()::text OR
  (value->>'receiverId')::text = auth.uid()::text
);
```

### Input Validation
```typescript
// Server-side Validation
const validateMessage = (data: any) => {
  if (!data.content || data.content.length > 1000) {
    throw new Error('Invalid message content')
  }
  if (!data.receiverId || !isValidUUID(data.receiverId)) {
    throw new Error('Invalid receiver ID')
  }
  return true
}

// Client-side Validation
export const validators = {
  email: (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  password: (password: string) => ({
    isValid: password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password),
    errors: [] // Detailed error messages
  })
}
```

## 📱 Mobile Optimization

### Touch Interactions
```typescript
// Pull-to-Refresh Implementation
const [isRefreshing, setIsRefreshing] = useState(false)
const pullDistance = useRef(0)

const handleTouchStart = (e: TouchEvent) => {
  const touch = e.touches[0]
  pullDistance.current = touch.clientY
}

const handleTouchMove = (e: TouchEvent) => {
  const touch = e.touches[0]
  const distance = touch.clientY - pullDistance.current
  
  if (distance > 100 && !isRefreshing) {
    setIsRefreshing(true)
    refreshData().finally(() => setIsRefreshing(false))
  }
}

// Haptic Feedback
const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  if (navigator.vibrate) {
    const duration = type === 'light' ? 10 : type === 'medium' ? 25 : 50
    navigator.vibrate(duration)
  }
}
```

### Responsive Design
```css
/* Mobile-First CSS with Tailwind v4 */
.chat-container {
  @apply h-screen max-w-md mx-auto;
}

/* Responsive breakpoints */
@media (min-width: 768px) {
  .chat-container {
    @apply max-w-2xl;
  }
}

@media (min-width: 1024px) {
  .chat-container {
    @apply max-w-4xl grid grid-cols-3;
  }
}
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy Loading for Route Components
const EnhancedVideoFeed = lazy(() => import('./components/modern/EnhancedVideoFeed'))
const RealTimeCommunities = lazy(() => import('./components/modern/RealTimeCommunities'))

// Component Wrapping with Suspense
<Suspense fallback={<LoadingSkeleton />}>
  <EnhancedVideoFeed />
</Suspense>
```

### Caching Strategy
```typescript
// Local Storage Caching
const cacheManager = {
  set: (key: string, data: any, ttl: number = 3600000) => {
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  get: (key: string) => {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const parsed = JSON.parse(item)
    if (Date.now() - parsed.timestamp > parsed.ttl) {
      localStorage.removeItem(key)
      return null
    }
    
    return parsed.data
  }
}
```

## 🔧 Development Workflow

### Build Process
```typescript
// TypeScript Configuration
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
  }
}

// ESLint Rules
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error"
  }
}
```

### Deployment Pipeline
```bash
# Frontend Build
npm run build

# Edge Function Deployment
supabase functions deploy make-server-0e8b25fb

# Environment Variables
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_key

# Database Migrations
supabase db push
```

## 📊 Monitoring & Analytics

### Error Tracking
```typescript
// Global Error Handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  // Send to monitoring service
})

// React Error Boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React error:', error, errorInfo)
    // Send to monitoring service
  }
}
```

### Performance Metrics
```typescript
// Performance Monitoring
const trackPerformance = (action: string, startTime: number) => {
  const duration = performance.now() - startTime
  console.log(`${action} took ${duration}ms`)
  
  // Send metrics to analytics
  analytics.track('performance', {
    action,
    duration,
    timestamp: Date.now()
  })
}
```

This technical architecture provides a solid foundation for SupaApp's scalable, real-time social platform with comprehensive features and robust performance characteristics.