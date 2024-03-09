import update, { CustomCommands, Spec } from 'immutability-helper';

export type Trunk<T> = {
    childs: Trunk<T>[],
    value: T|undefined,
    collapsed: boolean,
    serial: string,
    parent: string|null,
};

export type PartialTrunk<T> = {
    childs: PartialTrunk<T>[],
    value: T|undefined,
    collapsed?: boolean,
    serial?: string,
    parent?: string|null,
}

export type Tree<T> = {
    undo: {forwardHash:Update<T>, backwardHash:Update<T>}[]
    redo: {forwardHash:Update<T>, backwardHash:Update<T>}[]
    trunk: Trunk<T>
    lookup: {[key:string]: Trunk<T>|PartialTrunk<T>}
    createBaseValue: ()=>T
    makeSerial:()=>string
};

type Hash<T, C extends CustomCommands<object> = never> = Spec<T, C>

type Update<T> = {trunkHash:Hash<Trunk<T>>, deletedSerials?:string[]}

type HashIteration<T, C extends CustomCommands<object> = never> = {
    childs?: Spec<Trunk<T>[], C>
    value?: Spec<T|undefined, C>,
    collapsed?: Spec<boolean, C>,
    serial?: Spec<string, C>,
    parent?: Spec<string|null, C>,
}

export const CreateSerialGenerator = (size:number) => () => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const text = (function() {
        const results = [];
        for (let i=0; i < size; i++) {
            results.push(possible.charAt(Math.floor(Math.random() * possible.length)));
        }
        return results;
    })();
    return text.join('');
};

export function ParseTrunk<T>(trunk:Trunk<T>|PartialTrunk<T>, createBaseValue:()=>T, makeSerial=CreateSerialGenerator(5), newSerials=false):Tree<T> {
    const lookup:{[key:string]: Trunk<T>|PartialTrunk<T>} = {}; 
    const formatChild = (child:Trunk<T>|PartialTrunk<T>, parent:string|null) => {
        if (child.value === undefined || child.value === null){
            child.value = createBaseValue();
        }
        if (child.childs === undefined){
            child.childs = [];
        }
        if (child.collapsed === undefined){
            child.collapsed = false;
        }

        child.parent = parent;
        if (child.serial === undefined || newSerials){
            child.serial = makeSerial();
        }
        lookup[child.serial] = child;
        for (let i=0; i < child.childs.length; i++){
            formatChild(child.childs[i] as Trunk<T>, child.serial);
        }
    };
    formatChild(trunk, null);
    return {
        undo: [],
        redo: [],
        trunk: trunk as Trunk<T>,
        lookup: lookup,
        createBaseValue: createBaseValue,
        makeSerial: makeSerial
    };
}

export function MakeEmptyTree<T>(createBaseValue:()=>T, makeSerial=CreateSerialGenerator(5)):Tree<T> {
    return ParseTrunk<T>({
        childs: [{childs:[], collapsed: false, value: undefined}],
        value: undefined,
        collapsed: false
    }, createBaseValue, makeSerial);
}

const updateLookup = <T>(tree:Tree<T>, deletedSerials?:string[]) => {
    const lookupOp:Spec<{[key:string]: Trunk<T>|PartialTrunk<T>}, never> = {};

    const fixNodeHash = (trunk:Trunk<T>) => {
        if (tree.lookup[trunk.serial] === undefined) {
            lookupOp[trunk.serial] = {$set: trunk};
        } else if (tree.lookup[trunk.serial] === trunk) {
            return;
        }
        lookupOp[trunk.serial] = {$set: trunk};
        trunk.childs.forEach((child)=>{
            fixNodeHash(child as Trunk<T>);
        });
    };
    fixNodeHash(tree.trunk);

    return update(tree, {
        lookup: {
            ...lookupOp,
            $unset: (deletedSerials ?? [])
        }
    });
};
export function ApplyHash<T>(tree:Tree<T>, forwardHash:Update<T>, backwardHash:Update<T>):Tree<T> {
    const hash:Hash<Tree<T>> = {
        undo: {$push: [{forwardHash, backwardHash}]},
        redo: {$set: []}
    };
    if (forwardHash.trunkHash){
        hash.trunk = forwardHash.trunkHash;
    }
    return updateLookup(update(tree, hash), forwardHash.deletedSerials);
}

