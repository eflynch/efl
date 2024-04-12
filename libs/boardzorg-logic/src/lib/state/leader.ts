import { Faction } from "./faction";

export const LeaderList = {
    "Atreides": [
        {name: "Duncan-Idaho", power: 2},
        {name: "Dr-Wellington-Yueh", power: 1},
        {name: "Gurney-Halleck", power: 4},
        {name: "Lady-Jessica", power: 5},
        {name: "Thufir-Hawat", power: 5},
    ],
    "Bene-Gesserit": [
        {name: "Alia", power: 5},
        {name: "Margot-Lady-Fenring", power: 5},
        {name: "Princess-Irulan", power: 5},
        {name: "Reverend-Mother-Ramallo", power: 5},
        {name: "Wanna-Marcus", power: 5},
    ],
    "Emperor": [
        {name: "Bashar", power: 2},
        {name: "Burseg", power: 3},
        {name: "Caid", power: 3},
        {name: "Captain-Aramsham", power: 5},
        {name: "Count-Hasimir-Fenring", power: 6},
    ],
    "Fremen": [
        {name: "Chani", power: 6},
        {name: "Jamis", power: 2},
        {name: "Otheym", power: 5},
        {name: "Shadout-Mapes", power: 3},
        {name: "Stilgar", power: 7},
    ],
    "Guild": [
        {name: "Esmar-Tuek", power: 3},
        {name: "Master-Bewt", power: 3},
        {name: "Representative", power: 1},
        {name: "Soo-Soo-Sook", power: 2},
        {name: "Staban-Tuek", power: 5},
    ],
    "Harkonnen": [
        {name: "Captain-Iakin-Nefud", power: 2},
        {name: "Feyd-Rautha", power: 6},
        {name: "Beast-Rabban", power: 4},
        {name: "Piter-DeVries", power: 3},
        {name: "Umman-Kudu", power: 1},
    ]
} as const

export type Leader = typeof LeaderList[keyof typeof LeaderList][number]["name"];


export const getLeaderFaction = (leader: Leader) => {
    for (const faction in LeaderList) {
        const factionList = LeaderList[faction as keyof typeof LeaderList];
        const found = factionList.find((l) => l.name === leader);
        if (found !== undefined) {
            return faction as Faction;
        }
    }
    throw new Error("Not a valid leader name");
}

export const parseLeader = (leader: Leader) => {
    for (const faction in LeaderList) {
        const factionList = LeaderList[faction as keyof typeof LeaderList];
        const found = factionList.find((l) => l.name === leader);
        if (found !== undefined) {
            return found
        }
    }
    throw new Error("Not a valid leader name");
}
