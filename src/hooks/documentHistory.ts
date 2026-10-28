export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export function initHistory<T>(present: T): HistoryState<T> {
  return { past: [], present, future: [] }
}

export function pushHistory<T>(state: HistoryState<T>, next: T, limit = 50): HistoryState<T> {
  return {
    past: [...state.past, state.present].slice(-limit),
    present: next,
    future: [],
  }
}

export function undoHistory<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.past.length === 0) return state
  const previous = state.past[state.past.length - 1]
  return {
    past: state.past.slice(0, -1),
    present: previous,
    future: [state.present, ...state.future],
  }
}

export function redoHistory<T>(state: HistoryState<T>): HistoryState<T> {
  if (state.future.length === 0) return state
  const [next, ...rest] = state.future
  return {
    past: [...state.past, state.present],
    present: next,
    future: rest,
  }
}

export function resetHistory<T>(present: T): HistoryState<T> {
  return initHistory(present)
}
