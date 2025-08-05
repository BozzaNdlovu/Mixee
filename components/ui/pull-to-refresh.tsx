import { useState, useRef, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from './utils'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  refreshThreshold?: number
  className?: string
}

export function PullToRefresh({ 
  onRefresh, 
  children, 
  refreshThreshold = 80,
  className 
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const startY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop !== 0) return
    startY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop !== 0) return
    if (isRefreshing) return

    const currentY = e.touches[0].clientY
    const distance = Math.max(0, currentY - startY.current)
    
    if (distance > 0) {
      e.preventDefault()
      const adjustedDistance = Math.min(distance * 0.5, refreshThreshold * 1.5)
      setPullDistance(adjustedDistance)
      setCanRefresh(adjustedDistance >= refreshThreshold)
    }
  }

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error('Error refreshing:', error)
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        setCanRefresh(false)
      }
    } else {
      setPullDistance(0)
      setCanRefresh(false)
    }
  }

  useEffect(() => {
    if (!isRefreshing && pullDistance > 0) {
      const timer = setTimeout(() => {
        setPullDistance(0)
        setCanRefresh(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isRefreshing, pullDistance])

  const getRefreshText = () => {
    if (isRefreshing) return 'Refreshing...'
    if (canRefresh) return 'Release to refresh'
    return 'Pull to refresh'
  }

  const getRotation = () => {
    if (isRefreshing) return 'animate-spin'
    return pullDistance > 0 ? `rotate-${Math.min(180, (pullDistance / refreshThreshold) * 180)}` : ''
  }

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance, refreshThreshold)}px)` : undefined,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-transparent z-10"
          style={{ 
            height: Math.max(refreshThreshold, pullDistance),
            transform: `translateY(-${refreshThreshold}px)`
          }}
        >
          <div className={cn(
            "flex flex-col items-center gap-2 transition-all duration-200",
            canRefresh ? "scale-110" : "scale-100"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              canRefresh ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600"
            )}>
              <RefreshCw className={cn("w-4 h-4 transition-transform duration-200", getRotation())} />
            </div>
            <span className={cn(
              "text-xs font-medium transition-colors duration-200",
              canRefresh ? "text-blue-600" : "text-gray-500"
            )}>
              {getRefreshText()}
            </span>
          </div>
        </div>
      )}
      
      {children}
    </div>
  )
}