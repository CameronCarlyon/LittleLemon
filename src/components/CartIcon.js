import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import cartIcon from '../assets/icons/basket-icon.json';

// Animation segments
const ANIMATIONS = {
  ADD: [70, 130]
};

const CartIcon = ({ count = 0 }) => {
  // Refs for animations and elements
  const cartLottie = useRef(null);
  const cartCount = useRef(null);
  const prevCount = useRef(0);
  const prevTotalQuantity = useRef(0);
  const isInitialized = useRef(false);
  
  // Check if on cart page
  const location = useLocation();
  const isOnCartPage = location.pathname === '/cart';

  // Pulse animation for cart count
  const pulseCartCount = () => {
    const element = cartCount.current;
    if (!element) return;

    gsap.timeline()
      .to(element, {
        scale: 1.3,
        duration: 0.15,
        ease: 'power2.out'
      })
      .to(element, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(1.5)'
      });
  };

  // Initialize animations
  useEffect(() => {
    // Cart icon initialization
    if (cartLottie.current) {
      cartLottie.current.goToAndStop(0, true);
    }
    
    // Cart count badge initialization
    if (cartCount.current) {
      gsap.set(cartCount.current, {
        scale: 0,
        transformOrigin: 'center center'
      });
    }
    
    isInitialized.current = true;
  }, []);

  // Cart count animation effect (removed hover logic)
  useEffect(() => {
    // Cart count animation effect
    if (cartLottie.current && count > prevTotalQuantity.current) {
      cartLottie.current.playSegments(ANIMATIONS.ADD, true);
    }
    prevTotalQuantity.current = count;
  }, [count]);

  // Cart count badge animation
  useEffect(() => {
    const element = cartCount.current;
    if (!element) return;

    const wasVisible = prevCount.current > 0;
    const isVisible = count > 0;
    const quantityChanged = wasVisible && isVisible && count !== prevCount.current;
    const becameZero = wasVisible && !isVisible;

    if (isVisible) {
      if (!wasVisible) {
        // Entrance animation - from zero to non-zero
        gsap.to(element, {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          ease: 'back.out(1.7)',
          transformOrigin: 'center center'
        });
      } else if (quantityChanged && isInitialized.current) {
        // Pulse for quantity change between non-zero values
        pulseCartCount();
      }
    } else if (becameZero) {
      // Exit animation - from non-zero to zero
      gsap.to(element, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'back.in(1.7)',
        transformOrigin: 'center center'
      });
    }

    prevCount.current = count;
  }, [count]);

  return (
    <NavLink to='/cart' className="cart-icon-container">
      <Lottie
        lottieRef={cartLottie}
        animationData={cartIcon}
        autoplay={false}
        loop={false}
        style={{ width: '2.5rem' }}
      />
      <span 
        ref={cartCount}
        className="cart-count" 
        style={{ display: 'flex' }}
        data-count={count}
      >
        {count}
      </span>
    </NavLink>
  );
};

export default CartIcon;
