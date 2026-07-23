'use client'

import { useState, Suspense, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Lock, Phone, MapPin, Calendar } from 'lucide-react'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

type Mode = 'login' | 'register'

function RegisterPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>(() =>
    searchParams.get('tab') === 'register' ? 'register' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const turnstileRef = useRef<TurnstileInstance>(null)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

  // Debug: Site key yüklendi mi kontrol et
  if (typeof window !== 'undefined') {
    console.log('[Turnstile] Site Key:', siteKey ? '✅ Yüklendi' : '❌ Yüklenmedi')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Turnstile site key varsa her iki modda da dogrulama zorunlu
    if (siteKey && !turnstileToken) {
      return setError('Lütfen robot dogrulamasını tamamlayın')
    }

    if (mode === 'register') {
      if (!displayName || !email || !password || !confirmPassword) return setError('Tüm zorunlu alanları doldurun')
      if (password !== confirmPassword) return setError('sifreler eslesmiyor')
      // Password policy: en az 12 karakter, özel karakter
      if (password.length < 12) return setError('sifre en az 12 karakter olmalıdır')
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return setError('sifre en az bir özel karakter içermelidir (!@#$%^&*() etc.)')
    } else {
      if (!email || !password) return setError('E-posta ve sifre gerekli')
    }

    setLoading(true)
    try {
      if (mode === 'register') {
        await signUp(email, displayName, password, turnstileToken || undefined, {
          birth_date: birthDate || undefined,
          city: city || undefined,
          phone: phone || undefined,
        })
      } else {
        await signIn(email, password, turnstileToken || undefined)
      }
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
      // Hata durumunda Turnstile'ı sıfırla
      turnstileRef.current?.reset()
      setTurnstileToken(null)
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setError(null)
    setEmail('')
    setPassword('')
    setDisplayName('')
    setConfirmPassword('')
    setBirthDate('')
    setCity('')
    setPhone('')
    turnstileRef.current?.reset()
    setTurnstileToken(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02]">
          {(['login', 'register'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-3 text-xs -mono uppercase tracking-widest transition-colors ${
                mode === m ? 'bg-white/[0.06] text-prism-violet' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m === 'login' ? 'giris Yap' : 'Kayıt Ol'}
            </button>
          ))}
        </div>

        {/* Hata mesajı */}
        {error && !loading && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-zinc-600 -mono">giris yap veya kayıt ol</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          {mode === 'register' && (
            <Field icon={<User size={15} />} type="text" placeholder="Kullanıcı adı *" value={displayName} onChange={setDisplayName} disabled={loading} />
          )}
          <Field icon={<Mail size={15} />} type="email" placeholder="E-posta *" value={email} onChange={setEmail} disabled={loading} />
          <Field icon={<Lock size={15} />} type="password" placeholder="sifre *" value={password} onChange={setPassword} disabled={loading} />
          {mode === 'register' && (
            <>
              <Field icon={<Lock size={15} />} type="password" placeholder="sifre tekrar *" value={confirmPassword} onChange={setConfirmPassword} disabled={loading} />
              <div className="pt-1 pb-0.5">
                <p className="text-[10px] text-zinc-600 -mono uppercase tracking-widest mb-2">Ek Bilgiler (opsiyonel)</p>
              </div>
              <Field icon={<Calendar size={15} />} type="date" placeholder="Dogum tarihi" value={birthDate} onChange={setBirthDate} disabled={loading} />
              <Field icon={<MapPin size={15} />} type="text" placeholder="sehir" value={city} onChange={setCity} disabled={loading} />
              <Field icon={<Phone size={15} />} type="tel" placeholder="Telefon numarası" value={phone} onChange={setPhone} disabled={loading} />
            </>
          )}

          {mode === 'login' && (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => router.push('/reset-password')}
                className="text-xs text-prism-violet hover:text-prism-violet/80 transition-colors"
              >
                sifremi Unuttum
              </button>
            </div>
          )}

          {/* sifre kuralları — sadece register modunda göster */}
          {mode === 'register' && (
            <div className="px-1 py-1">
              <p className="text-[10px] text-zinc-600 leading-relaxed">
                sifre: en az 8 karakter, büyük harf, küçük harf, rakam ve özel karakter (<span className="text-zinc-500">!@#$%</span>) içermelidir.
              </p>
            </div>
          )}

          {/* Cloudflare Turnstile — sadece site key varsa göster, her iki modda da */}
          {siteKey && (
            <div className="flex justify-center pt-1">
              <Turnstile
                ref={turnstileRef}
                siteKey={siteKey}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                onError={() => setTurnstileToken(null)}
                options={{
                  theme: 'dark',
                  language: 'tr',
                  appearance: 'always',
                  size: 'normal',
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white bg-prism-violet/20 border border-prism-violet/30 hover:bg-prism-violet/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Yükleniyor...' : mode === 'login' ? 'giris Yap' : 'Kayıt Ol'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterPageInner />
    </Suspense>
  )
}

function Field({
  icon, type, placeholder, value, onChange, disabled,
}: {
  icon: React.ReactNode
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  // placeholder'dan benzersiz id üret (boslukları ve * karakterlerini temizle)
  const fieldId = `field-${placeholder.replace(/[\s*]/g, '-').toLowerCase()}`
  return (
    <div className="relative">
      <label htmlFor={fieldId} className="sr-only">{placeholder.replace(' *', '')}</label>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">{icon}</span>
      <input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-prism-violet/40 transition-colors disabled:opacity-50"
      />
    </div>
  )
}
