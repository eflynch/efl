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
      [15, 1],
      [17, 1],
    ]),
  };
};

export function App() {
  return (
    <div>
      <Neck
        nutThickness={8}
        fretThickness={4}
        symbolMode={{ type: 'note', enharmonicMode: 'sharp' }}
        // symbolMode={{ type: 'interval', rootNote: 'E' }}
        highlightMode={{
          type: 'interval',
          rootNote: 'E',
          intervals: [0, 4, 7],
        }}
        // highlightMode={{type:'frets', assignments:[{string:0, fret:0}, {string:1, fret:3}, {string:2, fret:4}, {string:3, fret:5}]}}
        // symbolMode={{type: 'finger',
        // muted:[],
        // fingerAssignments:[
        //   {finger:1, assignments:[{string:1, fret:2}]},
        //   {finger:2, assignments:[{string:0, fret:3}]},
        //   {finger:3, assignments:[{string:2, fret:5}]},
        //   {finger:4, assignments:[{string:3, fret:7}]},
        // ]}}
        orientation="vertical"
        symbolSize={40}
        instrument={makeStandardInstrument(['E', 'A', 'D', 'G'], 22, 20)}
      />
    </div>
  );
}

export default App;
