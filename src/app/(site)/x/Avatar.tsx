import React from 'react'
import type { PublicUser, PublicMedia } from '@/types/public'

export const Avatar = ({ user, className = "w-32 h-32" }: { user: PublicUser, className?: string }) => {
  // Avatar URL'sini belirle: string ise do��rudan kullan, object ise PublicMedia olarak m+-h+-rle
  const avatarUrl = typeof user?.avatar === 'string'
    ? user.avatar
    : (user?.avatar as PublicMedia)?.sizes?.avatar?.url || (user?.avatar as PublicMedia)?.url

  return (
    <div className={`relative ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={user?.username}
          className="w-full h-full rounded-full object-cover border-4 border-[var(--xip-accent)] shadow-lg"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-4 border-white/10">
          <span className="text-4xl font-bold uppercase text-white/50">
            {user?.username?.charAt(0) || '?'}
          </span>
        </div>
      )}
    </div>
  )
}
