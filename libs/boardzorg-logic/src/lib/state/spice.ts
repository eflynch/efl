export const SpiceCardList = [
    "Broken-Land",
    "Cielago-North",
    "Cielago-South",
    "Funeral-Plain",
    "The-Great-Flat",
    "Habbanya-Erg",
    "Habbanya-Ridge-Flat",
    "Hagga-Basin",
    "Minor-Erg",
    "Old-Gap",
    "Red-Chasm",
    "Rock-Outcroppings",
    "Sihaya-Ridge",
    "South-Mesa",
    "Wind-Pass-North",
    "Shai-Hulud",
    "Shai-Hulud",
    "Shai-Hulud",
    "Shai-Hulud",
    "Shai-Hulud",
    "Shai-Hulud"
] as const

export type SpiceCard = typeof SpiceCardList[number];