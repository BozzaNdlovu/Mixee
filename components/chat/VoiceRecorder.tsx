import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, Pause, Send, Trash2, Volume2 } from 'lucide-react'
import { Button } from '../ui/button'
import { HapticFeedback } from '../../utils/haptics'
import { cn } from '../ui/utils'

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void
  onCancel: () => void
  isVisible: boolean
}

export function VoiceRecorder({ onSend, onCancel, isVisible }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [amplitude, setAmplitude] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const analyzerRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (isVisible && !isRecording) {
      startRecording()
    }
    return () => {
      stopTimer()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      })
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext()
      const source = audioContext.createMediaStreamSource(stream)
      const analyzer = audioContext.createAnalyser()
      analyzer.fftSize = 256
      source.connect(analyzer)
      
      analyzerRef.current = analyzer
      dataArrayRef.current = new Uint8Array(analyzer.frequencyBinCount)
      
      startAmplitudeAnimation()
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
        audioContext.close()
      }
      
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      startTimer()
      
    } catch (error) {
      console.error('Error starting recording:', error)
      onCancel()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      stopTimer()
      
      HapticFeedback.voiceRecording(false)
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume()
        startTimer()
      } else {
        mediaRecorderRef.current.pause()
        stopTimer()
      }
      setIsPaused(!isPaused)
    }
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
  }

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startAmplitudeAnimation = () => {
    const updateAmplitude = () => {
      if (analyzerRef.current && dataArrayRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArrayRef.current)
        const average = dataArrayRef.current.reduce((sum, value) => sum + value, 0) / dataArrayRef.current.length
        setAmplitude(average / 255) // Normalize to 0-1
      }
      
      if (isRecording && !isPaused) {
        animationRef.current = requestAnimationFrame(updateAmplitude)
      }
    }
    updateAmplitude()
  }

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      HapticFeedback.light()
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleSend = () => {
    if (audioBlob && duration > 0) {
      HapticFeedback.success()
      onSend(audioBlob, duration)
      resetRecorder()
    }
  }

  const handleCancel = () => {
    resetRecorder()
    onCancel()
  }

  const resetRecorder = () => {
    stopRecording()
    setAudioBlob(null)
    setAudioUrl(null)
    setDuration(0)
    setRecordingTime(0)
    setAmplitude(0)
    setIsPlaying(false)
    
    if (audioRef.current) {
      audioRef.current.src = ''
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getWaveformBars = () => {
    const bars = []
    const barCount = 20
    const baseHeight = 4
    
    for (let i = 0; i < barCount; i++) {
      const height = baseHeight + (amplitude * 20 * Math.random())
      bars.push(
        <div
          key={i}
          className={cn(
            "bg-current rounded-full transition-all duration-100",
            isRecording && !isPaused ? "animate-pulse" : ""
          )}
          style={{
            width: '2px',
            height: `${height}px`,
            marginRight: '2px'
          }}
        />
      )
    }
    return bars
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {isRecording ? 'Recording...' : audioBlob ? 'Voice Message' : 'Record Voice Message'}
          </h3>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            <Trash2 className="w-4 h-4 text-gray-500" />
          </Button>
        </div>

        {/* Recording Status */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex flex-col items-center gap-4">
            {/* Record Button / Status */}
            <div className="relative">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg",
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 text-white scale-110"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                )}
              >
                {isRecording ? (
                  <div className="w-6 h-6 bg-white rounded-sm" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </button>
              
              {/* Recording pulse ring */}
              {isRecording && !isPaused && (
                <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping opacity-30" />
              )}
            </div>

            {/* Timer */}
            <div className="text-2xl font-mono font-semibold text-gray-800">
              {formatTime(recordingTime)}
            </div>

            {/* Waveform Visualization */}
            {isRecording && (
              <div className="flex items-center justify-center h-8 text-blue-500">
                {getWaveformBars()}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {isRecording && (
            <Button
              variant="outline"
              size="lg"
              onClick={pauseRecording}
              className="rounded-full"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
          )}
          
          {audioBlob && !isRecording && (
            <Button
              variant="outline"
              size="lg"
              onClick={playRecording}
              className="rounded-full"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
          )}
        </div>

        {/* Audio Player (hidden) */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => {
              if (audioRef.current) {
                setDuration(Math.floor(audioRef.current.duration))
              }
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          
          {audioBlob && (
            <Button
              onClick={handleSend}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Voice Message
            </Button>
          )}
        </div>

        {/* Recording Tips */}
        {isRecording && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {isPaused ? 'Recording paused - tap to resume' : 'Tap pause to stop, or tap stop to finish'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}