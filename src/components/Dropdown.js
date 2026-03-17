import React, { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

const Dropdown = ({
    id,
    options,
    value,
    onChange,
    placeholder = '',
    disabled = false,
    className = '',
    hasError = false,
    required = false,
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const listboxRef = useRef(null);
    const buttonRef = useRef(null);
    const animatingRef = useRef(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    const openDropdown = useCallback(() => {
        if (disabled || animatingRef.current) return;
        animatingRef.current = true;

        const currentIndex = options.findIndex(opt => opt.value === value);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        setIsRendered(true);
        setIsOpen(true);
    }, [disabled, options, value]);

    const closeDropdown = useCallback((focusButton = true) => {
        if (!isOpen || animatingRef.current) return;
        animatingRef.current = true;

        const panel = panelRef.current;
        const listbox = listboxRef.current;
        const trigger = buttonRef.current;

        if (!panel || !listbox || !trigger) {
            setIsOpen(false);
            setIsRendered(false);
            animatingRef.current = false;
            return;
        }

        const items = listbox.querySelectorAll('[role="option"]');
        const currentHeight = panel.offsetHeight;

        gsap.set(panel, { height: currentHeight });

        const tl = gsap.timeline({
            onComplete: () => {
                setIsOpen(false);
                setIsRendered(false);
                animatingRef.current = false;
                gsap.set(panel, { clearProps: 'height,opacity' });
                if (focusButton) buttonRef.current?.focus();
            }
        });

        tl.to(items, {
            opacity: 0,
            y: -4,
            duration: 0.12,
            stagger: 0.015,
            ease: 'power2.in'
        })
        .to(panel, {
            opacity: 0,
            height: 0,
            duration: 0.18,
            ease: 'power2.in'
        }, '-=0.08');
    }, [isOpen]);

    // Animate open
    useEffect(() => {
        if (!isOpen || !isRendered || !panelRef.current || !listboxRef.current) {
            return;
        }

        const panel = panelRef.current;
        const listbox = listboxRef.current;
        const items = listbox.querySelectorAll('[role="option"]');

        gsap.set(panel, { opacity: 0 });
        gsap.set(items, { opacity: 0, y: -4 });

        gsap.set(panel, { height: 'auto' });
        const targetHeight = panel.offsetHeight;
        gsap.set(panel, { height: 0 });

        const tl = gsap.timeline({
            onComplete: () => {
                animatingRef.current = false;
                gsap.set(panel, { clearProps: 'height,opacity' });
            }
        });

        tl.to(panel, {
            height: targetHeight,
            duration: 0.2,
            ease: 'power2.inOut'
        })
        .to(panel, {
            opacity: 1,
            duration: 0.12,
            ease: 'power2.out'
        }, '-=0.12')
        .to(items, {
            opacity: 1,
            y: 0,
            duration: 0.15,
            stagger: 0.02,
            ease: 'power2.out'
        }, '-=0.1');
    }, [isOpen, isRendered]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (!isOpen || highlightedIndex < 0 || !listboxRef.current) return;
        const item = listboxRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
        item?.scrollIntoView({ block: 'nearest' });
    }, [highlightedIndex, isOpen]);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                closeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, closeDropdown]);

    const selectOption = useCallback((optionValue) => {
        onChange({ target: { id, value: optionValue } });
        closeDropdown();
    }, [id, onChange, closeDropdown]);

    const handleKeyDown = useCallback((e) => {
        if (disabled) return;

        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (isOpen && highlightedIndex >= 0) {
                    selectOption(options[highlightedIndex].value);
                } else if (!isOpen) {
                    openDropdown();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    openDropdown();
                } else {
                    setHighlightedIndex(prev =>
                        prev < options.length - 1 ? prev + 1 : prev
                    );
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) {
                    openDropdown();
                } else {
                    setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
                }
                break;
            case 'Home':
                e.preventDefault();
                if (isOpen) setHighlightedIndex(0);
                break;
            case 'End':
                e.preventDefault();
                if (isOpen) setHighlightedIndex(options.length - 1);
                break;
            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    closeDropdown();
                }
                break;
            case 'Tab':
                if (isOpen) closeDropdown(false);
                break;
            default:
                break;
        }
    }, [disabled, isOpen, highlightedIndex, options, selectOption, openDropdown, closeDropdown]);

    const handleButtonClick = () => {
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    const listboxId = `${id}-listbox`;
    const activeDescendantId = isOpen && highlightedIndex >= 0
        ? `${id}-option-${highlightedIndex}`
        : undefined;

    return (
        <div
            ref={containerRef}
            className={`dropdown${className ? ` ${className}` : ''}${hasError ? ' form-error' : ''}${disabled ? ' dropdown--disabled' : ''}${isOpen ? ' dropdown--open' : ''}`}
            {...rest}
        >
            <div className="dropdown__surface">
                <button
                    ref={buttonRef}
                    type="button"
                    role="combobox"
                    id={id}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={listboxId}
                    aria-activedescendant={activeDescendantId}
                    aria-required={required}
                    disabled={disabled}
                    className={`dropdown__trigger${!selectedOption ? ' dropdown__trigger--placeholder' : ''}`}
                    onClick={handleButtonClick}
                    onKeyDown={handleKeyDown}
                >
                    <span className="dropdown__value">{displayText}</span>
                    <svg
                        className={`dropdown__chevron${isOpen ? ' dropdown__chevron--open' : ''}`}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                    >
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>

                {isRendered && (
                    <div ref={panelRef} className="dropdown__panel">
                        <ul
                            ref={listboxRef}
                            role="listbox"
                            id={listboxId}
                            aria-label={rest['aria-label'] || undefined}
                            className="dropdown__listbox"
                            tabIndex={-1}
                        >
                            {options.map((option, index) => (
                                <li
                                    key={option.value}
                                    role="option"
                                    id={`${id}-option-${index}`}
                                    data-index={index}
                                    aria-selected={option.value === value}
                                    className={`dropdown__option${option.value === value ? ' dropdown__option--selected' : ''}${index === highlightedIndex ? ' dropdown__option--highlighted' : ''}`}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        selectOption(option.value);
                                    }}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dropdown;
