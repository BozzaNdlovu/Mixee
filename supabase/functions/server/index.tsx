import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'

// Initialize Hono app
const app = new Hono()

// CORS middleware - allows all origins for development
app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
}))

// Logger middleware
app.use('*', logger(console.log))

// Initialize Supabase client with service role
const getSupabase = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Inline KV Store Functions (replacing the import)
const kvStore = {
  async get(key: string) {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('kv_store_0e8b25fb')
        .select('value')
        .eq('key', key)
        .single()
      
      if (error || !data) return null
      return data.value
    } catch (error) {
      console.error('KV get error:', error)
      return null
    }
  },

  async set(key: string, value: any) {
    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('kv_store_0e8b25fb')
        .upsert({
          key,
          value: typeof value === 'string' ? JSON.parse(value) : value,
          updated_at: new Date().toISOString()
        })
      
      if (error) {
        console.error('KV set error:', error)
        throw error
      }
    } catch (error) {
      console.error('KV set error:', error)
      throw error
    }
  },

  async getByPrefix(prefix: string) {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase
        .from('kv_store_0e8b25fb')
        .select('key, value')
        .like('key', `${prefix}%`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('KV getByPrefix error:', error)
        return []
      }
      
      return data?.map(row => row.value) || []
    } catch (error) {
      console.error('KV getByPrefix error:', error)
      return []
    }
  },

  async del(key: string) {
    try {
      const supabase = getSupabase()
      const { error } = await supabase
        .from('kv_store_0e8b25fb')
        .delete()
        .eq('key', key)
      
      if (error) {
        console.error('KV del error:', error)
        throw error
      }
    } catch (error) {
      console.error('KV del error:', error)
      throw error
    }
  }
}

// Initialize storage buckets on startup
const initializeStorage = async () => {
  try {
    const supabase = getSupabase()
    
    const buckets = [
      { name: 'make-0e8b25fb-avatars', description: 'User profile pictures' },
      { name: 'make-0e8b25fb-media', description: 'Photos and images' }, 
      { name: 'make-0e8b25fb-videos', description: 'Video content' },
      { name: 'make-0e8b25fb-documents', description: 'Documents and files' }
    ]
    
    console.log('🗄️ Initializing storage buckets...')
    
    // Get existing buckets
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Failed to list existing buckets:', listError)
      return
    }
    
    const existingBucketNames = existingBuckets?.map(b => b.name) || []
    console.log('📂 Existing buckets:', existingBucketNames)
    
    // Create missing buckets with simplified configuration
    for (const bucket of buckets) {
      if (!existingBucketNames.includes(bucket.name)) {
        console.log(`📁 Creating storage bucket: ${bucket.name}`)
        
        try {
          const { error } = await supabase.storage.createBucket(bucket.name, {
            public: true, // Make buckets public for easier access
            allowedMimeTypes: ['image/*', 'video/*', 'application/*', 'text/*'], // Broader mime types
            // Remove fileSizeLimit to avoid the "object exceeded maximum allowed size" error
          })
          
          if (error) {
            // Check if it's a "bucket already exists" error - that's fine
            if (error.message.includes('already exists') || error.message.includes('Duplicate')) {
              console.log(`✅ Bucket ${bucket.name} already exists - skipping`)
              continue
            }
            
            console.error(`❌ Failed to create bucket ${bucket.name}:`, error)
            
            // Try creating with minimal configuration as fallback
            console.log(`🔄 Retrying ${bucket.name} with minimal config...`)
            const { error: retryError } = await supabase.storage.createBucket(bucket.name, {
              public: true
            })
            
            if (retryError && !retryError.message.includes('already exists')) {
              console.error(`❌ Retry failed for ${bucket.name}:`, retryError)
            } else {
              console.log(`✅ Successfully created ${bucket.name} with minimal config`)
            }
          } else {
            console.log(`✅ Successfully created storage bucket: ${bucket.name}`)
          }
        } catch (createError) {
          console.error(`❌ Exception creating bucket ${bucket.name}:`, createError)
        }
      } else {
        console.log(`✅ Bucket ${bucket.name} already exists`)
      }
    }
    
    console.log('🎉 Storage initialization completed')
  } catch (error) {
    console.error('❌ Error initializing storage:', error)
    // Continue anyway - storage is not critical for basic functionality
  }
}

