import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useDecisionTree } from './hooks/useDecisionTree'
import type { Locale } from './i18n'
import { addHistory } from './utils/history'

import { ParticleBackground } from './components/ParticleBackground'
import { Landing } from './components/Landing'
import { QuestionCard } from './components/QuestionCard'
import { ProgressBar } from './components/ProgressBar'
import { ResultPage } from './components/ResultPage'
import { HistoryPanel } from './components/HistoryPanel'

function App() {
  const [locale, setLocale] = useState<Locale>('zh-CN')
  const [showHistory, setShowHistory] = useState(false)
  const { state, startQuiz, answer, reset } = useDecisionTree()

  const handleToggleLang = () => {
    setLocale((prev) => (prev === 'zh-CN' ? 'en' : 'zh-CN'))
  }

  // Automatically save history when reaching the result phase
  useEffect(() => {
    if (state.phase === 'result' && state.result) {
      addHistory({
        projectName: state.projectName,
        result: state.result.result,
        reason: state.result.reason,
        questionCount: state.history.length,
      })
    }
  }, [state.phase, state.result, state.projectName, state.history.length])

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans text-brand-text bg-brand-bg">
      <ParticleBackground />
      
      <main className="relative z-10 min-h-screen flex flex-col items-center pt-12 md:pt-20 px-4 pb-20">
        <AnimatePresence mode="wait">
          {state.phase === 'landing' && (
            <Landing
              key="landing"
              onStart={startQuiz}
              locale={locale}
              onToggleLang={handleToggleLang}
              onShowHistory={() => setShowHistory(true)}
            />
          )}

          {state.phase === 'quiz' && state.currentNode && (
            <div key="quiz" className="w-full max-w-xl mx-auto flex flex-col items-center">
              <ProgressBar current={state.questionNumber} total={state.totalQuestions} locale={locale} />
              <QuestionCard
                key={state.currentNode.id}
                question={
                  locale === 'zh-CN' ? state.currentNode.question : state.currentNode.questionEn
                }
                questionNumber={state.questionNumber}
                totalQuestions={state.totalQuestions}
                onAnswer={answer}
                isEasterEgg={state.currentNode.special === 'easter-egg'}
                locale={locale}
                link={state.currentNode.link}
              />
            </div>
          )}

          {state.phase === 'result' && state.result && (
            <ResultPage
              key="result"
              result={state.result}
              projectName={state.projectName}
              history={state.history}
              locale={locale}
              onRestart={reset}
            />
          )}
        </AnimatePresence>
      </main>

      <HistoryPanel
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        locale={locale}
        onSelectProject={(name) => {
          reset()
          setTimeout(() => startQuiz(name), 300)
        }}
      />
    </div>
  )
}

export default App
