import React, { useState } from 'react';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Promotion from '../components/Promotion.js';

function ContactUsPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        emailAddress: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);

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

    const showError = submitAttempted && !validateForm();

    return (
        <div className="App">
            <Header />
            <div className="main-content">
                <h1>Want to get in touch?</h1>
                <div className="contact-info">
                    <div className="contact-details">
                        <div>
                            <p><b>Address</b></p>
                            <p>1358 Chestnut St. <br />Chicago<br />IL 60680<br />
                            <p><a href='maps.google.com'>Get Directions</a></p>
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
                    <form className="contact-form" onSubmit={submitForm} noValidate>
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
                            className={`btn-form ${isSubmitted ? 'btn-form-active' : ''}`}
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
