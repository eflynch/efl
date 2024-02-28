import { Orientation, RootNote, SymbolMode } from './types';
import { Symbol } from './symbol';
import { Slug } from './slug';
import { Nut } from './nut';

export type StringProps = {
  symbolMode: SymbolMode;
  frets: number[];
  fingerboardLengthInSemitones: number;
  stringRoot: RootNote;
  onSelectFret?: (fret: number) => void;
  orientation: Orientation;
  symbolSize: number;
};

export const String = (props: StringProps) => {
  const {
    frets,
    stringRoot,
    onSelectFret,
    orientation,
    symbolMode,
    symbolSize,
    fingerboardLengthInSemitones,
  } = props;

  const root = (
    <Symbol
      fret={0}
      stringRoot={stringRoot}
      size={symbolSize}
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
        return (
          <Symbol
            key={i}
            fret={semis}
            stringRoot={stringRoot}
            size={symbolSize}
            symbolMode={symbolMode}
            onSelect={(fret) => {
              onSelectFret && onSelectFret(fret);
            }}
          />
        );
      } else {
        return <Slug key={i} width={symbolSize} height={symbolSize} />;
      }
    });
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        justifyContent: 'space-around',
      }}
    >
      {root}
      <Nut symbolSize={symbolSize} orientation={orientation} />
      {fretSymbols}
    </div>
  );
};
