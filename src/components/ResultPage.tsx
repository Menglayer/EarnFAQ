import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import { t } from '../i18n'
import type { Locale } from '../i18n'
import type { ResultNode } from '../data/decisionTree'
import type { HistoryStep } from '../hooks/useDecisionTree'

interface ResultPageProps {
  result: ResultNode
  projectName: string
  history: HistoryStep[]
  locale: Locale
  onRestart: () => void
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  projectName,
  history,
  locale,
  onRestart,
}) => {
  const isSuccess = result.result === 'can-deposit'
  const shareCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isSuccess) {
      const duration = 3000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6'],
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#10b981', '#3b82f6', '#8b5cf6'],
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      frame()
    }
  }, [isSuccess])

  const handleDownload = async () => {
    if (!shareCardRef.current) return
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#0a0e1a',
        scale: 2,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `earnfaq-${projectName}.png`
      a.click()
    } catch (e) {
      console.error('Failed to generate image', e)
    }
  }

  const handleShare = async () => {
    if (navigator.share && shareCardRef.current) {
      try {
        const canvas = await html2canvas(shareCardRef.current, {
          backgroundColor: '#0a0e1a',
        })
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) return
          const file = new File([blob], 'share.png', { type: 'image/png' })
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: t(locale, 'app.title'),
              text: t(locale, 'app.resultFor', { name: projectName }),
              files: [file],
            })
          } else {
            handleDownload()
          }
        })
      } catch (e) {
        console.error('Share failed', e)
        handleDownload()
      }
    } else {
      handleDownload()
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className={`w-full max-w-2xl mx-auto flex flex-col items-center ${
        !isSuccess ? 'animate-shake' : ''
      }`}
    >
      {/* Shareable Card */}
      <div
        id="share-card"
        ref={shareCardRef}
        className={`w-full glass-panel rounded-3xl p-8 mb-8 relative overflow-hidden ${
          isSuccess ? 'border-brand-success/50' : 'border-brand-danger/50'
        }`}
      >
        <div
          className={`absolute top-0 left-0 w-full h-2 ${
            isSuccess ? 'bg-brand-success' : 'bg-brand-danger'
          }`}
        />

        <div className="text-center mb-8 mt-4">
          <div className="text-brand-muted mb-2">{t(locale, 'app.resultFor', { name: projectName })}</div>
          <h2
            className={`text-4xl md:text-5xl font-extrabold mb-4 ${
              isSuccess ? 'text-brand-success text-shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'text-brand-danger text-shadow-[0_0_20px_rgba(239,68,68,0.5)]'
            }`}
          >
            {t(locale, isSuccess ? 'app.resultTitle.can' : 'app.resultTitle.cannot')}
          </h2>
          <p className="text-xl text-brand-text font-medium">
            {locale === 'zh-CN' ? result.reason : result.reasonEn}
          </p>
        </div>

        <div className="border-t border-brand-muted/20 pt-6">
          <h3 className="text-brand-muted font-bold mb-4">{t(locale, 'app.pathTitle')}</h3>
          <div className="space-y-3">
            {history.map((step, idx) => (
              <div key={step.questionId} className="flex gap-4 text-sm items-start">
                <div className="text-brand-muted w-6 text-right mt-0.5">{idx + 1}.</div>
                <div className="flex-1 text-brand-text/90">{step.question}</div>
                <div
                  className={`font-bold ${
                    step.answer === 'yes' ? 'text-brand-primary' : 'text-brand-muted'
                  }`}
                >
                  {t(locale, step.answer === 'yes' ? 'app.yesDetail' : 'app.noDetail')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-brand-muted/20 flex justify-between items-center text-brand-muted/50 text-xs">
          <span className="font-bold tracking-widest">{t(locale, 'app.title')}</span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="flex-1 py-4 bg-brand-card border border-brand-primary/50 text-brand-primary rounded-xl font-bold hover:bg-brand-primary/10 transition-colors"
        >
          {t(locale, 'app.restart')}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover-glow"
        >
          {t(locale, 'app.share')}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex-1 py-4 bg-brand-card border border-brand-muted/50 text-brand-text rounded-xl font-bold hover:border-brand-text transition-colors"
        >
          {t(locale, 'app.download')}
        </motion.button>
      </div>
    </motion.div>
  )
}