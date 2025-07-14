import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register the plugin
gsap.registerPlugin(SplitText);

const Hero = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        // Create SplitText instances
        const titleSplit = new SplitText(titleRef.current.querySelector('h1'), { type: "chars" });
        const subtitleSplit = new SplitText(subtitleRef.current, { type: "chars" });
        const descriptionSplit = new SplitText(descriptionRef.current, { type: "words" });

        // Set initial states - more subtle
        gsap.set([titleSplit.chars, subtitleSplit.chars], {
            opacity: 0,
            y: 20
        });

        gsap.set(descriptionSplit.words, {
            opacity: 0,
            y: 10
        });

        gsap.set(buttonRef.current, {
            opacity: 0,
            y: 15
        });

        // Create subtle entrance animation sequence
        tl.to(titleSplit.chars, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
            stagger: 0.02
        })
        .to(subtitleSplit.chars, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            stagger: 0.015
        }, '-=0.8')
        .to(descriptionSplit.words, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power1.out',
            stagger: 0.05
        }, '-=0.6')
        .to(buttonRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
        }, '-=0.4');

        // Cleanup function
        return () => {
            titleSplit.revert();
            subtitleSplit.revert();
            descriptionSplit.revert();
        };

    }, []);

    return (
        <div ref={heroRef} className='hero'>
            <div ref={titleRef}>
                <h1>Little Lemon</h1>
                <h2 ref={subtitleRef} style={{ color: 'white' }}>Chicago</h2>
            </div>
            <h3 ref={descriptionRef}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</h3>
            <Link to='/reservations'>
                <div ref={buttonRef} className='btn-primary'>Reserve a Table</div>
            </Link>
        </div>
    );
};

export default Hero;