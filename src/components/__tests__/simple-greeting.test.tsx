// src/components/__tests__/simple-greeting.test.tsx
import { render, screen } from '@testing-library/react';
import SimpleGreeting from '@/components/simple-greeting';

describe('SimpleGreeting', () => {
  it('renders a greeting with the default name', () => {
    render(<SimpleGreeting />);
    const headingElement = screen.getByRole('heading', { name: /Hello, Guest!/i });
    expect(headingElement).toBeInTheDocument();
  });

  it('renders a greeting with a provided name', () => {
    render(<SimpleGreeting name="Studio" />);
    const headingElement = screen.getByRole('heading', { name: /Hello, Studio!/i });
    expect(headingElement).toBeInTheDocument();
  });
});
