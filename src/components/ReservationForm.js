import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { fetchAPI, submitAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

import HeroButton from './HeroButton';

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
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    // Animation refs
    const headerRef = useRef(null);
    const formRef = useRef(null);

    /**
     * Enhanced email validation following RFC 5322 guidelines
     * @param {string} email - Email address to validate
     * @returns {boolean} - Validation result
     */
    const validateEmail = (email) => {
        return email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    /**
     * Comprehensive form validation
     * @returns {boolean} Form validity
     */
    const validateForm = () => {
        return (
            formData.fullName.trim() !== '' &&
            validateEmail(formData.emailAddress) &&
            formData.guestCount !== '' &&
            formData.reservationDate !== '' &&
            formData.reservationTime !== ''
        );
    };

    /**
     * Individual field validation for better error handling
     * @param {string} fieldName - Name of field to validate
     * @returns {boolean} Field validity
     */
    const validateField = (fieldName) => {
        switch (fieldName) {
            case 'fullName':
                return formData.fullName.trim() !== '';
            case 'emailAddress':
                return validateEmail(formData.emailAddress);
            case 'guestCount':
                return formData.guestCount !== '';
            case 'reservationDate':
                return formData.reservationDate !== '';
            case 'reservationTime':
                return formData.reservationTime !== '';
            default:
                return true;
        }
    };

    /**
     * Check if field should show error state
     * @param {string} fieldName - Name of field to check
     * @returns {boolean} Should show error
     */
    const shouldShowFieldError = (fieldName) => {
        return submitAttempted && !validateField(fieldName);
    };

    /**
     * Handle standard form input changes
     * @param {Event} e - Input change event
     */
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        
        // Clear error state immediately when user starts typing (shows they're addressing the issue)
        if (submitAttempted) {
            setSubmitAttempted(false);
        }

        if (id === 'reservationDate') {
            fetchAvailableTimes(value);
        }
    };

    /**
     * Handle form submission with processing delay - validate, process reservation, and navigate
     * @param {Event} e - Submit event
     */
    const submitForm = async (e) => {
        e.preventDefault();
        setSubmitAttempted(true);

        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Add 3 second processing delay for better UX
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const success = submitAPI(formData);
            if (success) {
                console.log('Reservation submitted:', formData);
                navigate('/reservations/success', { 
                    state: { reservationData: formData }
                });
            }
        } catch (error) {
            console.error('Submission failed:', error);
            alert('Failed to create reservation. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Fetch available time slots for selected date
     * @param {string} date - Selected reservation date
     */
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

    // Fetch initial available times for today
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

    return (
        <form onSubmit={submitForm} noValidate ref={formRef}>
            <h1 ref={headerRef}>Secure Your Reservation</h1>
            
            <label htmlFor="fullName" className={shouldShowFieldError('fullName') ? 'form-error-text' : ''}>Full Name *</label>
            <input 
                id="fullName" 
                type="text" 
                className={shouldShowFieldError('fullName') ? 'form-error' : ''}
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isProcessing}
                required
            />
            
            <label htmlFor="emailAddress" className={shouldShowFieldError('emailAddress') ? 'form-error-text' : ''}>Email *</label>
            <input 
                id="emailAddress" 
                type="email" 
                className={shouldShowFieldError('emailAddress') ? 'form-error' : ''}
                value={formData.emailAddress}
                onChange={handleInputChange}
                disabled={isProcessing}
                required 
            />
            
            <label htmlFor="contactNumber">Contact Number</label>
            <input 
                id="contactNumber" 
                type="tel" 
                value={formData.contactNumber}
                onChange={handleInputChange}
                disabled={isProcessing}
            />
            
            <label htmlFor="occasion">Occasion</label>
            <select 
                id="occasion" 
                value={formData.occasion}
                onChange={handleInputChange}
                disabled={isProcessing}
            >
                <option value="none"></option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="business">Business Meeting</option>
                <option value="casualDining">Casual Dining</option>
            </select>
            
            <label htmlFor="guestCount" className={shouldShowFieldError('guestCount') ? 'form-error-text' : ''}>Number of Guests *</label>
            <select 
                id="guestCount" 
                className={shouldShowFieldError('guestCount') ? 'form-error' : ''}
                value={formData.guestCount}
                onChange={handleInputChange}
                disabled={isProcessing}
                required
            >
                <option value=""></option>
                {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
            </select>
            
            <label htmlFor="reservationDate" className={shouldShowFieldError('reservationDate') ? 'form-error-text' : ''}>Date *</label>
            <input 
                id="reservationDate"
                type="date" 
                placeholder=''
                value={formData.reservationDate}
                onChange={handleInputChange}
                className={shouldShowFieldError('reservationDate') ? 'form-error' : ''}
                disabled={isProcessing}
                required 
                min={new Date().toISOString().split('T')[0]}
            />
            
            <label htmlFor="reservationTime" className={shouldShowFieldError('reservationTime') ? 'form-error-text' : ''}>Time Slot *</label>
            <select 
                id="reservationTime" 
                className={shouldShowFieldError('reservationTime') ? 'form-error' : ''}
                value={formData.reservationTime}
                onChange={handleInputChange}
                disabled={isProcessing}
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
                disabled={isProcessing}
                rows="4" 
                cols="50" 
                placeholder="Please note that whilst we will do our best to accommodate your special requests, we cannot guarantee that all will be fulfilled."
            />
            
            <HeroButton
                type="submit"
                variant={validateForm() ? 'tertiary' : 'disabled'}
                disabled={!validateForm() || isProcessing}
                aria-disabled={!validateForm() || isProcessing}
                aria-busy={isProcessing}
            >
                <b>{isProcessing ? 'Processing...' : 'Create Reservation'}</b>
            </HeroButton>
        </form>
    );
};

export default ReservationForm;