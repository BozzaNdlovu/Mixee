import { useState } from 'react'
import { Search, Filter, MapPin, Star, Heart, ShoppingCart, Plus, Zap, Eye, MessageCircle, Shield, Award } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { cn } from '../ui/utils'

interface Product {
  id: string
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  seller: {
    id: string
    name: string
    username: string
    avatar?: string
    rating: number
    reviewCount: number
    isVerified: boolean
    responseTime: string
    distance: string
  }
  category: string
  location: string
  condition: 'new' | 'like_new' | 'good' | 'fair'
  isLiked: boolean
  viewCount: number
  likeCount: number
  createdAt: string
  isFeatured?: boolean
  isLocal?: boolean
  hasShipping: boolean
  hasPickup: boolean
}

interface LocalBusiness {
  id: string
  name: string
  category: string
  rating: number
  reviewCount: number
  distance: string
  isOpen: boolean
  avatar: string
  description: string
  specialOffer?: string
  isVerified: boolean
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'MacBook Pro 14" M2 - Like New',
    description: 'Barely used MacBook Pro with original packaging and accessories. Perfect for students or professionals.',
    price: 18500,
    currency: 'ZAR',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop'],
    seller: {
      id: 'seller1',
      name: 'Tech Enthusiast',
      username: '@techie_ct',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      reviewCount: 127,
      isVerified: true,
      responseTime: '< 1 hour',
      distance: '2.3km'
    },
    category: 'Electronics',
    location: 'Cape Town CBD',
    condition: 'like_new',
    isLiked: false,
    viewCount: 234,
    likeCount: 45,
    createdAt: '2 hours ago',
    isFeatured: true,
    isLocal: true,
    hasShipping: true,
    hasPickup: true
  },
  {
    id: '2',
    title: 'Handmade Pottery Set - Unique Design',
    description: 'Beautiful handcrafted pottery set, perfect for home decor or as a gift. Made by local artisan.',
    price: 450,
    currency: 'ZAR',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop'],
    seller: {
      id: 'seller2',
      name: 'Sarah Ceramics',
      username: '@sarah_ceramics',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      reviewCount: 89,
      isVerified: true,
      responseTime: '< 2 hours',
      distance: '1.8km'
    },
    category: 'Arts & Crafts',
    location: 'Woodstock',
    condition: 'new',
    isLiked: true,
    viewCount: 156,
    likeCount: 23,
    createdAt: '1 day ago',
    isLocal: true,
    hasShipping: false,
    hasPickup: true
  }
]

const mockBusinesses: LocalBusiness[] = [
  {
    id: '1',
    name: 'Truth Coffee',
    category: 'Coffee Shop',
    rating: 4.7,
    reviewCount: 1200,
    distance: '0.8km',
    isOpen: true,
    avatar: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=100&h=100&fit=crop',
    description: 'Award-winning specialty coffee roastery',
    specialOffer: '20% off all coffee beans today!',
    isVerified: true
  },
  {
    id: '2',
    name: 'Ocean Basket',
    category: 'Restaurant',
    rating: 4.4,
    reviewCount: 856,
    distance: '1.2km',
    isOpen: true,
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
    description: 'Fresh seafood and Mediterranean cuisine',
    isVerified: true
  }
]

