import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Promotion from '../components/Promotion.js';
import HyperlinkLabel from '../components/HyperlinkLabel.js';

function ContactUsPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    // Animation refs
    const headerRef = useRef(null);
    const contactDetailsRef = useRef(null);
    const formRef = useRef(null);

    const validateEmail = (email) => {
        return email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const validateForm = () => {
        return (
            formData.fullName.trim() !== '' &&
            validateEmail(formData.emailAddress) &&
            formData.subject.trim() !== '' &&
            formData.message.trim() !== ''
        );
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setSubmitAttempted(false);
    };

    const submitForm = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            setSubmitAttempted(true);
            return;
        }
        
        setIsSubmitted(true);
        console.log('Contact form submitted with data:', formData);
        
        // Clear form
        setFormData({
            fullName: '',
            emailAddress: '',
            subject: '',
            message: ''
        });
        
        setTimeout(() => setIsSubmitted(false), 2000);
    };

    // GSAP entrance animations
    useEffect(() => {
        const header = headerRef.current;
        const contactDetails = contactDetailsRef.current;
        const form = formRef.current;

        if (!header || !contactDetails || !form) return;

        // Set initial states
        gsap.set(header, {
            opacity: 0,
            y: 30
        });

        // Get all contact detail sections
        const detailSections = contactDetails.querySelectorAll('div');
        gsap.set(detailSections, {
            opacity: 0,
            y: 20
        });

        // Get all form fields in a specific order
        const formFields = [
            form.querySelector('#fullName'),
            form.querySelector('#emailAddress'),
            form.querySelector('#subject'),
            form.querySelector('#message'),
            form.querySelector('button')
        ].filter(Boolean); // Remove any null elements
    
        gsap.set(formFields, {
            opacity: 0,
            y: 20
        });

        // Create animation timeline
        const tl = gsap.timeline();

        // Animate header first
        tl.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
            delay: 0.1
        })
        // Animate contact detail sections with stagger
        .to(detailSections, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.2")
        // Animate form fields with consistent stagger
        .to(formFields, {
            opacity: 1,
            y: 0,
            duration: 0.25,
            stagger: 0.08,
            ease: "power2.out"
        }, "-=0.2");

        // Cleanup function
        return () => {
            tl.kill();
        };
    }, []);

    const showError = submitAttempted && !validateForm();

    return (
        <div className="App">
            <Header />
            <div className="main-content" id="main-content">
                <h1 ref={headerRef}>Want to get in touch?</h1>
                <div className="contact-info">
                    <div className="contact-details" ref={contactDetailsRef}>
                        <div>
                            <p><b>Address</b></p>
                            <p>1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                            <a href='https://maps.google.com'>
                                <HyperlinkLabel text='Get Directions' href=''/>
                            </a>
                            </p>
                        </div>
                        <div>
                            <p><b>Phone Number</b></p>
                            <p>(312) 555-7890</p>
                        </div>
                        <div>
                            <p><b>Email Address</b></p>
                            <p>contact@littlelemon.com</p>
                        </div>
                        <div>
                            <p><b>Contact Form</b></p>
                            <p> Alternatively, please fill out the following contact form and we'll aim to get back in touch with you shortly!</p>
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={submitForm} ref={formRef} noValidate>
                        <input
                            required
                            id='fullName'
                            type="text"
                            className={showError && !formData.fullName.trim() ? 'form-error' : ''}
                            placeholder="Your Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                        />
                        <input
                            required
                            id='emailAddress'
                            type="email"
                            className={showError && !validateEmail(formData.emailAddress) ? 'form-error' : ''}
                            placeholder="Your Email Address"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                        />
                        <input
                            required
                            id='subject'
                            type="text"
                            className={showError && !formData.subject.trim() ? 'form-error' : ''}
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                        />
                        <textarea
                            required
                            id='message'
                            className={showError && !formData.message.trim() ? 'form-error' : ''}
                            placeholder="Message"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                        <button 
                            type='submit' 
                            className={`btn-unavail ${validateForm() ? 'btn-form-active' : ''}`}
                        >
                            <b>{isSubmitted ? 'Sent!' : 'Submit'}</b>
                        </button>
                    </form>
                </div>
            </div>
            <Promotion />
            <Footer />
        </div>
    );
}

export default ContactUsPage;
