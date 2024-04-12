import { Faction } from "../state/faction"
import { Leader } from "../state/leader"


type UnionWidget = {
    widget: "choice"
    args: InternalWidget[]
}

type StructWidget = {
    widget: "struct"
    args: InternalWidget[]
}

type ArrayWidget = {
    widget: "array",
    args: InternalWidget
}

type StringWidget = {
    widget: "input"
}

type IntegerWidget = {
    widget: "integer"
    args: {
        min: number,
        max: number,
        type: string
    }
}

type ConstantWidget = {
    widget: "constant"
    args: string
}

export type SpiceWidget = IntegerWidget & {
    args: {
        min: 0,
        max: number,
        type: "spice"
    }
}

export type TraitorLeaderWidget = {
    widget: "traitor-leader"
}

export type LeaderWidget = {
    widget: "leader-input"
}

export type ForceWidget = {
    widget: "force",
    args: {
        normal: {
            min: number,
            max: number,
            type: "normal"
        },
        fedaykin: {
            min: number,
            max: number,
            type: "fedaykin"
        },
        sardaukar: {
            min: number,
            max: number,
            type: "sardaukar"
        },
    }
}

export type RevivalUnitsWidget = {
    widget: "revival-units"
    args: {
        force: ForceWidget
        freeUnits: number
        maxUnits: number
    }
}

export type RevivalLeaderWidget = {
    widget: "revival-leader"
    args: {
        leaders: Leader[],
        required: boolean
    }
}

export type SpaceWidget = {
    widget: "space-select"
}

export type SectorWidget = {
    widget: "sector-select"
}

export type SectorSpaceWidget = {
    widget: "space-selector-select-start"
}

export type SectorSpaceStartWidget = {
    widget: "space-selector-select-start"
}

export type SectorSpaceEndWidget = {
    widget: "space-selector-select-end"
}

export type BattleWidget = {
    widget: "battle-select"
}

export type FactionWidget = {
    widget: "faction-select"
    args: {
        factions: Faction[]
    }
}

export type MultiFactionWidget = {
    widget: "multi-faction-select",
    args: {
        factions: Faction[]
    }
}

export type PrescienceWidget = {
    widget: "prescience",
}

export type PrescienceAnswerWidget = {
    widget: "prescience-answer",
    args: {
        maxPower: number
    }
}

export type VoiceWidget = {
    widget: "voice"
}

export type DestroyUnitsWidget = {
    widget: "tank-units"
} 

export type DiscardTreacheryWidget = {
    widget: "discard-treachery"
}

export type ReturnTreacheryWidget = {
    widget: "return-treachery"
    args: {
        number: number
    }
}

export type TurnWidget = IntegerWidget & {
    args: {
        min: 0,
        max: 10,
        type: "turn"
    }
}

export type TokenWidget = {
    widget: "token-select"
}

type InternalWidget = UnionWidget | StructWidget | ArrayWidget | StringWidget | IntegerWidget | SpiceWidget | ConstantWidget | TraitorLeaderWidget | LeaderWidget | ForceWidget | RevivalUnitsWidget | RevivalLeaderWidget | SpaceWidget | SectorWidget | SectorSpaceWidget | SectorSpaceStartWidget | SectorSpaceEndWidget | BattleWidget | FactionWidget | MultiFactionWidget | PrescienceWidget | PrescienceAnswerWidget | VoiceWidget | DestroyUnitsWidget | DiscardTreacheryWidget | ReturnTreacheryWidget | TurnWidget | TokenWidget

export type Widget =  SpiceWidget | TraitorLeaderWidget | LeaderWidget | ForceWidget | RevivalUnitsWidget | RevivalLeaderWidget | SpaceWidget | SectorWidget | SectorSpaceWidget | SectorSpaceStartWidget | SectorSpaceEndWidget | BattleWidget | FactionWidget | MultiFactionWidget | PrescienceWidget | PrescienceAnswerWidget | VoiceWidget | DestroyUnitsWidget | DiscardTreacheryWidget | ReturnTreacheryWidget | TurnWidget | TokenWidget