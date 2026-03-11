import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
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
  const [isMenuRendered, setIsMenuRendered] = useState(false);
  const [isMenuPaddingExpanded, setIsMenuPaddingExpanded] = useState(false);
  const { cartItems } = useCart();
  const refs = useAnimationRefs();
  const mobileNavRef = refs.mobileNav;
  const animationRef = refs.animation;
  const paddingAnimationFrameRef = useRef(null);
  
  // Memoized cart count calculation
  const cartCount = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  // Toggle menu with animation
  const toggleMenu = useCallback(() => {
    if (window.innerWidth <= CONFIG.DESKTOP_BREAKPOINT) {
      setIsMenuOpen((prev) => {
        const next = !prev;
        if (next) {
          setIsMenuRendered(true);
        }
        return next;
      });
    }
  }, []);

  // Mobile menu animation
  useLayoutEffect(() => {
    const nav = mobileNavRef.current;
    if (!nav) return;

    // Kill any running timeline so we start fresh
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }

    const list = nav.querySelector('ul');
    const items = list
      ? Array.from(list.children).filter(
          (child) =>
            child.classList.contains('hyperlink-label') ||
            child.classList.contains('divider')
        )
      : [];

    // STATE 1: Not rendered — ensure everything is hidden
    if (!isMenuRendered) {
      gsap.set(nav, { display: 'none', visibility: 'hidden', height: 0, opacity: 0 });
      if (items.length) gsap.set(items, { opacity: 0 });
      return;
    }

    // STATE 2: Opening
    if (isMenuOpen) {
      gsap.set(items, { opacity: 0 });
      gsap.set(nav, {
        display: 'block',
        visibility: 'visible',
        overflow: 'hidden',
        height: 0,
        opacity: 1,
      });

      const tl = gsap.timeline();
      animationRef.current = tl;

      tl.to(nav, {
        height: 'auto',
        duration: 0.24,
        ease: 'power2.inOut',
      })
      .to(items, {
        opacity: 1,
        stagger: 0.02,
        duration: 0.08,
        ease: 'power2.out',
      }, '+=0.04');

      return;
    }

    // STATE 3: Closing (isMenuRendered && !isMenuOpen)
    // Capture current height before we start collapsing
    const currentHeight = nav.offsetHeight;

    gsap.set(nav, { overflow: 'hidden', height: currentHeight });

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(nav, { display: 'none', visibility: 'hidden', height: 0, opacity: 0 });
        setIsMenuRendered(false);
      }
    });
    animationRef.current = tl;

    // Reverse of entrance: items fade out (from end), then nav collapses
    tl.to(items, {
      opacity: 0,
      stagger: { each: 0.02, from: 'end' },
      duration: 0.08,
      ease: 'power2.in',
    })
    .to(nav, {
      height: 0,
      duration: 0.24,
      ease: 'power2.inOut',
    });

    // Cleanup: only kill the running timeline, do NOT revert inline styles
    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
        animationRef.current = null;
      }
    };
  }, [isMenuOpen, isMenuRendered, mobileNavRef, animationRef]);

  useEffect(() => {
    if (paddingAnimationFrameRef.current) {
      cancelAnimationFrame(paddingAnimationFrameRef.current);
      paddingAnimationFrameRef.current = null;
    }

    if (!isMenuRendered) {
      setIsMenuPaddingExpanded(false);
      return;
    }

    if (!isMenuOpen) {
      setIsMenuPaddingExpanded(false);
      return;
    }

    setIsMenuPaddingExpanded(false);

    paddingAnimationFrameRef.current = requestAnimationFrame(() => {
      paddingAnimationFrameRef.current = requestAnimationFrame(() => {
        setIsMenuPaddingExpanded(true);
        paddingAnimationFrameRef.current = null;
      });
    });

    return () => {
      if (paddingAnimationFrameRef.current) {
        cancelAnimationFrame(paddingAnimationFrameRef.current);
        paddingAnimationFrameRef.current = null;
      }
    };
  }, [isMenuOpen, isMenuRendered]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > CONFIG.DESKTOP_BREAKPOINT && isMenuOpen) {
        setIsMenuOpen(false);
        setIsMenuRendered(false);
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
        className={`main-nav mobile-only${isMenuPaddingExpanded ? ' is-rendered' : ''}`}
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
              <Divider width={'1rem'} color={'var(--color-green)'} triggerAnimation={false} />
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