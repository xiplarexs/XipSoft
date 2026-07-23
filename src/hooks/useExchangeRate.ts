'use client'

import { useState, useEffect } from 'react'

interface Rates {
  USD: number
  EUR: number
}

interface UseExchangeRateReturn {
  rates: Rates | null
  loading: boolean
  convert: (tryAmount: number, currency: 'USD' | 'EUR') => string
}

export function useExchangeRate(): UseExchangeRateReturn {
  const [rates, setRates] = useState<Rates | null>(null)
  const [loading, setLoading] = useState(true)

   
  useEffect(() => {
    const cached = sessionStorage.getItem('exchange_rates')
    const cachedAt = sessionStorage.getItem('exchange_rates_at')

    // 30 dakika cache
    if (cached && cachedAt && Date.now() - Number(cachedAt) < 30 * 60 * 1000) {
      setRates(JSON.parse(cached))
      setLoading(false)
      return
    }

    fetch('https://api.frankfurter.app/latest?from=TRY&to=USD,EUR')
      .then((r) => {
        if (!r.ok) throw new Error(`API error: ${r.status}`)
        return r.json()
      })
      .then((data) => {
        const r: Rates = { USD: data.rates.USD, EUR: data.rates.EUR }
        setRates(r)
        sessionStorage.setItem('exchange_rates', JSON.stringify(r))
        sessionStorage.setItem('exchange_rates_at', String(Date.now()))
      })
      .catch(() => {
        // API basarısız olursa yaklasık sabit kur kullan
        setRates({ USD: 0.028, EUR: 0.026 })
      })
      .finally(() => setLoading(false))
  }, [])

  const convert = (tryAmount: number, currency: 'USD' | 'EUR') => {
    if (!rates) return ''
    const amount = tryAmount * rates[currency]
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    })
  }

  return { rates, loading, convert }
}
