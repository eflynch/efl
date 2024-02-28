import styled from 'styled-components';
import {
  HighlightMode,
  IntervalSymbolList,
  makePitchClass,
  makeSharp,
  RootNote,
  RootNoteList,
  semitonesAboveC,
  SymbolMode,
} from './types';

export type SymbolProps = {
  fret: number;
  stringIndex: number;
  stringRoot: RootNote;
  onSelect?: (fret: number) => void;
  size: number;
  symbolMode: SymbolMode;
  highlightMode: HighlightMode;
};

const SymbolDiv = styled.div<{
  size: number;
  margin: number;
  highlighted: boolean;
}>`
  height: ${(props) => props.size - 2 * props.margin - 2}px;
  width: ${(props) => props.size - 2 * props.margin - 2}px;
  font-family: system-ui;
  font-weight: 100;
  font-size: ${(props) => props.size * 0.4}px;
  background-color: ${(props) => (props.highlighted ? 'black' : 'white')};
  color: ${(props) => (props.highlighted ? 'white' : 'black')};
  border: 1px solid black;
  border-radius: 9999px;
  margin: ${(props) => props.margin}px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

export const Symbol = (props: SymbolProps) => {
  const {
    fret,
    stringRoot,
    stringIndex,
    onSelect,
    size,
    symbolMode,
    highlightMode,
  } = props;

  const pitchClass = makePitchClass(semitonesAboveC(stringRoot) + fret);
  const highlighted = (() => {
    switch (highlightMode.type) {
      case 'interval': {
        const intervalSymbol = makePitchClass(
          pitchClass - semitonesAboveC(highlightMode.rootNote)
        );
        return highlightMode.intervals.includes(intervalSymbol);
      }
      case 'frets': {
        return (
          highlightMode.assignments.find(
            (x) => x.string === stringIndex && x.fret === fret
          ) !== undefined
        );
      }
    }
  })();

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
      // eslint-disable-next-line no-fallthrough
      case 'finger': {
        if (fret === 0) {
          if (symbolMode.muted.includes(stringIndex)) {
            return 'x';
          }
        }
        const assignment = symbolMode.fingerAssignments.find((x) =>
          x.assignments.find((y) => y.string === stringIndex && y.fret === fret)
        );
        return assignment ? assignment.finger : '';
      }
    }
  })();
  return (
    <SymbolDiv
      highlighted={highlighted}
      margin={size * 0.2}
      size={size}
      onClick={
        onSelect
          ? (e) => {
              onSelect(fret);
            }
          : undefined
      }
    >
      {symbol}
    </SymbolDiv>
  );
};
