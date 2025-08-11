import { ArrowLeft, Users2, Plus, Search, MessageCircle, Calendar, MapPin, Star, TrendingUp, Filter } from 'lucide-react'

interface ModernCommunitiesProps {
  onBack: () => void
}

export function ModernCommunities({ onBack }: ModernCommunitiesProps) {
  const communities = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      description: "Discussing the latest in technology and innovation",
      members: "1.2k",
      online: "45",
      category: "Technology",
      isActive: true,
      icon: "💻",
      color: "blue"
    },
    {
      id: 2,
      name: "Design Creatives",
      description: "Share your creative work and get feedback",
      members: "856",
      online: "23",
      category: "Design",
      isActive: true,
      icon: "🎨",
      color: "purple"
    },
    {
      id: 3,
      name: "Startup Founders",
      description: "Connect with fellow entrepreneurs",
      members: "432",
      online: "12",
      category: "Business",
      isActive: false,
      icon: "🚀",
      color: "green"
    },
    {
      id: 4,
      name: "Remote Workers",
      description: "Tips and support for remote work life",
      members: "2.1k",
      online: "89",
      category: "Lifestyle",
      isActive: true,
      icon: "🏠",
      color: "orange"
    },
    {
      id: 5,
      name: "Fitness & Wellness",
      description: "Stay healthy and motivated together",
      members: "1.5k",
      online: "67",
      category: "Health",
      isActive: true,
      icon: "💪",
      color: "red"
    },
    {
      id: 6,
      name: "Photography Lovers",
      description: "Share your best shots and techniques",
      members: "987",
      online: "34",
      category: "Arts",
      isActive: false,
      icon: "📸",
      color: "pink"
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Meetup",
      community: "Tech Enthusiasts",
      date: "Tomorrow, 7:00 PM",
      attendees: "45",
      type: "Virtual"
    },
    {
      id: 2,
      title: "Design Workshop",
      community: "Design Creatives",
      date: "Friday, 2:00 PM",
      attendees: "23",
      type: "In-Person"
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      green: "bg-green-100 text-green-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      pink: "bg-pink-100 text-pink-600"
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="relative z-10 max-w-md mx-auto bg-white/95 backdrop-blur-xl h-screen shadow-2xl border-x border-white/20 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">Communities</h1>
            <p className="text-xs text-gray-600">Join groups & discussions</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Upcoming Events
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.community}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{event.date}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{event.attendees} attending</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communities */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-purple-500" />
              Discover Communities
            </h2>
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {communities.map((community) => (
              <div key={community.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${getColorClasses(community.color)} rounded-lg flex items-center justify-center text-xl`}>
                    {community.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{community.name}</h3>
                      {community.isActive && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-xs text-green-600 font-medium">Active</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Users2 className="w-3 h-3" />
                        {community.members} members
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {community.online} online
                      </span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                        {community.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">Chat</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-purple-500 transition-colors">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs">Events</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors">
                        <Star className="w-4 h-4" />
                        <span className="text-xs">Follow</span>
                      </button>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Trending</h3>
              <p className="text-sm text-gray-600">Popular communities</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Users2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Local</h3>
              <p className="text-sm text-gray-600">Nearby groups</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Events</h3>
              <p className="text-sm text-gray-600">Upcoming meetups</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Create</h3>
              <p className="text-sm text-gray-600">Start a community</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}