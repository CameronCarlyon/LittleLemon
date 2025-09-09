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
 * - Keyboard navigation support
 * - Mobile-optimized touch targets
 * - GSAP closing and hover animations
 * - Auto-close after successful submission
 * 
 * @component
 */
const Promotion = memo(() => {
    const [email, setEmail] = useState('');
    const [isVisible, setIsVisible] = useState(() => {
        // Reset promotion state on page refresh by checking if this is a fresh page load
        const isPageRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
        
        if (isPageRefresh) {
            // Clear any existing close state on refresh
            sessionStorage.removeItem('promotion-closed');
            return true;
        }
        
        // Check sessionStorage for close state - persists across route navigation only
        const isPromotionClosed = sessionStorage.getItem('promotion-closed');
        return isPromotionClosed !== 'true';
    });
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
    
    // Refs for accessibility and animations
    const inputRef = useRef(null);
    const formRef = useRef(null);
    const dismissTimeoutRef = useRef(null);
    const bannerRef = useRef(null);
    const animationTimelineRef = useRef(null);
    const closeButtonRef = useRef(null);
    const autoCloseTimeoutRef = useRef(null);

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
     * Handle close button hover animation with GSAP
     * Scales X SVG icon slightly on hover for interactive feedback
     */
    const handleCloseButtonHover = useCallback((isHovering) => {
        if (!closeButtonRef.current || isAnimating) return;
        
        const svgIcon = closeButtonRef.current.querySelector('.svg-inline--fa');
        if (!svgIcon) return;

        gsap.context(() => {
            if (isHovering) {
                // Hover in: scale up slightly
                gsap.to(svgIcon, {
                    scale: 1.2,
                    duration: 0.2,
                    ease: 'power2.out',
                    force3D: true
                });
            } else {
                // Hover out: scale back to normal
                gsap.to(svgIcon, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'power2.out',
                    force3D: true
                });
            }
        }, closeButtonRef.current);
    }, [isAnimating]);

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
     * Handle form submission with validation and success behavior
     * Shows invalid state or processes successful submission with auto-close
     * @param {Event} e - Form submission event
     */
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        // Always trigger submit attempt for validation
        setSubmitAttempted(true);
        
        // If email is valid, proceed with submission
        if (validateEmail(email)) {
            console.log('Newsletter subscription:', email);
            
            // Clear input field instantly on successful submission
            setEmail('');
            
            // Set successful submission state
            setIsSubmissionSuccessful(true);
            setSubmitAttempted(false);
            
            // Auto-close after 3 seconds
            autoCloseTimeoutRef.current = setTimeout(() => {
                animateClose();
            }, 3000);
            
            return;
        }
        
        // If invalid, focus input for accessibility
        inputRef.current?.focus();
    }, [email, validateEmail, animateClose]);

    /**
     * Handle email input changes with validation reset
     * @param {Event} e - Input change event
     */
    const handleEmailChange = useCallback((e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        
        // Clear error state immediately when user starts typing (shows they're addressing the issue)
        if (submitAttempted) {
            setSubmitAttempted(false);
        }
        
        if (isSubmissionSuccessful) {
            setIsSubmissionSuccessful(false);
            // Clear auto-close timeout if user starts typing after success
            if (autoCloseTimeoutRef.current) {
                clearTimeout(autoCloseTimeoutRef.current);
                autoCloseTimeoutRef.current = null;
            }
        }
    }, [submitAttempted, isSubmissionSuccessful]);

    /**
     * Handle promotion banner dismissal with GSAP animation
     * Stores close state in sessionStorage to persist across route navigation
     */
    const handleDismiss = useCallback(() => {
        // Clear any pending auto-close timeout
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
        
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
     * Handle input focus - no longer clears error state automatically
     * Error state should only clear when the field becomes valid
     */
    const handleInputFocus = useCallback(() => {
        // Focus no longer automatically clears error state
        // Error state will only clear when field becomes valid through handleEmailChange
    }, []);

    // Cleanup timeouts and animations on unmount
    React.useEffect(() => {
        return () => {
            if (dismissTimeoutRef.current) {
                clearTimeout(dismissTimeoutRef.current);
            }
            if (autoCloseTimeoutRef.current) {
                clearTimeout(autoCloseTimeoutRef.current);
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
                            disabled={isAnimating || isSubmissionSuccessful}
                            className={`newsletter-email-input ${
                                showError ? 'form-error' : ''
                            } ${
                                isSubmissionSuccessful ? 'form-success' : ''
                            }`}
                            placeholder={
                                isSubmissionSuccessful 
                                    ? "It's on the way!"
                                    : showError 
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
                            disabled={isAnimating || isSubmissionSuccessful}
                            className={`btn ${
                                showError ? 'btn-error' : ''
                            } ${
                                isSubmissionSuccessful ? 'btn-success' : ''
                            }`}
                            aria-label="Subscribe to newsletter"
                        >
                            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
                        </button>  
                    </div>
                </div>
            </form>
            
            <button
                ref={closeButtonRef}
                type="button"
                className="close-btn"
                onClick={handleDismiss}
                onMouseEnter={() => handleCloseButtonHover(true)}
                onMouseLeave={() => handleCloseButtonHover(false)}
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