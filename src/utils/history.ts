export interface HistoryRecord {
  id: string
  projectName: string
  result: 'can-deposit' | 'cannot-deposit'
  reason: string
  date: string
  questionCount: number
}

const STORAGE_KEY = 'earnfaq-history'

export function getHistory(): HistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as HistoryRecord[]
  } catch {
    return []
  }
}

export function addHistory(record: Omit<HistoryRecord, 'id' | 'date'>): void {
  const history = getHistory()
  const newRecord: HistoryRecord = {
    ...record,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: new Date().toISOString(),
  }
  // Keep latest 50
  history.unshift(newRecord)
  if (history.length > 50) history.pop()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY)
}
