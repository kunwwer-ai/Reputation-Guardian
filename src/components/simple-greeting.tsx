// src/components/simple-greeting.tsx
import type { ReactNode } from 'react';

interface SimpleGreetingProps {
  name?: string;
}

export default function SimpleGreeting({ name = "Guest" }: SimpleGreetingProps): ReactNode {
  return (
    <div>
      <h1>Hello, {name}!</h1>
    </div>
  );
}
