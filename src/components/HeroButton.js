import React, { useRef, useEffect, forwardRef } from 'react';
import { gsap } from 'gsap';

/**
 * HeroButton component with GSAP-powered hover effects
 * @component
 */
const HeroButton = forwardRef(({ 
    children, 
    onClick, 
    className = '', 
    style = {},
    variant = 'primary',
    disabled = false,
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
                backgroundColor: 'var(--color-yellow)',
                borderColor: 'var(--color-yellow)',
                initialTextColor: 'var(--color-green)',
                hoverTextColor: 'var(--color-yellow)',
                fillColor: 'var(--color-green)'
            },
            secondary: {
                backgroundColor: 'var(--color-green)',
                borderColor: 'var(--color-yellow)',
                initialTextColor: 'var(--color-yellow)',
                hoverTextColor: 'var(--color-green)',
                fillColor: 'var(--color-yellow)'
            },
            tertiary: {
                backgroundColor: 'var(--color-green)',
                borderColor: 'var(--color-green)',
                initialTextColor: 'var(--color-white)',
                hoverTextColor: 'var(--color-green)',
                fillColor: 'var(--color-white)'
            },
            disabled: {
                backgroundColor: 'var(--color-white)',
                borderColor: 'var(--color-white)',
                initialTextColor: 'var(--color-grey)',
                hoverTextColor: 'var(--color-grey)',
                fillColor: 'var(--color-grey)'
            }
        };
        
        return schemes[variant] || schemes.primary;
    };

    /**
     * Generate variant-specific className
     * @param {string} variant - Button variant
     * @returns {string} - CSS className for the variant
     */
    const getVariantClassName = (variant) => {
        const variantClasses = {
            primary: 'btn-hero--primary',
            secondary: 'btn-hero--secondary',
            tertiary: 'btn-hero--tertiary',
            disabled: 'btn-hero--disabled'
        };
        
        return variantClasses[variant] || variantClasses.primary;
    };

    // Determine effective variant - use 'disabled' if disabled prop is true
    const effectiveVariant = disabled ? 'disabled' : variant;
    const colorScheme = getColorScheme(effectiveVariant);
    const variantClassName = getVariantClassName(effectiveVariant);
    const borderWidth = 2;

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
            color: colorScheme.initialTextColor
        });

        // Set initial background color based on variant
        gsap.set(button, {
            backgroundColor: colorScheme.backgroundColor,
            borderColor: colorScheme.borderColor,
        });

        // Don't add event listeners if button is disabled
        if (disabled) {
            return;
        }

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

            const rect = button.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Clamp mouse position to button boundaries
            const clampedX = Math.max(0, Math.min(rect.width, mouseX));
            const clampedY = Math.max(0, Math.min(rect.height, mouseY));

            // Calculate the size needed to cover the entire button
            // Add extra padding to ensure no gaps at borders
            const padding = 10; // Increased padding to ensure coverage
            const maxDistance = Math.max(
                Math.sqrt(clampedX ** 2 + clampedY ** 2),
                Math.sqrt((rect.width - clampedX) ** 2 + clampedY ** 2),
                Math.sqrt(clampedX ** 2 + (rect.height - clampedY) ** 2),
                Math.sqrt((rect.width - clampedX) ** 2 + (rect.height - clampedY) ** 2)
            ) + padding;

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
                borderRadius: '50%',
                backgroundColor: colorScheme.fillColor
            });

            // Create timeline for entrance animation
            const tl = gsap.timeline({
                onComplete: () => {
                    timelineRef.current = null;
                    
                    // After animation completes, set fill to cover entire button
                    gsap.set(fill, {
                        left: -borderWidth,
                        top: -borderWidth,
                        right: -borderWidth,
                        bottom: -borderWidth,
                        width: `calc(100% + ${borderWidth * 2}px)`,
                        height: `calc(100% + ${borderWidth * 2}px)`,
                        marginLeft: 0,
                        marginTop: 0,
                        borderRadius: `${button.style.borderRadius || '1rem'}`,
                    });
                }
            });
            timelineRef.current = tl;

            // Animate the circle to fill the button first
            tl.to(fill, {
                scale: 1,
                duration: 0.4, // Slightly faster fill animation
                ease: 'power2.out'
            })
            // Then animate text color (faster transition)
            .to(text, {
                color: colorScheme.hoverTextColor,
                duration: 0.2, // Fast text transition
                ease: 'power2.out'
            }, 0.2); // Start text animation sooner

            // After fill animation, transition to button shape
            tl.to(fill, {
                borderRadius: button.style.borderRadius || '1rem', // Match button border radius
                duration: 0.2,
                ease: 'power2.inOut'
            }, '-=0.1');
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
            
            // Create exit timeline with text color change first
            const exitTl = gsap.timeline({
                onComplete: () => {
                    // Reset to initial state after fade out
                    gsap.set(fill, {
                        scale: 0,
                        opacity: 0,
                        borderRadius: '50%',
                        left: '50%',
                        top: '50%',
                        width: 0,
                        height: 0,
                        marginLeft: 0,
                        marginTop: 0
                    });
                    exitTimelineRef.current = null;
                }
            });
            exitTimelineRef.current = exitTl;

            // First animate text back to initial color - faster transition
            exitTl.to(text, {
                color: colorScheme.initialTextColor,
                duration: 0.15, // Fast text transition
                ease: 'power2.out'
            })
            // Then fade out the fill
            .to(fill, {
                opacity: 0,
                duration: 0.25, 
                ease: 'power2.out'
            }, 0.05); // Start sooner
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
    }, [colorScheme, borderWidth, buttonRef, disabled]);

    return (
        <button
            ref={buttonRef}
            className={`btn-hero ${variantClassName} ${className}`}
            onClick={onClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: colorScheme.backgroundColor,
                borderColor: colorScheme.borderColor,
                color: colorScheme.initialTextColor,
                border: `${borderWidth}px solid ${colorScheme.borderColor}`,
                transition: disabled ? 'none' : 'border-color 0.3s ease',
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
                    backgroundColor: colorScheme.fillColor,
                    pointerEvents: 'none',
                    zIndex: 0,
                    transform: 'scale(0)',
                    opacity: 0
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
                    pointerEvents: 'none',
                    color: colorScheme.initialTextColor
                }}
            >
                {children}
            </div>
        </button>
    );
});

HeroButton.displayName = 'HeroButton';

export default HeroButton;