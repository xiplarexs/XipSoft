'use client'

import { useState } from 'react'
import type { SettingsTab, SettingsTabId } from './types'
import ErrorBoundary from './ErrorBoundary'

interface SettingsTabsProps {
  tabs: SettingsTab[]
  defaultTab: SettingsTabId
  user: any // Replace with your User type
}

export default function SettingsTabs({ tabs, defaultTab, user }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTabId>(defaultTab)
  const activeTabData = tabs.find((tab) => tab.id === activeTab) ?? tabs[0] ?? ({ id: defaultTab, label: '', component: () => null } as SettingsTab)
  const ActiveComponent = activeTabData.component

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-56 flex-shrink-0">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTabId)}
              className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center">
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {activeTabData.label}
            </h2>
            <ErrorBoundary>
              <ActiveComponent user={user} />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  )
}
