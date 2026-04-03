import React, { useRef, useEffect, useLayoutEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import Dropdown from './Dropdown';

const MenuFilters = ({ 
    activeFilters, 
    onFiltersChange, 
    sortBy, 
    onSortChange,
    isClosing,
    onExitComplete,
}) => {
    const filtersRef = useRef(null);
    const filterCategoriesRef = useRef(null);
    const animationItemStyle = {
        opacity: 0,
        transform: 'scale(0)',
        transformOrigin: 'center center',
        transition: 'none'
    };
    const labelAnimationStyle = {
        ...animationItemStyle,
        display: 'inline-block'
    };

    // Memoized filter options to prevent recreation on renders
    const dietaryFilters = useMemo(() => [
        { key: 'vegetarian', label: 'Vegetarian' },
        { key: 'vegan', label: 'Vegan' },
        { key: 'glutenFree', label: 'Gluten-Free' }
    ], []);

    const sortOptions = useMemo(() => [
        { key: 'default', label: 'Default' },
        { key: 'calories-low', label: 'Calories (Low to High)' },
        { key: 'calories-high', label: 'Calories (High to Low)' },
        { key: 'price-low', label: 'Price (Low to High)' },
        { key: 'price-high', label: 'Price (High to Low)' },
        { key: 'name', label: 'Name (A-Z)' }
    ], []);

    // Handle dietary filter toggle with useCallback for performance
    const handleDietaryFilterToggle = useCallback((filterKey) => {
        const newFilters = { ...activeFilters };
        newFilters[filterKey] = !newFilters[filterKey];
        onFiltersChange(newFilters);
    }, [activeFilters, onFiltersChange]);

    // Handle sort change
    const handleSortChange = useCallback((e) => {
        onSortChange(e.target.value);
    }, [onSortChange]);

    // Memoize sort options in { value, label } format for Dropdown
    const dropdownSortOptions = useMemo(() =>
        sortOptions.map(opt => ({ value: opt.key, label: opt.label })),
    [sortOptions]);

    useLayoutEffect(() => {
        const container = filtersRef.current;
        if (!container) return undefined;

        const ctx = gsap.context(() => {
            const filterElements = container.querySelectorAll('[data-filter-animation-item]');

            gsap.set(container, {
                height: 0,
            });

            gsap.set(filterElements, {
                opacity: 0,
                scale: 0,
                transformOrigin: 'center center'
            });

            gsap.set(container, { height: 'auto' });
            const targetHeight = container.offsetHeight;
            gsap.set(container, { height: 0 });

            const timeline = gsap.timeline({
                defaults: {
                    ease: 'power2.out'
                },
                onComplete: () => {
                    gsap.set(container, { height: 'auto' });
                }
            });

            timeline
                .to(container, {
                    height: targetHeight,
                    duration: 0.28
                })
                .to(filterElements, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.18,
                    stagger: 0.03,
                    clearProps: 'opacity,transform,transition'
                }, '-=0.14');
        }, container);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (!isClosing) return;

        const container = filtersRef.current;
        if (!container) return;

        const filterElements = container.querySelectorAll('[data-filter-animation-item]');
        const items = Array.from(filterElements);

        const currentHeight = container.offsetHeight;
        gsap.set(container, { height: currentHeight, overflow: 'hidden' });

        const tl = gsap.timeline({
            onComplete: () => {
                if (onExitComplete) onExitComplete();
            }
        });

        tl.to(items, {
            opacity: 0,
            scale: 0,
            duration: 0.18,
            ease: 'power2.in'
        })
        .to(container, {
            height: 0,
            duration: 0.28,
            ease: 'power2.in'
        }, '-=0.14');

        return () => tl.kill();
    }, [isClosing, onExitComplete]);

    useEffect(() => {
        const container = filterCategoriesRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (!e.deltaY || e.deltaX) return;

            e.preventDefault();
            const px = e.deltaMode === 1 ? e.deltaY * 50 : e.deltaY;
            container.scrollBy({ left: px, behavior: 'instant' });
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, []);

    return (
        <div ref={filtersRef} className="filter-container">
            <div className='filter-controls'>
            <div className='filter-by-container'>
                <label data-filter-animation-item style={labelAnimationStyle}>Filter by:</label>
                <div className='menu-categories' ref={filterCategoriesRef}>
                    {dietaryFilters.map((filter) => (
                        <button
                            key={filter.key}
                            className={`menu-category${activeFilters[filter.key] ? ' active' : ''}`}
                            onClick={() => handleDietaryFilterToggle(filter.key)}
                            data-filter-animation-item
                            style={animationItemStyle}
                        >
                            {filter.label}
                        </button>
                    ))}  
                </div>
            </div>
            
            <div className="sort-by-container">
                    <label htmlFor="sort-select" data-filter-animation-item style={labelAnimationStyle}>Sort by:</label>
                    <Dropdown
                        id="sort-select"
                        className="btn-dropdown"
                        value={sortBy}
                        onChange={handleSortChange}
                        options={dropdownSortOptions}
                        data-filter-animation-item
                        style={animationItemStyle}
                    />
                </div>
                </div>
        </div>
        
    );
};

export default MenuFilters;
