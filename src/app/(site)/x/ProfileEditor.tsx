'use client'

import { useState, useRef } from 'react'
import { User, ImageIcon } from 'lucide-react'
import type { User as UserType } from './types'
import { globalService } from '@/services/global.service'

export default function ProfileEditor({ user }: { user: UserType }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    website: user.website || '',
    location: user.location || '',
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const backgroundInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Sadece resim dosyaları yüklenebilir')
        return
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Avatar dosyası maksimum 5MB olabilir')
        return
      }
      setAvatarFile(file)
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Sadece resim dosyaları yüklenebilir')
        return
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Arka plan dosyası maksimum 10MB olabilir')
        return
      }
      setBackgroundFile(file)
    }
  }

  const convertToWebp = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        // Resize if needed
        const maxSize = file.name.includes('avatar') ? 512 : 1920
        let width = img.width
        let height = img.height
        
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height * maxSize) / width
            width = maxSize
          } else {
            width = (width * maxSize) / height
            height = maxSize
          }
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const webpFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp'
            })
            resolve(webpFile)
          } else {
            resolve(file)
          }
        }, 'image/webp', 0.9)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const uploadFile = async (file: File, type: 'avatar' | 'background'): Promise<string | null> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type === 'background' ? 'cover' : 'avatar')
      
      const { uploadAvatarAction } = await import('@/app/_actions/upload-actions')
      const result = await uploadAvatarAction(formData)
      if (!result.success) throw new Error(result.error)
      return result.url || null
    } catch (error) {
      console.error('Upload error:', error)
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      let avatarUrl = user.photo_url
      let backgroundUrl = user.background_url
      
      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await uploadFile(avatarFile, 'avatar')
        if (!avatarUrl) {
          alert('Avatar yüklenemedi')
          setUploading(false)
          return
        }
      }
      
      // Upload background if changed
      if (backgroundFile) {
        backgroundUrl = await uploadFile(backgroundFile, 'background')
        if (!backgroundUrl) {
          alert('Arka plan yüklenemedi')
          setUploading(false)
          return
        }
      }
      
      // Update profile with new data
      await globalService.user.updateUserProfile(user.id, {
        ...formData,
        photo_url: avatarUrl,
        background_url: backgroundUrl
      })
      
      alert('Profil basarıyla güncellendi')
      // Reload page to show new images
      window.location.reload()
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Profil güncellenemedi')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar and Background Upload */}
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Avatar
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {avatarFile ? (
                <img 
                  src={URL.createObjectURL(avatarFile)} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              ) : user.photo_url ? (
                <img 
                  src={user.photo_url} 
                  alt="Current avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                disabled={uploading}
              >
                {avatarFile ? 'Degistir' : 'Avatar Yükle'}
              </button>
              <p className="text-xs text-gray-500 mt-1">WebP formatı, max 5MB</p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Arka Plan
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {backgroundFile ? (
                <img 
                  src={URL.createObjectURL(backgroundFile)} 
                  alt="Background preview" 
                  className="w-full h-full object-cover"
                />
              ) : user.background_url ? (
                <img 
                  src={user.background_url} 
                  alt="Current background" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/*"
                onChange={handleBackgroundChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => backgroundInputRef.current?.click()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                disabled={uploading}
              >
                {backgroundFile ? 'Degistir' : 'Arka Plan Yükle'}
              </button>
              <p className="text-xs text-gray-500 mt-1">WebP formatı, max 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Username
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Bio
          </label>
          <div className="mt-1">
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="Tell us about yourself..."
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            A brief description of yourself shown on your profile.
          </p>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Website
          </label>
          <div className="mt-1">
            <input
              type="url"
              name="website"
              id="website"
              value={formData.website}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Location
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="location"
              id="location"
              value={formData.location}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              placeholder="City, Country"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Yükleniyor...' : 'Degisiklikleri Kaydet'}
        </button>
      </div>
    </form>
  )
}
