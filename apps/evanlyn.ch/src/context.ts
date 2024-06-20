import { Dispatch, createContext } from 'react'
import { MagnolialState, Value } from './mainstate'
import { Action } from './actions'
import { MakeEmptyTree } from '@efl/immutable-tree'

const MagnoliaContext = createContext<{
  magnolia: MagnolialState
  dispatch: Dispatch<Action>
}>({
  magnolia: {
    tree: MakeEmptyTree<Value>(() => ({ title: '' })),
    headSerial: '',
    focusSerial: '',
  },
  dispatch: (action: Action) => {
    console.log(action)
  },
})
export default MagnoliaContext
