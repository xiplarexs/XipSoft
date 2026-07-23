// Define a basic User type that matches what we expect
// This can be replaced with the actual Payload User type later
export interface User {
  id: string
  email: string
  name?: string
  username?: string
  bio?: string
  website?: string
  location?: string
  photo_url?: string | null
  background_url?: string | null
  twoFactorEnabled?: boolean
  loginLog?: Array<{
    ip: string
    device: string
    timestamp: string
    sessionId?: string
  }>
}

export type SettingsTab = {
  id: string
  label: string
  component: React.ComponentType<{ user: User }>
  icon?: React.ReactNode
}

export type SettingsTabId = 'profile' | 'verification' | 'security' | 'privacy' | 'notifications' | 'themes' | 'account'
