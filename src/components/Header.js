import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';

import { useCart } from '../context/CartContext.js';
import HyperlinkLabel from './HyperlinkLabel.js';
import Divider from './Divider.js';

import lemonLogo from '../assets/lemon.png';
import cartIcon from '../assets/icons/basket-icon.json';
import hamburgerIcon from '../assets/icons/menu-icon.json';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems } = useCart();
    const mobileNavRef = useRef(null);
    const animationRef = useRef(null);
    const cartLottieRef = useRef(null);
    const hamburgerLottieRef = useRef();
    const prevCartLengthRef = useRef(0);
    
    // Navigation items array
    const navigationItems = [
        { href: '/menu', text: 'Menu' },
        { href: '/reservations', text: 'Reservations' },
        { href: '/our-restaurant', text: 'Our Restaurant' },
        { href: '/contact-us', text: 'Contact Us' },
        { href: '/faqs', text: 'FAQs' }
    ];

    // Toggle menu
    const toggleMenu = () => {
        if (window.innerWidth <= 1266) {
            setIsMenuOpen(prev => {
                const newState = !prev;
                
                // Trigger hamburger animation based on menu state
                if (hamburgerLottieRef.current) {
                    if (newState) {
                        // Play open animation (hamburger to X) - SWAP TO SECOND HALF
                        hamburgerLottieRef.current.playSegments([30, 60], true);
                    } else {
                        // Play close animation (X to hamburger) - SWAP TO FIRST HALF
                        hamburgerLottieRef.current.playSegments([0, 30], true);
                    }
                }
                
                return newState;
            });
        }
    };

    // Animation hook with interrupt support
    useEffect(() => {
        const nav = mobileNavRef.current;
        
        // Always kill any running animation first
        if (animationRef.current) {
            animationRef.current.kill();
        }
        
        const ctx = gsap.context(() => {
            if (isMenuOpen) {
                // Opening animation sequence
                
                // Create new timeline
                const tl = gsap.timeline();
                animationRef.current = tl;
                
                // First set initial state - completely hidden
                gsap.set(nav, {
                    display: 'block',
                    overflow: 'hidden',
                    height: 0,
                    opacity: 0,
                    transformOrigin: 'top'
                });
                
                // Animate background container first
                tl.to(nav, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.inOut',
                    clearProps: 'height'
                });
                
                // Get all menu items including dividers
                const items = nav.querySelectorAll('li');
                
                // Setup items for animation
                gsap.set(items, { 
                    opacity: 0,
                    y: -15,
                });
                
                // Animate items
                tl.to(items, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.05,
                    duration: 0.3,
                    ease: 'power2.out',
                }, '-=0.2');
                
            } else if (nav && getComputedStyle(nav).display !== 'none') {
                // Closing animation sequence
                
                // Create new timeline
                const tl = gsap.timeline({
                    onComplete: () => {
                        gsap.set(nav, { display: 'none' });
                    }
                });
                animationRef.current = tl;
                
                // Get all menu items
                const items = nav.querySelectorAll('li');
                
                // First animate items out
                tl.to(items, {
                    opacity: 0,
                    y: 15,
                    stagger: 0.03,
                    duration: 0.25,
                    ease: 'power2.in',
                });
                
                // Then collapse the container
                tl.to(nav, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut',
                }, '-=0.15');
            }
        });
        
        // Cleanup
        return () => {
            ctx.revert();
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, [isMenuOpen]);

    // Close menu on window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1266 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    // Initialize Lottie animation to static state (first frame)
    useEffect(() => {
        if (cartLottieRef.current) {
            // Go to the first frame and stop
            cartLottieRef.current.goToAndStop(0, true);
        }
    }, []);

    // Trigger cart animation when items are added to cart
    useEffect(() => {
        // Only run animation if we have a ref and the cart count has increased
        if (cartLottieRef.current && cartItems.length > prevCartLengthRef.current) {
            // Play "hover-basket-3" animation (70-130 frames)
            cartLottieRef.current.playSegments([70, 130], true);
        }
        
        // Update the previous cart length for next comparison
        prevCartLengthRef.current = cartItems.length;
    }, [cartItems.length]);

    // Handle cart hover animation
    const handleCartHover = () => {
        if (cartLottieRef.current) {
            // Check if animation is already playing
            if (!cartLottieRef.current.isPaused) {
                return; // Don't interrupt an ongoing animation
            }
            
            // Play "hover-basket-4" animation (140-200 frames)
            cartLottieRef.current.playSegments([140, 200], true);
        }
    };

    const getTotalCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <header>
            <Link to='/home'>
                <img src={lemonLogo} alt='Little Lemon Logo' style={{ maxWidth: '3rem'}}/>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="desktop-only">
                {navigationItems.map((item) => (
                    <HyperlinkLabel
                        key={item.href}
                        href={item.href}
                        text={item.text}
                    />
                ))}
            </nav>

            {/* Mobile Navigation */}
            <nav
                ref={mobileNavRef}
                className={`main-nav mobile-only ${isMenuOpen ? 'open' : ''}`}
                style={{ display: 'none' }}
            >
                <ul>
                    {navigationItems.map((item, index) => (
                        <React.Fragment key={item.href}>
                                <HyperlinkLabel
                                    href={item.href}
                                    text={item.text}
                                    onClick={toggleMenu}
                                />
                                <Divider width={1} />
                        </React.Fragment>
                    ))}
                        <HyperlinkLabel
                            href='/cart'
                            text='Shopping Cart'
                            onClick={toggleMenu}
                        />
                </ul>
            </nav>
            <div className='horizontal-container nav-icons'>
            {/* Desktop Cart Icon */}
                <NavLink to='/cart'>
                    <Lottie
                        lottieRef={cartLottieRef}
                        animationData={cartIcon}
                        autoplay={false}
                        loop={false}
                        style={{ width: '2.5rem' }}
                        onMouseEnter={handleCartHover}
                    />
                    <div className='cart-count'>
                        {getTotalCartCount() || ''}
                    </div>
                </NavLink>
            {/* Mobile Burger Menu */}
                <Lottie
                    lottieRef={hamburgerLottieRef}
                    animationData={hamburgerIcon}
                    autoplay={false}
                    loop={false}
                    className="burger-menu mobile-only" 
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                    style={{ width: '3.4rem' }}
                />
            </div>
        </header>
    );
};

export default Header;