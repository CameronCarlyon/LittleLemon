import React, { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import hamburgerIcon from '../assets/icons/menu-icon.json';

// Animation segments
const ANIMATIONS = {
  OPEN: [85, 140],
  CLOSE: [9, 64]
};

const HamburgerMenuIcon = ({ isOpen, onToggle }) => {
  const hamburgerLottie = useRef(null);
  const hasAnimated = useRef(false);
  
  // Set initial frame without animation
  useEffect(() => {
    if (hamburgerLottie.current) {
      // Immediately set to frame 10 and stop
      hamburgerLottie.current.setSpeed(0);
      hamburgerLottie.current.goToAndStop(1, true);
      
      // Reset speed for future animations
      setTimeout(() => {
        if (hamburgerLottie.current) {
          hamburgerLottie.current.setSpeed(1);
        }
      }, 100);
    }
  }, []);

  // Play animation when isOpen state changes, but only after first interaction
  useEffect(() => {
    if (hamburgerLottie.current && hasAnimated.current) {
      const segments = isOpen ? ANIMATIONS.CLOSE : ANIMATIONS.OPEN;
      hamburgerLottie.current.playSegments(segments, true);
    }
  }, [isOpen]);

  // Handle click with animation flag
  const handleToggle = () => {
    hasAnimated.current = true;
    onToggle();
  };

  return (
    <button
      className="burger-menu mobile-only"
      onClick={handleToggle}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls="main-navigation"
      style={{ width: '3.4rem', background: 'none', border: 'none', padding: 0 }}
>
  <Lottie
    lottieRef={hamburgerLottie}
    animationData={hamburgerIcon}
    autoplay={false}
    loop={false}
    initialSegment={[10, 10]}
    aria-hidden="true"
  />
</button>
  );
};

export default HamburgerMenuIcon;
