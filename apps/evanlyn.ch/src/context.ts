import { Dispatch, createContext, } from 'react';
import { MainState, Value } from './mainstate';
import { Action } from './actions';
import { MakeEmptyTree } from './immutable-tree';

const MagnoliaContext = createContext<{state:MainState, dispatch: Dispatch<Action>}>({
    state: {
        whose: "mine",
        synchronize: "ok",
        magnolia: {
            tree:MakeEmptyTree<Value>(()=>({title:""})),
            headSerial: "", focusSerial: ""
        }
    },
    dispatch: (action:Action) => {
        console.log(action);
    }
});
export default MagnoliaContext;
