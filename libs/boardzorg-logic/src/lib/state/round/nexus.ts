import { Faction } from "../faction"


export type NexusRoundState = {
    type: "nexus"
    proposals: Map<Faction, Faction>
}