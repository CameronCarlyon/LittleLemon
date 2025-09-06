import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
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

    // Animation refs
    const headerRef = useRef(null);
    const formRef = useRef(null);

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

    // GSAP entrance animations
    useEffect(() => {
        const header = headerRef.current;
        const form = formRef.current;

        if (!header || !form) return;

        // Set initial state for header
        gsap.set(header, {
            opacity: 0,
            y: 30
        });

        // Get all form elements (labels, inputs, selects, textarea, button)
        const formElements = form.querySelectorAll('label, input, select, textarea, button');
        gsap.set(formElements, {
            opacity: 0
        });

        // Create animation timeline
        const tl = gsap.timeline();

        // Animate header first with fade in and down movement
        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            delay: 0.1
        })
        // Animate form elements with tight stagger (fade in only)
        .to(formElements, {
            opacity: 1,
            duration: 1,
            stagger: 0.06,
            ease: "power2.out"
        }, "-=0.15");

        // Cleanup function
        return () => {
            tl.kill();
        };
    }, []);

    const showError = submitAttempted && !validateForm();

    return (
        <form onSubmit={submitForm} noValidate ref={formRef}>
            <h1 ref={headerRef}>Secure Your Reservation</h1>
            
            <label htmlFor="fullName" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Full Name *</label>
            <input 
                id="fullName" 
                type="text" 
                className={showError && !formData.fullName.trim() ? 'form-error' : ''}
                value={formData.fullName}
                onChange={handleInputChange}
                required
            />
            
            <label htmlFor="emailAddress" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Email *</label>
            <input 
                id="emailAddress" 
                type="email" 
                className={showError && !validateEmail(formData.emailAddress) ? 'form-error' : ''}
                value={formData.emailAddress}
                onChange={handleInputChange}
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
                <option value="none"></option>
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
                <option value=""></option>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
            
            <label htmlFor="reservationDate" className={showError && !formData.reservationDate ? 'form-error-text' : ''}>Date *</label>
            <input 
                id="reservationDate"
                type="date" 
                placeholder=''
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
                <option value=""></option>
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