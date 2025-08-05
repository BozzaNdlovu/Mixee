import { useState } from 'react'
import { ArrowRight, Check, Sparkles, Users, MessageCircle, ShoppingBag, GraduationCap, MapPin, Shield } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { cn } from '../ui/utils'

interface OnboardingWelcomeProps {
  user: {
    displayName: string
    location?: string
  }
  onComplete: () => void
}

export function OnboardingWelcome({ user, onComplete }: OnboardingWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: `Welcome to SupaApp, ${user.displayName.split(' ')[0]}! 🎉`,
      description: "You've joined the next-generation social platform that combines the best of messaging, communities, marketplace, and learning.",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      features: []
    },
    {
      title: "Real-Time Everything 🚀",
      description: "Experience lightning-fast messaging, live community updates, and instant notifications with our real-time platform.",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-600",
      features: [
        "Instant messaging with read receipts",
        "Live community discussions",
        "Real-time notifications",
        "End-to-end encryption for all chats"
      ]
    },
    {
      title: "Discover Your Community 👥",
      description: "Join communities based on your interests and location. Connect with like-minded people near you.",
      icon: Users,
      color: "from-green-500 to-emerald-600",
      features: [
        "Location-based community discovery",
        "Interest-based groups",
        "Local events and meetups",
        "Expert-led discussions"
      ]
    },
    {
      title: "Marketplace & Learning 🛍️",
      description: "Buy and sell locally, or learn new skills with our integrated marketplace and learning platform.",
      icon: ShoppingBag,
      color: "from-orange-500 to-red-600",
      features: [
        "Local marketplace for buying/selling",
        "Course marketplace with expert instructors",
        "Secure payment processing",
        "Skill verification and certificates"
      ]
    },
    {
      title: "Your Privacy Matters 🔒",
      description: "All your conversations are protected with end-to-end encryption. Your data stays private and secure.",
      icon: Shield,
      color: "from-indigo-500 to-purple-600",
      features: [
        "End-to-end encrypted messaging",
        "No data tracking or selling",
        "Local data processing",
        "GDPR compliant privacy controls"
      ]
    }
  ]

  const currentStepData = steps[currentStep]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const skipToEnd = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-pink-300/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-br from-blue-300/20 to-cyan-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-yellow-300/20 to-orange-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-600">Getting Started</h2>
            <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
          </div>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "flex-1 h-2 rounded-full transition-all duration-300",
                  index <= currentStep 
                    ? "bg-gradient-to-r from-purple-500 to-pink-600" 
                    : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <Card className="p-8 bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
          {/* Step Icon */}
          <div className="text-center mb-6">
            <div className={cn(
              "inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-2xl mb-4 bg-gradient-to-br",
              currentStepData.color
            )}>
              <currentStepData.icon className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {currentStepData.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Features List */}
          {currentStepData.features.length > 0 && (
            <div className="mb-8">
              <div className="space-y-3">
                {currentStepData.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Badge */}
          {user.location && currentStep === 0 && (
            <div className="flex items-center justify-center mb-6">
              <Badge variant="secondary" className="px-3 py-1">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </Badge>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={skipToEnd}
              className="flex-1"
            >
              Skip Tour
            </Button>
            
            <Button
              onClick={nextStep}
              className={cn(
                "flex-1 text-white shadow-lg bg-gradient-to-r transition-all duration-200",
                currentStepData.color
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </div>

          {/* Skip Indicator */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              You can access this tour anytime from your profile settings
            </p>
          </div>
        </Card>

        {/* Live Platform Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 border border-green-200 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Live Real-Time Platform</span>
          </div>
        </div>
      </div>
    </div>
  )
}