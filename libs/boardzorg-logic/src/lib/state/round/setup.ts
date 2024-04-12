
export const SetupStagesList = ["prediction", "token-placement", "traitors", "sietch-tabr", "one-free-placement", "storm-placement"] as const
export  type SetupStage = typeof SetupStagesList[number]

export type SetupRoundState = {
    type: "setup"
    stage: SetupStage
}