export const Undo = <T>(tree:Tree<T>) => {
    if (tree.undo.length) {
        const {forwardHash, backwardHash} = tree.undo[tree.undo.length - 1];
        return updateLookup(update(tree, {
            trunk: backwardHash.trunkHash,
            undo: {$splice: [[tree.undo.length - 1, 1]] },
            redo: {$push: [{forwardHash, backwardHash}]},
        }), backwardHash.deletedSerials);
    } else {
        return tree;
    }
};

export const Redo = <T>(tree:Tree<T>) => {
    if (tree.redo.length) {
        const {forwardHash, backwardHash} = tree.redo[tree.redo.length - 1];
        return updateLookup(update(tree, {
            trunk: forwardHash.trunkHash,
            undo: {$push: [{forwardHash, backwardHash}]},
            redo: {$splice: [[tree.redo.length - 1, 1]] },
        }), forwardHash.deletedSerials);
    } else {
        return tree;
    }
};


function makeChild<T>(makeSerial:()=>string, parentSerial:string):Trunk<T> {
    return {
        value: undefined,
        collapsed: false,
        serial: makeSerial(),
        parent: parentSerial,
        childs: []
    }
}

export function ParentOf<T>(tree:Tree<T>, child:Trunk<T>):Trunk<T>|undefined {
    if (child.parent === undefined){
        return undefined;
    }
    return tree.lookup[child.parent as string] as Trunk<T>;
}

export function IndexOf<T>(tree:Tree<T>, child:Trunk<T>):number {
    if (child.parent === undefined){return 0;}
    return (ParentOf(tree, child) as Trunk<T>).childs.indexOf(child);
}

export function AncestorsOf<T>(tree:Tree<T>, target:Trunk<T>|null):Trunk<T>[] {
    if (target === null){
        return [];
    }
    const ancestors = [];
    let parent = ParentOf(tree, target);
    while (parent !== undefined){
        ancestors.unshift(parent);
        parent = ParentOf(tree, parent);
    }
    return ancestors;
}

export function PredOf<T>(tree:Tree<T>, child:Trunk<T>):Trunk<T>|undefined{
    if (child === tree.trunk){
        return undefined;
    }
    if (IndexOf(tree, child) === 0){
        return ParentOf(tree, child);
    }
    const lowestOpenLeaf:(trunk:Trunk<T>)=>Trunk<T> = (trunk:Trunk<T>) => {
        if (trunk.collapsed || trunk.childs.length === 0){
            return trunk;
        }
        return lowestOpenLeaf(trunk.childs[trunk.childs.length - 1] as Trunk<T>);
    }
    const parent = ParentOf(tree, child) as Trunk<T>;
    return lowestOpenLeaf(parent.childs[IndexOf(tree, child) - 1 as number] as Trunk<T>);
}

export function SuccOf<T>(tree:Tree<T>, child:Trunk<T>) {
    if (!child.collapsed && child.childs.length > 0){
        return child.childs[0];
    }

    const parent = ParentOf(tree, child) as Trunk<T>;
    const childIdx = IndexOf(tree, child);
    if (childIdx < parent.childs.length - 1){
        return parent.childs[childIdx + 1];
    }

    const findIt:(trunk:Trunk<T>)=>Trunk<T>|undefined = (trunk:Trunk<T>) => {
        if (trunk === tree.trunk){
            return undefined;
        }
        const parent = ParentOf(tree, trunk) as Trunk<T>;
        const childIdx = IndexOf(tree, trunk);
        if (childIdx < parent.childs.length - 1){
            return parent.childs[childIdx + 1];
        }

        return findIt(parent);
    };

    return findIt(ParentOf(tree, child) as Trunk<T>);
}

export function Lookup<T>(tree:Tree<T>, serial:string):Trunk<T>|undefined {
    return tree.lookup[serial] as Trunk<T>;
}

function generateTrunkHash<T>(tree:Tree<T>, target:Trunk<T>, callback:(hash:HashIteration<T>)=>void):Hash<Trunk<T>> {
    const parents = AncestorsOf(tree, target);
    parents.push(target);
    const hash:Hash<Trunk<T>> = {};
    let iter:HashIteration<T> = hash;
    for (let i=1; i < parents.length; i++){
        const previousParent = parents[i-1];
        const parent = parents[i];
        const parentIdx = previousParent.childs.indexOf(parent);
        const newHash = {};
        iter.childs = {
            [parentIdx]: newHash
        };
        iter = newHash;
    }
    callback(iter);
    return hash;
}

