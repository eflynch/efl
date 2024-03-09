import { Tree as MagTree, Trunk as MagTrunk, PartialTrunk as MagPartialTrunk } from "./immutable-tree";

export type Value ={
    title:string,
    link?:string,
    content?:string,
    note?:string
}

export type Tree = MagTree<Value>;
export type Trunk = MagTrunk<Value>;
export type PartialTrunk = MagPartialTrunk<Value>;

export type MagnolialState = {
    tree:Tree,
    headSerial:string|null,
    focusSerial:string|null
}

export type SyncState = 'ok'|'pending'|'failed'

export type WhoseState = 'mine'|'yours'|'secret'

export type MainState = {
    magnolia:MagnolialState,
    whose:WhoseState;
    synchronize:SyncState;
};