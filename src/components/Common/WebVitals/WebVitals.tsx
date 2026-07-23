'use client'

/**
 * WebVitals — Client-side Core Web Vitals tracking
 *
 * LCP, INP, CLS, FCP, TTFB metriklerini ölçer ve google Analytics'e gönderir.
 * Sadece production'da aktif — dev'de console.log ile gösterir.
 *
 * Kullanım: Root layout'a <WebVitals /> ekle (zaten eklendi)
 */

import { useEffect } from 'react'
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

// gA4 event gönderimi
function sendTogA(metric: Metric) {
  if (typeof window === 'undefined') return

  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    // Dev'de sadece console'a yaz
    const rating = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌'
    console.log(`[WebVitals] ${rating} ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'}`)
    return
  }

  // Production: gA4'e gönder
  const win = window as typeof window & { gtag?: (...args: unknown[]) => void }
  if (typeof win.gtag !== 'function') return

  win.gtag('event', metric.name, {
    event_category: 'Web Vitals',
    event_label: metric.id,
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    non_interaction: true,
    // Rating: good / needs-improvement / poor
    metric_rating: metric.rating,
    // Delta: son ölçümden bu yana degisim
    metric_delta: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
  })
}

export default function WebVitals() {
  useEffect(() => {
    // Tüm Core Web Vitals metriklerini kaydet
    onCLS(sendTogA)   // Cumulative Layout Shift — görsel kararlılık
    onFCP(sendTogA)   // First Contentful Paint — ilk içerik
    onINP(sendTogA)   // Interaction to Next Paint — etkilesim yanıt süresi (FID'in yerini aldı)
    onLCP(sendTogA)   // Largest Contentful Paint — en büyük içerik
    onTTFB(sendTogA)  // Time to First Byte — sunucu yanıt süresi
  }, [])

  // Render etmez — sadece ölçüm yapar
  return null
}
