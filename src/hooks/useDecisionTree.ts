import { useState, useCallback } from 'react'
import {
  decisionTree,
  ROOT_NODE_ID,
  TOTAL_QUESTIONS,
  type DecisionNode,
  type ResultNode,
} from '../data/decisionTree'

export interface HistoryStep {
  questionId: string
  question: string
  answer: 'yes' | 'no'
}

export interface QuizState {
  phase: 'landing' | 'quiz' | 'result'
  projectName: string
  currentNodeId: string
  currentNode: DecisionNode | null
  result: ResultNode | null
  history: HistoryStep[]
  questionNumber: number
  totalQuestions: number
}

export function useDecisionTree() {
  const [state, setState] = useState<QuizState>({
    phase: 'landing',
    projectName: '',
    currentNodeId: ROOT_NODE_ID,
    currentNode: decisionTree[ROOT_NODE_ID],
    result: null,
    history: [],
    questionNumber: 0,
    totalQuestions: TOTAL_QUESTIONS,
  })

  const startQuiz = useCallback((projectName: string) => {
    setState({
      phase: 'quiz',
      projectName,
      currentNodeId: ROOT_NODE_ID,
      currentNode: decisionTree[ROOT_NODE_ID],
      result: null,
      history: [],
      questionNumber: 1,
      totalQuestions: TOTAL_QUESTIONS,
    })
  }, [])

  const answer = useCallback((choice: 'yes' | 'no') => {
    setState((prev) => {
      if (!prev.currentNode) return prev

      const nextValue = choice === 'yes' ? prev.currentNode.yes : prev.currentNode.no
      const newHistory: HistoryStep[] = [
        ...prev.history,
        {
          questionId: prev.currentNode.id,
          question: prev.currentNode.question,
          answer: choice,
        },
      ]

      // Next is a result
      if (typeof nextValue === 'object' && 'result' in nextValue) {
        return {
          ...prev,
          phase: 'result',
          result: nextValue,
          history: newHistory,
        }
      }

      // Next is another question
      const nextNode = decisionTree[nextValue]
      if (!nextNode) {
        // Safety fallback - shouldn't happen
        return {
          ...prev,
          phase: 'result',
          result: {
            result: 'cannot-deposit',
            reason: '决策树异常，建议谨慎',
            reasonEn: 'Decision tree error, proceed with caution',
          },
          history: newHistory,
        }
      }

      return {
        ...prev,
        currentNodeId: nextValue,
        currentNode: nextNode,
        history: newHistory,
        questionNumber: prev.questionNumber + 1,
      }
    })
  }, [])

  const reset = useCallback(() => {
    setState({
      phase: 'landing',
      projectName: '',
      currentNodeId: ROOT_NODE_ID,
      currentNode: decisionTree[ROOT_NODE_ID],
      result: null,
      history: [],
      questionNumber: 0,
      totalQuestions: TOTAL_QUESTIONS,
    })
  }, [])

  return {
    state,
    startQuiz,
    answer,
    reset,
  }
}
