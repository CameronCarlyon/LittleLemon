import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import HyperlinkLabel from './HyperlinkLabel.js';
import Divider from './Divider.js';
import { gsap } from 'gsap';
import Lottie from 'lottie-react'; // Better for conditional animations

import lemonLogo from '../assets/lemon.png';
// Import your Lottie animation JSON
import cartIcon from '../assets/system-regular-65-shopping-basket-hover-wiggle.json';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { cartItems } = useCart();
    const mobileNavRef = useRef(null);
    const animationRef = useRef(null);
    const cartLottieRef = useRef(); // Ref for cart animation

    // Navigation items array
    const navigationItems = [
        { href: '/menu', text: 'Menu' },
        { href: '/reservations', text: 'Reservations' },
        { href: '/our-restaurant', text: 'Our Restaurant' },
        { href: '/contact-us', text: 'Contact Us' },
        { href: '/faqs', text: 'FAQs' }
    ];

    // Toggle menu - removed isAnimating check to allow interruption
    const toggleMenu = () => {
        if (window.innerWidth <= 1266) {
            setIsMenuOpen(prev => !prev);
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

    // Trigger cart animation when items are added
    useEffect(() => {
        if (cartLottieRef.current && cartItems.length > 0) {
            // Play the "add" animation segment
            cartLottieRef.current.playSegments([30, 60], true);
        }
    }, [cartItems.length]);

    const handleCartHover = () => {
        if (cartLottieRef.current) {
            // Play the "wiggle" animation segment
            cartLottieRef.current.playSegments([0, 30], true);
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
                    {/* Main navigation items */}
                    {navigationItems.map((item, index) => (
                        <React.Fragment key={item.href}>
                            <li>
                                <HyperlinkLabel
                                    href={item.href}
                                    text={item.text}
                                    onClick={toggleMenu}
                                />
                            </li>
                            {index < navigationItems.length - 1 && (
                                <li>
                                    <Divider />
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                    
                    {/* Add final divider before Shopping Cart */}
                    <li>
                        <Divider />
                    </li>
                    
                    {/* Shopping Cart link - last item */}
                    <li>
                        <HyperlinkLabel
                            href='/cart'
                            text='Shopping Cart'
                            onClick={toggleMenu}
                        />
                    </li>
                </ul>
            </nav>
            <div className='horizontal-container'>
            {/* Desktop Cart Icon */}
            <div 
                className="desktop-only cart-container"
                onMouseEnter={handleCartHover}
            >
                <NavLink to='/cart'>
                    <Lottie
                        lottieRef={cartLottieRef}
                        animationData={cartIcon}
                        autoplay={false}
                        loop={false}
                        style={{ width: '2rem', height: '2rem' }}
                    />
                    <div className='cart-count'>
                        {getTotalCartCount() || ''}
                    </div>
                </NavLink>
            </div>

            {/* Mobile Burger Menu */}
            <div
                className="burger-menu mobile-only" 
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
            >
                <FontAwesomeIcon 
                    className='icon' 
                    icon={isMenuOpen ? faTimes : faBars} 
                />
            </div>
            </div>
        </header>
    );
};

export default Header;