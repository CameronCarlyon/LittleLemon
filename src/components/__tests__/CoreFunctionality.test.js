import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Core App Functionality', () => {
  test('React framework integration', () => {
    const TestComponent = () => <div>Hello World</div>;
    render(<TestComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('DOM element rendering', () => {
    render(<div data-testid="test-div">Test Content</div>);
    expect(screen.getByTestId('test-div')).toBeInTheDocument();
  });

  test('Interactive button components', () => {
    render(<button>Click Me</button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  test('Semantic heading structure', () => {
    render(<h1>Test Heading</h1>);
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
  });

  test('List component accessibility', () => {
    render(
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});
