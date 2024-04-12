import { Faction } from "../state/faction";
import { GameState } from "../state/game-state";
import { RoundState } from "../state/round";
import { TreacheryCard } from "../state/treachery";


export const checkRound = (round:RoundState['type']) => (faction:Faction|null, gameState:GameState) => {
    return gameState.roundState.type === round;
}

interface HasStage<T> {
    stage:T
}

export const checkStage = <S>(stage:S) => (faction:Faction|null, gameState:GameState) => {
    return (gameState.roundState as unknown as HasStage<S>).stage === stage;
}

export const checkIsFaction = (faction:Faction|null) => faction !== null
export const checkIsSU = (faction:Faction|null) => faction === null


export const checkTreachery = (treachery:TreacheryCard) => (faction:Faction|null, gameState:GameState) => {
    return gameState.factions.get(faction as Faction)?.treacheryHand.includes(treachery) || false;
}
