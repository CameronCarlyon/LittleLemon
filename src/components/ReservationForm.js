import React, { useState } from 'react';
import { fetchAPI, submitAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ReservationForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        contactNumber: '',
        occasion: '',
        guestCount: '',
        reservationDate: '',
        reservationTime: '',
        specialRequests: ''
    });
    const [availableTimes, setAvailableTimes] = useState([]);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validateForm = () => {
        return (
            formData.fullName.trim() !== '' &&
            validateEmail(formData.emailAddress) &&
            formData.guestCount !== '' &&
            formData.reservationDate !== '' &&
            formData.reservationTime !== ''
        );
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setSubmitAttempted(false);

        if (id === 'reservationDate') {
            fetchAvailableTimes(value);
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (!validateForm()) {
            return;
        }

        try {
            const success = submitAPI(formData);
            if (success) {
                setIsSubmitted(true);
                console.log('Reservation submitted:', formData);
                navigate('/reservations/success', { 
                    state: { reservationData: formData }
                });
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to create reservation. Please try again.');
        }
    };

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

    React.useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        fetchAvailableTimes(today);
    }, []);

    const showError = submitAttempted && !validateForm();

    return (
        <form onSubmit={submitForm} noValidate>
            <h1>Secure Your Reservation</h1>
            
            <label htmlFor="fullName" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Full Name *</label>
            <input 
                id="fullName" 
                type="text" 
                className={showError && !formData.fullName.trim() ? 'form-error' : ''}
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={showError ? "Please enter your name" : ""}
                required
            />
            
            <label htmlFor="emailAddress" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Email *</label>
            <input 
                id="emailAddress" 
                type="email" 
                className={showError && !validateEmail(formData.emailAddress) ? 'form-error' : ''}
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder={showError ? "Please enter a valid email address" : ""}
                required 
            />
            
            <label htmlFor="contactNumber">Contact Number</label>
            <input 
                id="contactNumber" 
                type="tel" 
                value={formData.contactNumber}
                onChange={handleInputChange}
            />
            
            <label htmlFor="occasion">Occasion</label>
            <select 
                id="occasion" 
                value={formData.occasion}
                onChange={handleInputChange}
            >
                <option value="none">Select an occasion</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="business">Business Meeting</option>
                <option value="casualDining">Casual Dining</option>
            </select>
            
            <label htmlFor="guestCount" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Number of Guests *</label>
            <select 
                id="guestCount" 
                className={showError && !formData.guestCount ? 'form-error' : ''}
                value={formData.guestCount}
                onChange={handleInputChange}
                required
            >
                <option value="">Select number of guests</option>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
            
            <label htmlFor="reservationDate" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Date *</label>
            <input 
                id="reservationDate"
                type="date" 
                value={formData.reservationDate}
                onChange={handleInputChange}
                className={showError && !formData.reservationDate ? 'form-error' : ''}
                required 
                min={new Date().toISOString().split('T')[0]}
            />
            
            <label htmlFor="reservationTime" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Time Slot *</label>
            <select 
                id="reservationTime" 
                className={showError && !formData.reservationTime ? 'form-error' : ''}
                value={formData.reservationTime}
                onChange={handleInputChange}
                required
            >
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
                value={formData.specialRequests}
                onChange={handleInputChange}
                rows="4" 
                cols="50" 
                placeholder="Please note that whilst we will do our best to accommodate your special requests, we cannot guarantee that all will be fulfilled."
            />
            <button
                type="submit" 
                className={`btn-unavail ${validateForm() ? 'btn-form-active' : ''}`}
            >
                <b>Create Reservation</b>
            </button>
        </form>
    );
};

export default ReservationForm;