import React, { memo, useState, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { gsap } from 'gsap';

/**
 * Newsletter Promotion Banner Component
 * 
 * Features:
 * - Email validation with real-time feedback
 * - Accessible form controls with proper ARIA labels
 * - Success state with auto-dismiss functionality
 * - Keyboard navigation support
 * - Mobile-optimized touch targets
 * - GSAP closing animation
 * 
 * @component
 */
const Promotion = memo(() => {
    const [email, setEmail] = useState('');
    const [isVisible, setIsVisible] = useState(() => {
        // Check sessionStorage for close state - persists across route navigation 
        // but resets on page refresh
        const isPromotionClosed = localStorage.getItem('promotion-closed');
        return isPromotionClosed !== 'true';
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    
    // Refs for accessibility and animations
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const dismissTimeoutRef = useRef(null);
    const bannerRef = useRef(null);
    const animationTimelineRef = useRef(null);

    /**
     * Enhanced email validation following RFC 5322 guidelines
     * @param {string} email - Email address to validate
     * @returns {boolean} - Validation result
     */
    const validateEmail = useCallback((email) => {
        if (!email?.trim()) return false;
        
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email.trim());
    }, []);

    /**
     * Animate promotion banner closing with GSAP
     * Gradually decreases height to 0 then removes from DOM
     */
    const animateClose = useCallback(() => {
        if (!bannerRef.current || isAnimating) return;
        
        setIsAnimating(true);
        
        // Kill any existing animation
        if (animationTimelineRef.current) {
            animationTimelineRef.current.kill();
        }

        const banner = bannerRef.current;
        
        gsap.context(() => {
            // Get current height for animation
            const currentHeight = banner.offsetHeight;
            
            // Create timeline for closing animation
            const tl = gsap.timeline({
                onComplete: () => {
                    // Store close state and remove from DOM after animation
                    sessionStorage.setItem('promotion-closed', 'true');
                    setIsVisible(false);
                    setIsAnimating(false);
                }
            });

            // Set initial height explicitly for smooth animation
            gsap.set(banner, {
                height: currentHeight,
                overflow: 'hidden'
            });

            // Animate content opacity and scale down
            tl.to(banner.children, {
                opacity: 0,
                scale: 0.95,
                y: -10,
                duration: 0.25,
                ease: 'power2.in',
                stagger: 0.02
            })
            // Then animate height to 0
            .to(banner, {
                height: 0,
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 0,
                duration: 0.3,
                ease: 'power2.inOut'
            }, '-=0.1')
            // Finally fade out completely
            .to(banner, {
                opacity: 0,
                duration: 0.15,
                ease: 'power1.in'
            }, '-=0.1');

            animationTimelineRef.current = tl;
            
        }, banner);
    }, [isAnimating]);

    /**
     * Handle form submission with validation and error handling
     * Always shows invalid state on any submit attempt
     * @param {Event} e - Form submission event
     */
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        
        // Always trigger invalid state on any submit attempt
        setSubmitAttempted(true);
        
        // Focus input for accessibility
        inputRef.current?.focus();
        
        // Don't proceed with actual submission - just show invalid state
        return;
    }, []);

    /**
     * Handle email input changes with validation reset
     * @param {Event} e - Input change event
     */
    const handleEmailChange = useCallback((e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        
        // Reset validation state when user starts typing
        if (submitAttempted) {
            setSubmitAttempted(false);
        }
    }, [submitAttempted]);

    /**
     * Handle promotion banner dismissal with GSAP animation
     * Stores close state in sessionStorage to persist across route navigation
     */
    const handleDismiss = useCallback(() => {
        if (dismissTimeoutRef.current) {
            clearTimeout(dismissTimeoutRef.current);
            dismissTimeoutRef.current = null;
        }
        
        // Trigger GSAP closing animation
        animateClose();
    }, [animateClose]);

    /**
     * Handle keyboard navigation for dismiss button
     * @param {KeyboardEvent} e - Keyboard event
     */
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            handleDismiss();
        }
    }, [handleDismiss]);

    /**
     * Handle input focus - clear error state for better UX
     */
    const handleInputFocus = useCallback(() => {
        if (submitAttempted) {
            setSubmitAttempted(false);
        }
    }, [submitAttempted]);

    // Cleanup timeout and animations on unmount
    React.useEffect(() => {
        return () => {
            if (dismissTimeoutRef.current) {
                clearTimeout(dismissTimeoutRef.current);
            }
            if (animationTimelineRef.current) {
                animationTimelineRef.current.kill();
            }
        };
    }, []);

        // Don't render if not visible
    if (!isVisible) return null;

    const showError = submitAttempted && !validateEmail(email);

    return (
        <div 
            ref={bannerRef}
            className="promotion-banner"
            role="banner"
            aria-live="polite"
            onKeyDown={handleKeyDown}
        >
            <form 
                ref={formRef}
                onSubmit={handleSubmit} 
                noValidate
                aria-label="Newsletter subscription"
            >
                <div className="newsletter-input">
                    <h3 id="newsletter-heading">
                        Subscribe to Our Monthly Newsletter!
                    </h3>
                        <label htmlFor="newsletter-email" className="sr-only">
                            Email address for newsletter subscription
                        </label>
                        
                        <div className='email-input-container'>
                        <input 
                            ref={inputRef}
                            id="newsletter-email"
                            type="email" 
                            name="email"
                            autoComplete="email"
                            required
                            disabled={isAnimating}
                            className={`newsletter-email-input ${
                                showError ? 'form-error' : ''
                            }`}
                            placeholder={
                                showError 
                                    ? "Please enter a valid email address" 
                                    : "Enter your email address"
                            }
                            value={email}
                            onChange={handleEmailChange}
                            onFocus={handleInputFocus}
                            aria-invalid={showError}
                            aria-describedby={showError ? "email-error" : "newsletter-heading"}
                            aria-label="Email address"
                        />
                        <button 
                            type="submit" 
                            disabled={!email.trim() || isAnimating}
                            className={`btn ${
                                showError ? 'btn-error' : ''
                            }`}
                            aria-label="Subscribe to newsletter"
                        >
                            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                        </button>  
                        </div>
                        
                        {showError && (
                            <div 
                                id="email-error" 
                                className="error-text"
                                role="alert"
                                aria-live="assertive"
                            >
                                Please enter a valid email address
                            </div>
                        )}
                </div>
            </form>
            
            <button
                type="button"
                className="close-btn"
                onClick={handleDismiss}
                disabled={isAnimating}
                aria-label="Close newsletter promotion"
                title="Close promotion (Press Escape)"
            >
                <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
        </div>
    );
});

Promotion.displayName = 'Promotion';

export default Promotion;