export function SetCollapsed<T>(tree:Tree<T>, child:Trunk<T>, state:boolean):Tree<T> {
    const oldState = child.collapsed;
    const forwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.collapsed = {$set: state}
    });
    const backwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.collapsed = {$set: oldState}
    });
    return ApplyHash(tree, {trunkHash: forwardTrunkHash, deletedSerials:[]}, {trunkHash: backwardTrunkHash, deletedSerials:[]});
}

export function SetValue<T>(tree:Tree<T>, child:Trunk<T>, value:T):Tree<T> {
    const oldValue = child.value;
    if (value === oldValue){return tree;}

    // Weird hack
    const valueWithTitle = value as unknown as {title?:string};
    if (valueWithTitle.title !== undefined && valueWithTitle.title === "<br>"){
        valueWithTitle.title = "";
    }

    const forwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.value = {$set: value};
    });
    const backwardTrunkHash = generateTrunkHash(tree, child, targetHash => {
        targetHash.value = {$set: oldValue};
    });
    return ApplyHash(tree, {trunkHash: forwardTrunkHash}, {trunkHash: backwardTrunkHash});
}


export function NewChild<T>(tree:Tree<T>, child:Trunk<T>):{tree:Tree<T>, newItem:Trunk<T>} {
    const newItem = makeChild<T>(tree.makeSerial, child.serial);
    newItem.value = tree.createBaseValue();


    const forwardTrunkHash:Hash<Trunk<T>> = generateTrunkHash(tree, child, targetHash => {
        targetHash.childs = {$splice: [[0, 0, newItem]]};
    });

    const backwardTrunkHash:Hash<Trunk<T>>  = generateTrunkHash(tree, child, targetHash => {
        targetHash.childs = {$splice: [[0, 1]]};
    });
    return {
        tree: ApplyHash(tree,
            {trunkHash: forwardTrunkHash},
            {trunkHash: backwardTrunkHash, deletedSerials: [newItem.serial]}),
        newItem: newItem
    };
}

export function NewSibling<T>(tree:Tree<T>, child:Trunk<T>, index:number, sibling:Trunk<T>|null=null):{tree:Tree<T>, newItem:Trunk<T>|undefined} {
    if (child === tree.trunk){
        return {tree:tree, newItem:undefined};
    }
    const parent = ParentOf(tree, child) as Trunk<T>;

    const newItem = (() => {
        if (sibling) {
            return sibling as Trunk<T>
        }
        const newItem = makeChild<T>(tree.makeSerial, child.parent as string);
        newItem.value = tree.createBaseValue();
        return newItem;
    })();


    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[index, 0, newItem]]};
    });

    const backwardTrunkHash  = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[index, 1]]};
    });
    return {
        tree: ApplyHash(tree,
            {trunkHash: forwardTrunkHash},
            {trunkHash: backwardTrunkHash, deletedSerials: [newItem.serial]}),
        newItem: newItem
    };
}

export function NewItemBelow<T>(tree:Tree<T>, child:Trunk<T>):{tree:Tree<T>, newItem:Trunk<T>|undefined} {
    return NewSibling(tree, child, IndexOf(tree, child) + 1); 
}

export function NewItemAbove<T>(tree:Tree<T>, child:Trunk<T>):{tree:Tree<T>, newItem:Trunk<T>|undefined} {
    return NewSibling(tree, child, IndexOf(tree, child)); 
}

export function DeleteItem<T>(tree:Tree<T>, child:Trunk<T>):Tree<T> {
    if (child === tree.trunk) {
        return tree;
    }

    const parent = ParentOf(tree, child) as Trunk<T>;
    if (parent === tree.trunk && tree.trunk.childs.length === 1) {
        return tree;
    }

    const childIndex = IndexOf(tree, child);

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[childIndex, 1]]};
    });
    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {$splice: [[childIndex, 0, child]]};
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash, deletedSerials: [child.serial]},
        {trunkHash: backwardTrunkHash});
}

