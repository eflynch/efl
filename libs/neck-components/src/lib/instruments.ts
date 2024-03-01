import { InstrumentDefinition, RootNote } from './types';

export const makeStandardInstrument = (
  roots: RootNote[],
  scaleLengthInCm: number,
  fingerBoardLengthInSemitones: number
): InstrumentDefinition => {
  return {
    strings: roots.map((root) => ({
      root,
      frets: new Array(fingerBoardLengthInSemitones)
        .fill(0)
        .map((_, i) => i + 1),
    })),
    scaleLengthInCm,
    fingerBoardLengthInSemitones,
    dotsMap: new Map<number, number>([
      [3, 1],
      [5, 1],
      [7, 1],
      [9, 1],
      [12, 2],
      [15, 1],
      [17, 1],
    ]),
  };
};


export const makeDiatonicInstrument = (
  roots: RootNote[],
  scaleLengthInCm: number,
  fingerBoardLengthInSemitones: number
): InstrumentDefinition => {
  return {
    strings: roots.map((root) => ({
      root,
      frets: new Array(fingerBoardLengthInSemitones)
        .fill(0)
        .map((_, i) => i + 1)
        .filter(fret => [0, 2, 4, 5, 7, 9, 10, 11].includes((fret)%12))
    })),
    scaleLengthInCm,
    fingerBoardLengthInSemitones,
    dotsMap: new Map<number, number>([
      [5, 1],
      [12, 1],
      [17, 1],
      [24, 1],
    ]),
  };
};
