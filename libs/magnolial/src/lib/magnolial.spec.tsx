import { render } from '@testing-library/react';

import Magnolial from './magnolial';

describe('Magnolial', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Magnolial />);
    expect(baseElement).toBeTruthy();
  });
});
