import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Form Interaction Tests', () => {
  test('renders email form fields', () => {
    const EmailForm = () => (
      <form>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" placeholder="Enter your email" />
      </form>
    );
    render(<EmailForm />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  test('handles user input interactions', () => {
    const InputField = () => <input data-testid="test-input" />;
    render(<InputField />);
    const input = screen.getByTestId('test-input');
    
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(input.value).toBe('test@example.com');
  });

  test('processes button click events', () => {
    let clicked = false;
    const InteractiveButton = () => (
      <button onClick={() => { clicked = true; }}>
        Click Me
      </button>
    );
    render(<InteractiveButton />);
    
    fireEvent.click(screen.getByText('Click Me'));
    expect(clicked).toBe(true);
  });

  test('renders reservation form components', () => {
    const ReservationForm = () => (
      <form>
        <label htmlFor="date">Date</label>
        <input id="date" type="date" />
        
        <label htmlFor="time">Time</label>
        <select id="time">
          <option>5:00 PM</option>
          <option>6:00 PM</option>
        </select>
        
        <label htmlFor="guests">Number of guests</label>
        <input id="guests" type="number" min="1" max="10" />
        
        <label htmlFor="occasion">Occasion</label>
        <select id="occasion">
          <option>Birthday</option>
          <option>Anniversary</option>
        </select>
      </form>
    );
    render(<ReservationForm />);
    
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Number of guests')).toBeInTheDocument();
    expect(screen.getByLabelText('Occasion')).toBeInTheDocument();
  });

  test('renders newsletter subscription form', () => {
    const Newsletter = () => (
      <div>
        <h3>Subscribe to Our Monthly Newsletter!</h3>
        <form>
          <input type="email" placeholder="Enter your email address" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    );
    render(<Newsletter />);
    
    expect(screen.getByText('Subscribe to Our Monthly Newsletter!')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByText('Subscribe')).toBeInTheDocument();
  });
});
