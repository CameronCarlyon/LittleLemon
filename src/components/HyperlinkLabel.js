import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const HyperlinkLabel = ({ href, text, children, ...props }) => {
    const linkRef = useRef(null);
    const underlineRef = useRef(null);

    useEffect(() => {
        const link = linkRef.current;
        const underline = underlineRef.current;
        
        // Set initial state - underline hidden
        gsap.set(underline, { 
            scaleX: 0,
            transformOrigin: 'left'
        });

        // Mouse enter event - animate underline from left to right
        const handleMouseEnter = () => {
            gsap.set(underline, { transformOrigin: 'left' }); // Ensure left origin for entry
            gsap.to(underline, {
                scaleX: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        // Mouse leave event - hide underline from left to right
        const handleMouseLeave = () => {
            gsap.set(underline, { transformOrigin: 'right' }); // Change to right origin
            gsap.to(underline, {
                scaleX: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => {
                    // Reset origin back to left after animation completes
                    gsap.set(underline, { transformOrigin: 'left' });
                }
            });
        };

        // Add event listeners
        link.addEventListener('mouseenter', handleMouseEnter);
        link.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup
        return () => {
            link.removeEventListener('mouseenter', handleMouseEnter);
            link.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <Link to={`${href}`} 
            ref={linkRef} 
            style={{ 
                position: 'relative',
                display: 'inline-block',
                textDecoration: 'none'
            }}
            {...props}
        >
            {children}
            {text}
            <span 
                ref={underlineRef}
                style={{
                    position: 'absolute',
                    bottom: '-5px',
                    left: 0,
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'var(--color-yellow)',
                    display: 'block',
                    borderRadius: '2.5px'
                }}
            />
        </Link>
    );
};

export default HyperlinkLabel;