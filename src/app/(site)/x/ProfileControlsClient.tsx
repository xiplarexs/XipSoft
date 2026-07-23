'use client'

import Link from 'next/link'
import type { PublicUser } from '@/types/public'

interface ProfileControlsClientProps {
  user: PublicUser
  isOwner?: boolean
  hideControls?: boolean
}

export default function ProfileControlsClient({ user, isOwner = false, hideControls = false }: ProfileControlsClientProps) {
  if (hideControls) {
    return null
  }

  if (!isOwner) {
    return (
      <div className="p-6">
        <h4 className="text-sm opacity-40 mb-4 uppercase tracking-widest">Kullanıcı Bilgileri</h4>
        <p className="text-xs text-white/60">Bu kullanıcının profil bilgileri burada görülebilir.</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h4 className="text-sm opacity-40 mb-4 uppercase tracking-widest">Kontrol Paneli</h4>
      <p className="text-xs text-white/60 mb-4">Profil ve hesap ayarlarınızı kontrol panelinden yönetebilirsiniz.</p>
      <Link
        href="/x/settings"
        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600/80 hover:bg-blue-600 text-white -black rounded-xl transition-colors text-xs uppercase tracking-widest"
      >
        Ayarlara git
      </Link>
    </div>
  )
}
