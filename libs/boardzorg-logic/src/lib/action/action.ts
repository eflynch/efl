import { Faction } from "../state/faction";
import { GameState } from "../state/game-state";

export type BadCommand = {
    error: string;
}

export type Action = (gameState:GameState) => GameState|BadCommand;
export type Check = (faction:Faction|null, gameState:GameState) => boolean;

export type ActionSpecification = {
    name: string;
    description: string;
    argSpec:string;
    checkRelevance: Check;
    action:(faction:Faction|null, args:string)=>Action
}

export const combineChecks = (checks:Check[]):Check => {
    return (faction, gameState) => {
        return checks.every(check => check(faction, gameState));
    }
}

export const combineActions = (actions:Action[]):Action => {
    return (gameState:GameState):GameState|BadCommand => {
        return actions.reduce((state:GameState|BadCommand, action:Action):GameState|BadCommand => {
            if (typeof state === 'object') {
                return state 
            }
            return action(state)
        }, gameState)
    }
}