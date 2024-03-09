import { Dispatch, KeyboardEvent } from 'react'
import update from 'immutability-helper'
import { Action } from './actions'
import { Trunk } from './mainstate'

const setTitle = (child: Trunk, title: string, dispatch: Dispatch<Action>) => {
  if (child.value === undefined) {
    return
  }
  dispatch({
    type: 'MODIFY',
    child,
    value: update(child.value, { title: { $set: title } }),
  })
}

const setContent = (
  child: Trunk,
  content: string,
  dispatch: Dispatch<Action>
) => {
  if (child.value === undefined) {
    return
  }
  dispatch({
    type: 'MODIFY',
    child,
    value: update(child.value, { content: { $set: content } }),
  })
}

const setLink = (child: Trunk, link: string, dispatch: Dispatch<Action>) => {
  if (child.value === undefined) {
    return
  }
  dispatch({
    type: 'MODIFY',
    child,
    value: update(child.value, { link: { $set: link } }),
  })
}

const setNote = (child: Trunk, note: string, dispatch: Dispatch<Action>) => {
  if (child.value === undefined) {
    return
  }
  dispatch({
    type: 'MODIFY',
    child,
    value: update(child.value, { note: { $set: note } }),
  })
}

const KeyDownHandler =
  (
    child: Trunk,
    head: Trunk,
    mode: string,
    setMode: (mode: string) => void,
    dispatch: Dispatch<Action>
  ) =>
  (e: KeyboardEvent) => {
    switch (mode) {
      case 'vim-default':
        keyDownVimDefault(e, child, head, setMode, dispatch)
        break
      case 'vim-input':
        keyDownVimInput(e, child, setMode, dispatch)
        break
      case 'standard':
        keyDownStandard(e, child, setMode, dispatch)
        break
      case 'note-input':
        keyDownNote(e, child, setMode, dispatch)
        return
      default:
        keyDownStandard(e, child, setMode, dispatch)
        break
    }
    keyDownCommon(e, child, setMode, dispatch)
  }
export default KeyDownHandler

const keyDownCommon = (
  e: KeyboardEvent,
  child: Trunk,
  setMode: (mode: string) => void,
  dispatch: Dispatch<Action>
) => {
  if (e.keyCode === 8) {
    // === 'Backspace'){
    if (e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'DELETE', child })
    } else {
      if (child.value?.title === '' && child.childs.length === 0) {
        e.preventDefault()
        dispatch({ type: 'DELETE', child })
      }
    }
  }

  if (e.keyCode === 9) {
    // === 'Tab'){
    e.preventDefault()
    if (e.shiftKey) {
      dispatch({ type: 'OUTDENT', child })
    } else {
      dispatch({ type: 'INDENT', child })
    }
  }
  if (e.keyCode === 39) {
    // 'ArrowRight'){
    if (e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'INDENT', child })
    }
  }
  if (e.keyCode === 37) {
    // 'ArrowLeft'){
    if (e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'OUTDENT', child })
    }
  }
  if (e.keyCode === 38) {
    //'ArrowUp'){
    e.preventDefault()
    if (e.shiftKey) {
      dispatch({ type: 'SHIFT_UP', child })
    } else {
      dispatch({ type: 'FOCUS_UP', child })
    }
  }
  if (e.keyCode === 40) {
    //'ArrowDown'){
    e.preventDefault()
    if (e.shiftKey) {
      dispatch({ type: 'SHIFT_DOWN', child })
    } else {
      dispatch({ type: 'FOCUS_DOWN', child })
    }
  }
}

const keyDownNote = (
  e: KeyboardEvent,
  child: Trunk,
  setMode: (mode: string) => void,
  dispatch: Dispatch<Action>
) => {
  if (e.keyCode === 27) {
    //'Escape'){
    e.preventDefault()
    setMode('vim-default')
  }
}

