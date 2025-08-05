import { useState } from 'react'
import { Search, Filter, Play, BookOpen, Users, Clock, Star, Award, Zap, Calendar, Video, FileText, CheckCircle, Plus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Input } from '../ui/input'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { cn } from '../ui/utils'

interface Course {
  id: string
  title: string
  description: string
  instructor: {
    id: string
    name: string
    avatar: string
    title: string
    rating: number
    studentCount: number
    isVerified: boolean
  }
  thumbnail: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // minutes
  lessonCount: number
  enrolledCount: number
  rating: number
  reviewCount: number
  price: number
  currency: string
  isFree: boolean
  isPopular?: boolean
  isNew?: boolean
  tags: string[]
  skills: string[]
  completionRate?: number
  progress?: number
  lastWatched?: string
}

interface Workshop {
  id: string
  title: string
  description: string
  instructor: {
    name: string
    avatar: string
    title: string
  }
  date: string
  time: string
  duration: number
  location: string
  isOnline: boolean
  price: number
  currency: string
  spotsLeft: number
  maxSpots: number
  category: string
  isBooked?: boolean
}

interface Skill {
  id: string
  name: string
  category: string
  level: number // 0-100
  icon: string
  courseCount: number
}

const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Complete React Native Development',
    description: 'Build iOS and Android apps with React Native from scratch. Learn navigation, state management, and deployment.',
    instructor: {
      id: 'inst1',
      name: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      title: 'Senior Mobile Developer',
      rating: 4.9,
      studentCount: 12500,
      isVerified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=250&fit=crop',
    category: 'Programming',
    level: 'intermediate',
    duration: 1200, // 20 hours
    lessonCount: 45,
    enrolledCount: 8900,
    rating: 4.8,
    reviewCount: 1250,
    price: 899,
    currency: 'ZAR',
    isFree: false,
    isPopular: true,
    tags: ['React Native', 'Mobile Development', 'JavaScript'],
    skills: ['React Native', 'Mobile UI/UX', 'State Management', 'API Integration'],
    progress: 45,
    lastWatched: '2 days ago'
  },
  {
    id: '2',
    title: 'Photography Basics: From Beginner to Pro',
    description: 'Master the fundamentals of photography, composition, lighting, and editing to create stunning images.',
    instructor: {
      id: 'inst2',
      name: 'Sarah Williams',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b671746c?w=100&h=100&fit=crop&crop=face',
      title: 'Professional Photographer',
      rating: 4.9,
      studentCount: 15600,
      isVerified: true
    },
    thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=250&fit=crop',
    category: 'Creative Arts',
    level: 'beginner',
    duration: 480, // 8 hours
    lessonCount: 24,
    enrolledCount: 5400,
    rating: 4.7,
    reviewCount: 890,
    price: 0,
    currency: 'ZAR',
    isFree: true,
    isNew: true,
    tags: ['Photography', 'Composition', 'Lighting'],
    skills: ['Camera Basics', 'Composition', 'Photo Editing', 'Lighting']
  }
]

const mockWorkshops: Workshop[] = [
  {
    id: '1',
    title: 'Digital Marketing Strategy Workshop',
    description: 'Learn how to create effective digital marketing campaigns for small businesses and startups.',
    instructor: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      title: 'Marketing Consultant'
    },
    date: 'Jan 25, 2024',
    time: '18:00 - 20:00',
    duration: 120,
    location: 'Cape Town CBD',
    isOnline: false,
    price: 350,
    currency: 'ZAR',
    spotsLeft: 8,
    maxSpots: 25,
    category: 'Business'
  },
  {
    id: '2',
    title: 'Introduction to AI & Machine Learning',
    description: 'Get hands-on experience with AI tools and understand how machine learning can transform your work.',
    instructor: {
      name: 'Dr. Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      title: 'AI Researcher'
    },
    date: 'Jan 28, 2024',
    time: '10:00 - 13:00',
    duration: 180,
    location: 'Online',
    isOnline: true,
    price: 0,
    currency: 'ZAR',
    spotsLeft: 45,
    maxSpots: 100,
    category: 'Technology'
  }
]

