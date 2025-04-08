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
                navigate('/reservations/success');
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('There was a problem with the submission:', error);
            alert('Failed to create reservation. Please try again.');
        }
    };

    React.useEffect(() => {
        fetchAvailableTimes();
    }, []);

    return (
        <form onSubmit={submitForm}>
            <h1>Secure Your Reservation</h1>
            <label>Full Name *</label>
            <input type="text" name="fullName" required />
            <label>Email *</label>
            <input type="email" name="emailAddress" required />
            <label>Contact Number</label>
            <input type="tel" name="contactNumber" />
            <label>Occasion</label>
            <select name="occasion">
                <option value="none">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="business">Business Meeting</option>
                <option value="casualDining">Casual Dining</option>
            </select>
            <label>Number of Guests *</label>
            <select name="guestCount" required>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                        {i + 1}
                    </option>
                ))}
            </select>
            <label>Date *</label>
            <input 
                type="date" 
                name="reservationDate" 
                required 
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
            />
            <label>Time Slot *</label>
            <select name="reservationTime" required>
                <option value="">Select a time</option>
                {availableTimes.map((time, index) => (
                    <option key={index} value={time}>
                        {time}
                    </option>
                ))}
            </select>
            <label>Special Requests</label>
            <textarea name="specialRequests" rows="4" cols="50" placeholder="Please note that whilst we will do our best to accommodate your special requests, we cannot guarantee that all will be fulfilled."></textarea>
            <input type="submit" value="Create Reservation" className='btn-primary'/>
        </form>
    );
};

export default ReservationForm;