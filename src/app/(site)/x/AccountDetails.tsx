'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { globalService } from '@/services/global.service'


interface User {
  id: string
  username: string
  email: string
  role: string
  avatar?: { url: string }
  banner?: { url: string }
}

interface AccountDetailsProps {
  user: User
}

const updateUserProfile = async (formData: FormData) => {
  const userId = formData.get('userId') as string;
  const data = Object.fromEntries(formData.entries());
  delete data.userId;
  return await globalService.user.updateUserProfile(userId, data)
}

export default function AccountDetails({ user }: AccountDetailsProps) {
  const [email, setEmail] = useState(user.email || '')
  const [isNewsletter, setIsNewsletter] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('email', email)
      formData.append('newsletter', isNewsletter.toString())

      // Add avatar file if selected
      if (avatarInputRef.current?.files?.[0]) {
        formData.append('avatar', avatarInputRef.current.files[0])
      }

      // Add banner file if selected
      if (bannerInputRef.current?.files?.[0]) {
        formData.append('banner', bannerInputRef.current.files[0])
      }

      const result = await updateUserProfile(formData)

      if (result?.data) {
        alert('Ayarlar g+-ncellendi!')
        // Clear previews
        setAvatarPreview(null)
        setBannerPreview(null)
      } else {
        alert('Bir hata olu+�tu.')
      }
    } catch (error) {
      alert('Bir hata olu+�tu. L+-tfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="max-w-4xl space-y-12">
      {/* 1. BANNER ALANI */}
      <div className="relative w-full h-48 rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 group">
        <Image
          src={bannerPreview || user.banner?.url || 'public/media/default-avatar.webp'}
          alt="Profile Banner"
          fill
          className="object-cover opacity-50 group-hover:opacity-30 transition-all"
        />
        <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all">
          <span className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl text-[10px] -black uppercase tracking-widest border border-white/20">
            Banner'�- De��i+�tir
          </span>
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleBannerChange}
          />
        </label>
      </div>

      {/* AVATAR ALANI (+�st+-ne Biner +�ekilde) */}
      <div className="relative -mt-16 ml-10 w-32 h-32 group">
        <div className="w-full h-full rounded-[38px] border-8 border-black overflow-hidden bg-zinc-800 shadow-2xl">
          <Image
            src={avatarPreview || user.avatar?.url || '/public/media/default.webp'}
            alt={user.username}
            width={128}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
        <label className="absolute inset-0 flex items-center justify-center cursor-pointer rounded-[38px] bg-black/60 opacity-0 group-hover:opacity-100 transition-all">
          <Camera size={20} className="text-white" />
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      {/* 2. E-MAIL & HABER B+�LTEN�- */}
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] -black text-white/30 uppercase tracking-widest">E-Posta Adresi</label>
          <div className="flex gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-indigo-500 outline-none transition-all"
              placeholder="ornek@email.com"
            />
            <button
              type="button"
              className="px-6 py-4 bg-white/5 rounded-2xl text-[10px] -black uppercase hover:bg-white/10 transition-all text-white/40"
              onClick={() => alert('E-posta de��i+�tirme +�zelli��i yak�-nda eklenecek!')}
            >
              De��i+�tir
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 p-6 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-[24px]">
          <input
            type="checkbox"
            checked={isNewsletter}
            onChange={() => setIsNewsletter(!isNewsletter)}
            className="w-5 h-5 accent-indigo-500"
          />
          <div>
            <p className="text-xs font-bold text-white/80">Haber b+-ltenine abone ol</p>
            <p className="text-[10px] text-white/20 uppercase tracking-tighter mt-1">Yeni g+-ncellemeler ve duyurulardan haberdar olun.</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-indigo-600 rounded-[24px] text-xs -black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(79,70,229,0.2)] hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Kaydediliyor...' : 'De��i+�iklikleri Kaydet'}
        </button>
      </form>
    </div>
  )
}
