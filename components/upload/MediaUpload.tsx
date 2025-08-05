import { useState, useRef } from 'react'
import { Upload, Camera, Video, Image as ImageIcon, X, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { cn } from '../ui/utils'

interface MediaUploadProps {
  onUploadSuccess: (fileUrl: string, fileType: 'image' | 'video') => void
  onCancel: () => void
  acceptedTypes?: string[]
  maxSizeMB?: number
  title?: string
  uploadType?: 'avatar' | 'media' | 'video' | 'document'
}

export function MediaUpload({ 
  onUploadSuccess, 
  onCancel, 
  acceptedTypes = ['image/*', 'video/*'],
  maxSizeMB = 100,
  title = 'Upload Media',
  uploadType = 'media'
}: MediaUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File size must be less than ${maxSizeMB}MB`)
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const uploadFile = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get user's access token from auth session
      const { auth } = await import('../../utils/supabase/client')
      const { projectId } = await import('../../utils/supabase/info')
      
      const { data: sessionData, error: sessionError } = await auth.getSession()
      if (sessionError || !sessionData.session?.access_token) {
        throw new Error('Authentication required for uploads')
      }
      
      // Map upload type to bucket name
      const bucketMap = {
        avatar: 'make-0e8b25fb-avatars',
        media: 'make-0e8b25fb-media',
        video: 'make-0e8b25fb-videos',
        document: 'make-0e8b25fb-documents'
      }
      
      const bucket = bucketMap[uploadType] || 'make-0e8b25fb-media'
      
      console.log(`🔧 Starting upload to bucket: ${bucket}`)
      
      const uploadUrlResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0e8b25fb/upload-url`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`
          },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            bucket: bucket
          })
        }
      )

      if (!uploadUrlResponse.ok) {
        const errorText = await uploadUrlResponse.text()
        console.error('❌ Upload URL request failed:', uploadUrlResponse.status, errorText)
        throw new Error(`Failed to get upload URL: ${errorText}`)
      }

      const uploadUrlData = await uploadUrlResponse.json()
      console.log('✅ Got upload URL data:', uploadUrlData)
      
      const { uploadUrl, filePath, bucket: responseBucket } = uploadUrlData

      if (!uploadUrl) {
        throw new Error('No upload URL received from server')
      }

      console.log(`📤 Uploading file to: ${uploadUrl}`)
      
      // Upload file to Supabase Storage
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type
        }
      })

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text()
        console.error('❌ File upload failed:', uploadResponse.status, errorText)
        throw new Error(`Failed to upload file: ${errorText}`)
      }

      console.log('✅ File uploaded successfully')

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // Complete upload
      setUploadProgress(100)
      
      const fileType = selectedFile.type.startsWith('image/') ? 'image' : 'video'
      const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${responseBucket}/${filePath}`
      
      onUploadSuccess(publicUrl, fileType)

    } catch (error) {
      console.error('❌ Upload error:', error)
      let errorMessage = 'Failed to upload file. Please try again.'
      
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      alert(`Upload failed: ${errorMessage}`)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {!selectedFile ? (
          <div
            onDragEnter={handleDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-blue-500" />
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Drop your file here</h4>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-2"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                
                <p className="text-xs text-gray-400">
                  Supports images and videos up to {maxSizeMB}MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Preview */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100">
              {selectedFile.type.startsWith('image/') ? (
                <img
                  src={previewUrl!}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={previewUrl!}
                  className="w-full h-48 object-cover"
                  controls
                />
              )}
              
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUpload}
                  className="w-8 h-8 p-0 bg-black/20 hover:bg-black/40 text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* File Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {selectedFile.type.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                ) : (
                  <Video className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={resetUpload}
                disabled={isUploading}
                className="flex-1"
              >
                Change File
              </Button>
              <Button
                onClick={uploadFile}
                disabled={isUploading}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Upload
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </Card>
    </div>
  )
}