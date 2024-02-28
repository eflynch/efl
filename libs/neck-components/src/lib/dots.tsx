import { Slug } from './slug';
import { Orientation } from './types';

export type DotsProps = {
  symbolSize: number;
  orientation: Orientation;
  fingerboardLengthInSemitones: number;
  dotMap: Map<number, number>;
};

const SIZE = 8;
export const Dots = (props: DotsProps) => {
  const { symbolSize, orientation, fingerboardLengthInSemitones, dotMap } =
    props;
  const dots = [
    <Slug
      key={'-1'}
      width={orientation === 'horizontal' ? symbolSize : SIZE}
      height={orientation === 'horizontal' ? SIZE : symbolSize}
    />,
    <Slug key={'nut'} width={5} height={5} />,
    ...Array(fingerboardLengthInSemitones)
      .fill(0)
      .map((_, i) => {
        const semi = i + 1;
        if (dotMap.has(semi)) {
          return (
            <span
              key={i}
              style={{
                fontSize: 8,
                width: orientation === 'horizontal' ? symbolSize : SIZE,
                height: orientation === 'horizontal' ? SIZE : symbolSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span>{'●'.repeat(dotMap.get(semi) ?? 1)}</span>
            </span>
          );
        } else {
          return (
            <Slug
              key={i}
              width={orientation === 'horizontal' ? symbolSize : SIZE}
              height={orientation === 'horizontal' ? SIZE : symbolSize}
            />
          );
        }
      }),
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
