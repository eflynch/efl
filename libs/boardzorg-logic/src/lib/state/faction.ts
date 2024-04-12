import { Leader } from "./leader";
import { Power, PowerKind, createPower } from "./powers";
import { StormPosition } from "./storm";
import { TreacheryCard } from "./treachery";

export const FactionList = ["Atreides", "Harkonnen", "Emperor", "Fremen", "Bene-Gesserit", "Guild"] as const;
export type Faction = typeof FactionList[number];

export type FactionState = {
    name:string;
    initialSpice:number;
    freeRevival:number;
    handLimit:number;
    powers:Power[];

    leaders: Leader[];
    treacheryHand: TreacheryCard[];
    traitors: Leader[];
    rejectedTraitors: Leader[];
    forcesInReserve:{normal?:number, fedaykin?:number, sardaukar?:number};
    forcesInTanks: {normal?:number, fedaykin?:number, sardaukar?:number};
    spice:number;
    leaderDeathCount: {[leader:string]:number};
    tokenPosition: StormPosition|null;
    factionKaramaUsed:boolean;
}

const GuildPowers:PowerKind[] = ["TueksSietch", "ControlOfShipment", "ShippingOffWorld", "ShippingCrossWorld", "FinalVictory", "HalfPrice", "TurnOrder"];
const EmperorPowers:PowerKind[]  = ["Auctioneer", "Sardaukar"];
const HarkonnenPowers:PowerKind[]  = ["Carthag", "Traitors", "BonusTreachery", "LeaderCapture"];
const FremenPowers:PowerKind[]  = ["SietchTabr", "GreatFlatNatives", "FastMovement", "ShaiHulud", "WormControl", "EcologicalVictory", "Meteorology", "FullStrengthUnits", "Fedaykin", "StormResilience"];
const AtrediesPowers:PowerKind[]  = ["Arakeen", "SpiceVision", "KwisatzHaderach", "Prescience"];
const BeneGesseritPowers:PowerKind[]  = ["OneFreePlacement", "Prediction", "Voice" , "CharitableFoundation", "WorthlessKarama", "Advisors"];


export const createFactionState = (faction:Faction):FactionState => {
    const generic = {
        name: faction,
        leaders: [],
        treacheryHand: [],
        traitors: [],
        rejectedTraitors: [],
        forcesInReserve: {},
        forcesInTanks: {},
        spice: 0,
        leaderDeathCount: {},
        tokenPosition: null,
        factionKaramaUsed: false
    }
    switch(faction) {
        case 'Atreides':
            return {
                ...generic,
                powers:AtrediesPowers.map(kind => createPower(kind)),
                initialSpice: 10,
                freeRevival: 2,
                handLimit: 4
            }
        case 'Bene-Gesserit':
            return {
                ...generic,
                powers:BeneGesseritPowers.map(kind => createPower(kind)),
                initialSpice: 5,
                freeRevival: 2,
                handLimit: 4
            }
        case 'Emperor':
            return {
                ...generic,
                powers:EmperorPowers.map(kind => createPower(kind)),
                initialSpice: 10,
                freeRevival: 1,
                handLimit: 4
            }
        case 'Fremen':
            return {
                ...generic,
                powers:FremenPowers.map(kind => createPower(kind)),
                initialSpice: 10,
                freeRevival: 2,
                handLimit: 4
            }
        case 'Guild':
            return {
                ...generic,
                powers:GuildPowers.map(kind => createPower(kind)),
                initialSpice: 5,
                freeRevival: 3,
                handLimit: 4
            }
        case 'Harkonnen':
            return {
                ...generic,
                powers:HarkonnenPowers.map(kind => createPower(kind)),
                initialSpice: 10,
                freeRevival: 2,
                handLimit: 8
            }
    }
}