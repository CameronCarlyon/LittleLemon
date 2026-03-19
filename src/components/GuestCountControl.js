import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import HyperlinkLabel from './HyperlinkLabel';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const GuestCountControl = ({
    id,
    value,
    onChange,
    disabled = false,
    hasError = false,
    min = 1,
    max = 14,
    defaultValue = 2,
    className = '',
    ...rest
}) => {
    const minusButtonRef = useRef(null);
    const plusButtonRef = useRef(null);
    const valueRef = useRef(null);
    const helperPanelRef = useRef(null);
    const helperTimelineRef = useRef(null);
    const isHelperInitialisedRef = useRef(false);
    const initialIsAtMaxRef = useRef(false);
    const previousValueRef = useRef(null);

    const currentValue = useMemo(() => {
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            return clamp(defaultValue, min, max);
        }
        return clamp(parsed, min, max);
    }, [value, defaultValue, min, max]);

    useEffect(() => {
        if (value === '' || value === undefined || value === null) {
            onChange({
                target: {
                    id,
                    value: String(clamp(defaultValue, min, max))
                }
            });
        }
    }, [id, value, onChange, defaultValue, min, max]);

    useEffect(() => {
        gsap.set([minusButtonRef.current, plusButtonRef.current, valueRef.current], {
            transformOrigin: 'center center'
        });
    }, []);

    useEffect(() => {
        const previousValue = previousValueRef.current;
        if (previousValue !== null && previousValue !== currentValue && valueRef.current) {
            gsap.timeline()
                .to(valueRef.current, {
                    scale: 1.3,
                    duration: 0.15,
                    ease: 'power2.out'
                })
                .to(valueRef.current, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'back.out(1.5)'
                });
        }

        previousValueRef.current = currentValue;
    }, [currentValue]);

    const setGuestCount = useCallback((nextValue) => {
        const clampedValue = clamp(nextValue, min, max);
        if (clampedValue === currentValue) return;

        onChange({
            target: {
                id,
                value: String(clampedValue)
            }
        });
    }, [currentValue, id, max, min, onChange]);

    const pressButton = useCallback((element) => {
        if (!element || disabled) return;
        gsap.to(element, {
            scale: 0.85,
            duration: 0.01
        });
    }, [disabled]);

    const releaseButton = useCallback((element) => {
        if (!element) return;
        gsap.to(element, {
            scale: 1,
            duration: 0.15,
            ease: 'back.out(1.2)'
        });
    }, []);

    const canDecrease = !disabled && currentValue > min;
    const canIncrease = !disabled && currentValue < max;
    const isAtMax = currentValue >= max;

    if (previousValueRef.current === null) {
        initialIsAtMaxRef.current = isAtMax;
    }

    useEffect(() => {
        const helperPanel = helperPanelRef.current;
        if (!helperPanel) return;

        gsap.set(helperPanel, {
            height: initialIsAtMaxRef.current ? 'auto' : 0,
            opacity: initialIsAtMaxRef.current ? 1 : 0,
            overflow: 'hidden'
        });

        const timer = setTimeout(() => {
            isHelperInitialisedRef.current = true;
        }, 0);

        return () => {
            clearTimeout(timer);
            helperTimelineRef.current?.kill();
        };
    }, []);

    useEffect(() => {
        if (!isHelperInitialisedRef.current || !helperPanelRef.current) return;

        helperTimelineRef.current?.kill();
        const helperPanel = helperPanelRef.current;
        const timeline = gsap.timeline();
        helperTimelineRef.current = timeline;

        if (isAtMax) {
            timeline
                .to(helperPanel, {
                    height: 'auto',
                    duration: 0.25,
                    ease: 'power2.out'
                })
                .to(helperPanel, {
                    opacity: 1,
                    duration: 0.2,
                    ease: 'power2.out'
                }, '-=0.12');
            return;
        }

        timeline
            .to(helperPanel, {
                opacity: 0,
                duration: 0.15,
                ease: 'power2.in'
            })
            .to(helperPanel, {
                height: 0,
                duration: 0.2,
                ease: 'power2.in'
            }, '-=0.08');
    }, [isAtMax]);

    return (
        <div
            className={`guest-count-control${className ? ` ${className}` : ''}${hasError ? ' form-error' : ''}${disabled ? ' guest-count-control--disabled' : ''}`}
            role="group"
            aria-label={rest['aria-label'] || 'Number of guests'}
            aria-disabled={disabled}
        >
            <div className="guest-count-control__main">
                <button
                    ref={minusButtonRef}
                    type="button"
                    className="guest-count-control__button"
                    aria-label="Decrease number of guests"
                    onClick={() => setGuestCount(currentValue - 1)}
                    onMouseDown={() => pressButton(minusButtonRef.current)}
                    onMouseUp={() => releaseButton(minusButtonRef.current)}
                    onMouseLeave={() => releaseButton(minusButtonRef.current)}
                    onTouchStart={() => pressButton(minusButtonRef.current)}
                    onTouchEnd={() => releaseButton(minusButtonRef.current)}
                    disabled={!canDecrease}
                >
                    <svg
                        className="guest-count-control__button-symbol"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>

                <output
                    id={id}
                    ref={valueRef}
                    className="guest-count-control__value"
                    role="spinbutton"
                    aria-valuemin={min}
                    aria-valuemax={max}
                    aria-valuenow={currentValue}
                    tabIndex={disabled ? -1 : 0}
                    onKeyDown={(event) => {
                        if (disabled) return;
                        if (event.key === 'ArrowUp' || event.key === '+') {
                            event.preventDefault();
                            setGuestCount(currentValue + 1);
                        }
                        if (event.key === 'ArrowDown' || event.key === '-') {
                            event.preventDefault();
                            setGuestCount(currentValue - 1);
                        }
                    }}
                >
                    {currentValue}
                </output>

                <button
                    ref={plusButtonRef}
                    type="button"
                    className="guest-count-control__button"
                    aria-label="Increase number of guests"
                    onClick={() => setGuestCount(currentValue + 1)}
                    onMouseDown={() => pressButton(plusButtonRef.current)}
                    onMouseUp={() => releaseButton(plusButtonRef.current)}
                    onMouseLeave={() => releaseButton(plusButtonRef.current)}
                    onTouchStart={() => pressButton(plusButtonRef.current)}
                    onTouchEnd={() => releaseButton(plusButtonRef.current)}
                    disabled={!canIncrease}
                >
                    <svg
                        className="guest-count-control__button-symbol"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path d="M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            <div
                ref={helperPanelRef}
                className="guest-count-control__helper-panel"
            >
                <p className="guest-count-control__helper-text" role="status" aria-live="polite">
                    Booking for an event? Please{' '}
                    <HyperlinkLabel href="/contact-us" className="guest-count-control__helper-link" text="contact us" />
                    .
                </p>
            </div>
        </div>
    );
};

export default GuestCountControl;
