import { describe, expect, it } from 'vitest'
import { initHistory, pushHistory, redoHistory, undoHistory } from './documentHistory'

describe('documentHistory', () => {
  it('pushes snapshots and undoes', () => {
    let state = initHistory('a')
    state = pushHistory(state, 'b')
    state = pushHistory(state, 'c')
    expect(state.present).toBe('c')
    state = undoHistory(state)
    expect(state.present).toBe('b')
    state = undoHistory(state)
    expect(state.present).toBe('a')
    state = undoHistory(state)
    expect(state.present).toBe('a')
  })

  it('redoes after undo', () => {
    let state = initHistory(1)
    state = pushHistory(state, 2)
    state = undoHistory(state)
    state = redoHistory(state)
    expect(state.present).toBe(2)
  })

  it('clears future on new push', () => {
    let state = initHistory('a')
    state = pushHistory(state, 'b')
    state = undoHistory(state)
    state = pushHistory(state, 'c')
    expect(state.present).toBe('c')
    expect(state.future).toEqual([])
  })
})
