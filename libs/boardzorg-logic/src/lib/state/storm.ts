
export const StormCardList = [1, 2, 3, 4, 5, 6] as const
export type StormCard = typeof StormCardList[number]

export const StormPositionList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17] as const
export type StormPosition = typeof StormPositionList[number];
