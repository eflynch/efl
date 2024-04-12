import update from 'immutability-helper'
import { Faction, FactionState } from "../state/faction";
import { GameState } from "../state/game-state";
import { TreacheryCard } from '../state/treachery';
import { StormPosition } from '../state/storm';
import { SpaceState } from '../state/space';
import { Force, UnitType } from '../state/force';
import { Action, combineActions } from './action';


export const applyDiscardTreachery = (faction:Faction, treachery:TreacheryCard) => (gameState:GameState) => {
    return update(gameState, {
        factions: {
            [faction as Faction]: { $apply: (factionState:FactionState) => {
                return update(factionState, {
                    treacheryHand: {
                        $splice: [[factionState.treacheryHand.indexOf(treachery), 1]]
                    }
                })
            }}
        }
    })
}

export const applyDestroyAllUnits = (space:string, sectors:StormPosition[]|null, stormResilienceActive:boolean):Action => (gameState:GameState) => {
    const spaceToDestroy = gameState.mapState.get(space) 
    if (!spaceToDestroy) {
        return {error: "No such space"}
    }

    const sectorsToDestroy = spaceToDestroy.space.sectors.filter(s => sectors?.includes(s)) || spaceToDestroy.space.sectors
    const actions = combineActions(sectorsToDestroy.flatMap((sector:StormPosition) => {
        return [...spaceToDestroy.forces.entries()].flatMap(([faction, forces]) => {
            const force = forces.get(sector) as Force
            const half = (gameState.factions.get(faction)?.powers.find(power => power.type === 'StormResilience') !== undefined) && stormResilienceActive
            return [
                applyDestroyUnits(space, sector, faction, 'normal', half ? Math.ceil(force.normal / 2) : force.normal),
                applyDestroyUnits(space, sector, faction, 'fedaykin', half ? Math.ceil(force.fedaykin / 2) : force.fedaykin),
                applyDestroyUnits(space, sector, faction, 'sardaukar', half ? Math.ceil(force.sardaukar / 2) : force.sardaukar),
            ]
        })
    }))
    return actions(gameState)
}

export const applyDestroyUnits = (space:string, sector:StormPosition, faction:Faction, unitType:UnitType, unitCount:number) => (gameState:GameState) => {
    if ((gameState.mapState.get(space)?.forces.get(faction)?.get(sector)?.[unitType] ?? 0) <= unitCount){
        return {error: "Not enough units to destroy"}
    }
    return update(gameState, {
        factions: {
            [faction]: { $apply : (factionState:FactionState) => {
                const kwisatzHaderach = factionState.powers.find(power => power.type === 'KwisatzHaderach')
                if (kwisatzHaderach !== undefined) {
                    return update(factionState, {
                        forcesInTanks: {
                            [unitType]: {$apply: (units:number) => units + 1}
                        },
                        powers: {
                            [factionState.powers.indexOf(kwisatzHaderach)]: {
                                forcesToLoseToRevealKwisatzHaderach: {$apply: forces => Math.max(0, forces - 1)}
                            }
                        }
                    })
                }
                return update(factionState, {
                    forcesInTanks: {
                        [unitType]: {$apply: (units:number) => units + 1}
                    }
                })
            }}
        },
        mapState: {
            [space]: {
                $apply: (spaceState:SpaceState) => {
                    return update(spaceState, {
                        forces: {
                            [faction]: {
                                [sector]: {
                                    $apply: (force:Force) => {
                                        return update(force, {
                                            [unitType]: { $apply: (units:number) => units - 1} 
                                        })
                                    }
                                }
                            }
                        }
                    })
                }
            }
        }
    })
}