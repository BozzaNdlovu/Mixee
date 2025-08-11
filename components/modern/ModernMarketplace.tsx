import { ArrowLeft, ShoppingBag, Star, Heart, Search, Filter, MapPin, Tag, Clock, User, MessageCircle, Share2 } from 'lucide-react'

interface ModernMarketplaceProps {
  onBack: () => void
}

export function ModernMarketplace({ onBack }: ModernMarketplaceProps) {
  const featuredItems = [
    {
      id: 1,
      title: "iPhone 13 Pro",
      price: "$899",
      originalPrice: "$1099",
      seller: "TechGuru",
      location: "2.3km away",
      rating: 4.8,
      reviews: 127,
      image: "📱",
      condition: "Excellent",
      isLiked: false,
      timePosted: "2 hours ago"
    },
    {
      id: 2,
      title: "MacBook Air M2",
      price: "$1,199",
      originalPrice: "$1,499",
      seller: "StudentSeller",
      location: "1.1km away",
      rating: 4.9,
      reviews: 89,
      image: "💻",
      condition: "Like New",
      isLiked: true,
      timePosted: "1 day ago"
    },
    {
      id: 3,
      title: "Nike Air Max 270",
      price: "$85",
      originalPrice: "$150",
      seller: "SneakerHead",
      location: "0.8km away",
      rating: 4.7,
      reviews: 203,
      image: "👟",
      condition: "Good",
      isLiked: false,
      timePosted: "3 hours ago"
    },
    {
      id: 4,
      title: "Sony WH-1000XM4",
      price: "$249",
      originalPrice: "$349",
      seller: "AudioPro",
      location: "3.2km away",
      rating: 4.6,
      reviews: 156,
      image: "🎧",
      condition: "Excellent",
      isLiked: false,
      timePosted: "5 hours ago"
    }
  ]

  const categories = [
    { name: "Electronics", icon: "📱", color: "blue", count: "1.2k" },
    { name: "Fashion", icon: "👕", color: "purple", count: "856" },
    { name: "Home & Garden", icon: "🏠", color: "green", count: "432" },
    { name: "Sports", icon: "⚽", color: "orange", count: "298" },
    { name: "Books", icon: "📚", color: "red", count: "567" },
    { name: "Toys", icon: "🎮", color: "pink", count: "234" }
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
            <h1 className="text-lg font-bold text-gray-900">Marketplace</h1>
            <p className="text-xs text-gray-600">Shop & sell items</p>
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                <div className={`w-12 h-12 ${getColorClasses(category.color)} rounded-lg flex items-center justify-center mb-3 mx-auto text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Featured Items</h2>
          <div className="grid grid-cols-1 gap-4">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Item Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl">
                    {item.image}
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <Heart className={`w-5 h-5 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-green-600">{item.price}</span>
                      <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                        {Math.round(((parseInt(item.originalPrice.replace('$', '')) - parseInt(item.price.replace('$', ''))) / parseInt(item.originalPrice.replace('$', ''))) * 100)}% OFF
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{item.rating}</span>
                        <span className="text-xs text-gray-500">({item.reviews})</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {item.condition}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{item.seller}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-xs">Message</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">Share</span>
                      </button>
                      <div className="flex items-center gap-1 text-gray-500 ml-auto">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{item.timePosted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Browse</h3>
              <p className="text-sm text-gray-600">Find items</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Tag className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Sell</h3>
              <p className="text-sm text-gray-600">List items</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Local</h3>
              <p className="text-sm text-gray-600">Nearby items</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Deals</h3>
              <p className="text-sm text-gray-600">Best offers</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            Safety Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Meet in public places</li>
            <li>• Check item condition before buying</li>
            <li>• Use secure payment methods</li>
            <li>• Trust your instincts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}