export function IndentItem<T>(tree:Tree<T>, child:Trunk<T>):Tree<T> {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk<T>;

    const oldIndex = IndexOf(tree, child);
    if (oldIndex === 0){
        return tree;
    }

    const newParent = parent.childs[oldIndex - 1];
    const newParentOldCollapsedState = newParent.collapsed;
    const newParentOldChildCount = newParent.childs.length;

    const newChild = update(child, {
        parent: {$set: newParent.serial}
    });

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {
            [oldIndex - 1]: {
                childs: {$push: [newChild]},
                collapsed: {$set: false}
            },
            $splice: [[oldIndex, 1]],
        };
    });

    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        targetHash.childs = {
            [oldIndex - 1]: {
                childs: {$splice: [newParentOldChildCount, 1]},
                collapsed: {$set: newParentOldCollapsedState}
            },
            $splice: [[oldIndex, 0, child]],
        };
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash},
        {trunkHash: backwardTrunkHash});
}

export function OutdentItem<T>(tree:Tree<T>, child:Trunk<T>):Tree<T> {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk<T>;

    if (parent === tree.trunk) {
        return tree;
    }
    const newParent = ParentOf(tree, parent) as Trunk<T>; 

    const childIndex = IndexOf(tree, child);
    const parentIndex = IndexOf(tree, parent);


    const newChild = update(child, {
        parent: {$set: newParent.serial}
    });

    const forwardTrunkHash = generateTrunkHash(tree, newParent, targetHash => {
        targetHash.childs = {
            $splice: [[parentIndex + 1, 0, newChild]],
            [parentIndex]: {
                childs: {$splice: [[childIndex, 1]]}
            }
        };
    });

    const backwardTrunkHash = generateTrunkHash(tree, newParent, targetHash => {
        targetHash.childs = {
            $splice: [[parentIndex + 1, 1]],
            [parentIndex]: {
                childs: {$splice: [[childIndex, 0, child]]}
            }
        };
    });

    return ApplyHash(tree,
        {trunkHash: forwardTrunkHash},
        {trunkHash: backwardTrunkHash});
}

export function MoveItem<T>(tree:Tree<T>, child:Trunk<T>, index:number):Tree<T> {
    if (child === tree.trunk){
        return tree;
    }
    const parent = ParentOf(tree, child) as Trunk<T>;

    let newIndex = Math.max(index, 0);
    if (index >= parent.childs.length) {
        newIndex = parent.childs.length - 1;
    }
    const oldIndex = IndexOf(tree, child);

    if (oldIndex === newIndex) {
        return tree;
    }

    const forwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        let spliceOp:Spec<Trunk<T>[], never>;
        if (oldIndex > newIndex) {
            spliceOp = {$splice: [[oldIndex, 1], [newIndex, 0, child]]};
        } else {
            spliceOp = {$splice: [[newIndex + 1, 0, child], [oldIndex, 1]]};
        }
        targetHash.childs = spliceOp;
    });

    const backwardTrunkHash = generateTrunkHash(tree, parent, targetHash => {
        let spliceOp:Spec<Trunk<T>[], never>;
        if (newIndex > oldIndex) {
            spliceOp = {$splice:[[newIndex, 1], [oldIndex, 0, child]]};
        } else {
            spliceOp = {$splice:[[oldIndex + 1, 0, child], [newIndex, 1]]};
        }
        targetHash.childs = spliceOp;
    });

    return ApplyHash(tree, {trunkHash: forwardTrunkHash}, {trunkHash: backwardTrunkHash});
}

export function MoveItemUp<T>(tree:Tree<T>, child:Trunk<T>):Tree<T> {
    const newIndex = IndexOf(tree, child) - 1;
    return MoveItem(tree, child, newIndex);
}

export function MoveItemDown<T>(tree:Tree<T>, child:Trunk<T>):Tree<T> {
    const newIndex = IndexOf(tree, child) + 1;
    return MoveItem(tree, child, newIndex);
}

export function SpliceSubTree<T>(tree:Tree<T>, child:Trunk<T>, subtree:Trunk<T>):{tree:Tree<T>,newItem:Trunk<T>|undefined} {
    const parent = ParentOf(tree, child);
    const newSerialsSubTree = ParseTrunk(JSON.parse(JSON.stringify(subtree)), tree.createBaseValue, tree.makeSerial, true).trunk;
    newSerialsSubTree.parent = parent?.serial || null;
    const newSibling = NewSibling(tree, child, IndexOf(tree, child) + 1, newSerialsSubTree); 
    const newTree = DeleteItem(newSibling.tree, child);
    return {tree:newTree, newItem:newSibling.newItem};
}
