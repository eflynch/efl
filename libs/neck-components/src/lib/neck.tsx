import { Dots } from './dots';
import { String } from './string';
import { InstrumentDefinition, Orientation, SymbolMode } from './types';

export type NeckProps = {
  symbolMode: SymbolMode;
  orientation: Orientation;
  symbolSize: number;
  instrument: InstrumentDefinition;
  onSelectFret?: (fret: number, string: number) => void;
};

export const Neck = (props: NeckProps) => {
  const { symbolMode, instrument, onSelectFret, orientation, symbolSize } =
    props;
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
        symbolSize={symbolSize}
        orientation={orientation}
        fingerboardLengthInSemitones={instrument.fingerBoardLengthInSemitones}
        dotMap={instrument.dotsMap}
      />
      {/* <Dots size={size} horizontal={horizontal} length={length} /> */}
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
              symbolMode={symbolMode}
              symbolSize={symbolSize}
              orientation={orientation}
              stringRoot={root}
              frets={frets}
              onSelectFret={(fret) => {
                onSelectFret && onSelectFret(fret, i);
              }}
            />
          );
        })}
      </div>
      <Dots
        symbolSize={symbolSize}
        orientation={orientation}
        fingerboardLengthInSemitones={instrument.fingerBoardLengthInSemitones}
        dotMap={instrument.dotsMap}
      />
    </div>
  );
};
