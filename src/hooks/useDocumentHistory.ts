import { useCallback, useState } from 'react'
import type { DocumentModel } from '../domain/document'
import {
  initHistory,
  pushHistory,
  redoHistory,
  resetHistory,
  undoHistory,
  type HistoryState,
} from './documentHistory'

export function useDocumentHistory(initial: DocumentModel | null) {
  const [history, setHistory] = useState<HistoryState<DocumentModel | null>>(
    initHistory(initial),
  )

  const setDocument = useCallback((next: DocumentModel | null, record: boolean) => {
    setHistory((current) => {
      if (!record || current.present === next) {
        return { ...current, present: next }
      }
      return pushHistory(current, next)
    })
  }, [])

  const replaceDocument = useCallback((next: DocumentModel | null) => {
    setHistory(resetHistory(next))
  }, [])

  const undo = useCallback(() => {
    setHistory((current) => undoHistory(current))
  }, [])

  const redo = useCallback(() => {
    setHistory((current) => redoHistory(current))
  }, [])

  return {
    document: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    setDocument,
    replaceDocument,
    undo,
    redo,
  }
}
