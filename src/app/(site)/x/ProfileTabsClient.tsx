'use client'

import React from 'react'
import { Check } from 'lucide-react'

type TabKey = 'overview' | 'trade' | 'premium' | 'wall' | 'friends' | 'penalties' | 'history'

type ProfileData = {
  display_name?: string
  bio?: string
  website?: string
  job?: string
  branch?: string
  location?: string
  signature?: string
  role?: string
  reputation?: number
  message_count?: number
}

export default function ProfileTabsClient({ profile }: { profile?: ProfileData }) {
  const [tab, setTab] = React.useState<TabKey>('overview')

  const tabClass = (key: TabKey) => {
    const base = 'text-left px-4 py-3 rounded-2xl text-[10px] -black uppercase tracking-widest transition-all border'
    if (tab === key) return `${base} bg-white/10 text-white border-white/10`
    return `${base} bg-white/0 text-white/40 hover:bg-white/5 border-white/10`
  }

  const stats = [
    { label: 'Puan', value: profile?.reputation ?? 0 },
    { label: 'Mesajlar', value: profile?.message_count ?? 0 },
    { label: 'Rol', value: profile?.role ? profile.role.toUpperCase() : 'uye' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={tabClass('overview')} onClick={() => setTab('overview')}>genel</button>
        <button type="button" className={tabClass('trade')} onClick={() => setTab('trade')}>Ticaret</button>
        <button type="button" className={tabClass('premium')} onClick={() => setTab('premium')}>Premium</button>
        <button type="button" className={tabClass('wall')} onClick={() => setTab('wall')}>Duvar</button>
        <button type="button" className={tabClass('friends')} onClick={() => setTab('friends')}>Arkada�lar</button>
        <button type="button" className={tabClass('penalties')} onClick={() => setTab('penalties')}>Cezalar</button>
        <button type="button" className={tabClass('history')} onClick={() => setTab('history')}>ge�mi�</button>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6">
                <div className="text-[10px] -black uppercase tracking-widest text-white/40">{item.label}</div>
                <div className="text-3xl -black text-white mt-2">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-6 space-y-4">
            <div>
              <div className="text-[10px] -black uppercase tracking-widest text-white/40">Profil</div>
              <div className="text-white text-lg font-semibold mt-2">{profile?.display_name || 'Profil bilgileri duzenlenmemi�'}</div>
            </div>

            {profile?.bio && (
              <div>
                <div className="text-[10px] -black uppercase tracking-widest text-white/40">Hakk�nda</div>
                <p className="text-white/80 mt-2">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile?.website && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Web Sitesi</div>
                  <div className="text-white mt-2 truncate"><a className="text-primary hover:underline" href={profile.website} target="_blank" rel="noreferrer">{profile.website}</a></div>
                </div>
              )}
              {profile?.job && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Meslek</div>
                  <div className="text-white mt-2">{profile.job}</div>
                </div>
              )}
              {profile?.branch && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/40">B�lum</div>
                  <div className="text-white mt-2">{profile.branch}</div>
                </div>
              )}
              {profile?.location && (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-[10px] uppercase tracking-widest text-white/40">Konum</div>
                  <div className="text-white mt-2">{profile.location}</div>
                </div>
              )}
            </div>

            {profile?.signature && (
              <div className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-widest text-white/40">Imza</div>
                <div className="text-white mt-2">{profile.signature}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'premium' && (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl -black text-white mb-2">Premium uyelik Paketleri</h3>
            <p className="text-white/40 text-sm">�zel �zelliklerin kilidini a��n</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-primary/30 bg-white/[0.03] backdrop-blur-md p-6 hover:border-primary/50 transition-all">
              <div className="text-primary -black uppercase tracking-widest text-[10px] mb-2">Bronze</div>
              <div className="text-3xl -black text-white mb-4">?29.99<span className="text-sm text-white/40 -normal">/ay</span></div>
              <ul className="space-y-2 text-sm text-white/70 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-primary"/> Reklams�z Deneyim</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-primary"/> �zel Badge</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-primary"/> 5 Ekstra Mesaj</li>
              </ul>
              <button className="w-full btn btn-primary btn-sm">Sat�n Al</button>
            </div>

            <div className="rounded-3xl border border-secondary/30 bg-white/[0.03] backdrop-blur-md p-6 hover:border-secondary/50 transition-all">
              <div className="text-secondary -black uppercase tracking-widest text-[10px] mb-2">Silver</div>
              <div className="text-3xl -black text-white mb-4">?49.99<span className="text-sm text-white/40 -normal">/ay</span></div>
              <ul className="space-y-2 text-sm text-white/70 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-secondary"/> Tum Bronze �zellikler</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-secondary"/> �ne ��kan Profil</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-secondary"/> 20 Ekstra Mesaj</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-secondary"/> �zel Destek</li>
              </ul>
              <button className="w-full btn btn-secondary btn-sm">Sat�n Al</button>
            </div>

            <div className="rounded-3xl border border-accent/30 bg-white/[0.03] backdrop-blur-md p-6 hover:border-accent/50 transition-all">
              <div className="text-accent -black uppercase tracking-widest text-[10px] mb-2">gold</div>
              <div className="text-3xl -black text-white mb-4">?99.99<span className="text-sm text-white/40 -normal">/ay</span></div>
              <ul className="space-y-2 text-sm text-white/70 mb-6">
                <li className="flex items-center gap-2"><Check size={14} className="text-accent"/> Tum Silver �zellikler</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-accent"/> S�n�rs�z Mesaj</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-accent"/> VIP Badge</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-accent"/> �ncelikli Destek</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-accent"/> �zel Etkinlikler</li>
              </ul>
              <button className="w-full btn btn-accent btn-sm">Sat�n Al</button>
            </div>
          </div>
        </div>
      )}

      {tab !== 'overview' && tab !== 'premium' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-10">
          <div className="text-[10px] -black uppercase tracking-widest text-white/40 mb-3">{tab}</div>
          <div className="text-white/50">Bu b�lum yak�nda eklenecek.</div>
        </div>
      )}
    </div>
  )
}
