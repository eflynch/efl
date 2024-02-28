import { Dots } from './dots';
import { String } from './string';
import {
  HighlightMode,
  InstrumentDefinition,
  Orientation,
  SymbolMode,
} from './types';

export type NeckProps = {
  symbolMode: SymbolMode;
  highlightMode: HighlightMode;
  orientation: Orientation;
  symbolSize: number;
  instrument: InstrumentDefinition;
  onSelectFret?: (fret: number, string: number) => void;
  fretThickness: number;
  nutThickness: number;
};

export const Neck = (props: NeckProps) => {
  const {
    symbolMode,
    highlightMode,
    instrument,
    onSelectFret,
    orientation,
    symbolSize,
    fretThickness,
    nutThickness,
  } = props;
  const allFrets = [...new Set(instrument.strings.map((s) => s.frets).flat())];
  return (
    <div
      style={{
        flexGrow: 1,
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'column' : 'row-reverse',
      }}
    >
      <Dots
        fretThickness={fretThickness}
        nutThickness={nutThickness}
        frets={allFrets}
        symbolSize={symbolSize}
        orientation={orientation}
        fingerboardLengthInSemitones={instrument.fingerBoardLengthInSemitones}
        dotMap={instrument.dotsMap}
      />
      <div
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          display: 'flex',
          flexDirection:
            orientation === 'horizontal' ? 'column' : 'row-reverse',
        }}
      >
        {instrument.strings.map(({ root, frets }, i) => {
          return (
            <String
              fingerboardLengthInSemitones={
                instrument.fingerBoardLengthInSemitones
              }
              key={i}
              highlightMode={highlightMode}
              symbolMode={symbolMode}
              symbolSize={symbolSize}
              orientation={orientation}
              stringIndex={i}
              stringRoot={root}
              fretThickness={fretThickness}
              nutThickness={nutThickness}
              allFrets={allFrets}
              frets={frets}
              onSelectFret={(fret) => {
                onSelectFret && onSelectFret(fret, i);
              }}
            />
          );
        })}
      </div>
      <Dots
        fretThickness={fretThickness}
        nutThickness={nutThickness}
        frets={allFrets}
        symbolSize={symbolSize}
        orientation={orientation}
        fingerboardLengthInSemitones={instrument.fingerBoardLengthInSemitones}
        dotMap={instrument.dotsMap}
      />
    </div>
  );
};
