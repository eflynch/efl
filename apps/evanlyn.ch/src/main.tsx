import React, { useReducer, useEffect, Reducer, useCallback } from 'react'
import ReactDOM from 'react-dom/client'

import Magnolia from './components/Magnolia'
import Whose from './components/Whose'
import rootReducer from './reducers'

import { MainState, PartialTrunk, Trunk, WhoseState } from './mainstate'
import MagnoliaContext from './context'

import './index.css'
import { Action } from './actions'
import { useDataSource } from './useDataSource'


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

function historyEffect(headSerial: string) {
  if (window.location.hash !== '#' + headSerial) {
    window.history.pushState(null, '', '#' + headSerial)
  }
}

function dataSourceEffect(
  trunkTitle: string,
  whose: WhoseState
) {
  if (whose === 'mine') {
    if (trunkTitle === 'boardzorg') {
      window.localStorage.setItem('whose', 'secret')
    }
  }
}

const Main = (props: { whose: WhoseState }) => {
  const [mainState, dispatch] = useReducer<Reducer<MainState, Action>>(
    rootReducer,
    {
      whose: props.whose,
      magnolia: undefined,
      synchronize: 'ok',
    }
  )
  const state = mainState as MainState
  const trunk = state.magnolia?.tree?.trunk
  const whose = state.whose
  const title = trunk?.value?.title || ''

  const onLoad = useCallback((trunk: Trunk | PartialTrunk) => {
    let initHead: string | null = null
    if (window.location.hash !== '') {
      initHead = window.location.hash.substring(1)
    }
    dispatch({type: 'SET_TRUNK', child: trunk, initHead: initHead})
  }, [dispatch])

  const [sync, isSignedIn, signIn, signOut] = useDataSource(whose, onLoad) 

  useEffect(() => {
    if (whose === 'secret' && isSignedIn !== undefined && !isSignedIn) {
      signIn()
    }
  }, [whose, isSignedIn, signIn])

  useEffect(() => {
    if (trunk !== undefined) {
      const timeout = () => {
        sync(trunk);
      }
      const timeoutId = setTimeout(timeout, 5000);
      return () => {
        clearTimeout(timeoutId);
      }
    }
  }, [trunk, sync])

  useEffect(() => {
    historyEffect(state.magnolia?.headSerial || '')
  }, [state.magnolia?.headSerial])

  useEffect(() => {
    if (title !== undefined) {
      dataSourceEffect(title, whose)
    }
  }, [title, whose])

  const resetWhose = () => {
    window.localStorage.setItem('whose', 'mine')
    window.localStorage.removeItem('trunk')
    window.location.hash = ''
    window.location.reload()
  }

  return (
    <React.StrictMode>
      {state.magnolia && <MagnoliaContext.Provider value={{ magnolia: state.magnolia, dispatch }}>
        <Magnolia />
      </MagnoliaContext.Provider>
      }
      <Whose
          reset={resetWhose}
          changeWhose={(whose) => {
            window.localStorage.setItem('whose', whose)
            window.location.hash = ''
            window.location.reload()
          }}
          whose={state.whose}
          signOut={isSignedIn ? signOut : undefined}
        />
    </React.StrictMode>
  )
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

root.render(
  <Main
    whose={whoseItNow as WhoseState}
  />
)
