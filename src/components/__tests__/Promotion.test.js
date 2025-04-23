import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Promotion from '../Promotion';

describe('Promotion Component', () => {
    test('renders the promotion banner', () => {
        render(<Promotion />);
        expect(screen.getByText(/Subscribe to Our Monthly Newsletter!/i)).toBeInTheDocument();
    });

    test('renders input field and submit button', () => {
        render(<Promotion />);
        expect(screen.getByPlaceholderText(/Enter your email address/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('validates email and shows error message on invalid input', () => {
        render(<Promotion />);
        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'invalid-email' } });
        fireEvent.click(button);

        expect(screen.getByPlaceholderText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    test('submits successfully with a valid email', () => {
        render(<Promotion />);
        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        expect(screen.getByPlaceholderText(/Thanks for subscribing!/i)).toBeInTheDocument();
    });

    test('hides the promotion banner after successful submission', () => {
        jest.useFakeTimers();
        render(<Promotion />);
        const input = screen.getByPlaceholderText(/Enter your email address/i);
        const button = screen.getByRole('button');

        fireEvent.change(input, { target: { value: 'test@example.com' } });
        fireEvent.click(button);

        jest.advanceTimersByTime(3000);
        expect(screen.queryByText(/Subscribe to Our Monthly Newsletter!/i)).not.toBeInTheDocument();
        jest.useRealTimers();
    });

    test('closes the promotion banner when close button is clicked', () => {
        render(<Promotion />);
        const closeButton = screen.getByLabelText(/Close promotion/i);

        fireEvent.click(closeButton);

        expect(screen.queryByText(/Subscribe to Our Monthly Newsletter!/i)).not.toBeInTheDocument();
    });
});