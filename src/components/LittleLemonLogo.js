import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import littleLemonLogo from '../assets/icons/Little Lemon Logo.json';

// Animation segments
const ANIMATIONS = {
  ENTRANCE: [0, 149],
  HOVER: [150, 159]
};

const LittleLemonLogo = ({ secondary = false }) => {
  const logoLottie = useRef(null);
  const logoContainer = useRef(null);
  const entranceComplete = useRef(false);

  // Play entrance animation on mount
  useEffect(() => {
    if (logoLottie.current) {
      logoLottie.current.playSegments(ANIMATIONS.ENTRANCE, true);
      entranceComplete.current = true;
    }
  }, []);

  // Handle hover animations
  useEffect(() => {
    const container = logoContainer.current;
    const lottie = logoLottie.current;
    if (!container || !lottie) return;

    const handleMouseEnter = () => {
      if (entranceComplete.current) {
        lottie.playSegments(ANIMATIONS.HOVER, true);
      }
    };

    const handleMouseLeave = () => {
      if (entranceComplete.current) {
        lottie.playSegments([ANIMATIONS.HOVER[1], ANIMATIONS.HOVER[0]], true);
      }
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Create filter style for secondary mode
  const filterStyle = secondary ? {
    filter: 'grayscale(100%) brightness(180%)',
    opacity: 0.85
  } : {};

  return (
    <Link to='/home' ref={logoContainer}>
      <Lottie
        lottieRef={logoLottie}
        animationData={littleLemonLogo}
        autoplay={false}
        loop={false}
        className='little-lemon-logo'
        style={filterStyle}
      />
    </Link>
  );
};

export default LittleLemonLogo;
