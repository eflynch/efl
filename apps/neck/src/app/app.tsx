// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css'
import update from 'immutability-helper'
import {
  FingerAssignment,
  HighlightMode,
  Neck,
  RootNoteDisplayList,
  RootNoteList,
  Select,
  SymbolMode,
  makePitchClass,
  semitonesAboveC,
} from '@efl/neck-components'
import { Instrument, InstrumentList, Instruments } from './instruments'
import { useCallback, useState } from 'react'
import { InteractionMode } from './interaction'

export function App() {
  const [instrument, setInstrument] = useState<Instrument>('mandolin')
  const [interactionMode, setInteractionMode] = useState<InteractionMode>({
    type: 'pitches',
  })
  const [mode, setMode] = useState<{
    symbol: SymbolMode
    highlight: HighlightMode
  }>({
    symbol: {
      type: 'interval',
      rootNote: 'C',
      muted: [],
      fingerAssignments: [],
      enharmonicMode: 'sharp',
    },
    highlight: { type: 'interval', intervals: [] },
  })

  const selectFret = useCallback(
    (fret: number, stringIndex: number) => {
      switch (interactionMode.type) {
        case 'frets': {
          setMode((mode) => {
            if (mode.highlight.type !== 'frets') {
              return update(mode, {
                highlight: {
                  $set: {
                    type: 'frets',
                    assignments: [{ string: stringIndex, fret }],
                  },
                },
              })
            }
            return update(mode, {
              highlight: {
                assignments: {
                  $apply: (assignments: { string: number; fret: number }[]) => {
                    if (
                      assignments.find(
                        (assignment) =>
                          assignment.string === stringIndex &&
                          assignment.fret === fret
                      )
                    ) {
                      return assignments.filter(
                        (assignment) =>
                          assignment.string !== stringIndex ||
                          assignment.fret !== fret
                      )
                    }
                    return [...assignments, { string: stringIndex, fret }]
                  },
                },
              },
            })
          })
          break
        }
        case 'pitches': {
          setMode((mode) => {
            const string = Instruments[instrument].strings[stringIndex]
            const pitchClass = makePitchClass(
              fret + semitonesAboveC(string.root)
            )
            switch (mode.highlight.type) {
              case 'interval': {
                const interval = makePitchClass(
                  pitchClass - semitonesAboveC(mode.symbol.rootNote)
                )
                return update(mode, {
                  highlight: {
                    intervals: mode.highlight.intervals.includes(interval)
                      ? {
                          $splice: [
                            [mode.highlight.intervals.indexOf(interval), 1],
                          ],
                        }
                      : { $push: [interval] },
                  },
                })
              }
              case 'frets': {
                const held = mode.highlight.assignments.find(
                  (assignment) =>
                    assignment.string === stringIndex &&
                    assignment.fret === fret
                )
                return update(mode, {
                  highlight: {
                    assignments: held
                      ? {
                          $splice: [
                            [mode.highlight.assignments.indexOf(held), 1],
                          ],
                        }
                      : { $push: [{ string: stringIndex, fret }] },
                  },
                })
              }
            }
          })
          break
        }
        case 'chords': {
          setMode((mode) => {
            const string = Instruments[instrument].strings[stringIndex]
            const pitchClass = makePitchClass(
              fret + semitonesAboveC(string.root)
            )
            switch (mode.highlight.type) {
              case 'interval': {
                const interval = makePitchClass(
                  pitchClass - semitonesAboveC(mode.symbol.rootNote)
                )
                return update(mode, {
                  highlight: {
                    intervals: mode.highlight.intervals.includes(interval)
                      ? {
                          $splice: [
                            [mode.highlight.intervals.indexOf(interval), 1],
                          ],
                        }
                      : { $push: [interval] },
                  },
                })
              }
              case 'frets': {
                const held = mode.highlight.assignments.find(
                  (assignment) =>
                    assignment.string === stringIndex &&
                    assignment.fret === fret
                )
                return update(mode, {
                  highlight: {
                    assignments: held
                      ? {
                          $splice: [
                            [mode.highlight.assignments.indexOf(held), 1],
                          ],
                        }
                      : { $push: [{ string: stringIndex, fret }] },
                  },
                })
              }
            }
          })
          break
        }
        case 'fingering': {
          setMode((mode) => {
            const symbol = update(mode.symbol, {
              fingerAssignments: {
                $apply: (fingerAssignments: FingerAssignment[]) => {
                  const hasFinger = fingerAssignments.find(
                    (assignment) => assignment.finger === interactionMode.finger
                  )
                  return (
                    hasFinger
                      ? fingerAssignments
                      : [
                          ...fingerAssignments,
                          {
                            finger: interactionMode.finger,
                            assignments: [{ string: stringIndex, fret }],
                          },
                        ]
                  ).map((fingerAssignment) => {
                    if (fingerAssignment.finger === interactionMode.finger) {
                      if (
                        fingerAssignment.assignments.find(
                          (assignment) =>
                            assignment.string === stringIndex &&
                            assignment.fret === fret
                        )
                      ) {
                        return update(fingerAssignment, {
                          assignments: {
                            $splice: [
                              [
                                fingerAssignment.assignments.findIndex(
                                  (assignment) =>
                                    assignment.string === stringIndex &&
                                    assignment.fret === fret
                                ),
                                1,
                              ],
                            ],
                          },
                        })
                      }
                      return update(fingerAssignment, {
                        assignments: { $push: [{ string: stringIndex, fret }] },
                      })
                    } else {
                      if (
                        fingerAssignment.assignments.find(
                          (assignment) =>
                            assignment.string === stringIndex &&
                            assignment.fret === fret
                        )
                      ) {
                        return update(fingerAssignment, {
                          assignments: {
                            $splice: [
                              [
                                fingerAssignment.assignments.findIndex(
                                  (assignment) =>
                                    assignment.string === stringIndex &&
                                    assignment.fret === fret
                                ),
                                1,
                              ],
                            ],
                          },
                        })
                      }
                    }
                    return fingerAssignment
                  })
                },
              },
            })
            const highlight: HighlightMode = {
              type: 'frets',
              assignments: symbol.fingerAssignments
                .map((fingerAssignments) => fingerAssignments.assignments)
                .flat(),
            }
            return update(mode, {
              symbol: { $set: symbol },
              highlight: { $set: highlight },
            })
          })
          break
        }
      }
    },
    [interactionMode, setMode, instrument]
  )

  return (
    <div>
      <Select
        label="Instrument: "
        value={instrument}
        values={InstrumentList}
        onSelect={(instrument) => {
          setInstrument(instrument as Instrument)
        }}
      />
      <Select
        label="Symbol Mode: "
        value={mode.symbol.type}
        values={['interval', 'note']}
        onSelect={(type) => {
          setMode((mode) =>
            update(mode, {
              symbol: { type: { $set: type as 'interval' | 'note' } },
            })
          )
        }}
      />
      {mode.symbol.type === 'interval' && (
        <Select
          label="Root Note: "
          value={mode.symbol.rootNote}
          values={RootNoteList.slice()}
          onSelect={(rootNote) => {
            setMode((mode) =>
              update(mode, { symbol: { rootNote: { $set: rootNote } } })
            )
          }}
        />
      )}
      <Neck
        onSelectFret={selectFret}
        nutThickness={8}
        fretThickness={5}
        symbolMode={mode.symbol}
        highlightMode={mode.highlight}
        orientation="vertical"
        symbolSize={40}
        instrument={Instruments[instrument]}
      />
    </div>
  )
}

export default App
