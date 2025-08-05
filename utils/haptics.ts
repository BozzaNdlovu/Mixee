// Haptic feedback utility for mobile devices
export class HapticFeedback {
  private static isSupported = () => {
    return typeof navigator !== 'undefined' && 'vibrate' in navigator
  }

  private static isIOS = () => {
    return typeof window !== 'undefined' && 
           /iPad|iPhone|iPod/.test(navigator.userAgent)
  }

  // Light impact feedback (like button tap)
  static light() {
    if (this.isSupported()) {
      navigator.vibrate(10)
    }
  }

  // Medium impact feedback (like switch toggle)
  static medium() {
    if (this.isSupported()) {
      navigator.vibrate(20)
    }
  }

  // Heavy impact feedback (like error or important action)
  static heavy() {
    if (this.isSupported()) {
      navigator.vibrate(40)
    }
  }

  // Success feedback pattern
  static success() {
    if (this.isSupported()) {
      navigator.vibrate([20, 50, 20])
    }
  }

  // Error feedback pattern
  static error() {
    if (this.isSupported()) {
      navigator.vibrate([50, 100, 50, 100, 50])
    }
  }

  // Warning feedback pattern
  static warning() {
    if (this.isSupported()) {
      navigator.vibrate([30, 50, 30])
    }
  }

  // Notification feedback
  static notification() {
    if (this.isSupported()) {
      navigator.vibrate([10, 30, 10, 30])
    }
  }

  // Selection feedback (like scrolling through options)
  static selection() {
    if (this.isSupported()) {
      navigator.vibrate(8)
    }
  }

  // Long press feedback
  static longPress() {
    if (this.isSupported()) {
      navigator.vibrate(60)
    }
  }

  // Message sent feedback
  static messageSent() {
    if (this.isSupported()) {
      navigator.vibrate([15, 25, 15])
    }
  }

  // Message received feedback
  static messageReceived() {
    if (this.isSupported()) {
      navigator.vibrate([10, 20])
    }
  }

  // Voice recording start/stop
  static voiceRecording(isStart: boolean) {
    if (this.isSupported()) {
      if (isStart) {
        navigator.vibrate([30, 20, 30])
      } else {
        navigator.vibrate([20, 30, 20])
      }
    }
  }

  // Pull to refresh feedback
  static pullToRefresh() {
    if (this.isSupported()) {
      navigator.vibrate([5, 10, 5])
    }
  }

  // Swipe action feedback
  static swipeAction() {
    if (this.isSupported()) {
      navigator.vibrate(15)
    }
  }

  // Connection established
  static connected() {
    if (this.isSupported()) {
      navigator.vibrate([10, 50, 10])
    }
  }

  // Connection lost
  static disconnected() {
    if (this.isSupported()) {
      navigator.vibrate([50, 50, 50])
    }
  }
}