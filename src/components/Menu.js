import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import Lottie from 'lottie-react';
import { useCart } from '../context/CartContext';
import QuantityControl from './QuantityControl';
import MenuFilters from './MenuFilters';

// Import filter icons
import filterIconRegular from '../assets/icons/filter-icon-regular.json';
import filterIconSolid from '../assets/icons/filter-icon-solid.json';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('Breakfast');
    const [filters, setFilters] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false
    });
    const [sortBy, setSortBy] = useState('default');
    const [showFilters, setShowFilters] = useState(false);
    const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();
    const menuItemsRef = useRef(null);
    const animationRef = useRef(null);
    const filterLottieRef = useRef(null);

    /**
     * Triggers the filter icon Lottie animation
     * Used when filters change or filter panel is toggled
     */
    const triggerFilterAnimation = useCallback(() => {
        if (filterLottieRef.current) {
            filterLottieRef.current.goToAndPlay(0, true);
        }
    }, []);

    const handleAddToCart = (item) => {
        addToCart({ ...item, quantity: 1 });
    };

    const getCartQuantity = (itemName) => {
        const cartItem = cartItems.find(item => item.name === itemName);
        return cartItem ? cartItem.quantity : 0;
    };

    /**
     * Handle filter toggle with Lottie animation
     */
    const handleFilterToggle = useCallback(() => {
        setShowFilters(prev => !prev);
        triggerFilterAnimation();
    }, [triggerFilterAnimation]);

    /**
     * Enhanced filter change handler with animation trigger
     */
    const handleFiltersChange = useCallback((newFilters) => {
        setFilters(newFilters);
        triggerFilterAnimation();
    }, [triggerFilterAnimation]);

    /**
     * Enhanced sort change handler with animation trigger
     */
    const handleSortChange = useCallback((newSortBy) => {
        setSortBy(newSortBy);
        triggerFilterAnimation();
    }, [triggerFilterAnimation]);

    // Map of category names to their corresponding menu arrays
    const menuMap = useMemo(() => {
        const breakfastMenu = [
            { name: "Shakshuka Skillet", description: "Poached eggs in a rich spiced tomato and bell pepper sauce, served with warm pita.", price: 11.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
            { name: "Avocado & Feta Toast", description: "Sourdough bread topped with mashed avocado, crumbled feta, cherry tomatoes, and a drizzle of olive oil.", price: 9.99, calories: 350, vegetarian: true, vegan: false, glutenFree: false },
            { name: "Mediterranean Omelette", description: "Three-egg omelette with olives, sun-dried tomatoes, spinach, and goat cheese.", price: 10.99, calories: 480, vegetarian: true, vegan: false, glutenFree: true },
            { name: "Greek Yogurt Parfait", description: "Creamy Greek yogurt layered with honey, granola, fresh berries, and a sprinkle of almonds.", price: 8.99, calories: 320, vegetarian: true, vegan: false, glutenFree: false },
            { name: "Turkish Menemen", description: "Scrambled eggs cooked with peppers, tomatoes, and spices, served with fresh bread.", price: 10.99, calories: 380, vegetarian: true, vegan: false, glutenFree: false },
        ];

        const lunchMenu = [
            { name: "Lemon Chicken Pita Wrap", description: "Grilled lemon-marinated chicken with tzatziki, lettuce, tomatoes, and onions, wrapped in warm pita.", price: 12.99, calories: 520, vegetarian: false, vegan: false, glutenFree: false },
            { name: "Quinoa Tabbouleh Bowl", description: "Fresh quinoa salad with parsley, mint, tomatoes, cucumbers, and a lemon-olive oil dressing.", price: 11.99, calories: 380, vegetarian: true, vegan: true, glutenFree: true },
            { name: "Grilled Halloumi Salad", description: "Mixed greens with grilled halloumi, roasted bell peppers, and pomegranate seeds, served with balsamic vinaigrette.", price: 13.99, calories: 450, vegetarian: true, vegan: false, glutenFree: true },
            { name: "Lemon Herb Soup & Half Sandwich", description: "Bowl of lemon herb soup paired with half a Mediterranean sandwich.", price: 10.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
            { name: "Falafel Salad Bowl", description: "Crispy falafel over mixed greens with hummus, tzatziki, and fresh vegetables.", price: 12.99, calories: 480, vegetarian: true, vegan: false, glutenFree: true },
            { name: "Mediterranean Grain Bowl", description: "Quinoa and bulgur with roasted vegetables, chickpeas, and tahini dressing.", price: 13.99, calories: 520, vegetarian: true, vegan: true, glutenFree: false },
        ];

        const mainsMenu = [
            { name: "Lemon Herb Grilled Salmon", description: "Served with saffron rice, roasted vegetables, and a creamy tahini sauce.", price: 21.99, calories: 650, vegetarian: false, vegan: false, glutenFree: true },
            { name: "Moroccan Spiced Lamb Tagine", description: "Slow-cooked lamb with apricots, almonds, and aromatic spices, served with couscous.", price: 24.99, calories: 720, vegetarian: false, vegan: false, glutenFree: false },
            { name: "Stuffed Bell Peppers", description: "Roasted bell peppers filled with herbed rice, pine nuts, and raisins, topped with melted cheese.", price: 17.99, calories: 510, vegetarian: true, vegan: false, glutenFree: true },
            { name: "Seafood Paella", description: "Traditional paella with mussels, shrimp, calamari, and saffron-infused rice.", price: 26.99, calories: 680, vegetarian: false, vegan: false, glutenFree: true },
            { name: "Vegetarian Moussaka", description: "Layers of eggplant, lentils, and béchamel sauce, baked to perfection.", price: 18.99, calories: 560, vegetarian: true, vegan: false, glutenFree: false },
            { name: "Grilled Branzino", description: "Whole Mediterranean sea bass grilled with herbs and served with lemon potatoes.", price: 23.99, calories: 590, vegetarian: false, vegan: false, glutenFree: true },
            { name: "Chicken Souvlaki Platter", description: "Grilled chicken skewers with pita, tzatziki, and Greek salad.", price: 19.99, calories: 620, vegetarian: false, vegan: false, glutenFree: false },
            { name: "Eggplant Parmigiana", description: "Layers of roasted eggplant with marinara sauce and melted mozzarella.", price: 16.99, calories: 480, vegetarian: true, vegan: false, glutenFree: false },
        ];

        const dessertsMenu = [
            { name: 'Baklava Cheesecake', description: "Creamy cheesecake with layers of crispy phyllo, spiced nuts, and honey drizzle.", price: 8.99, calories: 480, vegetarian: true, vegan: false, glutenFree: false },
            { name: 'Orange & Olive Oil Cake', description: "Moist citrus cake with a hint of olive oil, served with a scoop of vanilla gelato.", price: 7.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
            { name: 'Pistachio & Rosewater Pudding', description: "A rich and creamy pudding flavored with rosewater and topped with crushed pistachios.", price: 6.99, calories: 350, vegetarian: true, vegan: false, glutenFree: true },
            { name: 'Date & Walnut Tart', description: "Sweet date filling in a buttery tart shell, topped with whipped cream.", price: 7.99, calories: 390, vegetarian: true, vegan: false, glutenFree: false },
            { name: 'Chocolate Tahini Brownie', description: "Dark chocolate brownie with a swirl of tahini, served with a side of espresso cream.", price: 8.99, calories: 450, vegetarian: true, vegan: false, glutenFree: false },
        ];
        
        const aLaCarteMenu = [
            { name: 'Hummus Trio', description: "Classic, roasted red pepper, and black garlic hummus, served with pita chips.", price: 9.99, calories: 450, vegetarian: true, vegan: true, glutenFree: false },
            { name: 'Dolmades (Stuffed Grape Leaves)', description: "Hand-rolled grape leaves stuffed with rice, herbs, and pine nuts.", price: 8.99, calories: 330, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Grilled Octopus with Lemon & Paprika', description: "Charred octopus drizzled with extra virgin olive oil, served with citrus salad.", price: 14.99, calories: 500, vegetarian: false, vegan: false, glutenFree: true },
            { name: 'Whipped Feta & Honey Dip', description: "Creamy feta blended with honey and herbs, served with crispy pita chips.", price: 7.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
            { name: 'Zaalouk (Moroccan Eggplant Dip)', description: "Smoky eggplant and tomato dip with garlic and spices, served with crusty bread.", price: 8.99, calories: 360, vegetarian: true, vegan: true, glutenFree: false },
            { name: 'Saffron & Garlic Shrimp Skewers', description: "Grilled shrimp marinated in saffron, garlic, and olive oil.", price: 13.99, calories: 410, vegetarian: false, vegan: false, glutenFree: true },
            { name: 'Spicy Roasted Chickpeas', description: "Crunchy, spiced chickpeas served with lemon aioli.", price: 6.99, calories: 280, vegetarian: true, vegan: false, glutenFree: true },
            { name: 'Fried Calamari with Harissa Aioli', description: "Lightly battered calamari served with a spicy harissa aioli dip.", price: 11.99, calories: 460, vegetarian: false, vegan: false, glutenFree: false },
        ];
        
        const specialsMenu = [
            { name: 'Saffron & Lemon Risotto', description: "Creamy risotto with saffron, lemon zest, and parmesan.", price: 19.99, calories: 570, vegetarian: true, vegan: false, glutenFree: true },
            { name: 'Pomegranate Glazed Duck', description: "Seared duck breast with a tangy pomegranate glaze, served with roasted root vegetables.", price: 25.99, calories: 690, vegetarian: false, vegan: false, glutenFree: true },
            { name: 'Grilled Lamb Chops with Mint Yogurt', description: "Marinated lamb chops served with warm lentil salad.", price: 27.99, calories: 750, vegetarian: false, vegan: false, glutenFree: true },
            { name: 'Spiced Lentil & Chickpea Stew', description: "Hearty stew with warming spices, topped with Greek yogurt and fresh herbs.", price: 16.99, calories: 610, vegetarian: true, vegan: false, glutenFree: true },
            { name: 'Mahi Mahi with Harissa Butter', description: "Grilled fish fillet with a spicy harissa butter sauce, served with couscous.", price: 23.99, calories: 680, vegetarian: false, vegan: false, glutenFree: false },
        ];
        
        const drinksMenu = [
            { name: 'Mint & Lemon Iced Tea', description: "Freshly brewed tea with lemon and mint.", price: 4.99, calories: 120, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Turkish Coffee', description: "Rich, aromatic coffee served in a traditional copper pot.", price: 5.99, calories: 50, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Fresh Pomegranate Juice', description: "Pure, refreshing pomegranate juice.", price: 6.99, calories: 160, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Mediterranean Sangria', description: "Red wine infused with citrus and Mediterranean spices.", price: 8.99, calories: 180, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Rosewater Lemonade', description: "Refreshing homemade lemonade with a floral twist.", price: 4.99, calories: 140, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Still or Sparkling Water', description: "Refreshing bottled water.", price: 2.99, calories: 0, vegetarian: true, vegan: true, glutenFree: true },
            { name: 'Soft Drink', description: "A selection of sodas including cola, orange soda, and lemon-lime soda.", price: 3.99, calories: 150, vegetarian: true, vegan: true, glutenFree: true },
        ];

        return {
            'Breakfast': breakfastMenu,
            'Lunch': lunchMenu,
            'Mains': mainsMenu,
            'Desserts': dessertsMenu,
            'A La Carte': aLaCarteMenu,
            'Specials': specialsMenu,
            'Drinks': drinksMenu
        };
    }, []);

    // Handle tab click
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    // Helper function to apply filters to any category
    const applyFiltersToCategory = useCallback((items) => {
        let filteredItems = [...items];

        // Apply dietary filters
        if (filters.vegetarian) {
            filteredItems = filteredItems.filter(item => item.vegetarian);
        }
        if (filters.vegan) {
            filteredItems = filteredItems.filter(item => item.vegan);
        }
        if (filters.glutenFree) {
            filteredItems = filteredItems.filter(item => item.glutenFree);
        }

        return filteredItems;
    }, [filters]);

    // Get categories that have items after filtering
    const availableCategories = useMemo(() => {
        return Object.keys(menuMap).filter(category => {
            const filteredItems = applyFiltersToCategory(menuMap[category]);
            return filteredItems.length > 0;
        });
    }, [menuMap, applyFiltersToCategory]);

    // Ensure active category is available, fallback to first available if not
    useEffect(() => {
        if (!availableCategories.includes(activeCategory) && availableCategories.length > 0) {
            setActiveCategory(availableCategories[0]);
        }
    }, [availableCategories, activeCategory]);

    // Get current menu items based on active category, filters, and sorting
    const currentMenuItems = useMemo(() => {
        if (!availableCategories.includes(activeCategory)) {
            return [];
        }

        let items = applyFiltersToCategory(menuMap[activeCategory]);

        // Apply sorting
        switch (sortBy) {
            case 'calories-low':
                items.sort((a, b) => a.calories - b.calories);
                break;
            case 'calories-high':
                items.sort((a, b) => b.calories - a.calories);
                break;
            case 'price-low':
                items.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                items.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                items.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Keep original order
                break;
        }

        return items;
    }, [activeCategory, sortBy, menuMap, availableCategories, applyFiltersToCategory]);

    // Get unfiltered items count for display
    const totalItemsInCategory = menuMap[activeCategory].length;

    // Animate menu items when category changes or filters change
    useEffect(() => {
        const container = menuItemsRef.current;
        if (!container) return;

        // Kill any existing animation
        if (animationRef.current) {
            animationRef.current.kill();
        }

        // Get all menu item elements (excluding dividers to avoid animation conflicts)
        const menuItems = container.querySelectorAll('.menu-item');
        
        if (menuItems.length === 0) return;

        // Create GSAP context for cleanup
        const ctx = gsap.context(() => {
            // Set initial state - invisible and positioned above
            gsap.set(menuItems, {
                opacity: 0,
                y: -20,
            });

            // Create timeline for staggered animation
            const tl = gsap.timeline();
            animationRef.current = tl;

            // Animate items in with stagger
            tl.to(menuItems, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: 'power2.out',
                stagger: {
                    amount: 0.5, // Total time for all items to finish staggering
                    from: 'start'
                }
            });
        }, container);

        // Cleanup function
        return () => {
            ctx.revert();
            if (animationRef.current) {
                animationRef.current.kill();
            }
        };
    }, [activeCategory, currentMenuItems.length]); // Also retrigger when filtered items count changes

    return (
        <div className='menu'>
            <div className='menu-categories-container'>
                <div className='menu-categories'>
                    {availableCategories.map((category) => (
                        <button 
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`menu-category ${activeCategory === category ? 'active' : ''}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <button 
                    className={`menu-category ${showFilters ? 'active' : ''} filter-btn`}
                    onClick={handleFilterToggle}
                    aria-label={showFilters ? 'Hide Filters' : 'Show Filters'}
                    aria-expanded={showFilters}
                >
                    <Lottie
                        lottieRef={filterLottieRef}
                        animationData={showFilters ? filterIconSolid : filterIconRegular}
                        autoplay={false}
                        loop={false}
                        style={{ width: '100%', height: '2rem' }}
                    />
                </button>
            </div>
            
            {showFilters && (
                <MenuFilters
                    activeFilters={filters}
                    onFiltersChange={handleFiltersChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    itemCount={currentMenuItems.length}
                    totalItems={totalItemsInCategory}
                />
            )}
            
            <div className='menu-items' ref={menuItemsRef}>
                {currentMenuItems.length > 0 ? (
                    currentMenuItems.map((item, index) => (
                        <React.Fragment key={`${activeCategory}-${index}`}>
                            <div className='menu-item'>
                                <label>{item.name}</label>
                                <p>{item.description}</p>
                                <div className='flex-row'>
                                    <p>{item.calories} kcal</p>
                                    <div className='dietary-labels'>
                                        {item.vegetarian && <div className='dietary-label vegetarian'><p>Vegetarian</p></div>}
                                        {item.vegan && <div className='dietary-label vegan'><p>Vegan</p></div>}
                                        {item.glutenFree && <div className='dietary-label gluten-free'><p>Gluten-free</p></div>}
                                    </div>
                                </div>
                                <div className="price-cart-row">
                                    <div className='price-label'>
                                        <b>${item.price}</b>
                                    </div>
                                    <QuantityControl 
                                        quantity={getCartQuantity(item.name)}
                                        onIncrease={() => handleAddToCart(item)}
                                        onDecrease={() => {
                                            const currentQty = getCartQuantity(item.name);
                                            if (currentQty <= 1) {
                                                removeFromCart(item.name);
                                            } else {
                                                updateQuantity(item.name, currentQty - 1);
                                            }
                                        }}
                                        minQuantity={0}
                                    />
                                </div>
                            </div>
                        </React.Fragment>
                    ))
                ) : (
                    <div className="no-items-message">
                        <h3>No items match your current filters</h3>
                        <p>Try adjusting your filter settings or clearing all filters to see more menu items.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Menu;