export function ModernMarketplace() {
  const [activeTab, setActiveTab] = useState('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'home', name: 'Home & Garden', icon: '🏡' },
    { id: 'arts', name: 'Arts & Crafts', icon: '🎨' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'books', name: 'Books', icon: '📚' }
  ]

  const handleProductLike = (productId: string) => {
    console.log('Liked product:', productId)
  }

  const handleAddToCart = (productId: string) => {
    console.log('Added to cart:', productId)
  }

  const handleContactSeller = (sellerId: string) => {
    console.log('Contact seller:', sellerId)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-emerald-50/30">
      {/* Search Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="relative mb-4">
          <Input
            placeholder="Search products and businesses..."
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
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>45 new listings today</span>
          </div>
          <div className="w-1 h-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span>Secure transactions</span>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 py-3 bg-white/50">
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full whitespace-nowrap",
                  selectedCategory === category.id && "bg-emerald-500 hover:bg-emerald-600"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2 bg-gray-100">
          <TabsTrigger value="products" className="rounded-xl">🛍️ Products</TabsTrigger>
          <TabsTrigger value="businesses" className="rounded-xl">🏪 Local Businesses</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {/* Featured Products */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Featured Near You</h3>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Hot Deals
                  </Badge>
                </div>

                {mockProducts.filter(p => p.isFeatured).map((product) => (
                  <Card key={product.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative">
                      {/* Product Image */}
                      <div 
                        className="h-48 bg-gradient-to-br from-emerald-100 to-blue-100"
                        style={{
                          backgroundImage: `url(${product.images[0]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.isFeatured && (
                            <Badge className="bg-orange-500 text-white text-xs">
                              ⭐ Featured
                            </Badge>
                          )}
                          {product.isLocal && (
                            <Badge className="bg-green-500 text-white text-xs">
                              📍 Local
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "w-8 h-8 rounded-full backdrop-blur-sm",
                              product.isLiked 
                                ? "bg-red-500/20 text-red-500" 
                                : "bg-white/20 text-white hover:bg-white/30"
                            )}
                            onClick={() => handleProductLike(product.id)}
                          >
                            <Heart className={cn("w-4 h-4", product.isLiked && "fill-current")} />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Price and Condition */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-emerald-600">
                              {product.currency} {product.price.toLocaleString()}
                            </span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {product.condition.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        {/* Title and Description */}
                        <h4 className="font-semibold text-gray-900 mb-1">{product.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                        {/* Seller Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={product.seller.avatar} />
                            <AvatarFallback>{product.seller.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{product.seller.name}</span>
                              {product.seller.isVerified && (
                                <Badge variant="outline" className="text-xs px-1 h-4">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                <span>{product.seller.rating}</span>
                                <span>({product.seller.reviewCount})</span>
                              </div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{product.seller.distance}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
                          {product.hasPickup && (
                            <Badge variant="secondary" className="text-xs">
                              🚶 Pickup
                            </Badge>
                          )}
                          {product.hasShipping && (
                            <Badge variant="secondary" className="text-xs">
                              📦 Shipping
                            </Badge>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{product.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{product.likeCount}</span>
                            </div>
                          </div>
                          <span>{product.createdAt}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleContactSeller(product.seller.id)}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                            onClick={() => handleAddToCart(product.id)}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* All Products */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">All Products</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {mockProducts.filter(p => !p.isFeatured).map((product) => (
                    <Card key={product.id} className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="relative">
                        <div 
                          className="h-32 bg-gradient-to-br from-gray-100 to-gray-200"
                          style={{
                            backgroundImage: `url(${product.images[0]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "absolute top-2 right-2 w-6 h-6 rounded-full backdrop-blur-sm p-0",
                              product.isLiked 
                                ? "bg-red-500/20 text-red-500" 
                                : "bg-white/20 text-white hover:bg-white/30"
                            )}
                            onClick={() => handleProductLike(product.id)}
                          >
                            <Heart className={cn("w-3 h-3", product.isLiked && "fill-current")} />
                          </Button>
                        </div>
                        
                        <div className="p-3">
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-lg font-bold text-emerald-600">
                              {product.currency} {product.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                            {product.title}
                          </h4>
                          
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{product.seller.distance}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Local Businesses Tab */}
        <TabsContent value="businesses" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Nearby Businesses</h3>
                
                {mockBusinesses.map((business) => (
                  <Card key={business.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={business.avatar} />
                          <AvatarFallback>{business.name[0]}</AvatarFallback>
                        </Avatar>
                        {business.isOpen && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{business.name}</h4>
                            {business.isVerified && (
                              <Badge variant="outline" className="text-xs px-1 h-4">
                                <Award className="w-2 h-2 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <Badge 
                            variant={business.isOpen ? "default" : "secondary"}
                            className={cn(
                              "text-xs",
                              business.isOpen ? "bg-green-500" : "bg-gray-400"
                            )}
                          >
                            {business.isOpen ? "Open" : "Closed"}
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{business.description}</p>

                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{business.rating}</span>
                            <span>({business.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{business.distance}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {business.category}
                          </Badge>
                        </div>

                        {business.specialOffer && (
                          <div className="bg-orange-50 rounded-lg p-2 mb-3">
                            <p className="text-xs text-orange-700">🎉 {business.specialOffer}</p>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Contact
                          </Button>
                          <Button size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600">
                            Visit Page
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Floating Create/Sell Button */}
      <div className="fixed bottom-32 right-6 z-40">
        <Button className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          <Plus className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  )
}