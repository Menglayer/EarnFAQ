import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { t } from '../i18n'
import type { Locale } from '../i18n'

interface QuestionCardProps {
  question: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (choice: 'yes' | 'no') => void
  isEasterEgg?: boolean
  locale: Locale
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onAnswer,
  isEasterEgg,
  locale,
}) => {
  const [displayedText, setDisplayedText] = useState('')

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('')
    let i = 0
    const timer = setInterval(() => {
      setDisplayedText((prev) => {
        const nextChar = question.charAt(i)
        i++
        if (i > question.length) {
          clearInterval(timer)
          return prev
        }
        return prev + nextChar
      })
    }, 30)

    return () => clearInterval(timer)
  }, [question])

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: 'spring', damping: 20, stiffness: 100 }}
      className={`glass-panel w-full max-w-xl mx-auto rounded-3xl p-8 relative flex flex-col items-center justify-center min-h-[300px] ${
        isEasterEgg ? 'easter-egg-glow' : ''
      }`}
    >
      <div className="absolute -top-4 bg-brand-bg border border-brand-primary text-brand-primary px-4 py-1 rounded-full text-sm font-semibold shadow-[0_0_10px_rgba(59,130,246,0.5)]">
        {t(locale, 'app.questionIndex', { current: questionNumber })}
      </div>

      {isEasterEgg && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-4xl mb-4"
        >
          👣
        </motion.div>
      )}

      <h2 className="text-2xl md:text-3xl font-bold text-center text-brand-text mb-12 h-[80px] flex items-center justify-center">
        {displayedText}
        <span className="animate-pulse opacity-50 ml-1">|</span>
      </h2>

      <div className="flex w-full gap-4 mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer('yes')}
          className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow"
        >
          {t(locale, 'app.yes')}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer('no')}
          className="flex-1 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-shadow"
        >
          {t(locale, 'app.no')}
        </motion.button>
      </div>
    </motion.div>
  )
}