export const IntervalSymbolList = [
  '',
  '♭',
  '2',
  'm',
  'M',
  '4',
  'T',
  '5',
  '+',
  '○',
  '7',
  '△',
] as const;
export type IntervalSymbol = (typeof IntervalSymbolList)[number];

export const RootNoteList = [
  'C',
  'D♭',
  'D',
  'E♭',
  'E',
  'F',
  'G♭',
  'G',
  'A♭',
  'A',
  'B♭',
  'B',
] as const;
export type RootNote = (typeof RootNoteList)[number];

export const EnharmonicModeList = ['sharp', 'flat'] as const;
export type EnharmonicMode = (typeof EnharmonicModeList)[number];

export type SymbolModeInterval = {
  type: 'interval';
  rootNote: RootNote;
};

export type SymbolModeNote = {
  type: 'note';
  enharmonicMode: EnharmonicMode;
};

export type SymbolMode = SymbolModeInterval | SymbolModeNote;

export type StringDefinition = {
  root: RootNote;
  frets: number[];
};

export type InstrumentDefinition = {
  strings: StringDefinition[];
  fingerBoardLengthInSemitones: number;
  scaleLengthInCm: number;
  dotsMap: Map<number, number>;
};

export const makeSharp = (note: RootNote) => {
  switch (note) {
    case 'B♭':
      return 'A♯';
    case 'E♭':
      return 'D♯';
    case 'A♭':
      return 'G♯';
    case 'D♭':
      return 'C♯';
    case 'G♭':
      return 'F♯';
    default:
      return note;
  }
};

export const makePitchClass = (value: number) => (value + 12) % 12;

export const semitonesAboveC = (note: RootNote) => RootNoteList.indexOf(note);

export const OrientationList = ['horizontal', 'vertical'] as const;
export type Orientation = (typeof OrientationList)[number];
