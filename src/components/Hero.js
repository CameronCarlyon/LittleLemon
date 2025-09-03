import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

import HeroButton from './HeroButton';
import HeroVideo from '../assets/videos/HeroVideo.mp4';
import HeroVideoWebM from '../assets/videos/HeroVideo.webm';
import HeroVideoPoster from '../assets/images/HeroVideoPoster.jpg';

const Hero = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descriptionRef = useRef(null);
    const buttonRef = useRef(null);
    const videoRef = useRef(null);

    useLayoutEffect(() => {
        // Video loading check
        const video = videoRef.current;
        if (video) {
            video.addEventListener('loadeddata', () => {
                console.log('Video loaded successfully');
            });
            video.addEventListener('error', (e) => {
                console.error('Video failed to load:', e);
            });
        }

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
        <section className='hero-container'>
            <video
                ref={videoRef}
                className="hero-video"
                autoPlay
                loop
                muted
                playsInline
                poster={HeroVideoPoster}
                preload="auto"
                aria-hidden="true"
                onError={(e) => console.error('Video error:', e)}
                onLoadStart={() => console.log('Video loading started')}
                onCanPlay={() => console.log('Video can play')}>
                <source src={HeroVideoWebM} type="video/webm" />
                <source src={HeroVideo} type="video/mp4" />
            </video>
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
        </section>
    );
};

export default Hero;