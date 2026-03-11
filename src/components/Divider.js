import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const Divider = ({ width = 100, color, triggerAnimation = true, delay = 0.50 }) => {
    const dividerRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const divider = dividerRef.current;
        if (!divider) return;

        if (!triggerAnimation) {
            gsap.set(divider, {
                scaleX: 1,
                transformOrigin: 'left'
            });
            return;
        }

        // Set initial state for animated dividers.
        gsap.set(divider, { 
            scaleX: 0,
            transformOrigin: 'left'
        });
    }, [triggerAnimation]);

    useEffect(() => {
        const divider = dividerRef.current;
        if (!divider || hasAnimated.current) return;

        // Only animate when triggerAnimation becomes true
        if (triggerAnimation) {
            hasAnimated.current = true;
            
            // Animate entrance from left to right
            gsap.to(divider, {
                scaleX: 1,
                duration: 1,
                ease: 'power2.out',
                delay: delay // Use the provided delay
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