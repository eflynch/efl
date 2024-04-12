import { Faction, FactionState, createFactionState } from "./faction";
import { Leader, LeaderList } from "./leader";
import { RoundState } from "./round";
import { SpaceList, SpaceState } from "./space";
import { SpiceCard, SpiceCardList } from "./spice";
import { StormCard, StormCardList, StormPosition } from "./storm";
import { TreacheryCard } from "./treachery";
import { Turn } from "./turn";

import seedrandom = require('seedrandom');


export type GameState = {
    factions: Map<Faction, FactionState>;

    treacheryCardsInPlay: TreacheryCard[];
    treacheryDeck: TreacheryCard[];
    treacheryDiscard: TreacheryCard[];

    spiceDeck: SpiceCard[];
    spiceDiscard: SpiceCard[];

    traitorDeck: Leader[];
    stormDeck:StormCard[];
    randomChoiceDeck:number[];

    turn: Turn;
    stormPosition: StormPosition
    shieldWall:boolean;

    mapState:Map<string, SpaceState>

    roundState:RoundState;
}

const shuffle = <T>(unshuffled:T[], random:seedrandom.PRNG):T[] => {
    return unshuffled.map(value => ({value, sort:random()})).sort((a,b) => a.sort - b.sort).map(a => a.value);
}


export const createGameState = (factions:Faction[], treacheryCardsInPlay:TreacheryCard[], seed:string):GameState => {
    const generateRandomNumber = seedrandom(seed);

    return {
        factions: new Map(factions.map(faction => [faction, createFactionState(faction)])),
        treacheryCardsInPlay: treacheryCardsInPlay,
        treacheryDeck: shuffle(treacheryCardsInPlay.slice().sort(), generateRandomNumber),
        treacheryDiscard: [],

        spiceDeck: shuffle(SpiceCardList.slice().sort(), generateRandomNumber),
        spiceDiscard: [],

        randomChoiceDeck:Array.from({length: 100}, () => generateRandomNumber() * 120),

        traitorDeck: shuffle(factions.slice().sort().map(faction => LeaderList[faction].slice().sort().map(v => v.name)).flat(), generateRandomNumber),
        stormDeck: Array.from({length: 10}, () => StormCardList[Math.floor(generateRandomNumber() * StormCardList.length)]),
        turn: 1,
        stormPosition: 0,
        shieldWall: true,
        mapState: new Map(SpaceList.map(space=> [space.name, {
            space: space,
            spice: 0,
            forces: new Map()
        }])),
        roundState: { type: "setup"}
    }
}