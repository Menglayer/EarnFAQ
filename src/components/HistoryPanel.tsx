import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { t } from '../i18n'
import type { Locale } from '../i18n'
import { getHistory, clearHistory } from '../utils/history'
import type { HistoryRecord } from '../utils/history'

interface HistoryPanelProps {
  locale: Locale
  onClose: () => void
  onSelectProject?: (name: string) => void
  isOpen: boolean
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  locale,
  onClose,
  onSelectProject,
  isOpen,
}) => {
  const [history, setHistory] = React.useState<HistoryRecord[]>([])

  React.useEffect(() => {
    if (isOpen) {
      setHistory(getHistory())
    }
  }, [isOpen])

  const handleClear = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm border-none cursor-default"
            onClick={onClose}
            aria-label="Close history panel"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-bg border-l border-brand-muted/30 z-50 p-6 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-brand-text">{t(locale, 'app.history')}</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-brand-card transition-colors text-brand-muted"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-brand-muted mt-20">
                  {t(locale, 'app.noHistory')}
                </div>
              ) : (
                history.map((record) => (
                  <button
                    type="button"
                    key={record.id}
                    onClick={() => {
                      if (onSelectProject) {
                        onSelectProject(record.projectName)
                        onClose()
                      }
                    }}
                    className="glass-panel p-4 rounded-xl cursor-pointer hover-glow transition-all w-full text-left"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-brand-text truncate mr-4">
                        {record.projectName}
                      </h3>
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-lg ${
                          record.result === 'can-deposit'
                            ? 'bg-brand-success/20 text-brand-success'
                            : 'bg-brand-danger/20 text-brand-danger'
                        }`}
                      >
                        {record.result === 'can-deposit' ? '✅' : '❌'}
                      </span>
                    </div>
                    <p className="text-sm text-brand-muted line-clamp-2 mb-2">
                      {record.reason}
                    </p>
                    <div className="text-xs text-brand-muted/60">
                      {new Date(record.date).toLocaleString(
                        locale === 'zh-CN' ? 'zh-CN' : 'en-US'
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="mt-6 w-full py-3 rounded-xl border border-brand-danger/50 text-brand-danger hover:bg-brand-danger hover:text-white transition-colors font-bold"
              >
                {t(locale, 'app.clearHistory')}
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}