import { Faction } from "./faction";
import { Turn } from "./turn";

export type TueksSietch = {
    type: "TueksSietch",
}
export type ControlOfShipment = {
    type: "ControlOfShipment",
}
export type ShippingOffWorld = {
    type: "ShippingOffWorld",
}
export type ShippingCrossWorld = {
    type: "ShippingCrossWorld",
}
export type FinalVictory = {
    type: "FinalVictory",
}
export type HalfPrice = {
    type: "HalfPrice",
}
export type TurnOrder = {
    type: "TurnOrder",
}
export type Auctioneer = {
    type: "Auctioneer",
}
export type Sardaukar = {
    type: "Sardaukar",
}
export type Carthag = {
    type: "Carthag",
}
export type Traitors = {
    type: "Traitors",
}
export type BonusTreachery = {
    type: "BonusTreachery",
}
export type LeaderCapture = {
    type: "LeaderCapture",
    capturedLeaders: []
}
export type SietchTabr = {
    type: "SietchTabr",
}
export type GreatFlatNatives = {
    type: "GreatFlatNatives",
}
export type FastMovement = {
    type: "FastMovement",
}
export type ShaiHulud = {
    type: "ShaiHulud",
}
export type WormControl = {
    type: "WormControl",
}
export type EcologicalVictory = {
    type: "EcologicalVictory",
}
export type Meteorology = {
    type: "Meteorology",
}
export type FullStrengthUnits = {
    type: "FullStrengthUnits",
}
export type Fedaykin = {
    type: "Fedaykin",
}
export type StormResilience = {
    type: "StormResilience",
}
export type Arakeen = {
    type: "Arakeen",
}
export type SpiceVision = {
    type: "SpiceVision",
}
export type KwisatzHaderach = {
    type: "KwisatzHaderach",
    forcesToLoseToRevealKwisatzHaderach: number;
    // Note that the Kwisatz Haderach interacts somewhat strangely with the other tank leaders
    // If kwisatz_haderach_tanks is "None", the Kwisatz Haderach is not in the tanks.
    // If this is a number, that is the death count all other leaders must exceed before
    // the Kwisatz Haderach can be revived.
    deathCountToReviveKwisatzHarderach: number|null 
}
export type Prescience = {
    type: "Prescience",
}
export type OneFreePlacement = {
    type: "OneFreePlacement",
}
export type Prediction = {
    type: "Prediction",
    faction?:Faction;
    turn?:Turn;
}

export type Voice = {
    type: "Voice",
}
export type CharitableFoundation = {
    type: "CharitableFoundation",
}
export type WorthlessKarama = {
    type: "WorthlessKarama",
}
export type Advisors = {
    type: "Advisors",
}


export type Power = TueksSietch | ControlOfShipment | ShippingOffWorld | ShippingCrossWorld | FinalVictory | HalfPrice | TurnOrder | Auctioneer | Sardaukar | Carthag | Traitors | BonusTreachery | LeaderCapture | SietchTabr | GreatFlatNatives | FastMovement | ShaiHulud | WormControl | EcologicalVictory | Meteorology | FullStrengthUnits | Fedaykin | StormResilience | Arakeen | SpiceVision | KwisatzHaderach | Prescience | OneFreePlacement | Prediction | Voice | CharitableFoundation | WorthlessKarama | Advisors;

export type PowerKind = Power['type'];

export const createPower = (kind:PowerKind):Power => {
    switch(kind) {
        case 'KwisatzHaderach':
            return {
                type: 'KwisatzHaderach',
                forcesToLoseToRevealKwisatzHaderach: 7,
                deathCountToReviveKwisatzHarderach: null
            }
        case 'Prediction':
            return {
                type: 'Prediction'
            }
        case 'Auctioneer':
            return {
                type: 'Auctioneer'
            }
        case 'LeaderCapture':
            return {
                type: 'LeaderCapture',
                capturedLeaders: []
            }
        default:
            return {
                type: kind
            } as Power
    }
}