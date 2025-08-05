import { useState, useEffect } from 'react'
import { Trophy, Star, Flame, Target, Gift, Crown, Zap, Calendar, Users, MessageCircle, Video, Heart } from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { cn } from '../ui/utils'
import { authenticatedApiCall, apiEndpoints } from '../../utils/supabase/info'

interface UserStats {
  totalPoints: number
  currentStreak: number
  longestStreak: number
  level: number
  xpToNextLevel: number
  badges: Badge[]
  dailyChallengesCompleted: number
  weeklyRank: number
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: string
}

interface DailyChallenge {
  id: string
  title: string
  description: string
  target: number
  progress: number
  reward: {
    points: number
    badge?: string
  }
  icon: string
  type: 'messages' | 'videos' | 'communities' | 'reactions' | 'friends'
  completed: boolean
}

interface LeaderboardEntry {
  userId: string
  username: string
  displayName: string
  avatar?: string
  points: number
  level: number
  rank: number
}

interface GamificationHubProps {
  currentUserId: string
  className?: string
}

export function GamificationHub({ currentUserId, className }: GamificationHubProps) {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    xpToNextLevel: 100,
    badges: [],
    dailyChallengesCompleted: 0,
    weeklyRank: 0
  })
  
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [celebratingBadge, setCelebratingBadge] = useState<Badge | null>(null)

  useEffect(() => {
    loadGamificationData()
    
    // Update stats every 30 seconds
    const interval = setInterval(loadGamificationData, 30000)
    return () => clearInterval(interval)
  }, [currentUserId])

  const loadGamificationData = async () => {
    try {
      // Load user stats and daily challenges
      const stats = await loadUserStats()
      const challenges = await loadDailyChallenges()
      const leaderboardData = await loadLeaderboard()
      
      setUserStats(stats)
      setDailyChallenges(challenges)
      setLeaderboard(leaderboardData)
    } catch (error) {
      console.error('Failed to load gamification data:', error)
      // Load demo data
      loadDemoData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserStats = async (): Promise<UserStats> => {
    try {
      // In a real app, this would call the backend
      const response = await authenticatedApiCall(`${apiEndpoints.gamification?.stats || '/api/gamification/stats'}`)
      return response
    } catch {
      // Demo data
      return {
        totalPoints: 2847,
        currentStreak: 7,
        longestStreak: 12,
        level: 8,
        xpToNextLevel: 340,
        badges: [
          { id: 'early_bird', name: 'Early Bird', description: 'Active for 7 days straight', icon: '🌅', rarity: 'rare', unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          { id: 'social_butterfly', name: 'Social Butterfly', description: 'Sent 100 messages', icon: '🦋', rarity: 'common' },
          { id: 'creator', name: 'Content Creator', description: 'Posted 10 videos', icon: '🎬', rarity: 'epic' }
        ],
        dailyChallengesCompleted: 3,
        weeklyRank: 15
      }
    }
  }

  const loadDailyChallenges = async (): Promise<DailyChallenge[]> => {
    try {
      // In a real app, this would call the backend
      const response = await authenticatedApiCall(`${apiEndpoints.gamification?.challenges || '/api/gamification/challenges'}`)
      return response
    } catch {
      // Demo data
      return [
        {
          id: 'daily_chat',
          title: 'Chat Master',
          description: 'Send 10 messages today',
          target: 10,
          progress: 7,
          reward: { points: 50 },
          icon: '💬',
          type: 'messages',
          completed: false
        },
        {
          id: 'video_watch',
          title: 'Video Explorer',
          description: 'Watch 5 videos',
          target: 5,
          progress: 5,
          reward: { points: 75, badge: 'binge_watcher' },
          icon: '📺',
          type: 'videos',
          completed: true
        },
        {
          id: 'community_join',
          title: 'Community Builder',
          description: 'Join 2 communities',
          target: 2,
          progress: 1,
          reward: { points: 100 },
          icon: '👥',
          type: 'communities',
          completed: false
        },
        {
          id: 'reactions_give',
          title: 'Spread Love',
          description: 'Give 15 reactions',
          target: 15,
          progress: 12,
          reward: { points: 30 },
          icon: '❤️',
          type: 'reactions',
          completed: false
        }
      ]
    }
  }

  const loadLeaderboard = async (): Promise<LeaderboardEntry[]> => {
    try {
      // In a real app, this would call the backend
      const response = await authenticatedApiCall(`${apiEndpoints.gamification?.leaderboard || '/api/gamification/leaderboard'}`)
      return response
    } catch {
      // Demo data
      return [
        { userId: 'user1', username: 'sarah_tech', displayName: 'Sarah Johnson', points: 4250, level: 12, rank: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
        { userId: 'user2', username: 'mike_dev', displayName: 'Mike Chen', points: 3890, level: 11, rank: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
        { userId: 'user3', username: 'emma_creates', displayName: 'Emma Wilson', points: 3456, level: 10, rank: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
        { userId: currentUserId, username: 'you', displayName: 'You', points: 2847, level: 8, rank: 15 },
        { userId: 'user4', username: 'alex_games', displayName: 'Alex Rodriguez', points: 2234, level: 7, rank: 16, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' }
      ]
    }
  }

  const loadDemoData = () => {
    setUserStats({
      totalPoints: 2847,
      currentStreak: 7,
      longestStreak: 12,
      level: 8,
      xpToNextLevel: 340,
      badges: [
        { id: 'early_bird', name: 'Early Bird', description: 'Active for 7 days straight', icon: '🌅', rarity: 'rare', unlockedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'social_butterfly', name: 'Social Butterfly', description: 'Sent 100 messages', icon: '🦋', rarity: 'common' },
        { id: 'creator', name: 'Content Creator', description: 'Posted 10 videos', icon: '🎬', rarity: 'epic' }
      ],
      dailyChallengesCompleted: 3,
      weeklyRank: 15
    })
  }

  const claimChallenge = async (challengeId: string) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId)
    if (!challenge || !challenge.completed) return

    try {
      // Optimistic update
      setUserStats(prev => ({
        ...prev,
        totalPoints: prev.totalPoints + challenge.reward.points
      }))

      setDailyChallenges(prev => 
        prev.map(c => c.id === challengeId ? { ...c, completed: false, progress: 0 } : c)
      )

      // In real app, would call backend
      // await authenticatedApiCall(`${apiEndpoints.gamification.claimChallenge}/${challengeId}`, { method: 'POST' })
      
      // Show celebration if badge reward
      if (challenge.reward.badge) {
        const newBadge = { 
          id: challenge.reward.badge, 
          name: 'Video Explorer', 
          description: 'Completed video watching challenge', 
          icon: '🏆', 
          rarity: 'rare' as const,
          unlockedAt: new Date().toISOString()
        }
        setCelebratingBadge(newBadge)
        setTimeout(() => setCelebratingBadge(null), 3000)
      }
    } catch (error) {
      console.error('Failed to claim challenge:', error)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelProgress = () => {
    const baseXP = userStats.level * 100
    const currentXP = baseXP - userStats.xpToNextLevel
    return (currentXP / baseXP) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your achievements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50", className)}>
      {/* Badge Celebration Modal */}
      {celebratingBadge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm text-center animate-in zoom-in duration-500">
            <div className="text-6xl mb-4 animate-bounce">{celebratingBadge.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Badge Unlocked!</h3>
            <p className="text-lg font-semibold text-purple-600 mb-1">{celebratingBadge.name}</p>
            <p className="text-gray-600 mb-4">{celebratingBadge.description}</p>
            <div className="w-full h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 rounded-full animate-pulse" />
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="h-full flex flex-col">
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="challenges" className="text-xs">Challenges</TabsTrigger>
            <TabsTrigger value="badges" className="text-xs">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-xs">Leaderboard</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-y-auto">
          <TabsContent value="overview" className="p-4 space-y-4 mt-0">
            {/* Level & Points Card */}
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Level {userStats.level}</h2>
                  <p className="text-purple-100">{userStats.totalPoints.toLocaleString()} total points</p>
                </div>
                <div className="text-right">
                  <Crown className="w-8 h-8 text-yellow-300 mb-1" />
                  <p className="text-xs text-purple-100">Rank #{userStats.weeklyRank}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Next Level</span>
                  <span>{userStats.xpToNextLevel} XP to go</span>
                </div>
                <Progress value={getLevelProgress()} className="h-2 bg-purple-300" />
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.currentStreak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
                <p className="text-xs text-gray-500 mt-1">Best: {userStats.longestStreak} days</p>
              </Card>
              
              <Card className="p-4 text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{userStats.dailyChallengesCompleted}</p>
                <p className="text-sm text-gray-600">Challenges Done</p>
                <p className="text-xs text-gray-500 mt-1">Today</p>
              </Card>
            </div>

            {/* Recent Badges */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Recent Badges
              </h3>
              <div className="space-y-2">
                {userStats.badges.slice(0, 3).map((badge) => (
                  <div key={badge.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <span className="text-2xl">{badge.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{badge.name}</p>
                      <p className="text-xs text-gray-600">{badge.description}</p>
                    </div>
                    <Badge className={cn("text-xs", getRarityColor(badge.rarity))}>
                      {badge.rarity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="challenges" className="p-4 space-y-4 mt-0">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-900">Daily Challenges</h2>
              <p className="text-gray-600">Complete challenges to earn points and badges</p>
            </div>

            {dailyChallenges.map((challenge) => (
              <Card key={challenge.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{challenge.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                      <Badge className="bg-blue-100 text-blue-700">
                        +{challenge.reward.points} pts
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    {challenge.completed && (
                      <Button 
                        onClick={() => claimChallenge(challenge.id)}
                        className="w-full mt-3 bg-green-500 hover:bg-green-600"
                      >
                        <Gift className="w-4 h-4 mr-2" />
                        Claim Reward
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="badges" className="p-4 space-y-4 mt-0">
            <div className="text-center mb-6">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-900">Badge Collection</h2>
              <p className="text-gray-600">{userStats.badges.length} badges earned</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {userStats.badges.map((badge) => (
                <Card key={badge.id} className="p-4 text-center">
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mb-2">{badge.description}</p>
                  <Badge className={cn("text-xs", getRarityColor(badge.rarity))}>
                    {badge.rarity}
                  </Badge>
                  {badge.unlockedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Earned {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="p-4 space-y-4 mt-0">
            <div className="text-center mb-6">
              <Star className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-gray-900">Weekly Leaderboard</h2>
              <p className="text-gray-600">See how you rank against other users</p>
            </div>

            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <Card 
                  key={entry.userId} 
                  className={cn(
                    "p-4",
                    entry.userId === currentUserId && "border-purple-300 bg-purple-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      entry.rank === 1 && "bg-yellow-100 text-yellow-700",
                      entry.rank === 2 && "bg-gray-100 text-gray-700",
                      entry.rank === 3 && "bg-orange-100 text-orange-700",
                      entry.rank > 3 && "bg-blue-100 text-blue-700"
                    )}>
                      {entry.rank === 1 && "🥇"}
                      {entry.rank === 2 && "🥈"}
                      {entry.rank === 3 && "🥉"}
                      {entry.rank > 3 && entry.rank}
                    </div>
                    
                    {entry.avatar ? (
                      <img 
                        src={entry.avatar} 
                        alt={entry.displayName}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {entry.displayName[0]?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{entry.displayName}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Level {entry.level}</span>
                        <span>•</span>
                        <span>{entry.points.toLocaleString()} pts</span>
                      </div>
                    </div>
                    
                    {entry.userId === currentUserId && (
                      <Badge className="bg-purple-500 text-white">You</Badge>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}