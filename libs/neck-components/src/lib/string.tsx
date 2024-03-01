import { HighlightMode, Orientation, RootNote, SymbolMode } from './types';
import { Symbol } from './symbol';
import { Slug } from './slug';
import { Fret } from './fret';
import styled from 'styled-components';

const StringContainer = styled.div<{ $orientation: Orientation }>`
  position: relative;
  display: flex;
  flex-direction: ${(props) =>
    props.$orientation === 'horizontal' ? 'row' : 'column'};
  justify-content: space-around;
`;

const StringLine = styled.div<{
  $orientation: Orientation;
  $symbolSize: number;
  $nutThickness: number;
}>`
  position: absolute;
  z-index: -1;
  top: ${(props) =>
    props.$orientation === 'vertical'
      ? props.$symbolSize / 2 + props.$nutThickness / 2
      : props.$symbolSize / 2}px;
  left: ${(props) =>
    props.$orientation === 'horizontal'
      ? props.$symbolSize / 2 + props.$nutThickness / 2
      : props.$symbolSize / 2}px;
  height: ${(props) =>
    props.$orientation === 'vertical'
      ? 'calc(100% - ' +
        (props.$symbolSize / 2 + props.$nutThickness).toString() +
        'px)'
      : '0px'};
  width: ${(props) =>
    props.$orientation === 'horizontal'
      ? 'calc(100% - ' +
        (props.$symbolSize / 2 + props.$nutThickness).toString() +
        'px)'
      : '0px'};
  border: 1px solid black;
  opacity: 0.4;
`;

export type StringProps = {
  symbolMode: SymbolMode;
  highlightMode: HighlightMode;
  frets: number[];
  allFrets: number[];
  nutThickness: number;
  fretThickness: number;
  fingerboardLengthInSemitones: number;
  stringIndex: number;
  stringRoot: RootNote;
  onSelectFret?: (fret: number) => void;
  orientation: Orientation;
  symbolSize: number;
};

export const String = (props: StringProps) => {
  const {
    frets,
    allFrets,
    nutThickness,
    fretThickness,
    stringIndex,
    stringRoot,
    onSelectFret,
    orientation,
    symbolMode,
    highlightMode,
    symbolSize,
    fingerboardLengthInSemitones,
  } = props;

  const root = (
    <Symbol
      fret={0}
      stringIndex={stringIndex}
      stringRoot={stringRoot}
      size={symbolSize}
      highlightMode={highlightMode}
      symbolMode={symbolMode}
      onSelect={(fret) => {
        onSelectFret && onSelectFret(0);
      }}
    />
  );

  const fretSymbols = Array(fingerboardLengthInSemitones)
    .fill(0)
    .map((_, i) => {
      const semis = i + 1;
      if (frets.includes(semis)) {
        return [
          <Symbol
            key={i}
            fret={semis}
            stringIndex={stringIndex}
            stringRoot={stringRoot}
            size={symbolSize}
            symbolMode={symbolMode}
            highlightMode={highlightMode}
            onSelect={(fret) => {
              onSelectFret && onSelectFret(fret);
            }}
          />,
          <Fret
            key={i + '-fret'}
            symbolSize={symbolSize}
            orientation={orientation}
            thickness={fretThickness}
          />,
        ];
      } else if (allFrets.includes(semis)) {
        return [
          <Slug key={i} width={symbolSize} height={symbolSize} />,
          <Fret
            key={i + '-fret'}
            symbolSize={symbolSize}
            orientation={orientation}
            thickness={fretThickness}
          />,
        ];
      } else {
        return [<Slug key={i} width={symbolSize} height={symbolSize} />];
      }
    })
    .flat();
  return (
    <StringContainer $orientation={orientation}>
      <StringLine
        $orientation={orientation}
        $symbolSize={symbolSize}
        $nutThickness={nutThickness}
      />
      {root}
      <Fret
        symbolSize={symbolSize}
        orientation={orientation}
        thickness={nutThickness}
      />
      {fretSymbols}
    </StringContainer>
  );
};
