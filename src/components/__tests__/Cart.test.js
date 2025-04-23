import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../Cart';

describe('Cart Component', () => {
    test('renders form inputs and labels', () => {
        render(<Cart />);

        // Check for form labels
        expect(screen.getByLabelText(/Your Details/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Billing/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Delivery/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Order Summary/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Add a Tip/i)).toBeInTheDocument();

        // Check for input placeholders
        expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Card Number/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/MM\/YY/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/CVV/i)).toBeInTheDocument();
    });

    test('renders delivery options', () => {
        render(<Cart />);

        // Check for delivery options
        expect(screen.getByText(/Store Pickup/i)).toBeInTheDocument();
        expect(screen.getByText(/Home Delivery/i)).toBeInTheDocument();
    });

    test('renders order summary and pricing details', () => {
        render(<Cart />);

        // Check for order summary labels
        expect(screen.getByText(/Subtotal/i)).toBeInTheDocument();
        expect(screen.getByText(/Service Fee/i)).toBeInTheDocument();
        expect(screen.getByText(/Sales Tax/i)).toBeInTheDocument();
        expect(screen.getByText(/Chicago Restaurant Tax/i)).toBeInTheDocument();
        expect(screen.getByText(/Total/i)).toBeInTheDocument();
    });

    test('renders tip options', () => {
        render(<Cart />);

        // Check for tip options
        expect(screen.getByText(/15%/i)).toBeInTheDocument();
        expect(screen.getByText(/20%/i)).toBeInTheDocument();
        expect(screen.getByText(/25%/i)).toBeInTheDocument();
        expect(screen.getByText(/No Tip/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Custom Tip: \$0.00/i)).toBeInTheDocument();
    });

    test('handles form submission', () => {
        render(<Cart />);

        const submitButton = screen.getByRole('button', { name: /Place Order/i });
        fireEvent.click(submitButton);

        // Check for validation errors or submission behavior
        expect(screen.getByText(/I agree to the Terms and Conditions/i)).toBeInTheDocument();
    });

    test('handles delivery address fields for home delivery', () => {
        render(<Cart />);

        const homeDeliveryOption = screen.getByLabelText(/Home Delivery/i);
        fireEvent.click(homeDeliveryOption);

        // Check for delivery address fields
        expect(screen.getByPlaceholderText(/Address/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Zip Code/i)).toBeInTheDocument();
    });
});