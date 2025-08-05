import { useState, useEffect } from 'react'
import { Mic, MicOff, Video, VideoOff, Users, Calendar, Clock, MapPin, Star, Share, Bell, Phone, PhoneOff, Volume2, VolumeX, Settings, Hand, MoreVertical, Crown } from 'lucide-react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { ScrollArea } from '../ui/scroll-area'
import { cn } from '../ui/utils'
import { authenticatedApiCall, apiEndpoints } from '../../utils/supabase/info'

interface LiveEvent {
  id: string
  title: string
  description: string
  hostId: string
  hostName: string
  hostAvatar?: string
  type: 'audio' | 'video' | 'hybrid'
  status: 'scheduled' | 'live' | 'ended'
  scheduledFor?: string
  startedAt?: string
  participants: Participant[]
  maxParticipants: number
  isPublic: boolean
  tags: string[]
  category: string
  recording?: boolean
}

interface Participant {
  userId: string
  username: string
  displayName: string
  avatar?: string
  role: 'host' | 'speaker' | 'listener'
  isMuted: boolean
  isVideoEnabled: boolean
  handRaised: boolean
  joinedAt: string
}

interface LiveEventsHubProps {
  currentUserId: string
  className?: string
}

interface LiveRoomProps {
  event: LiveEvent
  currentUserId: string
  onLeave: () => void
}

