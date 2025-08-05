import { useState } from 'react'
import { MapPin, Users, Zap, Plus, Search, Filter, Heart, MessageSquare, Calendar, Award, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { cn } from '../ui/utils'

interface Community {
  id: string
  name: string
  description: string
  category: string
  memberCount: number
  activeMembers: number
  distance?: string
  isJoined: boolean
  isLocal: boolean
  avatar?: string
  cover?: string
  recentActivity: string
  trending?: boolean
  verified?: boolean
  tags: string[]
  lastActive: string
}

interface LocalRadarRoom {
  id: string
  name: string
  description: string
  activeCount: number
  distance: string
  category: string
  isLive: boolean
  temperature: 'hot' | 'warm' | 'cool'
  recentMessage?: string
  avatar?: string
}

const mockCommunities: Community[] = [
  {
    id: '1',
    name: 'Cape Town Hikers',
    description: 'Weekend hiking adventures and trail recommendations around the Mother City',
    category: 'Outdoors',
    memberCount: 2847,
    activeMembers: 156,
    distance: '1.2km',
    isJoined: true,
    isLocal: true,
    avatar: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=100&h=100&fit=crop',
    cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
    recentActivity: '5 new posts about Lion\'s Head sunrise hike',
    trending: true,
    verified: true,
    tags: ['hiking', 'nature', 'weekend', 'adventure'],
    lastActive: '2 min ago'
  },
  {
    id: '2',
    name: 'UCT Students Connect',
    description: 'Connect with fellow UCT students, share study tips, and organize events',
    category: 'Education',
    memberCount: 1235,
    activeMembers: 89,
    distance: '2.3km',
    isJoined: false,
    isLocal: true,
    avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=100&h=100&fit=crop',
    recentActivity: 'Study group forming for finals',
    tags: ['university', 'study', 'students', 'events'],
    lastActive: '15 min ago'
  },
  {
    id: '3',
    name: 'Cape Town Foodies',
    description: 'Discover the best local restaurants, cafes, and hidden food gems',
    category: 'Food & Drink',
    memberCount: 5621,
    activeMembers: 234,
    distance: '0.8km',
    isJoined: true,
    isLocal: true,
    avatar: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop',
    recentActivity: 'New brunch spot review at V&A Waterfront',
    trending: true,
    tags: ['food', 'restaurants', 'reviews', 'local'],
    lastActive: '5 min ago'
  }
]

const mockRadarRooms: LocalRadarRoom[] = [
  {
    id: '1',
    name: 'V&A Waterfront Now',
    description: 'What\'s happening at the waterfront right now?',
    activeCount: 47,
    distance: '1.1km',
    category: 'Local Events',
    isLive: true,
    temperature: 'hot',
    recentMessage: 'Amazing sunset from the amphitheater! 🌅',
    avatar: 'https://images.unsplash.com/photo-1580749806857-1c95f1b13b6e?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Coffee Shop Vibes',
    description: 'Real-time coffee shop recommendations and availability',
    activeCount: 23,
    distance: '0.7km',
    category: 'Food & Drink',
    isLive: true,
    temperature: 'warm',
    recentMessage: 'Origin Coffee has free wifi and power outlets!',
  },
  {
    id: '3',
    name: 'Campus Study Spots',
    description: 'Find quiet study locations and library availability',
    activeCount: 12,
    distance: '2.1km',
    category: 'Education',
    isLive: false,
    temperature: 'cool',
    recentMessage: 'Jagger Library 3rd floor is pretty quiet',
  }
]

export function ModernCommunities() {
  const [activeTab, setActiveTab] = useState('communities')
  const [searchQuery, setSearchQuery] = useState('')

  const getTemperatureColor = (temp: LocalRadarRoom['temperature']) => {
    switch (temp) {
      case 'hot': return 'text-red-500'
      case 'warm': return 'text-orange-500'
      case 'cool': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const getTemperatureIcon = (temp: LocalRadarRoom['temperature']) => {
    switch (temp) {
      case 'hot': return '🔥'
      case 'warm': return '⚡'
      case 'cool': return '💧'
      default: return '📍'
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-blue-50/30">
      {/* Search Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="relative mb-4">
          <Input
            placeholder="Search communities and rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-2xl bg-gray-50 border-0"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>23 communities nearby</span>
          </div>
          <div className="w-1 h-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-orange-500" />
            <span>156 people active</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4 bg-gray-100">
          <TabsTrigger value="communities" className="rounded-xl">Communities</TabsTrigger>
          <TabsTrigger value="radar" className="rounded-xl relative">
            Local Radar
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </TabsTrigger>
        </TabsList>

        {/* Communities Tab */}
        <TabsContent value="communities" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {/* Featured Communities */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Trending Near You</h3>
                  <Badge variant="outline" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>

                {mockCommunities.filter(c => c.trending).map((community) => (
                  <Card key={community.id} className="overflow-hidden border-0 shadow-md">
                    {/* Cover Image */}
                    {community.cover && (
                      <div 
                        className="h-24 bg-gradient-to-r from-blue-400 to-purple-500 relative"
                        style={{
                          backgroundImage: `url(${community.cover})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {community.trending && (
                            <Badge className="bg-red-500 text-white text-xs animate-pulse">
                              🔥 Trending
                            </Badge>
                          )}
                          {community.verified && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              ✓ Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-12 h-12 border-2 border-white shadow-sm -mt-8 bg-white">
                          <AvatarImage src={community.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {community.name[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">{community.name}</h4>
                            <Button
                              variant={community.isJoined ? "secondary" : "default"}
                              size="sm"
                              className="rounded-full"
                            >
                              {community.isJoined ? "Joined" : "Join"}
                            </Button>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{community.description}</p>

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{community.memberCount.toLocaleString()} members</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span>{community.activeMembers} active</span>
                            </div>
                            {community.distance && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{community.distance} away</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-1">
                              {community.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs px-2">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{community.lastActive}</span>
                          </div>

                          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-700">{community.recentActivity}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* All Communities */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">All Communities</h3>
                {mockCommunities.filter(c => !c.trending).map((community) => (
                  <Card key={community.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={community.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-600 text-white">
                          {community.name[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{community.name}</h4>
                          <Button
                            variant={community.isJoined ? "secondary" : "outline"}
                            size="sm"
                            className="text-xs"
                          >
                            {community.isJoined ? "Joined" : "Join"}
                          </Button>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{community.description}</p>

                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{community.memberCount.toLocaleString()} members</span>
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{community.activeMembers} active</span>
                          {community.distance && (
                            <>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span>{community.distance}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Local Radar Tab */}
        <TabsContent value="radar" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {/* Radar Explanation */}
              <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Local Radar Rooms</h3>
                    <p className="text-sm text-gray-600">Real-time conversations happening around you</p>
                  </div>
                </div>
              </Card>

              {/* Active Radar Rooms */}
              {mockRadarRooms.map((room) => (
                <Card key={room.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center">
                        {room.avatar ? (
                          <Avatar className="w-full h-full">
                            <AvatarImage src={room.avatar} />
                            <AvatarFallback>{room.name[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <span className="text-xl">{getTemperatureIcon(room.temperature)}</span>
                        )}
                      </div>
                      {room.isLive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900">{room.name}</h4>
                          {room.isLive && (
                            <Badge className="bg-red-500 text-white text-xs animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={cn("text-xs font-medium", getTemperatureColor(room.temperature))}>
                            {getTemperatureIcon(room.temperature)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            <MapPin className="w-2 h-2 mr-1" />
                            {room.distance}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{room.description}</p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{room.activeCount} active</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {room.category}
                        </Badge>
                      </div>

                      {room.recentMessage && (
                        <div className="bg-gray-50 rounded-lg p-2 group-hover:bg-gray-100 transition-colors duration-300">
                          <p className="text-xs text-gray-700">💬 {room.recentMessage}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Floating Create Button */}
      <div className="fixed bottom-32 right-6 z-40">
        <Button className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          <Plus className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  )
}