import { Slug } from './slug';
import { Orientation } from './types';

export type DotsProps = {
  symbolSize: number;
  orientation: Orientation;
  fingerboardLengthInSemitones: number;
  frets: number[];
  dotMap: Map<number, number>;
  nutThickness: number;
  fretThickness: number;
};

const SIZE = 8;
export const Dots = (props: DotsProps) => {
  const {
    symbolSize,
    orientation,
    fingerboardLengthInSemitones,
    dotMap,
    frets,
    nutThickness,
    fretThickness,
  } = props;
  const dots = [
    <Slug
      key={'-1'}
      width={orientation === 'horizontal' ? symbolSize : SIZE}
      height={orientation === 'horizontal' ? SIZE : symbolSize}
    />,
    <Slug key={'nut'} width={nutThickness} height={nutThickness} />,
    ...Array(fingerboardLengthInSemitones)
      .fill(0)
      .map((_, i) => {
        const semi = i + 1;
        if (dotMap.has(semi)) {
          return [
            <span
              key={i}
              style={{
                userSelect: 'none',
                fontSize: 12,
                width: orientation === 'horizontal' ? symbolSize : SIZE,
                height: orientation === 'horizontal' ? SIZE : symbolSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  transform:
                    orientation === 'vertical'
                      ? 'rotate(90deg)'
                      : 'rotate(0deg)',
                }}
              >
                {'●'.repeat(dotMap.get(semi) ?? 1)}
              </span>
            </span>,
            frets.includes(semi) ? (
              <Slug
                key={i + '-fret'}
                width={orientation === 'horizontal' ? fretThickness : SIZE}
                height={orientation === 'horizontal' ? SIZE : fretThickness}
              />
            ) : undefined,
          ];
        } else {
          return [
            <Slug
              key={i}
              width={orientation === 'horizontal' ? symbolSize : SIZE}
              height={orientation === 'horizontal' ? SIZE : symbolSize}
            />,
            frets.includes(semi) ? (
              <Slug
                key={i + '-fret'}
                width={orientation === 'horizontal' ? fretThickness : SIZE}
                height={orientation === 'horizontal' ? SIZE : fretThickness}
              />
            ) : undefined,
          ];
        }
      })
      .flat()
      .filter((x) => x !== undefined),
  ];
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        justifyContent: 'space-around',
      }}
    >
      {dots}
    </div>
  );
};
