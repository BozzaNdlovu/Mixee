import { useState, useEffect } from 'react'
import { Users, MessageCircle, Calendar, Clock, CheckCircle, TrendingUp, Zap, Trophy, Star, Gift } from 'lucide-react'
import { CompactLiveReactions } from './LiveReactions'
import { MultiUserPresence } from './UserPresence'
import { cn } from '../ui/utils'

interface Poll {
  id: string
  question: string
  options: { id: string; text: string; votes: number }[]
  totalVotes: number
  endTime: Date
  isActive: boolean
}

interface LiveEvent {
  id: string
  type: 'poll' | 'qna' | 'announcement' | 'celebration' | 'challenge'
  title: string
  description: string
  participantCount: number
  isActive: boolean
  startTime: Date
  endTime?: Date
  data?: any
}

interface CommunityActivity {
  id: string
  type: 'join' | 'post' | 'poll_vote' | 'reaction' | 'achievement'
  user: string
  action: string
  timestamp: Date
}

interface LiveCommunityEventsProps {
  communityId: string
  isLive: boolean
  currentUserId: string
  className?: string
}

export function LiveCommunityEvents({ 
  communityId, 
  isLive, 
  currentUserId, 
  className 
}: LiveCommunityEventsProps) {
  const [activeEvents, setActiveEvents] = useState<LiveEvent[]>([])
  const [activePoll, setActivePoll] = useState<Poll | null>(null)
  const [recentActivity, setRecentActivity] = useState<CommunityActivity[]>([])
  const [onlineMembers, setOnlineMembers] = useState<string[]>([])
  const [communityStats, setCommunityStats] = useState({
    totalMembers: 0,
    onlineNow: 0,
    todayActivity: 0
  })

  useEffect(() => {
    if (!isLive) return

    // Initialize community stats
    setCommunityStats({
      totalMembers: Math.floor(Math.random() * 500) + 100,
      onlineNow: Math.floor(Math.random() * 50) + 10,
      todayActivity: Math.floor(Math.random() * 200) + 50
    })

    // Initialize online members
    const memberIds = Array.from({ length: 15 }, (_, i) => `member_${i + 1}`)
    setOnlineMembers(memberIds.slice(0, Math.floor(Math.random() * 10) + 5))

    // Create initial poll
    const initialPoll: Poll = {
      id: 'poll_1',
      question: 'What feature should we focus on next for SupaApp?',
      options: [
        { id: 'opt1', text: 'Advanced Video Editing', votes: Math.floor(Math.random() * 50) + 20 },
        { id: 'opt2', text: 'AI-Powered Recommendations', votes: Math.floor(Math.random() * 40) + 15 },
        { id: 'opt3', text: 'Cross-Platform Sync', votes: Math.floor(Math.random() * 60) + 25 },
        { id: 'opt4', text: 'Enhanced Privacy Controls', votes: Math.floor(Math.random() * 35) + 10 }
      ],
      totalVotes: 0,
      endTime: new Date(Date.now() + 300000), // 5 minutes from now
      isActive: true
    }
    initialPoll.totalVotes = initialPoll.options.reduce((sum, opt) => sum + opt.votes, 0)
    setActivePoll(initialPoll)

    // Initialize events
    setActiveEvents([
      {
        id: 'event_1',
        type: 'poll',
        title: '🗳️ Community Poll Active',
        description: 'Help shape SupaApp\'s future! Vote now.',
        participantCount: initialPoll.totalVotes,
        isActive: true,
        startTime: new Date(Date.now() - 60000),
        endTime: initialPoll.endTime,
        data: initialPoll
      },
      {
        id: 'event_2',
        type: 'celebration',
        title: '🎉 1000 Members Milestone!',
        description: 'We just hit 1000 community members!',
        participantCount: 45,
        isActive: true,
        startTime: new Date(Date.now() - 180000)
      }
    ])

    // Generate initial activity
    const activities: CommunityActivity[] = [
      {
        id: 'act_1',
        type: 'join',
        user: 'Sarah M.',
        action: 'joined the community',
        timestamp: new Date(Date.now() - 30000)
      },
      {
        id: 'act_2',
        type: 'poll_vote',
        user: 'Mike T.',
        action: 'voted in the poll',
        timestamp: new Date(Date.now() - 45000)
      },
      {
        id: 'act_3',
        type: 'post',
        user: 'Alex K.',
        action: 'shared a new video',
        timestamp: new Date(Date.now() - 90000)
      }
    ]
    setRecentActivity(activities)

    // Set up real-time updates
    const activityInterval = setInterval(() => {
      generateRandomActivity()
      updatePollVotes()
      updateOnlineMembers()
    }, 5000)

    const statsInterval = setInterval(() => {
      setCommunityStats(prev => ({
        totalMembers: prev.totalMembers + (Math.random() > 0.9 ? 1 : 0),
        onlineNow: Math.max(1, prev.onlineNow + (Math.random() > 0.5 ? 1 : -1)),
        todayActivity: prev.todayActivity + Math.floor(Math.random() * 3)
      }))
    }, 8000)

    return () => {
      clearInterval(activityInterval)
      clearInterval(statsInterval)
    }
  }, [isLive, communityId])

  const generateRandomActivity = () => {
    const activityTypes: CommunityActivity['type'][] = ['join', 'post', 'poll_vote', 'reaction', 'achievement']
    const users = ['Emma S.', 'David L.', 'Zara M.', 'Chris R.', 'Maya P.', 'Liam K.', 'Sophie T.']
    const actions = {
      join: ['joined the community', 'became a member'],
      post: ['shared a new post', 'uploaded a video', 'started a discussion'],
      poll_vote: ['voted in the poll', 'cast their vote'],
      reaction: ['reacted to a post', 'liked a video'],
      achievement: ['earned a badge', 'completed a challenge', 'reached a milestone']
    }

    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const user = users[Math.floor(Math.random() * users.length)]
    const action = actions[type][Math.floor(Math.random() * actions[type].length)]

    const newActivity: CommunityActivity = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      user,
      action,
      timestamp: new Date()
    }

    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]) // Keep last 10
  }

  const updatePollVotes = () => {
    if (!activePoll || !activePoll.isActive) return

    setActivePoll(prev => {
      if (!prev) return prev

      const shouldUpdate = Math.random() > 0.6
      if (!shouldUpdate) return prev

      const randomOptionIndex = Math.floor(Math.random() * prev.options.length)
      const updatedOptions = prev.options.map((option, index) => 
        index === randomOptionIndex 
          ? { ...option, votes: option.votes + Math.floor(Math.random() * 3) + 1 }
          : option
      )

      const newTotalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0)

      return {
        ...prev,
        options: updatedOptions,
        totalVotes: newTotalVotes
      }
    })
  }

  const updateOnlineMembers = () => {
    const allMembers = Array.from({ length: 20 }, (_, i) => `member_${i + 1}`)
    
    setOnlineMembers(prev => {
      const shouldChange = Math.random() > 0.7
      if (!shouldChange) return prev

      const shouldAdd = Math.random() > 0.5 && prev.length < 12
      
      if (shouldAdd) {
        const availableMembers = allMembers.filter(id => !prev.includes(id))
        if (availableMembers.length > 0) {
          const newMember = availableMembers[Math.floor(Math.random() * availableMembers.length)]
          return [...prev, newMember]
        }
      } else if (prev.length > 3) {
        const memberToRemove = prev[Math.floor(Math.random() * prev.length)]
        return prev.filter(id => id !== memberToRemove)
      }

      return prev
    })
  }

  const handlePollVote = (optionId: string) => {
    if (!activePoll || !isLive) return

    setActivePoll(prev => {
      if (!prev) return prev

      const updatedOptions = prev.options.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )

      return {
        ...prev,
        options: updatedOptions,
        totalVotes: prev.totalVotes + 1
      }
    })

    // Add activity
    const newActivity: CommunityActivity = {
      id: `act_${Date.now()}`,
      type: 'poll_vote',
      user: 'You',
      action: 'voted in the poll',
      timestamp: new Date()
    }
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)])
  }

  const formatTimeLeft = (endTime: Date) => {
    const diff = endTime.getTime() - Date.now()
    if (diff <= 0) return 'Ended'
    
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const getActivityIcon = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'join': return Users
      case 'post': return MessageCircle
      case 'poll_vote': return CheckCircle
      case 'reaction': return Star
      case 'achievement': return Trophy
      default: return MessageCircle
    }
  }

  const getActivityColor = (type: CommunityActivity['type']) => {
    switch (type) {
      case 'join': return 'text-green-500'
      case 'post': return 'text-blue-500'
      case 'poll_vote': return 'text-purple-500'
      case 'reaction': return 'text-pink-500'
      case 'achievement': return 'text-amber-500'
      default: return 'text-gray-500'
    }
  }

  if (!isLive) {
    return (
      <div className={cn("bg-gray-100 rounded-lg p-4", className)}>
        <div className="text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2" />
          <p>Community events will appear when live</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Community Stats Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Live Community</h3>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-600 font-medium">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">{communityStats.totalMembers}</div>
            <div className="text-xs text-purple-600">Total Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{communityStats.onlineNow}</div>
            <div className="text-xs text-green-600">Online Now</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{communityStats.todayActivity}</div>
            <div className="text-xs text-blue-600">Today's Activity</div>
          </div>
        </div>

        {/* Online Members */}
        <MultiUserPresence
          userIds={onlineMembers}
          isLive={isLive}
          maxVisible={6}
          className="justify-center"
        />
      </div>

      {/* Active Events */}
      <div className="space-y-3">
        {activeEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                <p className="text-gray-600 text-sm">{event.description}</p>
              </div>
              {event.isActive && (
                <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{event.participantCount} participants</span>
              </div>
              {event.endTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeLeft(event.endTime)} left</span>
                </div>
              )}
            </div>

            {event.type === 'poll' && activePoll && (
              <div className="space-y-2">
                <p className="font-medium text-gray-900 mb-3">{activePoll.question}</p>
                {activePoll.options.map((option) => {
                  const percentage = activePoll.totalVotes > 0 
                    ? Math.round((option.votes / activePoll.totalVotes) * 100) 
                    : 0

                  return (
                    <button
                      key={option.id}
                      onClick={() => handlePollVote(option.id)}
                      className="w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-900">{option.text}</span>
                        <span className="text-gray-600 text-sm">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{option.votes} votes</div>
                    </button>
                  )
                })}
              </div>
            )}

            {event.type === 'celebration' && (
              <div className="flex items-center justify-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="text-center">
                  <Gift className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <CompactLiveReactions
                    contentId={event.id}
                    contentType="community"
                    isLive={isLive}
                    className="justify-center"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-900">Live Activity</h4>
        </div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {recentActivity.map((activity) => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div key={activity.id} className="flex items-center gap-2 text-sm animate-fadeIn">
                <Icon className={cn("w-3 h-3", getActivityColor(activity.type))} />
                <span className="font-medium text-gray-800">{activity.user}</span>
                <span className="text-gray-600">{activity.action}</span>
                <span className="text-gray-400 text-xs ml-auto">
                  {Math.floor((Date.now() - activity.timestamp.getTime()) / 1000)}s
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}