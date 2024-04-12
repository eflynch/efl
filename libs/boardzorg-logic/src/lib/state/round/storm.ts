import { Faction } from "../faction"

export type StormRoundState = {
    type: "storm"
    weatherControlChecks: Faction[]
}
