'use client'

import { useState } from 'react'
import type { User } from './types'
import { globalService } from '@/services/global.service'

export default function Security2FA({ user }: { user: User }) {
  const [isEnabling2FA, setIsEnabling2FA] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false)

  const handle2FAToggle = async (enable: boolean) => {
    try {
      setIsLoading(true)
      setError('')

      if (enable) {
        // Start 2FA setup
        await globalService.user.updateSecurity({ userId: user.id, action: 'setup2FA' })
        // TODO: Handle QR code response
        setIsEnabling2FA(true)
      } else {
        // Disable 2FA
        await globalService.user.updateSecurity({ userId: user.id, action: 'disable2FA' })
        // Refresh the page to update the UI
        window.location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('2FA toggle error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const verify2FACode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) return

    try {
      setIsLoading(true)
      setError('')

      await globalService.user.updateSecurity({
        userId: user.id,
        action: 'verify2FA',
        code: verificationCode
      })

      // TODO: Handle recovery codes response
      setRecoveryCodes(['code1', 'code2', 'code3']) // Placeholder
      setShowRecoveryCodes(true)
      setIsEnabling2FA(false)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      console.error('2FA verification error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyRecoveryCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'))
      .then(() => {
        // Show success message
        alert('Recovery codes copied to clipboard! Store them in a safe place.')
      })
      .catch(err => {
        console.error('Failed to copy recovery codes:', err)
        setError('Failed to copy recovery codes. Please copy them manually.')
      })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Two-Factor Authentication
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-400">
            <p>
              Add an additional layer of security to your account by enabling two-factor authentication.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900/20 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="mt-5">
            {user.twoFactorEnabled ? (
              <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Two-factor authentication is enabled.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => handle2FAToggle(false)}
                    disabled={isLoading}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-red-900/30 dark:text-red-200 dark:hover:bg-red-900/40"
                  >
                    {isLoading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                </div>
              </div>
            ) : isEnabling2FA ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Scan the QR code
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                    Scan this QR code with your authenticator app (like google Authenticator or Authy)
                    to enable two-factor authentication.
                  </p>
                  {qrCodeUrl && (
                    <div className="flex justify-center p-4 bg-white rounded">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                    </div>
                  )}
                </div>

                <form onSubmit={verify2FACode} className="space-y-4">
                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Verification Code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="verificationCode"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        placeholder="Enter 6-digit code"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Enter the 6-digit code from your authenticator app.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={isLoading || !verificationCode}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Verifying...' : 'Verify and Enable'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEnabling2FA(false)
                        setError('')
                        setVerificationCode('')
                      }}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handle2FAToggle(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Enable Two-Factor Authentication
              </button>
            )}
          </div>
        </div>
      </div>

      {showRecoveryCodes && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">
            Save Your Recovery Codes
          </h3>
          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            Store these recovery codes in a secure password manager. They can be used to recover
            access to your account if you lose your two-factor authentication device.
          </p>
          <div className="mt-4 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded overflow-x-auto">
            <pre className="text-sm text-yellow-800 dark:text-yellow-200">
              {recoveryCodes.join('\n')}
            </pre>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              onClick={copyRecoveryCodes}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-yellow-800 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
            >
              Copy Recovery Codes
            </button>
            <button
              type="button"
              onClick={() => setShowRecoveryCodes(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              I've Saved My Codes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
