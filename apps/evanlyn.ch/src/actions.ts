import { Trunk, Value } from "./mainstate";

export type REMOTESYNC = {
    type: 'REMOTESYNC'
};
export type REMOTESYNC_ERROR = {
    type: 'REMOTESYNC_ERROR'
}
export type REMOTESYNC_OK = {
    type: 'REMOTESYNC_OK'
}

export type PASTE = {
    child:Trunk,
    subtree:Trunk,
    type: 'PASTE',
}

export type DELETE = {
    child:Trunk,
    type: 'DELETE',
}
export type INDENT = {
    child:Trunk,
    type: 'INDENT',
}
export type OUTDENT = {
    child:Trunk,
    type: 'OUTDENT',
}
export type SET_FOCUS = {
    child:Trunk,
    type: 'SET_FOCUS',
}
export type FOCUS_UP = {
    child:Trunk,
    type: 'FOCUS_UP',
}
export type FOCUS_DOWN = {
    child:Trunk,
    type: 'FOCUS_DOWN',
}
export type SHIFT_UP = {
    child:Trunk,
    type: 'SHIFT_UP',
}
export type SHIFT_DOWN = {
    child:Trunk,
    type: 'SHIFT_DOWN',
}
export type NEW_ABOVE = {
    child:Trunk,
    type: 'NEW_ABOVE',
}
export type NEW_BELOW = {
    child:Trunk,
    type: 'NEW_BELOW',
}
export type NEW = {
    child:Trunk,
    type: 'NEW',
}
export type UNDO = {
    type: 'UNDO',
}
export type REDO = {
    type: 'REDO',
}
export type MODIFY = {
    child:Trunk, value:Value,
    type: 'MODIFY',
}
export type SET_COLLAPSED = {
    child:Trunk, collapsed:boolean,
    type: 'SET_COLLAPSED',
}

export type SET_HEAD = {
    child:Trunk,
    type: 'SET_HEAD',
}

export type DELVE_IN = {
    child:Trunk,
    type: 'DELVE_IN',
}
export type DELVE_OUT = {
    child:Trunk,
    type: 'DELVE_OUT',
}


export type SyncAction =
    REMOTESYNC |
    REMOTESYNC_ERROR |
    REMOTESYNC_OK

export type MagnoliaAction =
    PASTE |
    DELETE |
    INDENT |
    OUTDENT |
    SET_FOCUS |
    FOCUS_UP |
    FOCUS_DOWN |
    SHIFT_UP |
    SHIFT_DOWN |
    NEW_ABOVE |
    NEW_BELOW |
    NEW |
    UNDO |
    REDO |
    MODIFY |
    SET_COLLAPSED |
    SET_HEAD |
    DELVE_IN |
    DELVE_OUT 

export type Action = SyncAction | MagnoliaAction