function LiveRoom({ event, currentUserId, onLeave }: LiveRoomProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)
  const [handRaised, setHandRaised] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [volume, setVolume] = useState(100)
  
  const currentParticipant = event.participants.find(p => p.userId === currentUserId)
  const isHost = currentParticipant?.role === 'host'
  const isSpeaker = currentParticipant?.role === 'speaker'
  const canSpeak = isHost || isSpeaker

  const speakers = event.participants.filter(p => p.role === 'host' || p.role === 'speaker')
  const listeners = event.participants.filter(p => p.role === 'listener')

  const toggleMute = () => {
    if (canSpeak) {
      setIsMuted(!isMuted)
      // In real app, would update audio stream
    }
  }

  const toggleVideo = () => {
    if (canSpeak && event.type !== 'audio') {
      setIsVideoEnabled(!isVideoEnabled)
      // In real app, would update video stream
    }
  }

  const toggleHandRaise = () => {
    if (!canSpeak) {
      setHandRaised(!handRaised)
      // In real app, would notify host
    }
  }

  const inviteSpeaker = (userId: string) => {
    if (isHost) {
      // In real app, would send speaker invitation
      console.log('Inviting user to speak:', userId)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <div>
              <h1 className="text-white font-semibold">{event.title}</h1>
              <p className="text-white/70 text-sm">
                {event.participants.length} / {event.maxParticipants} participants
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLeave}
              className="text-red-400 hover:bg-red-400/10"
            >
              <PhoneOff className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Speakers Section */}
        <div className="p-6">
          <h2 className="text-white font-medium mb-4 flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Speakers ({speakers.length})
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {speakers.map((participant) => (
              <div key={participant.userId} className="text-center">
                <div className="relative mb-3">
                  {event.type !== 'audio' && participant.isVideoEnabled ? (
                    <div className="w-24 h-24 bg-gray-800 rounded-2xl mx-auto flex items-center justify-center">
                      <span className="text-white text-xs">Video Feed</span>
                    </div>
                  ) : (
                    <div className={cn(
                      "w-24 h-24 rounded-2xl mx-auto flex items-center justify-center relative",
                      participant.isMuted ? "bg-gray-600" : "bg-green-500"
                    )}>
                      {participant.avatar ? (
                        <img 
                          src={participant.avatar} 
                          alt={participant.displayName}
                          className="w-full h-full rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {participant.displayName[0]?.toUpperCase()}
                        </span>
                      )}
                      
                      {/* Audio indicator */}
                      <div className={cn(
                        "absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center",
                        participant.isMuted ? "bg-red-500" : "bg-green-500"
                      )}>
                        {participant.isMuted ? (
                          <MicOff className="w-3 h-3 text-white" />
                        ) : (
                          <Mic className="w-3 h-3 text-white" />
                        )}
                      </div>
                      
                      {/* Host crown */}
                      {participant.role === 'host' && (
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                          <Crown className="w-5 h-5 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-white font-medium text-sm">{participant.displayName}</p>
                <p className="text-white/60 text-xs capitalize">{participant.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Listeners Section */}
        <div className="flex-1 bg-black/20 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Listeners ({listeners.length})
            </h3>
          </div>
          
          <ScrollArea className="h-48">
            <div className="p-4 space-y-2">
              {listeners.map((participant) => (
                <div key={participant.userId} className="flex items-center gap-3 text-white">
                  {participant.avatar ? (
                    <img 
                      src={participant.avatar} 
                      alt={participant.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {participant.displayName[0]?.toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <p className="font-medium text-sm">{participant.displayName}</p>
                    <p className="text-white/60 text-xs">
                      Joined {new Date(participant.joinedAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                  
                  {participant.handRaised && (
                    <div className="text-yellow-400">
                      <Hand className="w-4 h-4" />
                    </div>
                  )}
                  
                  {isHost && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => inviteSpeaker(participant.userId)}
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Mic className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-black/40 backdrop-blur-sm border-t border-white/10 p-4">
        <div className="flex items-center justify-center gap-4">
          {canSpeak && (
            <>
              <Button
                onClick={toggleMute}
                className={cn(
                  "w-12 h-12 rounded-full",
                  isMuted 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-green-500 hover:bg-green-600"
                )}
              >
                {isMuted ? (
                  <MicOff className="w-5 h-5 text-white" />
                ) : (
                  <Mic className="w-5 h-5 text-white" />
                )}
              </Button>
              
              {event.type !== 'audio' && (
                <Button
                  onClick={toggleVideo}
                  className={cn(
                    "w-12 h-12 rounded-full",
                    !isVideoEnabled 
                      ? "bg-gray-600 hover:bg-gray-700" 
                      : "bg-blue-500 hover:bg-blue-600"
                  )}
                >
                  {isVideoEnabled ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white" />
                  )}
                </Button>
              )}
            </>
          )}
          
          {!canSpeak && (
            <Button
              onClick={toggleHandRaise}
              className={cn(
                "w-12 h-12 rounded-full",
                handRaised 
                  ? "bg-yellow-500 hover:bg-yellow-600" 
                  : "bg-gray-600 hover:bg-gray-700"
              )}
            >
              <Hand className="w-5 h-5 text-white" />
            </Button>
          )}
          
          <Button
            onClick={onLeave}
            className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600"
          >
            <PhoneOff className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Room Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Volume
              </label>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600 w-8">{volume}%</span>
              </div>
            </div>
            
            {isHost && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Host Controls</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Record Session
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Manage Participants
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600">
                    End Session
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function LiveEventsHub({ currentUserId, className }: LiveEventsHubProps) {
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [activeEvent, setActiveEvent] = useState<LiveEvent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTab, setSelectedTab] = useState('live')

  useEffect(() => {
    loadEvents()
    
    // Real-time updates every 30 seconds
    const interval = setInterval(loadEvents, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadEvents = async () => {
    try {
      // Mock data - in real app would fetch from backend
      const mockEvents: LiveEvent[] = [
        {
          id: 'event1',
          title: 'Cape Town Tech Meetup',
          description: 'Weekly discussion about the latest in tech, AI, and startups in Cape Town',
          hostId: 'host1',
          hostName: 'Sarah Johnson',
          hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
          type: 'audio',
          status: 'live',
          startedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          participants: [
            {
              userId: 'host1',
              username: 'sarah_tech',
              displayName: 'Sarah Johnson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
              role: 'host',
              isMuted: false,
              isVideoEnabled: false,
              handRaised: false,
              joinedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
            },
            {
              userId: 'user1',
              username: 'mike_dev',
              displayName: 'Mike Chen',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
              role: 'speaker',
              isMuted: true,
              isVideoEnabled: false,
              handRaised: false,
              joinedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
            },
            {
              userId: 'user2',
              username: 'emma_creates',
              displayName: 'Emma Wilson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
              role: 'listener',
              isMuted: true,
              isVideoEnabled: false,
              handRaised: true,
              joinedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
            }
          ],
          maxParticipants: 50,
          isPublic: true,
          tags: ['tech', 'startup', 'networking'],
          category: 'technology'
        },
        {
          id: 'event2',
          title: 'Creative Corner: Art & Design',
          description: 'Showcase your latest work and get feedback from fellow creatives',
          hostId: 'host2',
          hostName: 'Emma Wilson',
          hostAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
          type: 'video',
          status: 'live',
          startedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
          participants: [
            {
              userId: 'host2',
              username: 'emma_creates',
              displayName: 'Emma Wilson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
              role: 'host',
              isMuted: false,
              isVideoEnabled: true,
              handRaised: false,
              joinedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
            }
          ],
          maxParticipants: 20,
          isPublic: true,
          tags: ['art', 'design', 'creative'],
          category: 'creative'
        },
        {
          id: 'event3',
          title: 'Weekend Braai Stories',
          description: 'Share your weekend adventures and connect with locals',
          hostId: 'host3',
          hostName: 'Alex Rodriguez',
          type: 'audio',
          status: 'scheduled',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          participants: [],
          maxParticipants: 30,
          isPublic: true,
          tags: ['social', 'weekend', 'stories'],
          category: 'lifestyle'
        }
      ]
      
      setEvents(mockEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const joinEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId)
    if (!event) return

    try {
      // In real app, would join via backend
      const updatedEvent = {
        ...event,
        participants: [
          ...event.participants,
          {
            userId: currentUserId,
            username: 'you',
            displayName: 'You',
            role: 'listener' as const,
            isMuted: true,
            isVideoEnabled: false,
            handRaised: false,
            joinedAt: new Date().toISOString()
          }
        ]
      }
      
      setActiveEvent(updatedEvent)
    } catch (error) {
      console.error('Failed to join event:', error)
    }
  }

  const leaveEvent = () => {
    setActiveEvent(null)
  }

  if (activeEvent) {
    return (
      <LiveRoom 
        event={activeEvent} 
        currentUserId={currentUserId} 
        onLeave={leaveEvent}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading live events...</p>
        </div>
      </div>
    )
  }

  const liveEvents = events.filter(e => e.status === 'live')
  const scheduledEvents = events.filter(e => e.status === 'scheduled')

  return (
    <div className={cn("h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50", className)}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Live Events</h1>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-purple-500 hover:bg-purple-600"
            >
              Create Event
            </Button>
          </div>
          
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Now ({liveEvents.length})</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled ({scheduledEvents.length})</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="live" className="p-4 space-y-4 mt-0">
            {liveEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Live Events</h3>
                <p className="text-gray-600 mb-4">Be the first to start a live conversation!</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Create Live Event
                </Button>
              </div>
            ) : (
              liveEvents.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      {event.hostAvatar ? (
                        <img 
                          src={event.hostAvatar} 
                          alt={event.hostName}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {event.hostName[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white">
                        <div className="w-full h-full bg-red-500 rounded-full animate-pulse" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <Badge className="bg-red-100 text-red-700">LIVE</Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.type === 'audio' ? '🎙️' : event.type === 'video' ? '📹' : '🎬'} {event.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{event.participants.length} / {event.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Started {new Date(event.startedAt!).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          <span>{event.hostName}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {event.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          onClick={() => joinEvent(event.id)}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Join Event
                        </Button>
                        <Button variant="outline" size="sm">
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="scheduled" className="p-4 space-y-4 mt-0">
            {scheduledEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Events</h3>
                <p className="text-gray-600">Schedule an event for later!</p>
              </div>
            ) : (
              scheduledEvents.map((event) => (
                <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {event.type === 'audio' ? '🎙️' : event.type === 'video' ? '📹' : '🎬'} {event.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(event.scheduledFor!).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Max {event.maxParticipants}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="outline">
                          <Bell className="w-4 h-4 mr-2" />
                          Remind Me
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}