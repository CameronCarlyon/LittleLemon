import React, { useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';

const HeroButton = forwardRef(({ 
    children, 
    onClick, 
    className = '', 
    style = {},
    variant = 'primary', // Add variant prop with default
    ...props 
}, ref) => {
    const internalButtonRef = useRef(null);
    const fillRef = useRef(null);
    const textRef = useRef(null);
    const timelineRef = useRef(null);
    const exitTimelineRef = useRef(null);

    // Use the forwarded ref OR fallback to internal ref
    const buttonRef = ref || internalButtonRef;

    // Define color schemes based on variant
    const getColorScheme = (variant) => {
        const schemes = {
            primary: {
                initialTextColor: 'var(--color-green)',
                hoverTextColor: 'var(--color-yellow)',
                fillColor: 'var(--color-green)'
            },
            secondary: {
                initialTextColor: 'var(--color-yellow)',
                hoverTextColor: 'var(--color-green)',
                fillColor: 'var(--color-yellow)'
            }
        };
        
        return schemes[variant] || schemes.primary;
    };

    const colorScheme = getColorScheme(variant);

    useEffect(() => {
        const button = buttonRef.current;
        const fill = fillRef.current;
        const text = textRef.current;

        if (!button || !fill || !text) return;

        // Set initial state - circle is hidden, text uses initial color
        gsap.set(fill, {
            scale: 0,
            opacity: 0,
            borderRadius: '50%'
        });

        gsap.set(text, {
            color: colorScheme.initialTextColor // Use variant-specific initial color
        });

        // Mouse enter handler (hover animation)
        const handleMouseEnter = (e) => {
            // Kill any existing animations
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
            if (exitTimelineRef.current) {
                exitTimelineRef.current.kill();
                exitTimelineRef.current = null;
            }

            // Always use button's bounding rect, not the event target
            const rect = button.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Clamp mouse position to button boundaries
            const clampedX = Math.max(0, Math.min(rect.width, mouseX));
            const clampedY = Math.max(0, Math.min(rect.height, mouseY));

            // Calculate the size needed to cover the entire button
            const maxDistance = Math.max(
                Math.sqrt(clampedX ** 2 + clampedY ** 2),
                Math.sqrt((rect.width - clampedX) ** 2 + clampedY ** 2),
                Math.sqrt(clampedX ** 2 + (rect.height - clampedY) ** 2),
                Math.sqrt((rect.width - clampedX) ** 2 + (rect.height - clampedY) ** 2)
            );

            // Set the circle position and reset properties
            gsap.set(fill, {
                left: clampedX,
                top: clampedY,
                width: maxDistance * 2,
                height: maxDistance * 2,
                marginLeft: -maxDistance,
                marginTop: -maxDistance,
                scale: 0,
                opacity: 1,
                borderRadius: '50%'
            });

            // Create timeline for entrance animation
            const tl = gsap.timeline({
                onComplete: () => {
                    timelineRef.current = null;
                }
            });
            timelineRef.current = tl;

            // Animate the circle to fill the button and text color simultaneously
            tl.to(fill, {
                scale: 1,
                duration: 0.6,
                ease: 'power2.out'
            })
            .to(text, {
                color: colorScheme.hoverTextColor, // Use variant-specific hover color
                duration: 0.4,
                ease: 'power2.out'
            }, 0.2); // Start text animation 0.2s into the fill animation

            // After fill animation, transition to button shape
            tl.to(fill, {
                borderRadius: 'inherit',
                duration: 0.3,
                ease: 'power2.inOut'
            });
        };

        // Mouse leave handler - fade out the fill and reset text color
        const handleMouseLeave = () => {
            // Kill entrance animation if it's still running
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
            if (exitTimelineRef.current) {
                exitTimelineRef.current.kill();
                exitTimelineRef.current = null;
            }
            
            // Create exit timeline - both animations must complete together
            const exitTl = gsap.timeline({
                onComplete: () => {
                    // Reset to initial state after fade out
                    gsap.set(fill, {
                        scale: 0,
                        opacity: 0,
                        borderRadius: '50%',
                        // Clear positioning properties
                        left: 'auto',
                        top: 'auto',
                        width: 'auto',
                        height: 'auto',
                        marginLeft: 0,
                        marginTop: 0
                    });
                    exitTimelineRef.current = null;
                }
            });
            exitTimelineRef.current = exitTl;

            // Animate fill fade out and text color back to initial color
            exitTl.to(fill, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.out'
            })
            .to(text, {
                color: colorScheme.initialTextColor, // Use variant-specific initial color
                duration: 0.3,
                ease: 'power2.out'
            }, 0); // Start immediately with fill fade
        };

        // Add event listeners only to the button
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);

        // Cleanup
        return () => {
            button.removeEventListener('mouseenter', handleMouseEnter);
            button.removeEventListener('mouseleave', handleMouseLeave);
            
            // Kill any running animations
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
            if (exitTimelineRef.current) {
                exitTimelineRef.current.kill();
            }
        };
    }, [colorScheme]); // Add colorScheme to dependencies

    return (
        <button
            ref={buttonRef}
            className={`btn-hero ${className}`}
            onClick={onClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
                ...style
            }}
            {...props}
        >
            {/* Fill overlay */}
            <div
                ref={fillRef}
                className="btn-hero__fill"
                style={{
                    position: 'absolute',
                    backgroundColor: colorScheme.fillColor, // Use variant-specific fill color
                    pointerEvents: 'none',
                    zIndex: 0
                }}
            />
            
            {/* Button content */}
            <div 
                ref={textRef}
                className="btn-hero__text"
                style={{ 
                    position: 'relative', 
                    zIndex: 2,
                    display: 'block',
                    pointerEvents: 'none'
                }}
            >
                {children}
            </div>
        </button>
    );
});

HeroButton.displayName = 'HeroButton';

export default HeroButton;