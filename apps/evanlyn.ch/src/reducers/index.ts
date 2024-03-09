import magnolia from './magnolia'
import { MainState } from '../mainstate';
import { Action } from '../actions';
import synchronize from './synchronize';

export default function rootReducer(state:MainState, action:Action):MainState {
    return {
        synchronize: synchronize(state.synchronize, action),
        magnolia: magnolia(state.magnolia, action),
        whose: state.whose
    };
}
