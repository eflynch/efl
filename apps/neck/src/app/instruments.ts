import {
  makeDiatonicInstrument,
  makeStandardInstrument,
} from '@efl/neck-components'

export const Instruments = {
  mandolin: makeStandardInstrument(['G', 'D', 'A', 'E'], 19, 20),
  violin: makeStandardInstrument(['G', 'D', 'A', 'E'], 19, 20),
  'irish tenor banjo': makeStandardInstrument(['G', 'D', 'A', 'E'], 22, 17),
  'jazz tenor banjo': makeStandardInstrument(['C', 'G', 'D', 'A'], 22, 19),
  guitar: makeStandardInstrument(['E', 'A', 'D', 'G', 'B', 'E'], 35, 24),
  dolcimer: makeDiatonicInstrument(['D', 'A', 'A'], 35, 24),
  ukelele: makeStandardInstrument(['G', 'C', 'E', 'A'], 22, 17),
} as const

export const InstrumentList = Object.keys(Instruments)

export type Instrument = keyof typeof Instruments
