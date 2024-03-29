import React, { useReducer, useEffect, Reducer } from 'react'
import ReactDOM from 'react-dom/client'
import { getJSON, putJSON } from './xhr'

import Magnolia from './components/Magnolia'
import Whose from './components/Whose'
import rootReducer from './reducers'

import { ParseTrunk, MakeEmptyTree } from '@efl/immutable-tree'

import { MainState, PartialTrunk, Trunk } from './mainstate'
import MagnoliaContext from './context'
import PromiseQueue from './promise-queue'

import './index.css'
import { Action } from './actions'

import mglFile from './assets/trunk.mgl'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

function historyEffect(headSerial: string) {
  if (window.location.hash !== '#' + headSerial) {
    window.history.pushState(null, '', '#' + headSerial)
  }
}

function dataSourceEffect(
  trunkTitle: string,
  whose: 'mine' | 'yours' | 'secret'
) {
  if (whose === 'mine') {
    if (trunkTitle === 'boardzorg') {
      window.localStorage.setItem('whose', 'secret')
    }
  }
}

function syncEffect(trunk: Trunk, whose: 'yours' | 'mine' | 'secret') {
  if (whose === 'yours') {
    window.localStorage.setItem('trunk', JSON.stringify(trunk))
  } else if (whose === 'secret') {
    PromiseQueue.enqueue(
      putJSON('https://boardzorg.org/zorg/trunk', { trunk: trunk })
    )
      .then(() => {
        //console.log("synced");
      })
      .catch(() => {
        //console.log("failed to sync");
      })
  }
}

const Main = (props: { initialState: MainState }) => {
  const [mainState, dispatch] = useReducer<Reducer<MainState, Action>>(
    rootReducer,
    props.initialState
  )
  const state = mainState as MainState
  const trunk = state.magnolia.tree.trunk
  const whose = state.whose
  const { title } = trunk.value || { title: '' }

  useEffect(() => {
    syncEffect(trunk, whose)
  }, [trunk, whose])

  useEffect(() => {
    historyEffect(state.magnolia.headSerial || '')
  }, [state.magnolia.headSerial])

  useEffect(() => {
    dataSourceEffect(title, whose)
  }, [title, whose])

  const resetWhose = () => {
    window.localStorage.setItem('whose', 'mine')
    window.localStorage.removeItem('trunk')
    window.location.hash = ''
    window.location.reload()
  }

  return (
    <React.StrictMode>
      <MagnoliaContext.Provider value={{ state, dispatch }}>
        <Magnolia />
        <Whose
          reset={resetWhose}
          changeWhose={(whose) => {
            window.localStorage.setItem('whose', whose)
            window.location.hash = ''
            window.location.reload()
          }}
          whose={state.whose}
        />
      </MagnoliaContext.Provider>
    </React.StrictMode>
  )
}

const renderMagnolia = () => {
  const whose = window.localStorage.getItem('whose')

  let initHead: string | null = null
  if (window.location.hash !== '') {
    initHead = window.location.hash.substring(1)
  }

  const render = (
    trunk: Trunk | PartialTrunk,
    whose: 'mine' | 'yours' | 'secret'
  ) => {
    root.render(
      <Main
        initialState={{
          magnolia: {
            tree: ParseTrunk(trunk, () => ({
              title: '',
              link: undefined,
              content: undefined,
            })),
            headSerial: initHead,
            focusSerial: initHead,
          },
          synchronize: 'ok',
          whose: whose,
        }}
      />
    )
  }

  if (whose === 'mine') {
    getJSON(
      mglFile,
      (trunk: Trunk) => {
        render(trunk, 'mine')
      },
      () => {
        //console.log("failed to load trunk");
      }
    )
  } else if (whose === 'yours') {
    const trunk =
      JSON.parse(window.localStorage.getItem('trunk') || 'false') ||
      MakeEmptyTree(() => ({ title: '', link: undefined, content: undefined }))
    render(trunk, 'yours')
  } else if (whose === 'secret') {
    getJSON(
      'https://boardzorg.org/zorg/trunk',
      (data) => {
        const trunk = data.trunk as PartialTrunk
        render(trunk, 'secret')
      },
      () => {
        //console.log("failed to load trunk");
      }
    )
  }
}

let whoseItNow = window.localStorage.getItem('whose')
if (
  whoseItNow !== 'mine' &&
  whoseItNow !== 'yours' &&
  whoseItNow !== 'secret'
) {
  window.localStorage.setItem('whose', 'mine')
  whoseItNow = 'mine'
}

renderMagnolia()
