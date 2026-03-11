import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import hamburgerIcon from '../assets/icons/menu-icon.json';

const SEGMENTS = {
  OPEN: [9, 64],
  CLOSE: [64, 9]
};

const BOUNDARY_FRAME = {
  CLOSED: 9,
  OPEN: 64
};

const HamburgerMenuIcon = ({ isOpen, onToggle }) => {
  const hamburgerLottie = useRef(null);
  const hasInitialisedRef = useRef(false);
  const previousIsOpenRef = useRef(isOpen);
  const [isLottieReady, setIsLottieReady] = useState(false);

  useEffect(() => {
    const lottie = hamburgerLottie.current;
    if (!isLottieReady || !lottie) return;

    // First run after Lottie loads: jump to the correct frame for current state.
    if (!hasInitialisedRef.current) {
      lottie.goToAndStop(isOpen ? BOUNDARY_FRAME.OPEN : BOUNDARY_FRAME.CLOSED, true);
      previousIsOpenRef.current = isOpen;
      hasInitialisedRef.current = true;
      return;
    }

    // Subsequent runs: animate only when isOpen actually changed.
    if (previousIsOpenRef.current !== isOpen) {
      lottie.goToAndStop(isOpen ? BOUNDARY_FRAME.CLOSED : BOUNDARY_FRAME.OPEN, true);
      lottie.playSegments(isOpen ? SEGMENTS.OPEN : SEGMENTS.CLOSE, true);
      previousIsOpenRef.current = isOpen;
    }
  }, [isOpen, isLottieReady]);

  return (
    <button
      className="burger-menu mobile-only"
      onClick={onToggle}
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
        onDOMLoaded={() => setIsLottieReady(true)}
        aria-hidden="true"
      />
    </button>
  );
};

export default HamburgerMenuIcon;
