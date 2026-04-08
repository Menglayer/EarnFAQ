import React from 'react'
import { t } from '../i18n'
import type { Locale } from '../i18n'

interface ProgressBarProps {
  current: number
  total: number
  locale: Locale
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, locale }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className="w-full max-w-xl mx-auto mb-8 px-4">
      <div className="flex justify-between items-center mb-2 text-sm text-brand-muted">
        <span>{t(locale, 'app.questionIndex', { current })}</span>
        <span>
          {current} / {total}
        </span>
      </div>
      <div className="h-2 w-full bg-brand-bg border border-brand-muted/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out relative"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}