import { NexusRoundState } from "./nexus"
import { RevivalRoundState } from "./revival"
import { SetupRoundState } from "./setup"
import { SpiceRoundState } from "./spice"
import { StormRoundState } from "./storm"

export type RoundState = NexusRoundState | RevivalRoundState | SetupRoundState | SpiceRoundState | StormRoundState;