const mockSkills: Skill[] = [
  { id: '1', name: 'React Development', category: 'Programming', level: 75, icon: '⚛️', courseCount: 12 },
  { id: '2', name: 'Photography', category: 'Creative', level: 60, icon: '📸', courseCount: 8 },
  { id: '3', name: 'Digital Marketing', category: 'Business', level: 40, icon: '📈', courseCount: 15 },
  { id: '4', name: 'UI/UX Design', category: 'Design', level: 55, icon: '🎨', courseCount: 10 }
]

const recommendedSkills = [
  { name: 'Data Science', icon: '📊', description: 'High demand skill', growth: '+85%' },
  { name: 'Blockchain', icon: '⛓️', description: 'Emerging technology', growth: '+120%' },
  { name: 'Public Speaking', icon: '🎤', description: 'Career essential', growth: '+45%' }
]

export function ModernLearningHub() {
  const [activeTab, setActiveTab] = useState('courses')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'programming', name: 'Programming', icon: '💻' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'creative', name: 'Creative Arts', icon: '🎨' },
    { id: 'technology', name: 'Technology', icon: '🚀' },
    { id: 'lifestyle', name: 'Lifestyle', icon: '🌱' }
  ]

  const handleEnrollCourse = (courseId: string) => {
    console.log('Enroll in course:', courseId)
  }

  const handleBookWorkshop = (workshopId: string) => {
    console.log('Book workshop:', workshopId)
  }

  const handleContinueLearning = (courseId: string) => {
    console.log('Continue learning:', courseId)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-yellow-50/30">
      {/* Search Header */}
      <div className="p-4 bg-white/80 backdrop-blur-sm border-b">
        <div className="relative mb-4">
          <Input
            placeholder="Search courses, workshops, skills..."
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
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
            <span>120+ courses available</span>
          </div>
          <div className="w-1 h-3 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-purple-500" />
            <span>Get certified</span>
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
                  selectedCategory === category.id && "bg-yellow-500 hover:bg-yellow-600"
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
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2 bg-gray-100">
          <TabsTrigger value="courses" className="rounded-xl">📚 Courses</TabsTrigger>
          <TabsTrigger value="workshops" className="rounded-xl">🏗️ Workshops</TabsTrigger>
          <TabsTrigger value="skills" className="rounded-xl">⚡ My Skills</TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {/* Continue Learning Section */}
              {mockCourses.filter(c => c.progress).length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">Continue Learning</h3>
                    <Badge variant="outline" className="text-xs">
                      <Zap className="w-3 h-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>

                  {mockCourses.filter(c => c.progress).map((course) => (
                    <Card key={course.id} className="overflow-hidden border-0 shadow-md">
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-20 h-14 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex-shrink-0"
                            style={{
                              backgroundImage: `url(${course.thumbnail})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          />
                          
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <span>{course.instructor.name}</span>
                              <div className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span>Last watched {course.lastWatched}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Progress value={course.progress} className="flex-1 h-2" />
                              <span className="text-xs text-gray-600">{course.progress}%</span>
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="bg-yellow-500 hover:bg-yellow-600"
                              onClick={() => handleContinueLearning(course.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Popular Courses */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">All Courses</h3>

                {mockCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      {/* Course Thumbnail */}
                      <div 
                        className="h-32 bg-gradient-to-br from-yellow-100 to-orange-100"
                        style={{
                          backgroundImage: `url(${course.thumbnail})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        
                        <div className="absolute top-3 left-3 flex gap-2">
                          {course.isPopular && (
                            <Badge className="bg-red-500 text-white text-xs">
                              🔥 Popular
                            </Badge>
                          )}
                          {course.isNew && (
                            <Badge className="bg-green-500 text-white text-xs">
                              ✨ New
                            </Badge>
                          )}
                          {course.isFree && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              🆓 Free
                            </Badge>
                          )}
                        </div>
                        
                        <div className="absolute top-3 right-3">
                          <div className="bg-black/50 rounded-full px-2 py-1 text-white text-xs">
                            {Math.floor(course.duration / 60)}h {course.duration % 60}m
                          </div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button
                            variant="ghost"
                            size="lg"
                            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                          >
                            <Play className="w-6 h-6 ml-1" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Price and Level */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {course.isFree ? (
                              <span className="text-lg font-bold text-green-600">Free</span>
                            ) : (
                              <span className="text-lg font-bold text-yellow-600">
                                {course.currency} {course.price}
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {course.level}
                            </Badge>
                          </div>
                        </div>

                        {/* Title and Description */}
                        <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                        {/* Instructor Info */}
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={course.instructor.avatar} />
                            <AvatarFallback>{course.instructor.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-medium">{course.instructor.name}</span>
                              {course.instructor.isVerified && (
                                <Badge variant="outline" className="text-xs px-1 h-4">
                                  ✓
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">{course.instructor.title}</span>
                          </div>
                        </div>

                        {/* Course Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{course.rating}</span>
                            <span>({course.reviewCount})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{course.enrolledCount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{course.lessonCount} lessons</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          className="w-full bg-yellow-500 hover:bg-yellow-600"
                          onClick={() => handleEnrollCourse(course.id)}
                        >
                          {course.isFree ? 'Enroll Free' : 'Enroll Now'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Workshops Tab */}
        <TabsContent value="workshops" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Upcoming Workshops</h3>
                
                {mockWorkshops.map((workshop) => (
                  <Card key={workshop.id} className="p-4 border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-8 h-8 text-purple-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{workshop.title}</h4>
                          <div className="flex items-center gap-2">
                            {workshop.isOnline ? (
                              <Badge className="bg-blue-500 text-white text-xs">
                                <Video className="w-2 h-2 mr-1" />
                                Online
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">
                                📍 In-person
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{workshop.description}</p>

                        {/* Date and Time */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{workshop.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{workshop.time}</span>
                          </div>
                        </div>

                        {/* Price and availability */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">
                            {workshop.spotsLeft} spots left
                          </span>
                          <div className="text-right">
                            {workshop.price === 0 ? (
                              <span className="text-lg font-bold text-green-600">Free</span>
                            ) : (
                              <span className="text-lg font-bold text-purple-600">
                                {workshop.currency} {workshop.price}
                              </span>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-purple-500 hover:bg-purple-600"
                          onClick={() => handleBookWorkshop(workshop.id)}
                          disabled={workshop.spotsLeft === 0}
                        >
                          {workshop.spotsLeft === 0 ? 'Fully Booked' : 'Book Now'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="flex-1 mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4 pb-32">
              {/* Skill Progress Overview */}
              <Card className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Your Learning Journey</h3>
                    <p className="text-sm text-gray-600">4 skills in progress • 12 certificates earned</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">87%</div>
                    <div className="text-xs text-gray-600">Average Progress</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">240h</div>
                    <div className="text-xs text-gray-600">Time Invested</div>
                  </div>
                </div>
              </Card>

              {/* Skills List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">My Skills</h3>
                
                {mockSkills.map((skill) => (
                  <Card key={skill.id} className="p-4 border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center text-2xl">
                        {skill.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Progress value={skill.level} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-gray-700">{skill.level}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{skill.courseCount} courses available</span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Plus className="w-3 h-3 mr-1" />
                            Improve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Skill Recommendations */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Recommended Skills</h3>
                
                {recommendedSkills.map((skill) => (
                  <Card key={skill.name} className="p-3 border-0 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-lg">
                        {skill.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{skill.name}</h4>
                          <Badge className="bg-green-500 text-white text-xs">
                            {skill.growth}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">{skill.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        Explore
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Floating Create Button */}
      <div className="fixed bottom-32 right-6 z-40">
        <Button className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300">
          <Plus className="w-5 h-5 text-white" />
        </Button>
      </div>
    </div>
  )
}