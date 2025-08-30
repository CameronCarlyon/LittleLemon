import React, { useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const HyperlinkLabel = ({ href, text, children, footer = false, ...props }) => {
    const linkRef = useRef(null);
    const underlineRef = useRef(null);
    const location = useLocation();
    
    // Check if current page matches the href
    const isCurrentPage = location.pathname === href;

    useEffect(() => {
        const link = linkRef.current;
        const underline = underlineRef.current;
        
        if (isCurrentPage && !footer) {
            // Set initial state for current page - underline visible with 50% more height
            // Only if not a footer link
            gsap.set(underline, { 
                scaleX: 1,
                scaleY: 1.5, // 50% taller
                transformOrigin: 'left top' // Anchor to top-left
            });
        } else {
            // Set initial state for other pages - underline hidden
            gsap.set(underline, { 
                scaleX: 0,
                scaleY: 1, // Normal height
                transformOrigin: 'left top' // Anchor to top-left
            });
        }

        // Only add hover effects if not on current page or if it's a footer link
        if (!isCurrentPage || footer) {
            // Mouse enter event - animate underline from left to right
            const handleMouseEnter = () => {
                gsap.set(underline, { transformOrigin: 'left top' });
                gsap.to(underline, {
                    scaleX: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            };

            // Mouse leave event - hide underline from left to right
            const handleMouseLeave = () => {
                gsap.set(underline, { transformOrigin: 'right top' });
                gsap.to(underline, {
                    scaleX: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.set(underline, { transformOrigin: 'left top' });
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
    }, [isCurrentPage, footer]);

    return (
        <Link to={`${href}`} 
            ref={linkRef}
            className='hyperlink-label' 
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
                    top: '100%',
                    left: 0,
                    width: '100%',
                    height: '5px',
                    backgroundColor: 'var(--color-yellow)',
                    display: 'block',
                    borderRadius: '2.5px',
                    transform: 'scaleX(0)', // Hide by default in CSS
                    transformOrigin: 'left top' // Set transform origin in CSS
                }}
            />
        </Link>
    );
};

export default HyperlinkLabel;