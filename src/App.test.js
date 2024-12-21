import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Dashboard component', () => {
  render(<App />);
  const linkElement = screen.getByText(/treasury management system/i);
  expect(linkElement).toBeInTheDocument();
});