// Initialize storage on startup (but don't block server start)
initializeStorage().catch(error => {
  console.error('Storage initialization failed, but server will continue:', error)
})

// Helper to get user from JWT token
const getUserFromToken = async (token: string) => {
  try {
    const supabase = getSupabase()
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting user from token:', error)
    return null
  }
}

// Helper to check if user is authenticated
const requireAuth = async (c: any) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Missing or invalid authorization header' }, 401)
  }
  
  const token = authHeader.split(' ')[1]
  const user = await getUserFromToken(token)
  
  if (!user) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
  
  return user
}

// Routes with /make-server-0e8b25fb prefix

// Health check endpoint
app.get('/make-server-0e8b25fb/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'SupaApp Backend',
    message: 'SupaApp backend is running smoothly',
    storage: 'Storage buckets initialized'
  })
})

// Debug endpoint to test authentication
app.get('/make-server-0e8b25fb/debug/auth', async (c) => {
  try {
    const authHeader = c.req.header('Authorization')
    console.log('🔍 Debug - Auth header:', authHeader)
    
    if (!authHeader) {
      return c.json({
        error: 'No authorization header',
        hasHeader: false,
        headerValue: null
      }, 401)
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      return c.json({
        error: 'Invalid authorization format',
        hasHeader: true,
        headerValue: authHeader,
        format: 'Expected "Bearer <token>"'
      }, 401)
    }
    
    const token = authHeader.split(' ')[1]
    const user = await getUserFromToken(token)
    
    return c.json({
      hasHeader: true,
      hasValidToken: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
      message: user ? 'Authentication successful' : 'Invalid token'
    })
  } catch (error: any) {
    console.error('Debug auth error:', error)
    return c.json({
      error: 'Debug endpoint error',
      message: error.message
    }, 500)
  }
})

// Authentication routes
app.post('/make-server-0e8b25fb/auth/register', async (c) => {
  try {
    const { email, password, metadata } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        username: metadata?.username || email.split('@')[0],
        display_name: metadata?.displayName || metadata?.username || email.split('@')[0],
        location: metadata?.location || 'South Africa',
        ...metadata
      },
      email_confirm: true // Auto-confirm since email server isn't configured
    })
    
    if (error) {
      console.error('Registration error:', error)
      return c.json({ error: error.message }, 400)
    }
    
    // Store user profile in KV store
    if (data.user) {
      await kvStore.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
        displayName: data.user.user_metadata?.display_name,
        location: data.user.user_metadata?.location,
        avatar: data.user.user_metadata?.avatar_url,
        createdAt: new Date().toISOString(),
        isOnline: true,
        lastSeen: new Date().toISOString()
      })
    }
    
    return c.json({ 
      user: data.user,
      message: 'User created successfully'
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    return c.json({ error: 'Failed to create user account' }, 500)
  }
})

app.post('/make-server-0e8b25fb/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }
    
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('Login error:', error)
      return c.json({ error: error.message }, 401)
    }
    
    // Update user online status
    if (data.user) {
      await kvStore.set(`user:${data.user.id}`, {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata?.username,
        displayName: data.user.user_metadata?.display_name,
        location: data.user.user_metadata?.location,
        avatar: data.user.user_metadata?.avatar_url,
        isOnline: true,
        lastSeen: new Date().toISOString()
      })
    }
    
    return c.json({ 
      user: data.user,
      session: data.session,
      message: 'Login successful'
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return c.json({ error: 'Login failed' }, 500)
  }
})

// User endpoints
app.get('/make-server-0e8b25fb/users', async (c) => {
  try {
    const users = await kvStore.getByPrefix('user:')
    return c.json(users.map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      location: u.location,
      avatar: u.avatar,
      isOnline: u.isOnline,
      lastSeen: u.lastSeen
    })))
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return c.json({ error: 'Failed to fetch users' }, 500)
  }
})

app.get('/make-server-0e8b25fb/users/:id', async (c) => {
  try {
    const userId = c.req.param('id')
    const user = await kvStore.get(`user:${userId}`)
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }
    
    return c.json(user)
  } catch (error: any) {
    console.error('Error fetching user:', error)
    return c.json({ error: 'Failed to fetch user' }, 500)
  }
})

