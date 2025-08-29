import React, { useRef, useEffect, useMemo } from 'react';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

import HeroButton from '../components/HeroButton.js';

// Register the plugin
gsap.registerPlugin(TextPlugin);

/**
 * Array of witty lemon-themed 404 messages
 * Following DRY principles with centralized message management
 */
const NO_PAGE_MESSAGES = [
    "This page vanished quicker than lemonade on a hot day!",
    "When life gives you lemons, but not the page you were looking for...",
    "This page is missing... Pulp Fiction?",
    "This page has been squeezed out of existence!",
    "Looks like this page is on a juice cleanse!",
    "We juiced up the website, but this page didn't make the cut!",
    "This page went sour. Try something sweeter!"
];

/**
 * NoPage component renders a 404 error page with typewriter animation
 * Uses GSAP for smooth animations and accessibility features
 */
function NoPage() {
    const errorCodeRef = useRef(null);
    const cursorRef = useRef(null);
    const messageRef = useRef(null);
    const buttonsRef = useRef(null);

    // Memoize the random message to prevent re-generation on re-renders
    const randomNoPageMessage = useMemo(() => 
        NO_PAGE_MESSAGES[Math.floor(Math.random() * NO_PAGE_MESSAGES.length)], 
        []
    );

    useEffect(() => {
        const errorElement = errorCodeRef.current;
        const cursorElement = cursorRef.current;
        const messageElement = messageRef.current;
        const buttonsElement = buttonsRef.current;

        if (!errorElement || !cursorElement || !messageElement || !buttonsElement) return;

        // Create GSAP context for proper cleanup
        const ctx = gsap.context(() => {
            // Set initial states - cursor as a styled div block
            gsap.set(cursorElement, { 
                opacity: 0,
                backgroundColor: "#f4ce14",
                width: "10px",
                borderRadius: "2px",
                height: "4rem",
                display: "inline-block",
                animation: "none" // Prevent any CSS animations
            });
            
            gsap.set(errorElement, { text: "" });
            gsap.set([messageElement, buttonsElement], {
                opacity: 0,
                y: 30
            });

            // Create the main animation timeline
            const tl = gsap.timeline();

            // Create independent blinking cursor timeline
            const cursorTl = gsap.timeline({ 
                repeat: -1, 
                yoyo: true,
                defaults: { ease: "power1.inOut" }
            });
            
            cursorTl.to(cursorElement, {
                opacity: 0,
                duration: 0.4
            });

            // Show cursor and start blinking immediately
            gsap.set(cursorElement, { opacity: 1 });

            // Main animation sequence
            tl.to(errorElement, {
                text: "Error 404",
                duration: 1.2,
                ease: "none",
                delay: 0.5
            })
            .to(cursorElement, {
                opacity: 0,
                duration: 0.2,
                delay: 0.8,
                onStart: () => cursorTl.kill() // Stop blinking when hiding
            })
            .to(messageElement, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3")
            .to(buttonsElement, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3");

        }, [errorCodeRef, cursorRef, messageRef, buttonsRef]);

        // Cleanup function
        return () => ctx.revert();
    }, []);

    return (
        <div>
            <Header />
            <div className='flex-column no-page'>
                <div className='no-page-message-container'>
                    <div style={{ display: 'inline-flex', alignItems: 'baseline' }}>
                        <h1 
                            ref={errorCodeRef} 
                            className='no-page-code'
                            aria-label="Error 404"
                        >
                            <span className="sr-only">Error 404</span>
                        </h1>
                        <div 
                            ref={cursorRef} 
                            className='typewriter-cursor'
                            style={{ 
                                marginLeft: '8px',
                                opacity: 0
                            }}
                            aria-hidden="true"
                        />
                    </div>
                    <h1 ref={messageRef} className='no-page-message'>
                        {randomNoPageMessage}
                    </h1>
                </div>
                <div ref={buttonsRef} style={{ display: 'flex', gap: '1rem' }}>
                    <Link to='/home'>
                        <HeroButton variant='primary'>Go Home</HeroButton>
                    </Link>
                    <Link to='/contact-us'>
                        <HeroButton variant='secondary'>Contact Us</HeroButton>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default NoPage;