const keyDownVimDefault = (
  e: KeyboardEvent,
  child: Trunk,
  head: Trunk,
  setMode: (mode: string) => void,
  dispatch: Dispatch<Action>
) => {
  if (e.metaKey) {
    return
  }
  e.preventDefault()
  if (e.keyCode === 72) {
    // h
    if (e.shiftKey) {
      dispatch({ type: 'OUTDENT', child })
    }
  }
  if (e.keyCode === 74) {
    // j
    if (e.shiftKey) {
      dispatch({ type: 'SHIFT_DOWN', child })
    } else {
      dispatch({ type: 'FOCUS_DOWN', child })
    }
  }
  if (e.keyCode === 75) {
    // k
    if (e.shiftKey) {
      dispatch({ type: 'SHIFT_UP', child })
    } else {
      dispatch({ type: 'FOCUS_UP', child })
    }
  }
  if (e.keyCode === 76) {
    // l
    if (e.shiftKey) {
      dispatch({ type: 'INDENT', child })
    }
  }
  if (e.keyCode === 78) {
    // n
    if (child.childs.length === 0 && child.value?.note === undefined) {
      child.value?.note ?? setNote(child, '', dispatch)
    }
    if (!child.collapsed || child === head) {
      setMode('note-input')
    }
  }
  if (e.keyCode === 79) {
    // o
    if (e.shiftKey) {
      dispatch({ type: 'NEW_ABOVE', child })
      setMode('vim-input')
    } else {
      dispatch({ type: 'NEW_BELOW', child })
      setMode('vim-input')
    }
  }
  if (e.keyCode === 85) {
    // u
    dispatch({ type: 'UNDO' })
  }
  if (e.keyCode === 69) {
    // e
    setContent(child, child.value?.title ?? '', dispatch)
  }
  if (e.keyCode === 70) {
    // f
    setLink(child, child.value?.title ?? '', dispatch)
  }
  if (e.keyCode === 82) {
    // r
    dispatch({ type: 'REDO' })
  }
  if (e.keyCode === 73) {
    // i
    setMode('vim-input')
  }
  if (e.keyCode === 65) {
    // a
  }
  if (e.keyCode === 67) {
    // c
    setTitle(child, '', dispatch)
    setMode('vim-input')
  }
  if (e.keyCode === 68) {
    // d
    dispatch({ type: 'DELETE', child })
  }
  if (e.keyCode === 32) {
    // space
    e.preventDefault()
    dispatch({ type: 'SET_COLLAPSED', child, collapsed: !child.collapsed })
  }
  if (e.keyCode === 190) {
    // >
    e.preventDefault()
    dispatch({ type: 'DELVE_IN', child })
  }
  if (e.keyCode === 188) {
    // <
    e.preventDefault()
    dispatch({ type: 'DELVE_OUT', child })
  }
  if (e.keyCode === 13) {
    // === 'Enter'){
    e.preventDefault()
    dispatch({ type: 'DELVE_IN', child })
  }
  if (e.keyCode === 27) {
    //'Escape'){
    e.preventDefault()
    dispatch({ type: 'DELVE_OUT', child })
  }

  if (e.keyCode === 89) {
    // y
    navigator.clipboard.writeText(JSON.stringify(child))
  }
}

const keyDownVimInput = (
  e: KeyboardEvent,
  child: Trunk,
  setMode: (mode: string) => void,
  dispatch: Dispatch<Action>
) => {
  if (e.keyCode === 27) {
    //'Escape'){
    e.preventDefault()
    setMode('vim-default')
  }

  if (e.keyCode === 13) {
    // === 'Enter'){
    if (e.shiftKey) {
      return
    }
    e.preventDefault()
    if (child.value?.link && child.childs.length === 0) {
      window.location = child.value.link as string & Location
    }
    if (child.value?.title === '') {
      dispatch({ type: 'NEW', child })
    } else {
      dispatch({ type: 'NEW_BELOW', child })
    }
  }
}

const keyDownStandard = (
  e: KeyboardEvent,
  child: Trunk,
  setMode: (mode: string) => void,
  dispatch: Dispatch<Action>
) => {
  if (e.keyCode === 32) {
    // Spacebar
    if (e.shiftKey) {
      e.preventDefault()
      dispatch({ type: 'SET_COLLAPSED', child, collapsed: !child.collapsed })
    }
  }
  if (e.keyCode === 27) {
    //'Escape'){
    e.preventDefault()
    if (e.shiftKey) {
      if (child.childs.length > 0) {
        dispatch({ type: 'DELVE_IN', child })
      }
    } else {
      dispatch({ type: 'DELVE_OUT', child })
    }
  }
}
