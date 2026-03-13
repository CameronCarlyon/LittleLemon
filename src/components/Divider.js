import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Divider = ({ width = 100, color, triggerAnimation = true, delay = 0.1 }) => {
    const dividerRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const divider = dividerRef.current;
        if (!divider) return;

        if (!triggerAnimation) {
            gsap.set(divider, {
                opacity: 1,
                scaleX: 1,
                transformOrigin: 'left center'
            });
            return;
        }

        // Set initial state for animated dividers.
        gsap.set(divider, { 
            opacity: 1,
            scaleX: 0,
            transformOrigin: 'left center'
        });
    }, [triggerAnimation]);

    useEffect(() => {
        const divider = dividerRef.current;
        if (!divider || hasAnimated.current) return;

        // Only animate when triggerAnimation becomes true
        if (triggerAnimation) {
            hasAnimated.current = true;
            
            // Animate entrance by growing from left to right.
            gsap.to(divider, {
                scaleX: 1,
                duration: 0.4,
                ease: 'power2.out',
                delay: delay
            });
        }
    }, [triggerAnimation, delay]);

    return (
        <span 
            ref={dividerRef}
            className="divider"
            style={{ width: `${width}`, backgroundColor: color }}
        />
    );
};

export default Divider;