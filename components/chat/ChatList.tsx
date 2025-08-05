import { useState } from 'react'
import { MessageSquare, MapPin, Shield, Video, Mic, Image, Clock, Users } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface ChatItem {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  isOnline: boolean
  isEncrypted: boolean
  messageType: 'text' | 'voice' | 'image' | 'video'
  distance?: string
  isGroup?: boolean
}

interface RadarRoom {
  id: string
  name: string
  description: string
  memberCount: number
  distance: string
  isActive: boolean
  category: string
  recentActivity: string
}

const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
    lastMessage: 'Hey! Just saw your story from Table Mountain 📸',
    timestamp: '2 min',
    unread: 2,
    isOnline: true,
    isEncrypted: true,
    messageType: 'text',
    distance: '1.2km'
  },
  {
    id: '2', 
    name: 'Local Coffee Squad',
    lastMessage: 'Anyone up for coffee at Truth?',
    timestamp: '15 min',
    unread: 0,
    isOnline: true,
    isEncrypted: true,
    messageType: 'text',
    isGroup: true,
    distance: '0.8km'
  },
  {
    id: '3',
    name: 'Marcus Williams',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    lastMessage: '🎵 Voice message',
    timestamp: '1h',
    unread: 0,
    isOnline: false,
    isEncrypted: true,
    messageType: 'voice',
    distance: '2.1km'
  },
  {
    id: '4',
    name: 'Emma Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    lastMessage: '📷 Photo',
    timestamp: '3h',
    unread: 1,
    isOnline: true,
    isEncrypted: true,
    messageType: 'image',
    distance: '0.5km'
  }
]

const mockRadarRooms: RadarRoom[] = [
  {
    id: '1',
    name: 'V&A Waterfront Vibes',
    description: 'What\'s happening at the waterfront today?',
    memberCount: 234,
    distance: '1.1km',
    isActive: true,
    category: 'Local Events',
    recentActivity: 'Live discussion about sunset views'
  },
  {
    id: '2',
    name: 'UCT Campus Connect',
    description: 'Connect with other UCT students nearby',
    memberCount: 89,
    distance: '2.3km', 
    isActive: true,
    category: 'Education',
    recentActivity: '5 people sharing study spots'
  },
  {
    id: '3',
    name: 'Cape Town Hiking Crew',
    description: 'Weekend hiking adventures and trail tips',
    memberCount: 156,
    distance: '1.8km',
    isActive: false,
    category: 'Outdoors',
    recentActivity: 'Planning Lion\'s Head sunrise hike'
  }
]

export function ChatList() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)

  const getMessageIcon = (type: ChatItem['messageType']) => {
    switch (type) {
      case 'voice': return <Mic className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="chats" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-4">
          <TabsTrigger value="chats">Messages</TabsTrigger>
          <TabsTrigger value="radar" className="relative">
            Radar Rooms
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chats" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              {mockChats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full p-4 h-auto justify-start hover:bg-accent/50"
                  onClick={() => setSelectedChat(chat.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>
                          {chat.isGroup ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            chat.name.split(' ').map(n => n[0]).join('')
                          )}
                        </AvatarFallback>
                      </Avatar>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-chart-1 rounded-full border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm truncate">{chat.name}</h3>
                          {chat.isEncrypted && (
                            <Shield className="w-3 h-3 text-chart-1" />
                          )}
                          {chat.distance && (
                            <Badge variant="outline" className="text-xs px-1">
                              <MapPin className="w-2 h-2 mr-1" />
                              {chat.distance}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                          {chat.unread > 0 && (
                            <Badge className="w-5 h-5 rounded-full flex items-center justify-center p-0 text-xs">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getMessageIcon(chat.messageType)}
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="radar" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <div className="rounded-lg bg-gradient-to-r from-chart-1/10 to-chart-2/10 p-4 border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-5 h-5 text-chart-1" />
                  <h3>Local Radar Rooms</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Discover conversations happening around you in real-time
                </p>
              </div>

              {mockRadarRooms.map((room) => (
                <Button
                  key={room.id}
                  variant="ghost"
                  className="w-full p-4 h-auto justify-start hover:bg-accent/50 border rounded-lg"
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      {room.isActive && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-chart-1 rounded-full animate-pulse border-2 border-background" />
                      )}
                    </div>
                    
                    <div className="flex-1 text-left space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm">{room.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-2 h-2 mr-1" />
                          {room.distance}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {room.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {room.memberCount}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {room.category}
                          </Badge>
                        </div>
                        {room.isActive && (
                          <div className="flex items-center gap-1 text-xs text-chart-1">
                            <div className="w-2 h-2 bg-chart-1 rounded-full animate-pulse" />
                            Live
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {room.recentActivity}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}