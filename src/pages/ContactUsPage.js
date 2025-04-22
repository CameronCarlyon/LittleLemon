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

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const isFormValid = () => {
        return Object.values(formData).every(value => value.trim() !== '');
    };

    const submitForm = (e) => {
        e.preventDefault();
        if (isFormValid()) {
            console.log('Contact form submitted with data:', formData);
            setIsSubmitted(true);
            // Clear form
            setFormData({
                fullName: '',
                emailAddress: '',
                subject: '',
                message: ''
            });
            // Reset submission state after delay
            setTimeout(() => setIsSubmitted(false), 2000);
        }
    };

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
                    <form className="contact-form" onSubmit={submitForm}>
                        <input
                            required
                            id='fullName'
                            type="text"
                            placeholder="Your Name"
                            value={formData.fullName}
                            onChange={handleInputChange}
                        />
                        <input
                            required
                            id='emailAddress'
                            type="email"
                            placeholder="Your Email Address"
                            value={formData.emailAddress}
                            onChange={handleInputChange}
                        />
                        <input
                            required
                            id='subject'
                            type="text"
                            placeholder="Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                        />
                        <textarea
                            required
                            id='message'
                            placeholder="Message"
                            value={formData.message}
                            onChange={handleInputChange}
                        />
                        <button 
                            type='submit' 
                            className={`btn-form ${isFormValid() ? 'btn-form-active' : ''}`}
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
