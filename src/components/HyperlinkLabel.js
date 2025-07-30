import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const HyperlinkLabel = ({ href, text, children, ...props }) => {
    const linkRef = useRef(null);
    const underlineRef = useRef(null);
    const location = useLocation();
    
    // Check if current page matches the href
    const isCurrentPage = location.pathname === href;

    useEffect(() => {
        const link = linkRef.current;
        const underline = underlineRef.current;
        
        if (isCurrentPage) {
            // Set initial state for current page - underline visible with 50% more height
            gsap.set(underline, { 
                scaleX: 1,
                height: '10px',
                transformOrigin: 'left'
            });
        } else {
            // Set initial state for other pages - underline hidden
            gsap.set(underline, { 
                scaleX: 0,
                height: '5px', // Default height
                transformOrigin: 'left'
            });
        }

        // Only add hover effects if not on current page
        if (!isCurrentPage) {
            // Mouse enter event - animate underline from left to right
            const handleMouseEnter = () => {
                gsap.set(underline, { transformOrigin: 'left' });
                gsap.to(underline, {
                    scaleX: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            };

            // Mouse leave event - hide underline from left to right
            const handleMouseLeave = () => {
                gsap.set(underline, { transformOrigin: 'right' });
                gsap.to(underline, {
                    scaleX: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
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
        }
    }, [isCurrentPage]);

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
                    height: isCurrentPage ? '7.5px' : '5px', // 50% more height for current page
                    backgroundColor: 'var(--color-yellow)',
                    display: 'block',
                    borderRadius: isCurrentPage ? '3.75px' : '2.5px' // Proportional border radius
                }}
            />
        </Link>
    );
};

export default HyperlinkLabel;