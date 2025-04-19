import React, { useState } from 'react';
import { fetchAPI, submitAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ReservationForm = () => {
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const navigate = useNavigate();

    const fetchAvailableTimes = (date) => {
        try {
            // Convert the date string to a Date object
            const dateObj = new Date(date);
            const times = fetchAPI(dateObj);
            setAvailableTimes(times);
        } catch (error) {
            console.error('Error fetching available times:', error);
            alert('Failed to fetch available times. Please try again later.');
        }
    };

    // Handle date change
    const handleDateChange = (e) => {
        const newDate = e.target.value;
        setSelectedDate(newDate);
        fetchAvailableTimes(newDate);
    };

    const submitForm = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const success = submitAPI(data);
            if (success) {
                console.log('Reservation submitted successfully:', data);
                navigate('/reservations/success', { 
                    state: { reservationData: data }
                });
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('There was a problem with the submission:', error);
            alert('Failed to create reservation. Please try again.');
        }
    };

    React.useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        fetchAvailableTimes(today);
    }, []);

    const isFormValid = () => {
        const fullName = document.getElementById('fullName')?.value.trim();
        const emailAddress = document.getElementById('emailAddress')?.value.trim();
        const guestCount = document.getElementById('guestCount')?.value;
        const reservationTime = document.getElementById('reservationTime')?.value;

        return fullName && emailAddress && guestCount && reservationTime;
    };

    return (
        <form onSubmit={submitForm}>
            <h1>Secure Your Reservation</h1>
            
            <label htmlFor="fullName">Full Name *</label>
            <input id="fullName" type="text" name="fullName" required onChange={() => setAvailableTimes([...availableTimes])} />
            
            <label htmlFor="emailAddress">Email *</label>
            <input id="emailAddress" type="email" name="emailAddress" required onChange={() => setAvailableTimes([...availableTimes])} />
            
            <label htmlFor="contactNumber">Contact Number</label>
            <input id="contactNumber" type="tel" name="contactNumber" />
            
            <label htmlFor="occasion">Occasion</label>
            <select id="occasion" name="occasion">
                <option value="none">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="business">Business Meeting</option>
                <option value="casualDining">Casual Dining</option>
            </select>
            
            <label htmlFor="guestCount">Number of Guests *</label>
            <select id="guestCount" name="guestCount" required onChange={() => setAvailableTimes([...availableTimes])}>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>
            
            <label htmlFor="reservationDate">Date *</label>
            <input 
                id="reservationDate"
                type="date" 
                name="reservationDate" 
                required 
                value={selectedDate}
                onChange={(e) => {
                    handleDateChange(e);
                    setAvailableTimes([...availableTimes]);
                }}
                min={new Date().toISOString().split('T')[0]}
            />
            
            <label htmlFor="reservationTime">Time Slot *</label>
            <select id="reservationTime" name="reservationTime" required onChange={() => setAvailableTimes([...availableTimes])}>
                <option value="">Select a time</option>
                {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                        {time}
                    </option>
                ))}
            </select>
            
            <label htmlFor="specialRequests">Special Requests</label>
            <textarea 
                id="specialRequests"
                name="specialRequests" 
                rows="4" 
                cols="50" 
                placeholder="Please note that whilst we will do our best to accommodate your special requests, we cannot guarantee that all will be fulfilled."
            />
            <button
                type="submit" 
                className={isFormValid() ? 'btn-form btn-form-active' : 'btn-form'} 
            ><b>Create Reservation</b></button>
        </form>
    );
};

export default ReservationForm;