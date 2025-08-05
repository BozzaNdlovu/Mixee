// Mock Supabase client for frontend-only mode
const projectId = 'demo-project'
const publicAnonKey = 'demo-key'
const appConfig = { name: 'Mixee', version: '2.0.0', mode: 'frontend-only' }
const isConnectedToRealBackend = () => false

// Construct Supabase URL
const supabaseUrl = `https://${projectId}.supabase.co`
const supabaseAnonKey = publicAnonKey

// Create mock auth object
const auth = {
  signUp: async (email: string, password: string, metadata: any) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === 'demo@supaapp.com' && password === 'demo123') {
      const user = {
        id: 'demo-user-id',
        email,
        user_metadata: metadata,
        created_at: new Date().toISOString()
      }
      
      return {
        data: {
          user,
          session: {
            access_token: 'demo-token',
            expires_at: Date.now() + (24 * 60 * 60 * 1000)
          }
        },
        error: null
      }
    }
    
    return {
      data: null,
      error: { message: 'In demo mode, use demo@supaapp.com / demo123' }
    }
  },

  signIn: {
    withPassword: async ({ email, password }: { email: string, password: string }) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'demo@supaapp.com' && password === 'demo123') {
        const user = {
          id: 'demo-user-id',
          email,
          user_metadata: {
            username: 'demo_user',
            display_name: 'Demo User'
          },
          created_at: new Date().toISOString()
        }
        
        return {
          data: {
            user,
            session: {
              access_token: 'demo-token',
              expires_at: Date.now() + (24 * 60 * 60 * 1000)
            }
          },
          error: null
        }
      }
      
      return {
        data: null,
        error: { message: 'Invalid login credentials' }
      }
    }
  },

  signOut: async () => {
    return { error: null }
  },

  getSession: async () => {
    // Try to get session from localStorage
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('supaapp_session')
      if (session) {
        try {
          const parsedSession = JSON.parse(session)
          return { data: { session: parsedSession }, error: null }
        } catch (e) {
          return { data: { session: null }, error: null }
        }
      }
    }
    return { data: { session: null }, error: null }
  },

  getUser: async () => {
    // Try to get user from localStorage
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('supaapp_user')
      if (user) {
        try {
          const parsedUser = JSON.parse(user)
          return { data: { user: parsedUser }, error: null }
        } catch (e) {
          return { data: { user: null }, error: null }
        }
      }
    }
    return { data: { user: null }, error: null }
  },

  onAuthStateChange: (callback: any) => {
    // Mock auth state change listener
    return { data: { subscription: null } }
  }
};

// Health check function for the client
export const checkClientHealth = async (): Promise<boolean> => {
  return true // Mock client is always healthy
}

// Create and export mock Supabase client
const supabase = {
  auth,
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({ data: null, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '/demo-file-url' } }),
      createSignedUrl: async (path: string, expiresIn: number) => ({ data: null, error: null }),
      remove: async (paths: string[]) => ({ data: null, error: null })
    })
  }
}

export default supabase