
export const TreacheryCardList = [
    "Baliset",
    "Crysknife",
    "Chaumas",
    "Chaumurky",
    "Cheap-Hero/Heroine",
    "Cheap-Hero/Heroine",
    "Cheap-Hero/Heroine",
    "Ellaca-Drug",
    "Family-Atomics",
    "Gom-Jabbar",
    "Hajr",
    "Jubba-Cloak",
    "Karama",
    "Karama",
    "Kulon",
    "La-la-la!",
    "Lasgun",
    "Maula-Pistol",
    "Shield",
    "Shield",
    "Shield",
    "Shield",
    "Snooper",
    "Snooper",
    "Snooper",
    "Snooper",
    "Slip-Tip",
    "Stunner",
    "Tleilaxu-Ghola",
    "Trip-to-Gamont",
    "Truth-Trance",
    "Truth-Trance",
    "Weather-Control"
] as const;

export type TreacheryCard = typeof TreacheryCardList[number];

export const WorthlessList = [
    "Baliset",
    "Jubba-Cloak",
    "Kulon",
    "La-la-la!",
    "Trip-to-Gamont"
] as const

export type WorthLess = typeof WorthlessList[number];

export const WeaponList = [
    "Crysknife",
    "Chaumas",
    "Chaumurky",
    "Ellaca-Drug",
    "Gom-Jabbar",
    "Lasgun",
    "Maula-Pistol",
    "Slip-Tip",
    "Stunner",
] as const

export type WeaponList = typeof WeaponList[number];

export const DefenseList = [
    "Shield",
    "Snooper"
] as const

export type Defense = typeof DefenseList[number];

export const ProjectileWeaponList = [
    "Maula-Pistol",
    "Crysknife",
    "Stunner",
    "Slip-Tip"
] as const

export type ProjectileWeapon = typeof ProjectileWeaponList[number];


export const PoisonWeaponList = [
    "Chaumas",
    "Chaumurky",
    "Ellaca-Drug",
    "Gom-Jabbar"
] as const

export type PoisonWeapon = typeof PoisonWeaponList[number];

export const ProjectileDefenseList = [
    "Shield"
] as const

export type ProjectileDefense = typeof ProjectileDefenseList[number];

export const PoisonDefenseList = [
    "Snooper"
] as const

export type PoisonDefense = typeof PoisonDefenseList[number];
