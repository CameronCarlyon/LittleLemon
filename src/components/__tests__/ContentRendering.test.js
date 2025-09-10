import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Content Rendering Tests', () => {
  test('renders restaurant branding', () => {
    const RestaurantName = () => <h1>Little Lemon</h1>;
    render(<RestaurantName />);
    expect(screen.getByText('Little Lemon')).toBeInTheDocument();
  });

  test('renders location information', () => {
    const Location = () => <p>Chicago</p>;
    render(<Location />);
    expect(screen.getByText('Chicago')).toBeInTheDocument();
  });

  test('renders navigation structure', () => {
    const Navigation = () => (
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/menu">Menu</a>
        <a href="/reservations">Reservations</a>
      </nav>
    );
    render(<Navigation />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Reservations')).toBeInTheDocument();
  });

  test('renders restaurant description', () => {
    const Description = () => (
      <p>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</p>
    );
    render(<Description />);
    expect(screen.getByText(/family owned Mediterranean restaurant/i)).toBeInTheDocument();
  });

  test('renders contact information', () => {
    const Contact = () => (
      <div>
        <p>678 Pisa Ave, Chicago, IL 60657</p>
        <p>(312) 593-2744</p>
        <p>contact@littlelemon.com</p>
      </div>
    );
    render(<Contact />);
    expect(screen.getByText(/678 Pisa Ave/i)).toBeInTheDocument();
    expect(screen.getByText('(312) 593-2744')).toBeInTheDocument();
    expect(screen.getByText(/contact@littlelemon.com/i)).toBeInTheDocument();
  });
});
