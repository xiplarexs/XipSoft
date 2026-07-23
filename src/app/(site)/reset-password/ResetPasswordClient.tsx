'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { requestPasswordResetAction, verifyPasswordResetCodeAction, resetPasswordAction } from '@/app/_actions/auth-actions'

type Step = 'request' | 'verify' | 'reset'

function ResetPasswordPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState<Step>(() => {
    const email = searchParams.get('email')
    const code = searchParams.get('code')
    if (email && code) return 'reset'
    return 'request'
  })
  
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [code, setCode] = useState(searchParams.get('code') || '')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email) {
      setError('E-posta adresi gerekli')
      return
    }

    setLoading(true)
    try {
      const result = await requestPasswordResetAction(email)

      if (!result.success) {
        throw new Error(result.error || 'Bir hata olustu')
      }

      setSuccess(result.message || 'sifre sıfırlama baglantısı e-posta adresinize gönderildi')
      setTimeout(() => {
        setStep('verify')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !code) {
      setError('E-posta ve kod gerekli')
      return
    }

    setLoading(true)
    try {
      const result = await verifyPasswordResetCodeAction(email, code)
      if (!result.success) {
        throw new Error(result.error || 'Kod geçersiz')
      }
      setStep('reset')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !code || !newPassword || !confirmPassword) {
      setError('Tüm alanları doldurun')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('sifreler eslesmiyor')
      return
    }

    if (newPassword.length < 8) {
      setError('sifre en az 8 karakter olmalı')
      return
    }

    setLoading(true)
    try {
      const result = await resetPasswordAction(email, code, newPassword)
      if (!result.success) {
        throw new Error(result.error || 'sifre sıfırlanamadı')
      }
      setSuccess('sifreniz basarıyla sıfırlandı')
      setTimeout(() => {
        router.push('/register?tab=login')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata olustu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian px-4">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/register?tab=login"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            giris Yap
          </Link>
        </div>

        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 'request' && 'sifremi Unuttum'}
            {step === 'verify' && 'Dogrulama Kodu'}
            {step === 'reset' && 'Yeni sifre'}
          </h1>
          <p className="text-sm text-zinc-400">
            {step === 'request' && 'E-posta adresinizi girin, sifre sıfırlama baglantısı gönderelim'}
            {step === 'verify' && 'E-posta adresinize gönderilen 6 haneli kodu girin'}
            {step === 'reset' && 'Yeni sifrenizi belirleyin'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={
          step === 'request' ? handleRequestReset :
          step === 'verify' ? handleVerifyCode :
          handleResetPassword
        } className="space-y-3 p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
          
          {step === 'request' && (
            <Field 
              icon={<Mail size={15} />} 
              type="email" 
              placeholder="E-posta" 
              value={email} 
              onChange={setEmail} 
              disabled={loading} 
            />
          )}

          {step === 'verify' && (
            <>
              <Field 
                icon={<Mail size={15} />} 
                type="email" 
                placeholder="E-posta" 
                value={email} 
                onChange={setEmail} 
                disabled={loading} 
              />
              <Field 
                icon={<Lock size={15} />} 
                type="text" 
                placeholder="Dogrulama Kodu" 
                value={code} 
                onChange={setCode} 
                disabled={loading} 
              />
            </>
          )}

          {step === 'reset' && (
            <>
              <Field 
                icon={<Lock size={15} />} 
                type="password" 
                placeholder="Yeni sifre" 
                value={newPassword} 
                onChange={setNewPassword} 
                disabled={loading} 
              />
              <Field 
                icon={<Lock size={15} />} 
                type="password" 
                placeholder="Yeni sifre Tekrar" 
                value={confirmPassword} 
                onChange={setConfirmPassword} 
                disabled={loading} 
              />
            </>
          )}

          {error && <p className="text-xs text-red-400 pt-1">{error}</p>}
          {success && (
            <div className="pt-1">
              <p className="text-xs text-green-400">{success}</p>
              {process.env.NODE_ENV === 'development' && step === 'request' && (
                <p className="text-[10px] text-zinc-500 mt-1">
                  💡 gelistirme modu: Konsolu kontrol edin, dogrulama kodu orada gösteriliyor
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl text-sm font-bold text-white bg-prism-violet/20 border border-prism-violet/30 hover:bg-prism-violet/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Yukleniyor...' : 
             step === 'request' ? 'Baglantı gönder' :
             step === 'verify' ? 'Kodu Dogrula' :
             'sifreyi Sıfırla'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordPageInner />
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
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">{icon}</span>
      <input
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
