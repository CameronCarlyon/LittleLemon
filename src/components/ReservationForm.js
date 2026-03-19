import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { fetchAPI, getReservationTimeSlots, submitAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';

import HeroButton from './HeroButton';
import Dropdown from './Dropdown';
import DatePicker from './DatePicker';

const toDateValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseDateValue = (dateValue) => {
    const [year, month, day] = dateValue.split('-').map(Number);
    return new Date(year, month - 1, day);
};

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

    const todayValue = toDateValue(new Date());
    const reservationDateValue = formData.reservationDate || todayValue;
    const selectedReservationDate = parseDateValue(reservationDateValue);

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
            const dateObj = parseDateValue(date);
            const times = fetchAPI(dateObj);
            setAvailableTimes(times);

            setFormData((prev) => {
                if (!prev.reservationTime || times.includes(prev.reservationTime)) {
                    return prev;
                }
                return {
                    ...prev,
                    reservationTime: ''
                };
            });
        } catch (error) {
            console.error('Error fetching available times:', error);
            alert('Failed to fetch available times. Please try again later.');
        }
    };

    const availableTimeSet = new Set(availableTimes);
    const allReservationTimeSlots = getReservationTimeSlots(selectedReservationDate);
    const reservationTimeOptions = allReservationTimeSlots.map((time) => ({
        value: time,
        label: time,
        disabled: !availableTimeSet.has(time)
    }));

    let reservationTimeStatusMessage = '';
    if (allReservationTimeSlots.length === 0) {
        reservationTimeStatusMessage = 'Little Lemon is closed on the selected date.';
    } else if (reservationTimeOptions.every((option) => option.disabled)) {
        reservationTimeStatusMessage = reservationDateValue === todayValue
            ? 'There are no remaining reservation times available today.'
            : 'No reservation times are currently available for the selected date.';
    }

    // Fetch initial available times for today
    React.useEffect(() => {
        fetchAvailableTimes(todayValue);
    }, [todayValue]);

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

        // Get all form elements (labels, inputs, dropdowns, textarea, button)
        const formElements = form.querySelectorAll('label, input, .dropdown, .datepicker, textarea, [type="submit"]');
        gsap.set(formElements, {
            opacity: 0,
            y: 20
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
        // Animate form elements with snappier timing to match Contact Us
        .to(formElements, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: 'opacity,transform'
        }, "-=0.2");

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
            <Dropdown
                id="occasion"
                value={formData.occasion}
                onChange={handleInputChange}
                disabled={isProcessing}
                placeholder=""
                options={[
                    { value: 'birthday', label: 'Birthday' },
                    { value: 'anniversary', label: 'Anniversary' },
                    { value: 'business', label: 'Business Meeting' },
                    { value: 'casualDining', label: 'Casual Dining' }
                ]}
            />
            
            <label htmlFor="guestCount" className={shouldShowFieldError('guestCount') ? 'form-error-text' : ''}>Number of Guests *</label>
            <Dropdown
                id="guestCount"
                hasError={shouldShowFieldError('guestCount')}
                value={formData.guestCount}
                onChange={handleInputChange}
                disabled={isProcessing}
                required
                placeholder=""
                options={Array.from({ length: 20 }, (_, i) => ({
                    value: String(i + 1),
                    label: String(i + 1)
                }))}
            />
            
            <label htmlFor="reservationDate" className={shouldShowFieldError('reservationDate') ? 'form-error-text' : ''}>Date *</label>
            <DatePicker
                id="reservationDate"
                value={formData.reservationDate}
                onChange={handleInputChange}
                hasError={shouldShowFieldError('reservationDate')}
                disabled={isProcessing}
                required
                placeholder=""
            />
            
            <label htmlFor="reservationTime" className={shouldShowFieldError('reservationTime') ? 'form-error-text' : ''}>Time Slot *</label>
            <Dropdown
                id="reservationTime"
                hasError={shouldShowFieldError('reservationTime')}
                value={formData.reservationTime}
                onChange={handleInputChange}
                disabled={isProcessing || reservationTimeOptions.length === 0}
                required
                placeholder=""
                options={reservationTimeOptions}
            />
            {reservationTimeStatusMessage && (
                <p className="form-helper-text" role="status" aria-live="polite">
                    {reservationTimeStatusMessage}
                </p>
            )}
            
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