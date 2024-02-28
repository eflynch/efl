import {
  IntervalSymbolList,
  makePitchClass,
  makeSharp,
  RootNote,
  RootNoteList,
  semitonesAboveC,
  SymbolMode,
} from './types';

export type IntervalSymbolProps = {
  fret: number;
  stringRoot: RootNote;
  onSelect?: (fret: number) => void;
  size: number;
  symbolMode: SymbolMode;
};

const margin = 2;

export const Symbol = (props: IntervalSymbolProps) => {
  const { fret, stringRoot, onSelect, size, symbolMode } = props;

  const pitchClass = makePitchClass(semitonesAboveC(stringRoot) + fret);
  const symbol = (() => {
    switch (symbolMode.type) {
      case 'interval': {
        const intervalSymbol =
          IntervalSymbolList[
            makePitchClass(pitchClass - semitonesAboveC(symbolMode.rootNote))
          ];
        if (intervalSymbol === '') {
          return symbolMode.rootNote;
        }
        return intervalSymbol;
      }
      case 'note':
        switch (symbolMode.enharmonicMode) {
          case 'flat':
            return RootNoteList[pitchClass];
          case 'sharp':
            return makeSharp(RootNoteList[pitchClass]);
        }
    }
  })();
  return (
    <div
      style={{
        height: size - 2 * margin,
        width: size - 2 * margin,
        fontSize: size * 0.6,
        borderRadius: 9999,
        boxShadow: 'rgba(0, 0, 0, 0.4) 1px 2px',
        margin: margin,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={
        onSelect
          ? (e) => {
              onSelect(fret);
            }
          : undefined
      }
    >
      {symbol}
    </div>
  );
};
