import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationForm from '../ReservationForm';

describe('ReservationForm Component', () => {
    test('renders the form with all fields and placeholder text for special requests', () => {
        render(<ReservationForm />);

        // Check if the special requests textarea is rendered with the correct placeholder
        const specialRequestsTextarea = screen.getByPlaceholderText(
            "Please note that whilst we will do our best to accommodate your special requests, we cannot guarantee that all will be fulfilled."
        );
        expect(specialRequestsTextarea).toBeInTheDocument();
    });

    test('displays validation errors when required fields are empty and form is submitted', async () => {
        render(<ReservationForm />);
        const submitButton = screen.getByRole('button', { name: /create reservation/i });

        // Submit the form without filling any fields
        await userEvent.click(submitButton);

        // Check for validation errors
        const fullNameInput = screen.getByLabelText(/full name \*/i);
        expect(fullNameInput).toHaveClass('form-error');

        const emailInput = screen.getByLabelText(/email \*/i);
        expect(emailInput).toHaveClass('form-error');

        const guestCountSelect = screen.getByLabelText(/number of guests \*/i);
        expect(guestCountSelect).toHaveClass('form-error');

        const reservationDateInput = screen.getByLabelText(/date \*/i);
        expect(reservationDateInput).toHaveClass('form-error');

        const reservationTimeSelect = screen.getByLabelText(/time slot \*/i);
        expect(reservationTimeSelect).toHaveClass('form-error');
    });

    test('updates the available times when a reservation date is selected', async () => {
        render(<ReservationForm />);
        const reservationDateInput = screen.getByLabelText(/date \*/i);

        // Simulate selecting a date
        await userEvent.type(reservationDateInput, '2023-12-25');

        // Check if available times are updated (mock fetchAPI should be implemented for this test to work)
        const timeOptions = screen.getAllByRole('option');
        expect(timeOptions.length).toBeGreaterThan(1); // Assuming fetchAPI returns some times
    });

    test('submits the form successfully when all required fields are filled', async () => {
        render(<ReservationForm />);
        const fullNameInput = screen.getByLabelText(/full name \*/i);
        const emailInput = screen.getByLabelText(/email \*/i);
        const guestCountSelect = screen.getByLabelText(/number of guests \*/i);
        const reservationDateInput = screen.getByLabelText(/date \*/i);
        const reservationTimeSelect = screen.getByLabelText(/time slot \*/i);
        const submitButton = screen.getByRole('button', { name: /create reservation/i });

        // Fill in the form
        await userEvent.type(fullNameInput, 'John Doe');
        await userEvent.type(emailInput, 'johndoe@example.com');
        await userEvent.selectOptions(guestCountSelect, '2');
        await userEvent.type(reservationDateInput, '2023-12-25');
        await userEvent.selectOptions(reservationTimeSelect, '18:00');

        // Submit the form
        await userEvent.click(submitButton);

        // Check if the form submission was successful (mock submitAPI should be implemented for this test to work)
        expect(screen.queryByText(/reservation submitted/i)).toBeInTheDocument();
    });
});