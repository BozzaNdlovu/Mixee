import { ArrowLeft, Play, Users, Zap, Star, TrendingUp, Heart, Share2, MessageCircle } from 'lucide-react'

interface ModernVideoFeedProps {
  onBack: () => void
}

export function ModernVideoFeed({ onBack }: ModernVideoFeedProps) {
  const trendingVideos = [
    {
      id: 1,
      title: "Amazing Sunset Timelapse",
      creator: "NatureLover",
      views: "12.5K",
      likes: "2.1K",
      comments: "156",
      thumbnail: "🌅",
      duration: "2:34"
    },
    {
      id: 2,
      title: "Quick Cooking Tips",
      creator: "ChefPro",
      views: "8.9K",
      likes: "1.5K",
      comments: "89",
      thumbnail: "👨‍🍳",
      duration: "4:12"
    },
    {
      id: 3,
      title: "Tech Review: Latest Gadgets",
      creator: "TechGuru",
      views: "15.2K",
      likes: "3.2K",
      comments: "234",
      thumbnail: "📱",
      duration: "8:45"
    },
    {
      id: 4,
      title: "Workout Motivation",
      creator: "FitnessCoach",
      views: "6.7K",
      likes: "1.8K",
      comments: "123",
      thumbnail: "💪",
      duration: "5:23"
    }
  ]

  const liveStreams = [
    {
      id: 1,
      title: "Live Gaming Stream",
      creator: "GameMaster",
      viewers: "1.2K",
      thumbnail: "🎮",
      isLive: true
    },
    {
      id: 2,
      title: "Cooking Live",
      creator: "ChefMaria",
      viewers: "856",
      thumbnail: "🍳",
      isLive: true
    }
  ]

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
            <h1 className="text-lg font-bold text-gray-900">Videos</h1>
            <p className="text-xs text-gray-600">Watch trending content</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Live Streams Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live Now
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-2xl">
                    {stream.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{stream.title}</h3>
                    <p className="text-sm text-gray-600">{stream.creator}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs text-red-600 font-medium">LIVE</span>
                      </div>
                      <span className="text-xs text-gray-500">{stream.viewers} watching</span>
                    </div>
                  </div>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-red-600 transition-colors">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Videos Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Trending
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {trendingVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Video Thumbnail */}
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-4xl">
                    {video.thumbnail}
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                  <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <Play className="w-6 h-6 text-gray-800 ml-1" />
                  </button>
                </div>
                
                {/* Video Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.creator}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>{video.views} views</span>
                    <span>{video.likes} likes</span>
                    <span>{video.comments} comments</span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">Like</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">Comment</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">Share</span>
                    </button>
                  </div>
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
                <Play className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Trending</h3>
              <p className="text-sm text-gray-600">Popular videos</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Following</h3>
              <p className="text-sm text-gray-600">Your creators</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Live</h3>
              <p className="text-sm text-gray-600">Live streams</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Favorites</h3>
              <p className="text-sm text-gray-600">Saved videos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}