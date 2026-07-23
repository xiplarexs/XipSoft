import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'giris Yap | XipSoft',
  description: 'XipSoft hesabınıza giris yapın',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
