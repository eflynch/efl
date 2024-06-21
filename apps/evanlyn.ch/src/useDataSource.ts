import { useCallback, useEffect } from "react"
import { PartialTrunk, Trunk } from "./mainstate"
import PromiseQueue from './promise-queue'
import { getJSON, putJSON } from "./xhr"
import mglFile from './assets/trunk.mgl'
import { MakeEmptyTree } from "@efl/immutable-tree"
import { useGoogleDocsDataSource } from "./useGoogleDocsDataSource"


const documentID = "1aBii_sITgw9M5BcWT76_XO6lx6ItfMHWxbWpEY-sZAo"


const useLocalDataSource = (onLoad:(trunk:Trunk|PartialTrunk)=>void) => {
    const sync = useCallback((trunk:Trunk) => {
        window.localStorage.setItem('trunk', JSON.stringify(trunk))
    }, [])

    const load = useCallback(() => {
        const trunk =
        JSON.parse(window.localStorage.getItem('trunk') || 'false') ||
        MakeEmptyTree(() => ({ title: '', link: undefined, content: undefined })).trunk
        onLoad(trunk);
    }, [onLoad])

    return [sync, load] as [(trunk:Trunk) => void, () => void]
};

const useDefaultDataSource = (onLoad:(trunk:Trunk|PartialTrunk)=>void) => {
    const sync = useCallback((trunk:Trunk) => {
        // do nothing
    }, [])

    const load = useCallback(() => {
        getJSON(
            mglFile,
            (trunk: unknown) => {
                onLoad(trunk as Trunk)
            },
            () => {
                //console.log("failed to load trunk");
            }
            )
    }, [onLoad])

    return [sync, load] as [(trunk:Trunk) => void, () => void]
};

const useZorgDataSource = (onLoad:(trunk:Trunk|PartialTrunk)=>void) => {
    const sync = useCallback((trunk:Trunk) => {
        PromiseQueue.enqueue(
            putJSON('https://boardzorg.org/zorg/trunk', { trunk: trunk })
        )
    }, [])

    const load = useCallback(() => {
        getJSON(
            'https://boardzorg.org/zorg/trunk',
            (data) => {
                const trunk = (data as {trunk:PartialTrunk}).trunk
                onLoad(trunk);
            },
            () => {
                //console.log("failed to load trunk");
            }
        )
    }, [onLoad])

    return [sync, load] as [(trunk:Trunk) => void, () => void]
}


export const useDataSource = (whose: 'yours' | 'mine' | 'secret' | 'zorg', onLoad:(trunk:Trunk|PartialTrunk)=>void) => {
    const [localSync, localLoad] = useLocalDataSource(onLoad)
    const [defaultSync, defaultLoad] = useDefaultDataSource(onLoad)
    const [zorgSync, zorgLoad] = useZorgDataSource(onLoad)
    const [googleSync, googleLoad, isSignedIn, signIn, signOut, googleIsSyncing] = useGoogleDocsDataSource(onLoad, documentID)
    const sync = useCallback((trunk:Trunk) => {
        switch(whose){
            case 'yours':
                localSync(trunk)
                return;
            case 'mine':
                defaultSync(trunk)
                return;
            case 'secret':
                googleSync(trunk);
                return;
            case 'zorg':
                zorgSync(trunk)
                return;
        }
    }, [defaultSync, googleSync, localSync, whose, zorgSync]);

    useEffect(() => {
        switch(whose){
            case 'mine':
                defaultLoad();
                return;
            case 'yours': {
                localLoad();
                return;
            }
            case 'zorg':
                zorgLoad();
                return;
            case 'secret':
                googleLoad();
                return;
          }
    }, [whose, defaultLoad, zorgLoad, localLoad, googleLoad]);

    const isSyncing = googleIsSyncing;

    return [sync, isSignedIn, signIn, signOut, isSyncing] as [(trunk:Trunk) => void, boolean|undefined, () => void, () => void, boolean];
}