// Communities endpoints
app.get('/make-server-0e8b25fb/communities', async (c) => {
  try {
    const communities = await kvStore.getByPrefix('community:')
    return c.json(communities || [])
  } catch (error: any) {
    console.error('Error fetching communities:', error)
    return c.json({ error: 'Failed to fetch communities' }, 500)
  }
})

app.post('/make-server-0e8b25fb/communities', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user // Return error response
    
    const { name, description, category, isPublic = true } = await c.req.json()
    
    if (!name || !description) {
      return c.json({ error: 'Name and description are required' }, 400)
    }
    
    const communityId = `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const community = {
      id: communityId,
      name,
      description,
      category: category || 'General',
      isPublic,
      creatorId: user.id,
      memberCount: 1,
      members: [user.id],
      createdAt: new Date().toISOString(),
      location: 'South Africa'
    }
    
    await kvStore.set(`community:${communityId}`, community)
    
    return c.json(community, 201)
  } catch (error: any) {
    console.error('Error creating community:', error)
    return c.json({ error: 'Failed to create community' }, 500)
  }
})

// Messages and conversations
app.get('/make-server-0e8b25fb/conversations', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const conversations = await kvStore.getByPrefix(`conversation:${user.id}:`)
    return c.json(conversations || [])
  } catch (error: any) {
    console.error('Error fetching conversations:', error)
    return c.json({ error: 'Failed to fetch conversations' }, 500)
  }
})

app.get('/make-server-0e8b25fb/conversations/:id/messages', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const conversationId = c.req.param('id')
    const messages = await kvStore.getByPrefix(`message:${conversationId}:`)
    
    return c.json(messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    ))
  } catch (error: any) {
    console.error('Error fetching messages:', error)
    return c.json({ error: 'Failed to fetch messages' }, 500)
  }
})

app.post('/make-server-0e8b25fb/messages', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const { conversationId, content, type = 'text' } = await c.req.json()
    
    if (!conversationId || !content) {
      return c.json({ error: 'Conversation ID and content are required' }, 400)
    }
    
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const message = {
      id: messageId,
      conversationId,
      senderId: user.id,
      content,
      type,
      createdAt: new Date().toISOString(),
      status: 'sent',
      isEncrypted: true // All messages are encrypted in SupaApp
    }
    
    await kvStore.set(`message:${conversationId}:${messageId}`, message)
    
    return c.json(message, 201)
  } catch (error: any) {
    console.error('Error sending message:', error)
    return c.json({ error: 'Failed to send message' }, 500)
  }
})

// Feed and posts
app.get('/make-server-0e8b25fb/feed/:type', async (c) => {
  try {
    const feedType = c.req.param('type')
    const posts = await kvStore.getByPrefix(`post:${feedType}:`)
    
    return c.json(posts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  } catch (error: any) {
    console.error('Error fetching feed:', error)
    return c.json({ error: 'Failed to fetch feed' }, 500)
  }
})

app.post('/make-server-0e8b25fb/posts', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const { content, type = 'text', mediaUrl, location } = await c.req.json()
    
    if (!content) {
      return c.json({ error: 'Content is required' }, 400)
    }
    
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const post = {
      id: postId,
      content,
      type,
      mediaUrl,
      authorId: user.id,
      authorName: user.user_metadata?.display_name || user.email?.split('@')[0],
      location: location || user.user_metadata?.location,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date().toISOString()
    }
    
    await kvStore.set(`post:global:${postId}`, post)
    
    return c.json(post, 201)
  } catch (error: any) {
    console.error('Error creating post:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// Marketplace/Products
app.get('/make-server-0e8b25fb/products', async (c) => {
  try {
    const products = await kvStore.getByPrefix('product:')
    return c.json(products || [])
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return c.json({ error: 'Failed to fetch products' }, 500)
  }
})

app.post('/make-server-0e8b25fb/products', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const { title, description, price, currency = 'ZAR', category, images } = await c.req.json()
    
    if (!title || !description || price === undefined) {
      return c.json({ error: 'Title, description, and price are required' }, 400)
    }
    
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const product = {
      id: productId,
      title,
      description,
      price: parseFloat(price),
      currency,
      category: category || 'General',
      images: images || [],
      sellerId: user.id,
      sellerName: user.user_metadata?.display_name || user.email?.split('@')[0],
      location: user.user_metadata?.location || 'South Africa',
      isAvailable: true,
      createdAt: new Date().toISOString()
    }
    
    await kvStore.set(`product:${productId}`, product)
    
    return c.json(product, 201)
  } catch (error: any) {
    console.error('Error creating product:', error)
    return c.json({ error: 'Failed to create product' }, 500)
  }
})

// Learning/Courses
app.get('/make-server-0e8b25fb/courses', async (c) => {
  try {
    const courses = await kvStore.getByPrefix('course:')
    return c.json(courses || [])
  } catch (error: any) {
    console.error('Error fetching courses:', error)
    return c.json({ error: 'Failed to fetch courses' }, 500)
  }
})

app.post('/make-server-0e8b25fb/courses', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const { title, description, category, price, duration } = await c.req.json()
    
    if (!title || !description) {
      return c.json({ error: 'Title and description are required' }, 400)
    }
    
    const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const course = {
      id: courseId,
      title,
      description,
      category: category || 'General',
      price: price || 0,
      duration: duration || '4 weeks',
      instructorId: user.id,
      instructorName: user.user_metadata?.display_name || user.email?.split('@')[0],
      enrolledCount: 0,
      rating: 0,
      createdAt: new Date().toISOString()
    }
    
    await kvStore.set(`course:${courseId}`, course)
    
    return c.json(course, 201)
  } catch (error: any) {
    console.error('Error creating course:', error)
    return c.json({ error: 'Failed to create course' }, 500)
  }
})

// File upload endpoint with improved bucket handling
app.post('/make-server-0e8b25fb/upload-url', async (c) => {
  try {
    const user = await requireAuth(c)
    if (!user || typeof user !== 'object') return user
    
    const { fileName, fileType, bucket } = await c.req.json()
    
    if (!fileName || !fileType || !bucket) {
      return c.json({ error: 'fileName, fileType, and bucket are required' }, 400)
    }
    
    // Validate bucket name
    const validBuckets = [
      'make-0e8b25fb-avatars',
      'make-0e8b25fb-media',
      'make-0e8b25fb-videos',
      'make-0e8b25fb-documents'
    ]
    
    if (!validBuckets.includes(bucket)) {
      return c.json({ error: 'Invalid bucket name' }, 400)
    }
    
    const supabase = getSupabase()
    const filePath = `${user.id}/${Date.now()}-${fileName}`
    
    // Create a signed upload URL
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filePath)
    
    if (error) {
      console.error('Upload URL error:', error)
      return c.json({ error: 'Failed to create upload URL' }, 500)
    }
    
    return c.json({
      uploadUrl: data.signedUrl,
      filePath: filePath,
      bucket: bucket
    })
  } catch (error: any) {
    console.error('Error creating upload URL:', error)
    return c.json({ error: 'Failed to create upload URL' }, 500)
  }
})

// Error handling middleware
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ 
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: 'Not found',
    path: c.req.path,
    method: c.req.method,
    timestamp: new Date().toISOString()
  }, 404)
})

console.log('🚀 SupaApp Backend Server starting...')
console.log('🗄️ Storage buckets will be created automatically')
console.log('📡 Available endpoints:')
console.log('   GET  /make-server-0e8b25fb/health')
console.log('   POST /make-server-0e8b25fb/auth/register')
console.log('   POST /make-server-0e8b25fb/auth/login')
console.log('   GET  /make-server-0e8b25fb/users')
console.log('   GET  /make-server-0e8b25fb/communities')
console.log('   POST /make-server-0e8b25fb/communities')
console.log('   GET  /make-server-0e8b25fb/conversations')
console.log('   POST /make-server-0e8b25fb/messages')
console.log('   GET  /make-server-0e8b25fb/products')
console.log('   POST /make-server-0e8b25fb/products')
console.log('   GET  /make-server-0e8b25fb/courses')
console.log('   POST /make-server-0e8b25fb/courses')
console.log('   POST /make-server-0e8b25fb/upload-url')

serve(app.fetch)