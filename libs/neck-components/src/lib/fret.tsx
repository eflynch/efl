import { Orientation } from './types';

export const Fret = ({
  symbolSize,
  orientation,
  thickness,
}: {
  thickness: number;
  symbolSize: number;
  orientation: Orientation;
}) => {
  const margin = 1.5;
  const realThickness = thickness - 2 * margin;
  return (
    <span
      style={{
        height:
          orientation === 'horizontal'
            ? symbolSize + margin * 2
            : realThickness,
        width:
          orientation === 'horizontal'
            ? realThickness
            : symbolSize + margin * 2,
        backgroundColor: 'gray',
        marginTop: orientation === 'horizontal' ? -margin : margin,
        marginBottom: orientation === 'horizontal' ? -margin : margin,
        marginLeft: orientation === 'vertical' ? -margin : margin,
        marginRight: orientation === 'vertical' ? -margin : margin,
      }}
    ></span>
  );
};
