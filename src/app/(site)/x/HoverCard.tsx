'use client'

import * as React from 'react'
import { User, MessageCircle, Settings, Shield, Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface UserProfile {
  id: string
  username: string
  email: string
  avatar?: string
  rank?: string
  joinDate: Date
  lastSeen: Date
  isOnline: boolean
}

interface HoverCardProps {
  user: UserProfile
  isVisible: boolean
  position?: { top: number; left: number }
}

export function HoverCard({ user, isVisible, position }: HoverCardProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed z-50 w-64 bg-black/20 backdrop-blur-lg border border-white/10 rounded-[20px] shadow-2xl overflow-hidden"
          style={{
            top: position?.top || 'auto',
            left: position?.left || 'auto',
            transform: 'translate(-50%, -100%)'
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={user.avatar || '/api/placeholder/40/40'}
                  alt={user.username}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
                {user.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="-bold text-[var(--xip-text)] truncate">
                    {user.username}
                  </h3>
                  {user.rank && (
                    <span className="text-xs bg-[var(--xip-accent)]/20 text-[var(--xip-accent)] px-2 py-0.5 rounded-full font-bold">
                      {user.rank}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--xip-text)]/60 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-4 border-b border-white/10">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-[var(--xip-text)]/60">+�yelik Tarihi</div>
              <div className="text-right text-[var(--xip-text)]">
                {user.joinDate.toLocaleDateString('tr-TR')}
              </div>
              <div className="text-[var(--xip-text)]/60">Son g+�r+-lme</div>
              <div className="text-right text-[var(--xip-text)]">
                {user.lastSeen.toLocaleDateString('tr-TR')}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4">
            <div className="flex gap-2">
              <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs transition-colors">
                <MessageCircle size={14} />
                Mesaj
              </button>
              <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs transition-colors">
                <User size={14} />
                Profil
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
