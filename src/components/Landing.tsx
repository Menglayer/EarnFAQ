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
        <p className="text-brand-muted text-lg md:text-xl mb-12 max-w-md mx-auto">
          {t(locale, 'app.subtitle')}
        </p>

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