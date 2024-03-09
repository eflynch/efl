export const ChordTypeList = [
  'M',
  'm',
  '5',
  '7',
  '△',
  'm7',
  'ø7',
  'o7',
  'mM7',
  'sus2',
  'sus4',
  'add9',
  'm6',
  '6',
  'aug',
] as const
export type ChordType = (typeof ChordTypeList)[number]

export const intervalsForChordType = (chordType: ChordType): number[] => {
  switch (chordType) {
    case 'M':
      return [0, 4, 7]
    case 'm':
      return [0, 3, 7]
    case '5':
      return [0, 7]
    case '7':
      return [0, 4, 7, 10]
    case '△':
      return [0, 4, 7, 11]
    case 'm7':
      return [0, 3, 7, 10]
    case 'ø7':
      return [0, 3, 6, 10]
    case 'o7':
      return [0, 3, 6, 9]
    case '6':
      return [0, 4, 7, 9]
    case 'aug':
      return [0, 4, 8]
    case 'm6':
      return [0, 3, 7, 9]
    case 'mM7':
      return [0, 3, 7, 11]
    case 'sus2':
      return [0, 2, 7]
    case 'sus4':
      return [0, 5, 7]
    case 'add9':
      return [0, 4, 7, 2]
  }
}
