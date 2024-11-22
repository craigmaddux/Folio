// src/App.test.js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Folio header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Folio/i);
  expect(headerElement).toBeInTheDocument();
});
