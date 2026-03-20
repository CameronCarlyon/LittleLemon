import React, { useState, useRef, useEffect, useCallback } from 'react';
import useAnimatedPanel from '../hooks/useAnimatedPanel';

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
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const listboxRef = useRef(null);
    const buttonRef = useRef(null);
    const isOpenSyncRef = useRef(false);
    const skipNextFocusOpenRef = useRef(false);
    const pointerFocusRef = useRef(false);

    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    const findNextEnabledIndex = useCallback((startIndex, direction) => {
        if (!options.length) return -1;
        let index = startIndex;
        while (index >= 0 && index < options.length) {
            if (!options[index].disabled) return index;
            index += direction;
        }
        return -1;
    }, [options]);

    const { animatePanel, broadcastOpen, closeFnRef } = useAnimatedPanel({
        id, isOpen, panelRef, buttonRef, containerRef
    });

    const closeDropdown = useCallback((focusButton = true) => {
        if (!isOpen) return;
        isOpenSyncRef.current = false;
        if (focusButton) skipNextFocusOpenRef.current = true;
        setIsOpen(false);
        animatePanel(false, focusButton);
    }, [isOpen, animatePanel]);

    closeFnRef.current = closeDropdown;

    const openDropdown = useCallback(() => {
        if (disabled || isOpen || isOpenSyncRef.current) return;
        isOpenSyncRef.current = true;
        broadcastOpen();
        const currentIndex = options.findIndex((opt) => opt.value === value);
        const initialIndex = currentIndex >= 0 && !options[currentIndex]?.disabled
            ? currentIndex
            : findNextEnabledIndex(0, 1);
        setHighlightedIndex(initialIndex);
        setIsOpen(true);
        animatePanel(true);
    }, [disabled, isOpen, options, value, animatePanel, broadcastOpen, findNextEnabledIndex]);

    useEffect(() => {
        if (!isOpen || highlightedIndex < 0 || !listboxRef.current) return;
        const item = listboxRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
        item?.scrollIntoView({ block: 'nearest' });
    }, [highlightedIndex, isOpen]);

    const selectOption = useCallback((optionValue) => {
        const option = options.find((opt) => opt.value === optionValue);
        if (!option || option.disabled) return;
        onChange({ target: { id, value: optionValue } });
        closeDropdown();
    }, [id, onChange, closeDropdown, options]);

    const handleKeyDown = useCallback((event) => {
        if (disabled) return;

        switch (event.key) {
            case 'Enter':
            case ' ': {
                event.preventDefault();
                if (isOpen && highlightedIndex >= 0) {
                    const highlightedOption = options[highlightedIndex];
                    if (highlightedOption && !highlightedOption.disabled) {
                        selectOption(highlightedOption.value);
                    }
                } else if (!isOpen) {
                    openDropdown();
                }
                break;
            }
            case 'ArrowDown': {
                event.preventDefault();
                if (!isOpen) {
                    openDropdown();
                } else {
                    setHighlightedIndex((prev) => {
                        const startIndex = prev < 0 ? 0 : prev + 1;
                        const nextIndex = findNextEnabledIndex(startIndex, 1);
                        return nextIndex >= 0 ? nextIndex : prev;
                    });
                }
                break;
            }
            case 'ArrowUp': {
                event.preventDefault();
                if (!isOpen) {
                    openDropdown();
                } else {
                    setHighlightedIndex((prev) => {
                        const startIndex = prev < 0 ? options.length - 1 : prev - 1;
                        const nextIndex = findNextEnabledIndex(startIndex, -1);
                        return nextIndex >= 0 ? nextIndex : prev;
                    });
                }
                break;
            }
            case 'Home': {
                event.preventDefault();
                if (isOpen) setHighlightedIndex(findNextEnabledIndex(0, 1));
                break;
            }
            case 'End': {
                event.preventDefault();
                if (isOpen) setHighlightedIndex(findNextEnabledIndex(options.length - 1, -1));
                break;
            }
            case 'Escape': {
                if (isOpen) {
                    event.preventDefault();
                    closeDropdown();
                }
                break;
            }
            case 'Tab': {
                const effectivelyOpen = isOpen || isOpenSyncRef.current;
                if (effectivelyOpen) {
                    if (event.shiftKey) {
                        const previousIndex = findNextEnabledIndex(highlightedIndex - 1, -1);
                        if (highlightedIndex > 0 && previousIndex >= 0) {
                            event.preventDefault();
                            setHighlightedIndex(previousIndex);
                        } else {
                            closeDropdown(false);
                            setHighlightedIndex(-1);
                        }
                    } else {
                        const startIndex = highlightedIndex < 0 ? 0 : highlightedIndex + 1;
                        const nextIndex = findNextEnabledIndex(startIndex, 1);
                        if (nextIndex >= 0) {
                            event.preventDefault();
                            setHighlightedIndex(nextIndex);
                        } else {
                            closeDropdown(false);
                            setHighlightedIndex(-1);
                        }
                    }
                }
                // Not open: onFocus handles opening; let Tab proceed naturally.
                break;
            }
            default:
                break;
        }
    }, [disabled, isOpen, highlightedIndex, options, selectOption, openDropdown, closeDropdown, findNextEnabledIndex]);

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
                    aria-invalid={hasError || undefined}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                    aria-disabled={disabled ? 'true' : undefined}
                    disabled={disabled}
                    className={`dropdown__trigger${!selectedOption ? ' dropdown__trigger--placeholder' : ''}`}
                    onPointerDown={() => {
                        pointerFocusRef.current = true;
                    }}
                    onClick={() => {
                        pointerFocusRef.current = false;
                        if (isOpen) {
                            closeDropdown();
                            return;
                        }
                        openDropdown();
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                        if (skipNextFocusOpenRef.current) {
                            skipNextFocusOpenRef.current = false;
                            return;
                        }
                        if (pointerFocusRef.current) return;
                        openDropdown();
                    }}
                    onBlur={() => {
                        pointerFocusRef.current = false;
                    }}
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
                                aria-disabled={option.disabled ? 'true' : undefined}
                                className={`dropdown__option${option.value === value ? ' dropdown__option--selected' : ''}${index === highlightedIndex ? ' dropdown__option--highlighted' : ''}${option.disabled ? ' dropdown__option--disabled' : ''}`}
                                onMouseDown={(event) => {
                                    if (option.disabled) return;
                                    event.preventDefault();
                                    selectOption(option.value);
                                }}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dropdown;
