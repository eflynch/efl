import { render } from '@testing-library/react';

import NeckComponents from './neck-components';

describe('NeckComponents', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NeckComponents />);
    expect(baseElement).toBeTruthy();
  });
});
