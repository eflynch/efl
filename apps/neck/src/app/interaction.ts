import { ChordType } from './chords'

export type InteractionModeFrets = {
  type: 'frets'
}

export type InteractionModePitches = {
  type: 'pitches'
}

export type InteractionModeChords = {
  type: 'chords'
  chordType: ChordType
}

export type InteractionModeFingering = {
  type: 'fingering'

  finger: number
}

export type InteractionMode =
  | InteractionModeFrets
  | InteractionModeChords
  | InteractionModePitches
  | InteractionModeFingering
