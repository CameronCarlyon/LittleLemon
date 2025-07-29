import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Divider = ({ width }) => {
    const dividerRef = useRef(null);

    useEffect(() => {
        const divider = dividerRef.current;

        // Set initial state - hidden (scaleX: 0)
        gsap.set(divider, { 
            scaleX: 0,
            transformOrigin: 'left'
        });

        // Animate entrance from left to right
        gsap.to(divider, {
            scaleX: 1,
            duration: 0.1,
            ease: 'power2.out'
        });
    }, []);

    return (
        <span 
            ref={dividerRef}
            className="divider"
            style={{ width: `${width}rem` }}
        />
    );
};

export default Divider;