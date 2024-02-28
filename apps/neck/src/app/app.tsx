// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';
import { InstrumentDefinition, Neck, RootNote } from '@efl/neck-components';

const makeStandardInstrument = (
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
    ]),
  };
};

export function App() {
  return (
    <div>
      <Neck
        symbolMode={{ type: 'note', enharmonicMode: 'sharp' }}
        orientation="horizontal"
        symbolSize={40}
        instrument={makeStandardInstrument(['E', 'A', 'D', 'G'], 22, 12)}
      />
    </div>
  );
}

export default App;
