import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

import HeroButton from './HeroButton';

// Register the plugin
gsap.registerPlugin(SplitText);

const Hero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const elements = [titleRef.current, subtitleRef.current, descriptionRef.current,];
        
        gsap.set(elements, {
            y: -30,
            opacity: 0,
        });

        gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.2
        })

        const buttonElement = buttonRef.current

        gsap.set(buttonElement, {
            scale: 0,
        });

        gsap.to(buttonElement, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
            delay: 0.5
        });
    }, []);

    return (
        <div className='hero-container'>
            <div>
                <h1 ref={titleRef}>Little Lemon</h1>
                <h2 ref={subtitleRef}>Chicago</h2>
            </div>
            <h3 ref={descriptionRef}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</h3>
            <Link to='/reservations'>
                <HeroButton ref={buttonRef}>
                    Reserve a Table
                </HeroButton>
            </Link>
        </div>
    );
};

export default Hero;