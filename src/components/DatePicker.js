import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { fetchAPI } from '../utils/api';
import useAnimatedPanel from '../hooks/useAnimatedPanel';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DatePicker = ({
    id,
    value,
    onChange,
    disabled = false,
    hasError = false,
    required = false,
    className = '',
    placeholder = '',
    ...rest
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedDate, setFocusedDate] = useState(null);
    const [viewMonth, setViewMonth] = useState(() => {
        if (value) {
            const [y, m] = value.split('-').map(Number);
            return { year: y, month: m - 1 };
        }
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() };
    });

    const containerRef = useRef(null);
    const panelRef = useRef(null);
    const buttonRef = useRef(null);
    const gridRef = useRef(null);
    const prevBtnRef = useRef(null);
    const nextBtnRef = useRef(null);
    const isOpenSyncRef = useRef(false);
    const openFocusTargetRef = useRef(null);
    const skipNextFocusOpenRef = useRef(false);
    const pointerFocusRef = useRef(false);

    const selectedDate = useMemo(() => {
        if (!value) return null;
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    }, [value]);

    const today = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    const maxDate = useMemo(() => {
        const max = new Date(today);
        max.setFullYear(max.getFullYear() + 1);
        return max;
    }, [today]);

    const isTodayAvailable = useMemo(() => {
        if (today.getDay() === 0) return false;
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const times = fetchAPI(today);
        return times.some((time) => {
            const [h, m] = time.split(':').map(Number);
            return h > currentHour || (h === currentHour && m > currentMinute);
        });
    }, [today]);

    const isDateDisabled = useCallback((date) => {
        if (date < today) return true;
        if (date.getTime() === today.getTime() && !isTodayAvailable) return true;
        if (date.getDay() === 0) return true;
        if (date > maxDate) return true;
        return false;
    }, [today, maxDate, isTodayAvailable]);

    const toValueString = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const isSameDate = (a, b) => {
        if (!a || !b) return false;
        return a.getFullYear() === b.getFullYear()
            && a.getMonth() === b.getMonth()
            && a.getDate() === b.getDate();
    };

    const formatDisplayDate = useCallback((dateStr) => {
        if (!dateStr) return placeholder;
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }, [placeholder]);

    const calendarDays = useMemo(() => {
        const { year, month } = viewMonth;
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let startDow = firstDay.getDay() - 1;
        if (startDow < 0) startDow = 6;

        const days = [];

        const prevMonthLast = new Date(year, month, 0).getDate();
        for (let i = startDow - 1; i >= 0; i -= 1) {
            const d = prevMonthLast - i;
            days.push({ date: new Date(year, month - 1, d), day: d, isCurrentMonth: false });
        }

        for (let d = 1; d <= daysInMonth; d += 1) {
            days.push({ date: new Date(year, month, d), day: d, isCurrentMonth: true });
        }

        const remaining = 7 - (days.length % 7);
        if (remaining < 7) {
            for (let d = 1; d <= remaining; d += 1) {
                days.push({ date: new Date(year, month + 1, d), day: d, isCurrentMonth: false });
            }
        }

        return days;
    }, [viewMonth]);

    const canGoPrev = useMemo(() => {
        const { year, month } = viewMonth;
        return year > today.getFullYear()
            || (year === today.getFullYear() && month > today.getMonth());
    }, [viewMonth, today]);

    const canGoNext = useMemo(() => {
        const { year, month } = viewMonth;
        return year < maxDate.getFullYear()
            || (year === maxDate.getFullYear() && month < maxDate.getMonth());
    }, [viewMonth, maxDate]);

    const goToPrevMonth = useCallback(() => {
        if (!canGoPrev) return;
        setViewMonth((prev) => (
            prev.month === 0
                ? { year: prev.year - 1, month: 11 }
                : { ...prev, month: prev.month - 1 }
        ));
    }, [canGoPrev]);

    const goToNextMonth = useCallback(() => {
        if (!canGoNext) return;
        setViewMonth((prev) => (
            prev.month === 11
                ? { year: prev.year + 1, month: 0 }
                : { ...prev, month: prev.month + 1 }
        ));
    }, [canGoNext]);

    const { animatePanel, broadcastOpen, closeFnRef } = useAnimatedPanel({
        id, isOpen, panelRef, buttonRef, containerRef
    });

    const closePicker = useCallback((focusButton = true) => {
        if (!isOpen) return;
        isOpenSyncRef.current = false;
        if (focusButton) skipNextFocusOpenRef.current = true;
        setIsOpen(false);
        animatePanel(false, focusButton);
    }, [isOpen, animatePanel]);

    closeFnRef.current = closePicker;

    const exitFocus = useCallback((backward = false) => {
        const selector = [
            'a[href]:not([tabindex="-1"])',
            'button:not(:disabled):not([tabindex="-1"])',
            'input:not(:disabled):not([tabindex="-1"])',
            'select:not(:disabled):not([tabindex="-1"])',
            'textarea:not(:disabled):not([tabindex="-1"])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(', ');
        const focusable = Array.from(document.querySelectorAll(selector))
            .filter((el) => !panelRef.current?.contains(el));
        const idx = focusable.indexOf(buttonRef.current);
        if (idx !== -1) {
            focusable[backward ? idx - 1 : idx + 1]?.focus();
        }
    }, []);

    const openPicker = useCallback(() => {
        if (disabled || isOpen || isOpenSyncRef.current) return;
        broadcastOpen();
        const dateToFocus = selectedDate || today;
        const targetYear = dateToFocus.getFullYear();
        const targetMonth = dateToFocus.getMonth();
        const willCanGoPrev = targetYear > today.getFullYear()
            || (targetYear === today.getFullYear() && targetMonth > today.getMonth());
        openFocusTargetRef.current = willCanGoPrev ? 'prev' : 'grid';
        setViewMonth({ year: targetYear, month: targetMonth });
        setFocusedDate(new Date(dateToFocus));
        isOpenSyncRef.current = true;
        setIsOpen(true);
        animatePanel(true);
    }, [disabled, isOpen, selectedDate, today, animatePanel, broadcastOpen]);

    useEffect(() => {
        if (!isOpen || !focusedDate || !gridRef.current) return;
        const focusTarget = openFocusTargetRef.current;
        openFocusTargetRef.current = null;

        const raf = requestAnimationFrame(() => {
            if (!isOpenSyncRef.current) return;
            if (focusTarget === 'prev' && prevBtnRef.current) {
                prevBtnRef.current.focus();
                return;
            }
            const key = toValueString(focusedDate);
            const cell = gridRef.current?.querySelector(`[data-date="${key}"]`);
            cell?.focus();
        });

        return () => cancelAnimationFrame(raf);
    }, [focusedDate, isOpen, viewMonth]);

    const selectDate = useCallback((date) => {
        if (isDateDisabled(date)) return;
        onChange({ target: { id, value: toValueString(date) } });
        closePicker();
    }, [id, onChange, closePicker, isDateDisabled]);

    const handleGridKeyDown = useCallback((event) => {
        if (!focusedDate) return;

        let newDate;
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newDate = new Date(focusedDate);
                newDate.setDate(newDate.getDate() - 1);
                break;
            case 'ArrowRight':
                event.preventDefault();
                newDate = new Date(focusedDate);
                newDate.setDate(newDate.getDate() + 1);
                break;
            case 'ArrowUp':
                event.preventDefault();
                newDate = new Date(focusedDate);
                newDate.setDate(newDate.getDate() - 7);
                break;
            case 'ArrowDown':
                event.preventDefault();
                newDate = new Date(focusedDate);
                newDate.setDate(newDate.getDate() + 7);
                break;
            case 'PageUp': {
                event.preventDefault();
                const prevMonth = focusedDate.getMonth() - 1;
                const yr = focusedDate.getFullYear();
                const daysInTarget = new Date(yr, prevMonth + 1, 0).getDate();
                const day = Math.min(focusedDate.getDate(), daysInTarget);
                newDate = new Date(yr, prevMonth, day);
                break;
            }
            case 'PageDown': {
                event.preventDefault();
                const nextMonth = focusedDate.getMonth() + 1;
                const yr = focusedDate.getFullYear();
                const daysInTarget = new Date(yr, nextMonth + 1, 0).getDate();
                const day = Math.min(focusedDate.getDate(), daysInTarget);
                newDate = new Date(yr, nextMonth, day);
                break;
            }
            case 'Home': {
                event.preventDefault();
                newDate = new Date(focusedDate);
                const dow = newDate.getDay();
                const diffToMonday = dow === 0 ? -6 : 1 - dow;
                newDate.setDate(newDate.getDate() + diffToMonday);
                break;
            }
            case 'End': {
                event.preventDefault();
                newDate = new Date(focusedDate);
                const dow = newDate.getDay();
                const diffToSunday = dow === 0 ? 0 : 7 - dow;
                newDate.setDate(newDate.getDate() + diffToSunday);
                break;
            }
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (!isDateDisabled(focusedDate)) selectDate(focusedDate);
                return;
            case 'Escape':
                event.preventDefault();
                closePicker();
                return;
            case 'Tab': {
                event.preventDefault();
                if (event.shiftKey) {
                    // Shift+Tab: previous available day → prev btn → exit backward
                    const currentIdx = calendarDays.findIndex(
                        (d) => d.isCurrentMonth && isSameDate(d.date, focusedDate)
                    );
                    const prevAvail = currentIdx > 0
                        ? calendarDays.slice(0, currentIdx).reverse()
                            .find((d) => d.isCurrentMonth && !isDateDisabled(d.date))
                        : null;
                    if (prevAvail) {
                        setFocusedDate(new Date(prevAvail.date));
                    } else if (canGoPrev) {
                        prevBtnRef.current?.focus();
                    } else {
                        closePicker(false);
                        exitFocus(true);
                    }
                } else {
                    // Tab: next available day → next btn → exit forward
                    const currentIdx = calendarDays.findIndex(
                        (d) => d.isCurrentMonth && isSameDate(d.date, focusedDate)
                    );
                    const nextAvail = currentIdx >= 0
                        ? calendarDays.slice(currentIdx + 1)
                            .find((d) => d.isCurrentMonth && !isDateDisabled(d.date))
                        : calendarDays.find((d) => d.isCurrentMonth && !isDateDisabled(d.date));
                    if (nextAvail) {
                        setFocusedDate(new Date(nextAvail.date));
                    } else if (canGoNext) {
                        nextBtnRef.current?.focus();
                    } else {
                        closePicker(false);
                        exitFocus(false);
                    }
                }
                return;
            }
            default:
                return;
        }

        if (newDate && newDate >= today && newDate <= maxDate) {
            setFocusedDate(newDate);
            if (newDate.getMonth() !== viewMonth.month || newDate.getFullYear() !== viewMonth.year) {
                setViewMonth({ year: newDate.getFullYear(), month: newDate.getMonth() });
            }
        }
    }, [focusedDate, viewMonth, today, maxDate, isDateDisabled, selectDate, closePicker, calendarDays, canGoPrev, canGoNext, exitFocus]);

    const handleNavKeyDown = useCallback((event, isNext) => {
        switch (event.key) {
            case 'Tab': {
                event.preventDefault();
                if (event.shiftKey) {
                    if (isNext) {
                        // Shift+Tab on next btn: focus last available day
                        const lastAvail = [...calendarDays].reverse()
                            .find((d) => d.isCurrentMonth && !isDateDisabled(d.date));
                        if (lastAvail && gridRef.current) {
                            setFocusedDate(new Date(lastAvail.date));
                            const key = toValueString(lastAvail.date);
                            gridRef.current.querySelector(`[data-date="${key}"]`)?.focus();
                        }
                    } else {
                        // Shift+Tab on prev btn: exit backward
                        closePicker(false);
                        exitFocus(true);
                    }
                } else if (!isNext) {
                    // Tab on prev btn: focus first available day
                    const firstAvail = calendarDays
                        .find((d) => d.isCurrentMonth && !isDateDisabled(d.date));
                    if (firstAvail && gridRef.current) {
                        setFocusedDate(new Date(firstAvail.date));
                        const key = toValueString(firstAvail.date);
                        gridRef.current.querySelector(`[data-date="${key}"]`)?.focus();
                    }
                } else {
                    // Tab on next btn: exit forward
                    closePicker(false);
                    exitFocus(false);
                }
                break;
            }
            case 'Escape': {
                event.preventDefault();
                closePicker();
                break;
            }
            default:
                break;
        }
    }, [calendarDays, isDateDisabled, closePicker, exitFocus]);

    const handleButtonKeyDown = useCallback((event) => {
        if (disabled) return;
        if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            if (!isOpen) openPicker();
        }
        if (event.key === 'Tab') {
            if (!isOpen) {
                event.preventDefault();
                openPicker();
            } else {
                // Edge case: Tab on trigger while open — move into panel
                event.preventDefault();
                if (canGoPrev && prevBtnRef.current) {
                    prevBtnRef.current.focus();
                } else if (gridRef.current) {
                    const firstAvail = calendarDays
                        .find((d) => d.isCurrentMonth && !isDateDisabled(d.date));
                    if (firstAvail) {
                        const key = toValueString(firstAvail.date);
                        gridRef.current.querySelector(`[data-date="${key}"]`)?.focus();
                    }
                }
            }
        }
    }, [disabled, isOpen, openPicker, canGoPrev, calendarDays, isDateDisabled]);

    const displayText = formatDisplayDate(value);

    return (
        <div
            ref={containerRef}
            className={`datepicker${className ? ` ${className}` : ''}${hasError ? ' form-error' : ''}${disabled ? ' datepicker--disabled' : ''}${isOpen ? ' datepicker--open' : ''}`}
            {...rest}
        >
            <div className="datepicker__surface">
                <button
                    ref={buttonRef}
                    type="button"
                    id={id}
                    aria-haspopup="dialog"
                    aria-expanded={isOpen}
                    aria-label={`Choose date${value ? `, current selection ${formatDisplayDate(value)}` : ''}`}
                    aria-describedby={hasError ? `${id}-error` : undefined}
                    aria-disabled={disabled ? 'true' : undefined}
                    disabled={disabled}
                    className={`datepicker__trigger${!value ? ' datepicker__trigger--placeholder' : ''}`}
                    onPointerDown={() => {
                        pointerFocusRef.current = true;
                    }}
                    onClick={() => {
                        pointerFocusRef.current = false;
                        if (isOpen) {
                            closePicker();
                            return;
                        }
                        openPicker();
                    }}
                    onKeyDown={handleButtonKeyDown}
                    onFocus={() => {
                        if (skipNextFocusOpenRef.current) {
                            skipNextFocusOpenRef.current = false;
                            return;
                        }
                        if (pointerFocusRef.current) return;
                        openPicker();
                    }}
                    onBlur={() => {
                        pointerFocusRef.current = false;
                    }}
                >
                    <span className="datepicker__value">{displayText}</span>
                    <svg
                        className={`datepicker__chevron${isOpen ? ' datepicker__chevron--open' : ''}`}
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

                <div
                    ref={panelRef}
                    className="datepicker__panel"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Choose date"
                >
                    <div className="datepicker__header">
                        <button
                            ref={prevBtnRef}
                            type="button"
                            className="datepicker__nav-btn"
                            onClick={goToPrevMonth}
                            disabled={!canGoPrev}
                            aria-label="Previous month"
                            tabIndex={isOpen ? 0 : -1}
                            onKeyDown={(e) => handleNavKeyDown(e, false)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <span className="datepicker__month-year" aria-live="polite">
                            {MONTHS[viewMonth.month]} {viewMonth.year}
                        </span>
                        <button
                            ref={nextBtnRef}
                            type="button"
                            className="datepicker__nav-btn"
                            onClick={goToNextMonth}
                            disabled={!canGoNext}
                            aria-label="Next month"
                            tabIndex={isOpen ? 0 : -1}
                            onKeyDown={(e) => handleNavKeyDown(e, true)}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </button>
                    </div>

                    <table
                        className="datepicker__grid"
                        ref={gridRef}
                        role="grid"
                        aria-label={`${MONTHS[viewMonth.month]} ${viewMonth.year}`}
                    >
                        <thead>
                            <tr>
                                {DAYS_OF_WEEK.map((day) => (
                                    <th key={day} className="datepicker__day-header" scope="col" abbr={day}>
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
                                <tr key={weekIndex}>
                                    {calendarDays.slice(weekIndex * 7, (weekIndex + 1) * 7).map((dayInfo, dayIndex) => {
                                        const { date, day, isCurrentMonth } = dayInfo;
                                        const dateStr = toValueString(date);
                                        const dis = !isCurrentMonth || isDateDisabled(date);
                                        const isSelected = isCurrentMonth && isSameDate(date, selectedDate);
                                        const isToday = isCurrentMonth && isSameDate(date, today);
                                        const isFocused = isCurrentMonth && isSameDate(date, focusedDate);

                                        return (
                                            <td
                                                key={dayIndex}
                                                role="gridcell"
                                                aria-selected={isSelected}
                                                aria-disabled={dis}
                                                aria-label={
                                                    isCurrentMonth
                                                        ? date.toLocaleDateString('en-GB', {
                                                            weekday: 'long',
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })
                                                        : undefined
                                                }
                                                data-date={dateStr}
                                                tabIndex={isFocused && isOpen ? 0 : -1}
                                                className={[
                                                    'datepicker__day',
                                                    !isCurrentMonth && 'datepicker__day--outside',
                                                    isCurrentMonth && isDateDisabled(date) && 'datepicker__day--disabled',
                                                    isSelected && 'datepicker__day--selected',
                                                    isToday && 'datepicker__day--today',
                                                    isCurrentMonth && date.getDay() === 0 && 'datepicker__day--sunday'
                                                ].filter(Boolean).join(' ')}
                                                onClick={() => !dis && selectDate(date)}
                                                onKeyDown={isCurrentMonth ? handleGridKeyDown : undefined}
                                            >
                                                <span className="datepicker__day-content">{day}</span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DatePicker;
