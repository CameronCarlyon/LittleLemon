import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';

import basketGraphic from '../assets/icons/basket-graphic.json';
import HeroButton from './HeroButton';

const BASKET_MESSAGES = [
    "Your basket's feeling a little lonely… why not add something tasty?",
    "Nothing in here yet, but your next Mediterranean feast is just a click away!",
    "Craving something delicious? Check out our specials and fill up your basket.",
    "Your cart tells us you're a minimalist, but our falafel would disagree!",
    "An empty basket? Not on our watch! Let's add some flavour to your day.",
    "Your basket is empty. Might we tempt you with our famous Shakshuka?",
    "Like an olive grove without olives, your basket is empty. Let's fix that!",
];

const CartEmpty = () => {
    const lottieRef = useRef(null);
    const isPlayingRef = useRef(false);
    const messageRef = useRef(null);
    const buttonsRef = useRef(null);
    const lottieContainerRef = useRef(null);

    // Memoize random message to prevent re-generation on re-renders
    const randomMessage = useMemo(() => 
        BASKET_MESSAGES[Math.floor(Math.random() * BASKET_MESSAGES.length)], 
        []
    );

    // Only start animation if not already playing
    const handleMouseEnter = useCallback(() => {
        if (lottieRef.current && !isPlayingRef.current) {
            isPlayingRef.current = true;
            lottieRef.current.goToAndPlay(0, true); // Play from beginning
        }
    }, []);

    // Handle animation completion - reset to first frame and allow new animations
    const handleComplete = useCallback(() => {
        isPlayingRef.current = false; // Mark as not playing
        if (lottieRef.current) {
            lottieRef.current.goToAndStop(0, true); // Reset to first frame
        }
    }, []);

    // GSAP entrance animations
    useEffect(() => {
        const messageElement = messageRef.current;
        const buttonsElement = buttonsRef.current;
        const lottieContainer = lottieContainerRef.current;

        if (!messageElement || !buttonsElement || !lottieContainer) return;

        // Set initial states
        gsap.set([lottieContainer, messageElement, buttonsElement], {
            opacity: 0,
            y: 30
        });

        // Create the animation timeline
        const tl = gsap.timeline();

        // Animate in the Lottie animation first
        tl.to(lottieContainer, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.5
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

        // Cleanup function
        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div className='flex-column no-page'>
            <div className='no-page-message-container'>
               <div
                ref={lottieContainerRef}
                onMouseEnter={handleMouseEnter}
            >
                <Lottie 
                    lottieRef={lottieRef}
                    animationData={basketGraphic}
                    loop={false}
                    autoplay={true}
                    onComplete={handleComplete}
                    style={{ height: '200px', width: 'auto' }}
                    aria-label="Empty basket animation"
                />
                </div>
                <p ref={messageRef} className='no-page-message'>{randomMessage}</p> 
            </div>
            <div ref={buttonsRef}>
                <Link to="/menu">
                    <HeroButton>Check Out The Menu</HeroButton>
                </Link>
            </div>
        </div>
    );
};

export default CartEmpty;