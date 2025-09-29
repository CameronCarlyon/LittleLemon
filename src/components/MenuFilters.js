import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';

const MenuFilters = ({ 
    activeFilters, 
    onFiltersChange, 
    sortBy, 
    onSortChange,
}) => {
    const filtersRef = useRef(null);
    const timelineRef = useRef(null);
    const isOpen = useRef(false);

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

    // Clear all filters
    const handleClearAll = useCallback(() => {
        onFiltersChange({
            vegetarian: false,
            vegan: false,
            glutenFree: false
        });
        onSortChange('default');
    }, [onFiltersChange, onSortChange]);

    // Memoized check for active filters
    const hasActiveFilters = useMemo(() => 
        Object.values(activeFilters).some(Boolean) || sortBy !== 'default'
    , [activeFilters, sortBy]);

    /**
     * Opens the filters with GSAP animation
     * First grows container height, then reveals elements
     */
    const openFilters = useCallback(() => {
        if (isOpen.current) return;
        
        const container = filtersRef.current;
        if (!container) return;

        // Kill any running animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const ctx = gsap.context(() => {
            const filterElements = container.querySelectorAll(
                '.menu-category, .sort-controls, label, div'
            );

            // Set initial state - container collapsed, elements hidden
            gsap.set(container, {
                height: 0,
                opacity: 0,
                overflow: 'hidden'
            });

            gsap.set(filterElements, {
                opacity: 0,
                scale: 0.95
            });

            // Create timeline for opening animation
            const tl = gsap.timeline({
                onComplete: () => {
                    // Clear height constraint after animation for responsive behavior
                    gsap.set(container, { height: 'auto' });
                    isOpen.current = true;
                }
            });

            // First: grow container height and fade in
            tl.to(container, {
                height: 'auto',
                opacity: 1,
                duration: 0.4,
                ease: 'power2.inOut'
            })
            // Then: staggered reveal of filter elements
            .to(filterElements, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.3,
                stagger: 0.05,
                ease: 'back.out(1.2)'
            }, '-=0.1');

            timelineRef.current = tl;
        }, container);

        return () => ctx.revert();
    }, []);

    /**
     * Closes the filters with GSAP animation
     * First hides elements, then collapses container height
     */
    const closeFilters = useCallback(() => {
        if (!isOpen.current) return;
        
        const container = filtersRef.current;
        if (!container) return;

        // Kill any running animation
        if (timelineRef.current) {
            timelineRef.current.kill();
        }

        const ctx = gsap.context(() => {
            const filterElements = container.querySelectorAll(
                '.menu-category, .sort-controls, label, div'
            );

            // Get current height for smooth collapse
            const currentHeight = container.offsetHeight;
            gsap.set(container, { height: currentHeight });

            // Create timeline for closing animation
            const tl = gsap.timeline({
                onComplete: () => {
                    isOpen.current = false;
                }
            });

            // First: hide filter elements with stagger
            tl.to(filterElements, {
                opacity: 0,
                y: -15,
                scale: 0.95,
                duration: 0.25,
                stagger: 0.03,
                ease: 'power2.in'
            })
            // Then: collapse container height and fade out
            .to(container, {
                height: 0,
                opacity: 0,
                duration: 0.35,
                ease: 'power2.inOut'
            }, '-=0.1');

            timelineRef.current = tl;
        }, container);

        return () => ctx.revert();
    }, []);

    // Initialize with opening animation on mount
    useEffect(() => {
        openFilters();
        
        // Cleanup on unmount
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, [openFilters]);

    // Example trigger for closing (you can call closeFilters() when needed)
    // This could be triggered by a parent component or based on some condition
    useEffect(() => {
        // Add any conditions here that should trigger closing
        // For now, this is just a placeholder for the closing functionality
    }, [closeFilters]);

    return (
        <div ref={filtersRef} className="filter-container">
            <div className='filter-controls'>
            <div className='flex-row'>
                <label>Filter by:</label>
                <div className='filter-categories'>
                    {dietaryFilters.map((filter) => (
                        <button
                            key={filter.key}
                            className={`menu-category${activeFilters[filter.key] ? ' active' : ''}`}
                            onClick={() => handleDietaryFilterToggle(filter.key)}
                        >
                            {filter.label}
                        </button>
                    ))}  
                </div>
            </div>
            
            <div className="sort-by-container">
                    <div className='flex-row'>
                    <label htmlFor="sort-select" >Sort by:</label>
                    <select
                        id="sort-select"
                        className="menu-category"
                        value={sortBy}
                        onChange={handleSortChange}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.key} value={option.key}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    </div>
                </div>
                </div>
                <div className='clear-filters-container'>
                    {hasActiveFilters && (
                        <button 
                            className="menu-category"
                            onClick={handleClearAll}
                        >
                            Clear Filters
                        </button>
                    )}
            </div>
        </div>
        
    );
};

export default MenuFilters;
