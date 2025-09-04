import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

import { useCart } from '../context/CartContext.js';
import HyperlinkLabel from './HyperlinkLabel.js';
import Divider from './Divider.js';
import LittleLemonLogo from './LittleLemonLogo.js';
import CartIcon from './CartIcon.js';
import HamburgerMenuIcon from './HamburgerMenuIcon.js';

// Constants and configuration
const CONFIG = {
  DESKTOP_BREAKPOINT: 1266,
  NAVIGATION_ITEMS: [
    { href: '/menu', text: 'Menu' },
    { href: '/reservations', text: 'Reservations' },
    { href: '/our-restaurant', text: 'Our Restaurant' },
    { href: '/contact-us', text: 'Contact Us' },
    { href: '/faqs', text: 'FAQs' }
  ]
};

// Custom hook for animation refs
const useAnimationRefs = () => {
  return {
    mobileNav: useRef(null),
    animation: useRef(null),
    cartIcon: useRef(null),
    hamburgerMenu: useRef(null)
  };
};

// NavigationItems component
const NavigationItems = ({ items, onClick = () => {} }) => (
  <>
    {items.map((item) => (
      <HyperlinkLabel
        key={item.href}
        href={item.href}
        text={item.text}
        onClick={onClick}
      />
    ))}
  </>
);

// Main Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const refs = useAnimationRefs();
  
  // Memoized cart count calculation
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  // Toggle menu with animation
  const toggleMenu = useCallback(() => {
    if (window.innerWidth <= CONFIG.DESKTOP_BREAKPOINT) {
      setIsMenuOpen(prev => !prev);
    }
  }, []);

  // Mobile menu animation
  useEffect(() => {
    const nav = refs.mobileNav.current;
    if (!nav) return;

    // Kill any running animation
    if (refs.animation.current) {
      refs.animation.current.kill();
    }

    const ctx = gsap.context(() => {
      if (isMenuOpen) {
        // Opening animation
        const tl = gsap.timeline();
        refs.animation.current = tl;

        gsap.set(nav, {
          display: 'block',
          overflow: 'hidden',
          height: 0,
          opacity: 0,
          transformOrigin: 'top'
        });

        const items = nav.querySelectorAll('li');
        gsap.set(items, { opacity: 0, y: -15 });

        tl.to(nav, {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.inOut',
          clearProps: 'height'
        })
        .to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
        }, '-=0.2');

      } else if (getComputedStyle(nav).display !== 'none') {
        // Closing animation
        const tl = gsap.timeline({
          onComplete: () => gsap.set(nav, { display: 'none' })
        });
        refs.animation.current = tl;

        const items = nav.querySelectorAll('li');
        
        tl.to(items, {
          opacity: 0,
          y: 15,
          stagger: 0.03,
          duration: 0.25,
          ease: 'power2.in',
        })
        .to(nav, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        }, '-=0.15');
      }
    });

    return () => {
      ctx.revert();
      if (refs.animation.current) {
        refs.animation.current.kill();
      }
    };
  });

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > CONFIG.DESKTOP_BREAKPOINT && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  // GSAP hover animations for cart and hamburger icons
  useEffect(() => {
    const cartIcon = refs.cartIcon.current;
    const hamburgerMenu = refs.hamburgerMenu.current;

    const setupHoverAnimation = (element) => {
      if (!element) return;

      const handleMouseEnter = () => {
        gsap.to(element, {
          scale: 1.1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    };

    const cleanupCart = setupHoverAnimation(cartIcon);
    const cleanupHamburger = setupHoverAnimation(hamburgerMenu);

    return () => {
      if (cleanupCart) cleanupCart();
      if (cleanupHamburger) cleanupHamburger();
    };
  });

  return (
    <header>
      <div className='logo-container'>
        <LittleLemonLogo />
      </div>
      
      {/* Desktop Navigation */}
      <nav className="desktop-only">
        <NavigationItems items={CONFIG.NAVIGATION_ITEMS} />
      </nav>

      {/* Mobile Navigation */}
      <nav
        ref={refs.mobileNav}
        className={`main-nav mobile-only ${isMenuOpen ? 'open' : ''}`}
        style={{ display: 'none' }}
      >
        <ul>
          {CONFIG.NAVIGATION_ITEMS.map((item) => (
            <React.Fragment key={item.href}>
              <HyperlinkLabel
                href={item.href}
                text={item.text}
                onClick={toggleMenu}
              />
              <Divider width={'1rem'} color={'var(--color-green)'} triggerAnimation={true} />
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
        {/* Cart Icon Component */}
        <div ref={refs.cartIcon}>
          <CartIcon count={cartCount} />
        </div>

        {/* Mobile Burger Menu Component */}
        <div ref={refs.hamburgerMenu}>
          <HamburgerMenuIcon 
            isOpen={isMenuOpen}
            onToggle={toggleMenu}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;