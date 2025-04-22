import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEnvelope, faEnvelopeCircleCheck } from '@fortawesome/free-solid-svg-icons';

const Promotion = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [submitAttempted, setSubmitAttempted] = useState(false);

    const validateEmail = (email) => {
        return email && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            setSubmitAttempted(true);
            return;
        }
        
        setIsSubmitted(true);
        console.log('Newsletter subscription:', email);
        setEmail('');
        
        setTimeout(() => setIsVisible(false), 3000);
    };

    if (!isVisible) return null;

    const showError = submitAttempted && !validateEmail(email);

    return (
        <div className="promotion-banner">
            <form onSubmit={handleSubmit} noValidate>
                <div className="newsletter-input">
                    <h3>Subscribe to Our Monthly Newsletter!</h3>
                    <div>
                        <input 
                            required
                            type="email" 
                            className={isSubmitted ? "form-successful" : showError ? "form-error" : ""}
                            placeholder={
                                isSubmitted 
                                    ? "Thanks for subscribing!" 
                                    : showError 
                                        ? "Please enter a valid email address" 
                                        : "Enter your email address"
                            }
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setSubmitAttempted(false);
                            }}
                            aria-label="Email address"
                            aria-invalid={showError}
                        />
                        <button type="submit" 
                                className={isSubmitted ? "btn btn-successful" : showError ? "btn btn-error" : "btn"}>
                            {isSubmitted ? (
                                <FontAwesomeIcon icon={faEnvelopeCircleCheck} />
                            ) : (
                                <FontAwesomeIcon icon={faEnvelope} />
                            )}
                        </button>  
                    </div>
                </div>
            </form>
            <FontAwesomeIcon 
                icon={faXmark} 
                className='close-btn' 
                onClick={() => setIsVisible(false)}
                aria-label="Close promotion"
            />
        </div>
    );
};

export default Promotion;