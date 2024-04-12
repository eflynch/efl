import update from 'immutability-helper'
import { Faction } from "../state/faction";
import { GameState } from "../state/game-state";
import { StormRoundState } from "../state/round/storm";
import { Action, ActionSpecification, combineActions, combineChecks } from "./action";
import { checkIsFaction, checkIsSU, checkRound, checkTreachery } from "./checks";
import { applyDestroyAllUnits, applyDiscardTreachery } from './common';
import { errorAction } from './error';
import { StormPosition } from '../state/storm';


const applyStormDestruction = (sector:StormPosition):Action => (gameState:GameState) => {
    const destroyedSpaces = [...gameState.mapState.entries()].filter(([, spaceState]) => {
        return spaceState.space.sectors.includes(sector) && (spaceState.space.type === 'sand' || (spaceState.space.type.includes('shielded') && !gameState.shieldWall))
    })
    const action = combineActions(destroyedSpaces.map(([name,]) => {
        return applyDestroyAllUnits(name, [sector], true)
    }))
    return action(gameState)
}


const applyStormRound = (numSpaces:number):Action => (gameState:GameState) => {
    if (numSpaces === 0 ){
        return gameState
    }
    const action = combineActions([...Array(numSpaces).keys()].map(i => gameState.stormPosition + i % 18 as StormPosition).map(sector => {
        return applyStormDestruction(sector)
    }))
    return action(update(gameState, {
        stormPosition: { $set:(gameState.stormPosition + numSpaces) % 18 as StormPosition },
        roundState: {
            $set: {
                type: 'spice'
            }
        }
    }))
}

export const PassWeatherControl:ActionSpecification = {
    name: "pass-weather-control",
    description: "Defer using weather control to the next player",
    argSpec: "",
    checkRelevance: combineChecks([
        checkIsFaction,
        checkRound('storm'),
        (faction, gameState) => !(gameState.roundState as StormRoundState).weatherControlChecks.includes(faction as Faction)
    ]),
    action: (faction) => {
        return (gameState:GameState) => {
            return update(gameState, {
                roundState: {
                    weatherControlChecks: {
                        $push: [faction as Faction]
                    }
                }
            })
        }
    }
}


export const Storm = {
    name: 'storm',
    description: 'Move the storm and destroy units',
    argSpec: "",
    checkRelevance: combineChecks([
        checkIsSU,
        checkRound('storm'),
    ]),
    action: () => (gameState:GameState) => {
        const numSpaces = gameState.stormDeck[0]
        const action = applyStormRound(numSpaces)
        update(action(gameState), {
                stormDeck: {
                    $splice: [[0, 1]]
                }
        })
    }
}


export const WeatherControl = {
    name: "weather-control",
    description: "Decide how far the storm moves this turn from 0 to 10 sectors",
    argSpec: "number",
    checkRelevance: combineChecks([
        checkIsFaction,
        checkRound('storm'),
        checkTreachery('Weather-Control'),
        (faction, gameState) => !(gameState.roundState as StormRoundState).weatherControlChecks.includes(faction as Faction)
    ]),
    action: (faction:Faction|null, args:string) => {
        const numSpaces = parseInt(args)
        if (faction === null){
            return errorAction("Invalid faction")
        }
        if (numSpaces < 0 || numSpaces > 10) {
            return errorAction("Invalid number of spaces")
        }
        return combineActions([
            applyDiscardTreachery(faction as Faction, 'Weather-Control'),
            applyStormRound(numSpaces)
        ])
    }
}