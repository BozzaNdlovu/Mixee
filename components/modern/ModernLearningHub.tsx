import { ArrowLeft, BookOpen, GraduationCap, Play, Star, Clock, Users, TrendingUp, Filter, Search, Award, Target } from 'lucide-react'

interface ModernLearningHubProps {
  onBack: () => void
}

export function ModernLearningHub({ onBack }: ModernLearningHubProps) {
  const courses = [
    {
      id: 1,
      title: "React Fundamentals",
      instructor: "Sarah Johnson",
      rating: 4.8,
      students: "2.3k",
      duration: "8 hours",
      level: "Beginner",
      price: "$49",
      originalPrice: "$99",
      image: "⚛️",
      category: "Programming",
      isFeatured: true
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Mike Chen",
      rating: 4.9,
      students: "1.8k",
      duration: "12 hours",
      level: "Intermediate",
      price: "$79",
      originalPrice: "$149",
      image: "🎨",
      category: "Design",
      isFeatured: true
    },
    {
      id: 3,
      title: "Digital Marketing Strategy",
      instructor: "Emma Davis",
      rating: 4.7,
      students: "3.1k",
      duration: "6 hours",
      level: "Beginner",
      price: "$39",
      originalPrice: "$79",
      image: "📈",
      category: "Marketing",
      isFeatured: false
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Alex Rodriguez",
      rating: 4.6,
      students: "4.2k",
      duration: "15 hours",
      level: "Advanced",
      price: "$89",
      originalPrice: "$179",
      image: "🐍",
      category: "Programming",
      isFeatured: false
    }
  ]

  const categories = [
    { name: "Programming", icon: "💻", color: "blue", count: "156" },
    { name: "Design", icon: "🎨", color: "purple", count: "89" },
    { name: "Marketing", icon: "📈", color: "green", count: "67" },
    { name: "Business", icon: "💼", color: "orange", count: "45" },
    { name: "Photography", icon: "📸", color: "red", count: "34" },
    { name: "Music", icon: "🎵", color: "pink", count: "23" }
  ]

  const achievements = [
    {
      id: 1,
      title: "First Course Completed",
      description: "Complete your first course",
      icon: "🎓",
      progress: 100,
      isCompleted: true
    },
    {
      id: 2,
      title: "Learning Streak",
      description: "Learn for 7 days in a row",
      icon: "🔥",
      progress: 85,
      isCompleted: false
    },
    {
      id: 3,
      title: "Course Creator",
      description: "Create your first course",
      icon: "✏️",
      progress: 0,
      isCompleted: false
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
            <h1 className="text-lg font-bold text-gray-900">Learning Hub</h1>
            <p className="text-xs text-gray-600">Expand your skills</p>
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
        {/* Achievements */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Your Achievements
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${achievement.isCompleted ? 'bg-green-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center text-2xl`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${achievement.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {achievement.isCompleted && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Courses */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.filter(course => course.isFeatured).map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex gap-4 p-4">
                  {/* Course Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center text-3xl">
                    {course.image}
                  </div>
                  
                  {/* Course Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        Featured
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{course.rating}</span>
                      </div>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{course.students} students</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                        {course.level}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">{course.price}</span>
                        <span className="text-sm text-gray-500 line-through">{course.originalPrice}</span>
                      </div>
                    </div>
                    
                    <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:scale-105 transition-transform">
                      Enroll Now
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
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
                <div className={`w-12 h-12 ${getColorClasses(category.color)} rounded-lg flex items-center justify-center mb-3 mx-auto text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.count} courses</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Goals */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Learning Goals
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Complete 5 courses this month</span>
              <span className="text-sm text-gray-500">2/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Spend 2 hours learning today</span>
              <span className="text-sm text-gray-500">1.5/2h</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}