import { Action } from "./action/action"
import { Faction } from "./state/faction"
import { GameState, createGameState } from "./state/game-state"
import { TreacheryCard } from "./state/treachery"


export type Session = {
    seed:string 
    gameLog: GameState[]
    actionLog: Action[]
    commandLog: string[]
}


export const createSession = (factions:Faction[], treacheryCardsInPlay:TreacheryCard[], seed:string):Session => ({
    seed: seed,
    gameLog: [createGameState(factions, treacheryCardsInPlay, seed)],
    actionLog: [],
    commandLog: []
})

export const executeCommand = (session:Session, command:string):Session => {
    const currentGameState = session.gameLog[session.gameLog.length - 1]

}

function replacer(key:string, value:any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
  }
  function reviver(key:string, value:any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

export const serializeSession = (session:Session):string => {
    return JSON.stringify({
        seed: session.seed,
        factions: session.gameLog[0].factions.keys(),
        treacheryCardsInPlay: session.gameLog[0].treacheryCardsInPlay,
        commandLog: session.commandLog,
    }, replacer)
}

export const deserializeSession = (serialized:string):Session => {
    const parsed = JSON.parse(serialized, reviver)
    const {seed, factions, treacheryCardsInPlay, commandLog} = parsed
    const session = createSession(factions, treacheryCardsInPlay, seed)

    return session
}