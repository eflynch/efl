import { useEffect, useContext } from 'react'
import update from 'immutability-helper'
import { useSessionStorage } from 'react-use'
import Item from './Item'
import Breadcrumbs from './Breadcrumbs'
import Title from './Title'

import MagnoliaContext from '../context'

import './Magnolia.css'

import ContentIFrame from './ContentIFrame'
import { AncestorsOf, Lookup, ParentOf } from '@efl/immutable-tree'
import KeyDownHandler from '../keybindings'
import { Trunk } from '../mainstate'

function Magnolia(): JSX.Element {
  const [mode, setMode] = useSessionStorage<string>('mode', 'vim-default')
  const { magnolia , dispatch } = useContext(MagnoliaContext)
  const { tree, headSerial, focusSerial } = magnolia

  const ensureHeadAndFocus = () => {
    if (
      headSerial === null ||
      headSerial === undefined ||
      Lookup(tree, headSerial) === undefined
    ) {
      dispatch({ type: 'SET_HEAD', child: tree.trunk })
    }
    if (
      focusSerial === null ||
      focusSerial === undefined ||
      Lookup(tree, focusSerial) === undefined
    ) {
      dispatch({ type: 'SET_FOCUS', child: tree.trunk })
    }
  }
  useEffect(ensureHeadAndFocus, [
    headSerial,
    focusSerial,
    dispatch,
    tree.trunk,
    tree,
  ])
  const head: Trunk = headSerial
    ? Lookup(tree, headSerial) || tree.trunk
    : tree.trunk
  const focus: Trunk = focusSerial
    ? Lookup(tree, focusSerial) || tree.trunk
    : tree.trunk

  useEffect(() => {
    const content = head.value?.content
    const focusCapture =
      content === null || content === undefined || content === ''
    if (focusCapture && focusSerial === null) {
      dispatch({ type: 'SET_FOCUS', child: head })
    }
    const parent = ParentOf(tree, head)
    if (
      !head.value?.content &&
      head.value?.note === undefined &&
      head.childs.length === 0 &&
      parent !== undefined
    ) {
      dispatch({ type: 'SET_HEAD', child: parent })
      dispatch({ type: 'SET_FOCUS', child: head })
    }
  }, [tree, focusSerial, head, dispatch])

  const entryEnabled = mode !== 'vim-default' && mode !== 'note-input'
  const takingNotes = mode === 'note-input'

  const setTitle = (child: Trunk, title: string) => {
    if (child.value !== undefined) {
      const value = child.value
      dispatch({
        type: 'MODIFY',
        child: child,
        value: update(value, { title: { $set: title } }),
      })
    }
  }

  const setCollapsed = (child: Trunk, collapsedState: boolean) => {
    dispatch({
      type: 'SET_COLLAPSED',
      child: child,
      collapsed: collapsedState,
    })
  }

  const setHead = (head: Trunk | undefined) => {
    if (head === undefined) {
      return
    }
    dispatch({ type: 'SET_HEAD', child: head })
  }

  const setFocus = (child: Trunk | undefined) => {
    if (child === undefined) {
      return
    }
    dispatch({ type: 'SET_FOCUS', child: child })
  }

  const setNotes = (child: Trunk, note: string) => {
    if (child === undefined || child.value === undefined) {
      return
    }
    const value = child.value
    dispatch({
      type: 'MODIFY',
      child: child,
      value: update(value, { note: { $set: note } }),
    })
  }

  const onKeyDown = KeyDownHandler(focus, head, mode, setMode, dispatch)

  return (
    <div className="magnolia" onKeyDown={onKeyDown}>
      <div
        style={{
          width: '80%',
        }}
      >
        <div>
          <Breadcrumbs setHead={setHead} ancestors={AncestorsOf(tree, head)} />
          <div className="title">
            <Title
              trunk={head}
              setTitle={setTitle}
              setFocus={setFocus}
              setHead={setHead}
              setNotes={setNotes}
              showNotes={
                head.value?.note !== undefined && head.childs.length === 0
              }
              takingNotes={takingNotes}
              entryEnabled={entryEnabled}
              hasFocus={focus === head}
            />
          </div>
        </div>
        <div>
          {!head?.childs.length &&
          head?.value?.content !== null &&
          head?.value?.content !== undefined ? (
            <ContentIFrame
              bootstrap={head.value}
              src={head.value.content}
              onEscape={() => {
                setHead(ParentOf(tree, head))
                setFocus(head)
              }}
            />
          ) : (
            head?.childs.map((child: Trunk | undefined) => {
              if (child === undefined) {
                return null
              }
              const numHeadAncestors = AncestorsOf(tree, head).length
              const focusAncestors = AncestorsOf(tree, focus).slice(
                1 + numHeadAncestors
              )
              focusAncestors.push(focus)

              return (
                <Item
                  trunk={child}
                  key={child.serial}
                  focusAncestors={
                    focusAncestors[0] === child ? focusAncestors.slice(1) : null
                  }
                  setHead={setHead}
                  setFocus={setFocus}
                  setNotes={setNotes}
                  setCollapsed={setCollapsed}
                  entryEnabled={entryEnabled}
                  takingNotes={takingNotes}
                  setTitle={setTitle}
                />
              )
            })
          )}
        </div>
      </div>
      <div className="modes">
        <button
          style={{
            color: mode === 'standard' ? '#807861' : '',
          }}
          onClick={() => {
            setMode('standard')
          }}
        >
          std
        </button>
        <button
          style={{
            color: mode === 'standard' ? '' : '#807861',
          }}
          onClick={() => {
            setMode('vim-default')
          }}
        >
          vim
        </button>
      </div>
    </div>
  )
}

export default Magnolia
