import React, { useRef, useEffect, useMemo } from 'react';
import Footer from '../components/Footer.js';
import Header from '../components/Header.js';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

import HeroButton from '../components/HeroButton.js';

// Register the plugin
gsap.registerPlugin(TextPlugin);

const NO_PAGE_MESSAGES = [
    "This page vanished quicker than lemonade on a hot day!",
    "When life gives you lemons, but not the page you were looking for...",
    "This page is missing... Pulp Fiction?",
    "This page has been squeezed out of existence!",
    "Looks like this page is on a juice cleanse!",
    "We juiced up the website, but this page didn't make the cut!",
    "This page went sour. Try something sweeter!"
];

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

        // Set initial states - HIDE CURSOR IMMEDIATELY
        gsap.set(cursorElement, { 
            opacity: 0, // Hide cursor initially
            color: "#f4ce14",
            fontWeight: 700,
            fontSize: '10rem',
            fontStyle: 'normal'
        });
        
        gsap.set(errorElement, { text: "" }); // Start with empty text
        gsap.set([messageElement, buttonsElement], {
            opacity: 0,
            y: 30
        });

        // Create the animation timeline
        const tl = gsap.timeline();

        // Create blinking cursor animation (runs independently)
        const cursorTl = gsap.timeline({ repeat: -1, yoyo: true });
        cursorTl.to(cursorElement, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.inOut"
        });

        // Start cursor blinking immediately
        gsap.set(cursorElement, { opacity: 1 }); // Show cursor for blinking

        // Typewriter effect for "Error 404"
        tl.to(errorElement, {
            text: "Error 404",
            duration: 1.2,
            ease: "none",
            delay: 0.5 // Small delay before starting
        })
        // Pause and then hide cursor
        .to(cursorElement, {
            opacity: 0,
            duration: 0.2,
            delay: 0.8 // Pause after typing
        })
        // Animate in the message
        .to(messageElement, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3")
        // Animate in the buttons
        .to(buttonsElement, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.3");

        // Stop cursor blinking when main animation completes
        tl.eventCallback("onComplete", () => {
            cursorTl.kill();
            gsap.set(cursorElement, { opacity: 0 });
        });

        // Cleanup function
        return () => {
            tl.kill();
            cursorTl.kill();
        };
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
                    <span 
                        ref={cursorRef} 
                        className='no-page-code'
                        style={{ 
                            fontSize: 'inherit',
                            lineHeight: 'inherit',
                            marginLeft: '2px',
                            opacity: 0
                        }}
                    >
                        _
                    </span>
                </div>
                <h1 ref={messageRef} className='no-page-message'>{randomNoPageMessage}</h1>
                </div>
                <div ref={buttonsRef} style={{display: 'flex', gap: '1rem'}}>
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
