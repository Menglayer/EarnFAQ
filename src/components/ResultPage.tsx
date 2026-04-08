import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
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

function generateImage(
  projectName: string,
  result: ResultNode,
  history: HistoryStep[],
  locale: Locale,
): string {
  const scale = 2
  const w = 600
  const isSuccess = result.result === 'can-deposit'
  const h = 340 + history.length * 32 + (isSuccess ? 50 : 0)
  const canvas = document.createElement('canvas')
  canvas.width = w * scale
  canvas.height = h * scale
  const ctx = canvas.getContext('2d')!
  ctx.scale(scale, scale)

  // Background
  ctx.fillStyle = '#0a0e1a'
  ctx.fillRect(0, 0, w, h)

  // Top accent bar
  ctx.fillStyle = isSuccess ? '#10b981' : '#ef4444'
  ctx.fillRect(0, 0, w, 4)

  // Project name subtitle
  ctx.fillStyle = '#64748b'
  ctx.font = '14px system-ui, sans-serif'
  ctx.textAlign = 'center'
  const subtitle = locale === 'zh-CN'
    ? `关于「${projectName}」的诊断结果`
    : `Diagnosis for "${projectName}"`
  ctx.fillText(subtitle, w / 2, 40)

  // Result title
  ctx.fillStyle = isSuccess ? '#10b981' : '#ef4444'
  ctx.font = 'bold 36px system-ui, sans-serif'
  const title = locale === 'zh-CN'
    ? (isSuccess ? '可以存！' : '不能存！')
    : (isSuccess ? 'Safe to Deposit!' : 'Do NOT Deposit!')
  ctx.fillText(title, w / 2, 85)

  // Reason
  ctx.fillStyle = '#f1f5f9'
  ctx.font = '16px system-ui, sans-serif'
  const reason = locale === 'zh-CN' ? result.reason : result.reasonEn
  ctx.fillText(reason, w / 2, 115)

  // Divider
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(30, 140)
  ctx.lineTo(w - 30, 140)
  ctx.stroke()

  // Path title
  ctx.fillStyle = '#64748b'
  ctx.font = 'bold 13px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(locale === 'zh-CN' ? '决策路径' : 'Decision Path', 30, 165)

  // History steps
  let y = 190
  history.forEach((step, idx) => {
    ctx.fillStyle = '#64748b'
    ctx.font = '13px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(`${idx + 1}.`, 50, y)

    ctx.fillStyle = 'rgba(241, 245, 249, 0.9)'
    ctx.font = '13px system-ui, sans-serif'
    ctx.textAlign = 'left'
    // Truncate long questions
    const maxQ = 42
    const qText = step.question.length > maxQ ? step.question.slice(0, maxQ) + '…' : step.question
    ctx.fillText(qText, 60, y)

    const ansText = locale === 'zh-CN'
      ? (step.answer === 'yes' ? '是的' : '不是')
      : (step.answer === 'yes' ? 'Yes' : 'No')
    ctx.fillStyle = step.answer === 'yes' ? '#3b82f6' : '#64748b'
    ctx.font = 'bold 13px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(ansText, w - 30, y)

    y += 32
  })

  // Bottom divider
  const footerY = y + 10
  ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'
  ctx.beginPath()
  ctx.moveTo(30, footerY)
  ctx.lineTo(w - 30, footerY)
  ctx.stroke()

  // Footer
  ctx.fillStyle = 'rgba(100, 116, 139, 0.5)'
  ctx.font = 'bold 11px system-ui, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(locale === 'zh-CN' ? '加密理财⑮问' : 'Crypto EarnFAQ', 30, footerY + 22)
  ctx.textAlign = 'right'
  ctx.font = '11px system-ui, sans-serif'
  ctx.fillText(new Date().toLocaleDateString(), w - 30, footerY + 22)

  // Watermark
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(100, 116, 139, 0.35)'
  ctx.font = '11px system-ui, sans-serif'
  ctx.fillText('earnfaq.menglayer.cc', w / 2, footerY + 22)

  // Risk disclaimer (only for success results)
  if (isSuccess) {
    const disclaimerY = footerY + 42
    ctx.fillStyle = 'rgba(100, 116, 139, 0.45)'
    ctx.font = '10px system-ui, sans-serif'
    ctx.textAlign = 'center'
    const d1 = locale === 'zh-CN'
      ? '⚠️ 仅供娱乐参考，不构成投资建议'
      : '⚠️ For entertainment only, not investment advice'
    const d2 = locale === 'zh-CN'
      ? '投资有风险，理财需谨慎'
      : 'Investing involves risk, proceed with caution'
    ctx.fillText(d1, w / 2, disclaimerY)
    ctx.fillText(d2, w / 2, disclaimerY + 16)
  }

  return canvas.toDataURL('image/png')
}

export const ResultPage: React.FC<ResultPageProps> = ({
  result,
  projectName,
  history,
  locale,
  onRestart,
}) => {
  const isSuccess = result.result === 'can-deposit'

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

  const handleDownload = () => {
    const dataUrl = generateImage(projectName, result, history, locale)
    const link = document.createElement('a')
    link.download = `earnfaq-${projectName}.png`
    link.href = dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    const resultText = isSuccess
      ? t(locale, 'app.resultTitle.can')
      : t(locale, 'app.resultTitle.cannot')
    const reason = locale === 'zh-CN' ? result.reason : result.reasonEn
    const tweetText = `${t(locale, 'app.resultFor', { name: projectName })}\n\n${resultText}\n${reason}\n\n🔗 earnfaq.menglayer.cc`
    const twitterUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}`
    window.open(twitterUrl, '_blank', 'noopener,noreferrer')
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
      {/* Result Card */}
      <div
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
          <div className="text-brand-muted mb-4 flex items-center justify-center flex-wrap whitespace-pre-wrap">
            {t(locale, 'app.resultFor', { name: projectName }).split(projectName).map((part, i, arr) => (
              <React.Fragment key={i}>
                <span className="text-sm md:text-base">{part}</span>
                {i < arr.length - 1 && (
                  <span className="inline-block mx-1.5 px-3 py-1 bg-brand-primary/15 text-brand-primary font-black text-2xl md:text-3xl rounded-xl border border-brand-primary/30 shadow-[0_0_20px_rgba(59,130,246,0.25)] transform hover:scale-105 transition-transform cursor-default">
                    {projectName}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
          <h2
            className={`text-4xl md:text-5xl font-extrabold mb-4 mt-2 ${
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
          className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/30 hover-glow flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" role="img" aria-label="X">
            <title>X</title>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
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

      {isSuccess && (
        <div className="mt-6 text-center text-brand-muted/60 text-xs leading-relaxed">
          <p>⚠️ {t(locale, 'app.disclaimer1')}</p>
          <p>{t(locale, 'app.disclaimer2')}</p>
        </div>
      )}
    </motion.div>
  )
}
