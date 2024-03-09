import { Action } from "../actions";
import { SyncState } from "../mainstate";

const synchronize = (state:SyncState, action:Action):SyncState => {
    switch (action.type) {
        case 'REMOTESYNC':
            return "pending";
        case 'REMOTESYNC_ERROR':
            return "failed"
        case 'REMOTESYNC_OK':
            return "ok"
        default:
            return state
    }
}
export default synchronize;
