import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { t } from '../i18n'
import type { Locale } from '../i18n'

interface LandingProps {
  onStart: (projectName: string) => void
  locale: Locale
  onToggleLang: () => void
  onShowHistory: () => void
}

export const Landing: React.FC<LandingProps> = ({
  onStart,
  locale,
  onToggleLang,
  onShowHistory,
}) => {
  const [projectName, setProjectName] = useState('')
  const [isShaking, setIsShaking] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500)
      return
    }
    onStart(projectName.trim())
  }

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onToggleLang}
        className="absolute top-4 right-4 px-4 py-2 rounded-full glass-panel text-sm font-medium hover:text-brand-primary transition-colors"
      >
        {t(locale, 'app.lang')}
      </motion.button>

      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onShowHistory}
        className="absolute top-4 left-4 px-4 py-2 rounded-full glass-panel text-sm font-medium hover:text-brand-primary transition-colors"
      >
        {t(locale, 'app.history')}
      </motion.button>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-center w-full mt-20"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gradient tracking-tight">
          {t(locale, 'app.title')}
        </h1>
        <p className="text-brand-muted text-lg md:text-xl mb-8 max-w-md mx-auto">
          {t(locale, 'app.subtitle')}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <a
            href="https://x.com/MengLayer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-brand-muted hover:text-brand-primary hover-glow transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="X">
              <title>X</title>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            @MengLayer
          </a>
          <a
            href="https://t.me/MengYaWeb3"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-brand-muted hover:text-brand-primary hover-glow transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="Telegram">
              <title>Telegram</title>
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            Telegram
          </a>
        </div>

        <form onSubmit={handleSubmit} className="w-full relative z-10 px-4">
          <div className={`relative ${isShaking ? 'animate-shake' : ''}`}>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t(locale, 'app.inputPlaceholder')}
              className="w-full px-6 py-5 rounded-2xl glass-panel text-lg text-brand-text placeholder-brand-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all mb-6"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-5 rounded-2xl bg-gradient-primary text-white text-xl font-bold hover-glow shadow-lg shadow-brand-primary/30 relative overflow-hidden"
          >
            <span className="relative z-10">{t(locale, 'app.startButton')}</span>
            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-2xl"></div>
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}