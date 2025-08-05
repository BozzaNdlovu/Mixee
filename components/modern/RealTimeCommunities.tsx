import { useState, useEffect } from 'react'
import { MapPin, Users, Zap, Plus, Search, Filter, Calendar, MessageCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { cn } from '../ui/utils'
import { authenticatedApiCall, apiEndpoints, buildEndpoint, isDevelopment } from '../../utils/supabase/info'

interface Community {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  members: string[]
  creatorId: string
  location?: string
  isPublic: boolean
  createdAt: string
}

interface CreateCommunityData {
  name: string
  description: string
  category: string
  location: string
}

export function RealTimeCommunities({ currentUserId }: { currentUserId: string }) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [error, setError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [createData, setCreateData] = useState<CreateCommunityData>({
    name: '',
    description: '',
    category: 'general',
    location: 'Cape Town, SA'
  })

  const categories = [
    'all', 'general', 'technology', 'business', 'creative', 'lifestyle', 'sports',
    'food', 'travel', 'education', 'health', 'music', 'gaming'
  ]

  useEffect(() => {
    loadCommunities()
    
    // Set up real-time polling for updates every 10 seconds (but only in online mode)
    const interval = setInterval(() => {
      if (!isOfflineMode) {
        loadCommunities(true) // Silent update
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [isOfflineMode])

  useEffect(() => {
    // Filter communities based on search and category
    let filtered = communities

    if (searchQuery) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(community => community.category === selectedCategory)
    }

    setFilteredCommunities(filtered)
  }, [communities, searchQuery, selectedCategory])

  const loadCommunities = async (silent = false) => {
    if (!silent) {
      setIsLoading(true)
      setError(null)
    }

    try {
      const data = await authenticatedApiCall(apiEndpoints.communities.list)
      
      // Ensure we have member arrays for all communities
      const communitiesWithMembers = data.map((community: any) => ({
        ...community,
        members: community.members || [],
        memberCount: community.memberCount || community.members?.length || 0
      }))
      
      setCommunities(communitiesWithMembers)
      setLastUpdate(new Date())
      setIsOfflineMode(false)
    } catch (error: any) {
      console.error('Failed to load communities:', error)
      
      // Check if this is a demo user or development mode
      const isDemoMode = currentUserId === 'demo-user-id' || isDevelopment
      
      if (isDemoMode) {
        setIsOfflineMode(true)
        // Load demo communities from localStorage or use defaults
        const demoCommunities = [
          {
            id: 'comm_demo_1',
            name: 'Cape Town Tech Hub',
            description: 'Connect with local developers and entrepreneurs in Cape Town. Share ideas, collaborate on projects, and build the future together.',
            category: 'technology',
            memberCount: 1247,
            members: [currentUserId],
            creatorId: 'demo-creator-1',
            location: 'Cape Town, SA',
            isPublic: true,
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comm_demo_2',
            name: 'South African Startups',
            description: 'Building the future of Africa, one startup at a time. Connect with entrepreneurs across South Africa.',
            category: 'business',
            memberCount: 892,
            members: [],
            creatorId: 'demo-creator-2',
            location: 'South Africa',
            isPublic: true,
            createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comm_demo_3',
            name: 'Local Artists Network',
            description: 'Showcase your art and connect with fellow creatives. From traditional to digital art, all mediums welcome.',
            category: 'creative',
            memberCount: 567,
            members: [],
            creatorId: 'demo-creator-3',
            location: 'Western Cape',
            isPublic: true,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comm_demo_4',
            name: 'Table Mountain Hikers',
            description: 'Join fellow outdoor enthusiasts for hikes around Table Mountain and the surrounding areas.',
            category: 'sports',
            memberCount: 423,
            members: [],
            creatorId: 'demo-creator-4',
            location: 'Cape Town',
            isPublic: true,
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'comm_demo_5',
            name: 'Cape Town Foodies',
            description: 'Discover the best restaurants, share recipes, and connect with food lovers in Cape Town.',
            category: 'food',
            memberCount: 1156,
            members: [currentUserId],
            creatorId: currentUserId,
            location: 'Cape Town',
            isPublic: true,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
        setCommunities(demoCommunities)
      } else {
        if (!silent) {
          setError(error.message || 'Failed to load communities. Please try again.')
        }
      }
    } finally {
      if (!silent) {
        setIsLoading(false)
      }
    }
  }

  const createCommunity = async () => {
    if (!createData.name.trim() || !createData.description.trim()) return

    setIsCreating(true)
    try {
      if (isOfflineMode || currentUserId === 'demo-user-id') {
        // Create demo community locally
        const newCommunity = {
          id: `comm_demo_${Date.now()}`,
          ...createData,
          memberCount: 1,
          members: [currentUserId],
          creatorId: currentUserId,
          isPublic: true,
          createdAt: new Date().toISOString()
        }
        
        setCommunities(prev => [newCommunity, ...prev])
      } else {
        const newCommunity = await authenticatedApiCall(apiEndpoints.communities.create, {
          method: 'POST',
          body: JSON.stringify({
            ...createData,
            creatorId: currentUserId
          })
        })
        setCommunities(prev => [newCommunity, ...prev])
      }

      setShowCreateDialog(false)
      setCreateData({
        name: '',
        description: '',
        category: 'general',
        location: 'Cape Town, SA'
      })
    } catch (error: any) {
      console.error('Failed to create community:', error)
      setError(error.message || 'Failed to create community. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const joinCommunity = async (communityId: string) => {
    // Optimistic update
    setCommunities(prev => 
      prev.map(comm => 
        comm.id === communityId 
          ? {
              ...comm,
              members: [...comm.members, currentUserId],
              memberCount: comm.memberCount + 1
            }
          : comm
      )
    )

    try {
      if (!isOfflineMode && currentUserId !== 'demo-user-id') {
        await authenticatedApiCall(buildEndpoint(apiEndpoints.communities.join, { communityId }), {
          method: 'POST',
          body: JSON.stringify({ userId: currentUserId })
        })
      }
      // In offline/demo mode, the optimistic update is sufficient
    } catch (error: any) {
      console.error('Failed to join community:', error)
      // Revert the optimistic update on error
      setCommunities(prev => 
        prev.map(comm => 
          comm.id === communityId 
            ? {
                ...comm,
                members: comm.members.filter(id => id !== currentUserId),
                memberCount: comm.memberCount - 1
              }
            : comm
        )
      )
      setError(error.message || 'Failed to join community. Please try again.')
    }
  }

  const refreshCommunities = () => {
    loadCommunities()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-600">Loading communities...</p>
        <p className="text-xs text-gray-500 mt-1">
          {isOfflineMode ? 'Loading demo data' : 'Connecting to SupaApp servers'}
        </p>
      </div>
    )
  }

  if (error && !isOfflineMode) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
        <p className="text-gray-600 text-center mb-4 max-w-sm">{error}</p>
        <Button onClick={refreshCommunities} className="bg-blue-500 hover:bg-blue-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-blue-50/30">
      {/* Header with search and create */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
        {/* Live Status & Last Update */}
        <div className="flex items-center justify-between mb-3">
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border",
            isOfflineMode 
              ? "bg-amber-100 text-amber-700 border-amber-200"
              : "bg-green-100 text-green-700 border-green-200"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isOfflineMode ? "bg-amber-500" : "bg-green-500"
            )} />
            <span>{isOfflineMode ? 'Demo Mode' : 'Live Updates'}</span>
          </div>
          
          <div className="text-xs text-gray-500">
            Updated {lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-2xl bg-gray-50 border-0"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Community</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Community Name *
                  </label>
                  <Input
                    value={createData.name}
                    onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter community name"
                    maxLength={50}
                  />
                  <p className="text-xs text-gray-500 mt-1">{createData.name.length}/50 characters</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Description *
                  </label>
                  <Textarea
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your community and what makes it special"
                    rows={3}
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-500 mt-1">{createData.description.length}/300 characters</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Category
                  </label>
                  <select
                    value={createData.category}
                    onChange={(e) => setCreateData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white"
                  >
                    {categories.filter(cat => cat !== 'all').map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Location
                  </label>
                  <Input
                    value={createData.location}
                    onChange={(e) => setCreateData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Community location or 'Global' for online"
                  />
                </div>
                
                <Button
                  onClick={createCommunity}
                  disabled={isCreating || !createData.name.trim() || !createData.description.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {isCreating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Community...
                    </div>
                  ) : (
                    'Create Community'
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                selectedCategory === category
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>{filteredCommunities.length} communities</span>
          </div>
          <div className="w-1 h-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3 text-green-500" />
            <span>{communities.reduce((sum, c) => sum + c.memberCount, 0)} total members</span>
          </div>
          <div className="w-1 h-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>{isOfflineMode ? 'Demo mode' : 'Live platform'}</span>
          </div>
        </div>
      </div>

      {/* Communities List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-32">
          {filteredCommunities.length === 0 && !isLoading ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {searchQuery || selectedCategory !== 'all' ? (
                  <Search className="w-10 h-10 text-blue-500" />
                ) : (
                  <Users className="w-10 h-10 text-blue-500" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || selectedCategory !== 'all' 
                  ? 'No communities found' 
                  : 'No communities yet'
                }
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Be the first to create a community!'
                }
              </p>
              {(!searchQuery && selectedCategory === 'all') && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Community
                </Button>
              )}
            </div>
          ) : (
            filteredCommunities.map((community) => {
              const isMember = community.members.includes(currentUserId)
              const isCreator = community.creatorId === currentUserId

              return (
                <Card key={community.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-all duration-300 hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-blue-600">
                        {community.name[0]?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{community.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs capitalize">
                            {community.category}
                          </Badge>
                          {isCreator && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              Creator
                            </Badge>
                          )}
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            isOfflineMode ? "bg-amber-500" : "bg-green-500"
                          )} title={isOfflineMode ? "Demo community" : "Live community"} />
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {community.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{community.memberCount} member{community.memberCount !== 1 ? 's' : ''}</span>
                        </div>
                        {community.location && (
                          <>
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{community.location}</span>
                            </div>
                          </>
                        )}
                        <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        <span>Created {new Date(community.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isMember ? (
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open Chat
                          </Button>
                        ) : (
                          <Button
                            onClick={() => joinCommunity(community.id)}
                            size="sm"
                            className="flex-1 bg-blue-500 hover:bg-blue-600"
                          >
                            Join Community
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </ScrollArea>
    </div>
  )
}