import { Orientation } from './types';

const SIZE = 3;
const MARGIN = 1.5;

export const Nut = ({
  symbolSize,
  orientation,
}: {
  symbolSize: number;
  orientation: Orientation;
}) => {
  return (
    <span
      style={{
        height: orientation === 'horizontal' ? symbolSize + MARGIN * 2 : SIZE,
        width: orientation === 'horizontal' ? SIZE : symbolSize + MARGIN * 2,
        backgroundColor: 'gray',
        marginTop: orientation === 'horizontal' ? -MARGIN : MARGIN,
        marginBottom: orientation === 'horizontal' ? -MARGIN : MARGIN,
        marginLeft: orientation === 'vertical' ? -MARGIN : MARGIN,
        marginRight: orientation === 'vertical' ? -MARGIN : MARGIN,
      }}
    ></span>
  );
};
