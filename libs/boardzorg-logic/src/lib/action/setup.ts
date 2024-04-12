import update from 'immutability-helper'
import { Faction, FactionState } from "../state/faction";
import { GameState } from "../state/game-state";
import { ActionSpecification, combineChecks } from "./action";
import { checkIsFaction, checkRound, checkStage } from "./checks";
import { StormPosition } from '../state/storm';


export const PlaceToken:ActionSpecification = {
    name: "place-token",
    description: "Place a token around the board to determine term order",
    argSpec: "sector",
    checkRelevance: combineChecks([
        checkRound('setup'),
        checkStage('token-placement'),
        checkIsFaction,
        (faction:Faction|null, gameState:GameState) => gameState.factions.get(faction as Faction)?.tokenPosition === null
    ]),
    action: (faction, args) => (gameState:GameState) => {
        return update(gameState, {
            factions: {
                [faction as Faction]: {
                    $apply : (factionState:FactionState) => update(factionState, {
                        tokenPosition: { $set: parseInt(args) as StormPosition }
                    })
                }
            }
        })
    }
}