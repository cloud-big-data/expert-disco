import React from 'react';
import { render } from '@testing-library/react';
import Skyvue from './Skyvue';

test('renders learn react link', () => {
  const { getByText } = render(<Skyvue />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
