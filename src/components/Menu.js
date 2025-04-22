import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import QuantityControl from './QuantityControl';

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState('Breakfast');
    const { addToCart, removeFromCart, updateQuantity, cartItems } = useCart();

    const handleAddToCart = (item) => {
        addToCart({ ...item, quantity: 1 });
    };

    const getCartQuantity = (itemName) => {
        const cartItem = cartItems.find(item => item.name === itemName);
        return cartItem ? cartItem.quantity : 0;
    };

    // Menu data
    let breakfastMenu=[
        { name: "Shakshuka Skillet", description: "Poached eggs in a rich spiced tomato and bell pepper sauce, served with warm pita.", price: 11.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
        { name: "Mediterranean Avocado Toast", description: "Sourdough toast topped with avocado, feta, cherry tomatoes, za'atar, and a drizzle of olive oil.", price: 9.99, calories: 380, vegetarian: true, vegan: false, glutenFree: false },
        { name: "Honey & Almond Greek Yogurt Bowl", description: "Thick Greek yogurt topped with honey, almonds, fresh figs, and a sprinkle of cinnamon.", price: 8.99, calories: 310, vegetarian: true, vegan: false, glutenFree: true },
        { name: "Spinach & Feta Omelette", description: "Fluffy eggs folded with fresh spinach, feta cheese, and herbs, served with a side of roasted potatoes.", price: 10.99, calories: 450, vegetarian: true, vegan: false, glutenFree: true },
        { name: "Orange Blossom Pancakes", description: "Soft pancakes infused with orange blossom water, topped with pistachios, syrup, and fresh berries.", price: 9.99, calories: 520, vegetarian: true, vegan: false, glutenFree: false },
    ];
      
    let lunchMenu=[
        { name: "Lemon Chicken Pita Wrap", description: "Grilled lemon-marinated chicken with tzatziki, lettuce, tomatoes, and onions, wrapped in warm pita.", price: 12.99, calories: 570, vegetarian: false, vegan: false, glutenFree: false },
        { name: "Falafel & Hummus Bowl", description: "Crispy falafel served with creamy hummus, cucumber salad, pickled turnips, and warm pita.", price: 11.99, calories: 590, vegetarian: true, vegan: true, glutenFree: false },
        { name: "Mediterranean Quinoa Salad", description: "Quinoa, chickpeas, roasted red peppers, cucumbers, olives, and feta, drizzled with lemon dressing.", price: 10.99, calories: 430, vegetarian: true, vegan: false, glutenFree: true },
        { name: "Spiced Lamb Meatballs", description: "Tender lamb meatballs in a tomato and harissa sauce, served with fluffy couscous.", price: 13.99, calories: 620, vegetarian: false, vegan: false, glutenFree: false },
        { name: "Grilled Halloumi & Fig Flatbread", description: "Warm flatbread topped with grilled halloumi cheese, fig jam, arugula, and balsamic glaze.", price: 12.99, calories: 480, vegetarian: true, vegan: false, glutenFree: false },
    ];
    
    let mainsMenu=[
        { name: "Lemon Herb Grilled Salmon", description: "Served with saffron rice, roasted vegetables, and a creamy tahini sauce.", price: 21.99, calories: 650, vegetarian: false, vegan: false, glutenFree: true },
        { name: "Slow-Cooked Lamb Tagine", description: "Traditional Moroccan-style lamb stew with apricots, almonds, and warm spices, served with couscous.", price: 23.99, calories: 720, vegetarian: false, vegan: false, glutenFree: false },
        { name: "Stuffed Eggplant with Spiced Couscous", description: "Roasted eggplant filled with spiced couscous, tomatoes, and pine nuts, topped with yogurt sauce.", price: 18.99, calories: 590, vegetarian: true, vegan: false, glutenFree: false },
        { name: "Za'atar Crusted Chicken", description: "Juicy chicken breast coated in za'atar, served with garlic roasted potatoes and charred lemon.", price: 20.99, calories: 610, vegetarian: false, vegan: false, glutenFree: true },
        { name: "Seafood Paella", description: "A fragrant blend of shrimp, mussels, and squid cooked with saffron-infused rice and fresh herbs.", price: 24.99, calories: 740, vegetarian: false, vegan: false, glutenFree: true },
        { name: "Braised Beef with Pomegranate Glaze", description: "Slow-braised beef short ribs with a tangy pomegranate glaze, served with roasted root vegetables.", price: 26.99, calories: 780, vegetarian: false, vegan: false, glutenFree: true },
        { name: "Harissa Spiced Lamb Chops", description: "Grilled lamb chops marinated in harissa, served with warm lentil salad and yogurt dressing.", price: 27.99, calories: 750, vegetarian: false, vegan: false, glutenFree: true },
        { name: "Moussaka", description: "A baked casserole of layered eggplant, spiced beef, and creamy béchamel sauce.", price: 19.99, calories: 690, vegetarian: false, vegan: false, glutenFree: false },
    ];
    
    let dessertsMenu=[
        { name: 'Baklava Cheesecake', description: "Creamy cheesecake with layers of crispy phyllo, spiced nuts, and honey drizzle.", price: 8.99, calories: 480, vegetarian: true, vegan: false, glutenFree: false },
        { name: 'Orange & Olive Oil Cake', description: "Moist citrus cake with a hint of olive oil, served with a scoop of vanilla gelato.", price: 7.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
        { name: 'Pistachio & Rosewater Pudding', description: "A rich and creamy pudding flavored with rosewater and topped with crushed pistachios.", price: 6.99, calories: 350, vegetarian: true, vegan: false, glutenFree: true },
        { name: 'Date & Walnut Tart', description: "Sweet date filling in a buttery tart shell, topped with whipped cream.", price: 7.99, calories: 390, vegetarian: true, vegan: false, glutenFree: false },
        { name: 'Chocolate Tahini Brownie', description: "Dark chocolate brownie with a swirl of tahini, served with a side of espresso cream.", price: 8.99, calories: 450, vegetarian: true, vegan: false, glutenFree: false },
    ];
    
    let aLaCarteMenu=[
        { name: 'Hummus Trio', description: "Classic, roasted red pepper, and black garlic hummus, served with pita chips.", price: 9.99, calories: 450, vegetarian: true, vegan: true, glutenFree: false },
        { name: 'Dolmades (Stuffed Grape Leaves)', description: "Hand-rolled grape leaves stuffed with rice, herbs, and pine nuts.", price: 8.99, calories: 330, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Grilled Octopus with Lemon & Paprika', description: "Charred octopus drizzled with extra virgin olive oil, served with citrus salad.", price: 14.99, calories: 500, vegetarian: false, vegan: false, glutenFree: true },
        { name: 'Whipped Feta & Honey Dip', description: "Creamy feta blended with honey and herbs, served with crispy pita chips.", price: 7.99, calories: 420, vegetarian: true, vegan: false, glutenFree: false },
        { name: 'Zaalouk (Moroccan Eggplant Dip)', description: "Smoky eggplant and tomato dip with garlic and spices, served with crusty bread.", price: 8.99, calories: 360, vegetarian: true, vegan: true, glutenFree: false },
        { name: 'Saffron & Garlic Shrimp Skewers', description: "Grilled shrimp marinated in saffron, garlic, and olive oil.", price: 13.99, calories: 410, vegetarian: false, vegan: false, glutenFree: true },
        { name: 'Spicy Roasted Chickpeas', description: "Crunchy, spiced chickpeas served with lemon aioli.", price: 6.99, calories: 280, vegetarian: true, vegan: false, glutenFree: true },
        { name: 'Fried Calamari with Harissa Aioli', description: "Lightly battered calamari served with a spicy harissa aioli dip.", price: 11.99, calories: 460, vegetarian: false, vegan: false, glutenFree: false },
    ];
    
    let specialsMenu=[
        { name: 'Saffron & Lemon Risotto', description: "Creamy risotto with saffron, lemon zest, and parmesan.", price: 19.99, calories: 570, vegetarian: true, vegan: false, glutenFree: true },
        { name: 'Pomegranate Glazed Duck', description: "Seared duck breast with a tangy pomegranate glaze, served with roasted root vegetables.", price: 25.99, calories: 690, vegetarian: false, vegan: false, glutenFree: true },
        { name: 'Grilled Lamb Chops with Mint Yogurt', description: "Marinated lamb chops served with warm lentil salad.", price: 27.99, calories: 750, vegetarian: false, vegan: false, glutenFree: true },
        { name: 'Spiced Lentil & Chickpea Stew', description: "Hearty stew with warming spices, topped with Greek yogurt and fresh herbs.", price: 16.99, calories: 610, vegetarian: true, vegan: false, glutenFree: true },
        { name: 'Mahi Mahi with Harissa Butter', description: "Grilled fish fillet with a spicy harissa butter sauce, served with couscous.", price: 23.99, calories: 680, vegetarian: false, vegan: false, glutenFree: false },
    ];
    
    let drinksMenu=[
        { name: 'Mint & Lemon Iced Tea', description: "Freshly brewed tea with lemon and mint.", price: 4.99, calories: 120, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Turkish Coffee', description: "Rich, aromatic coffee served in a traditional copper pot.", price: 5.99, calories: 50, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Fresh Pomegranate Juice', description: "Pure, refreshing pomegranate juice.", price: 6.99, calories: 160, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Mediterranean Sangria', description: "Red wine infused with citrus and Mediterranean spices.", price: 8.99, calories: 180, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Rosewater Lemonade', description: "Refreshing homemade lemonade with a floral twist.", price: 4.99, calories: 140, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Still or Sparkling Water', description: "Refreshing bottled water.", price: 2.99, calories: 0, vegetarian: true, vegan: true, glutenFree: true },
        { name: 'Soft Drinks', description: "A selection of sodas including cola, orange soda, and lemon-lime soda.", price: 3.99, calories: 150, vegetarian: true, vegan: true, glutenFree: true },
    ];

    // Map of category names to their corresponding menu arrays
    const menuMap = {
        'Breakfast': breakfastMenu,
        'Lunch': lunchMenu,
        'Mains': mainsMenu,
        'Desserts': dessertsMenu,
        'A La Carte': aLaCarteMenu,
        'Specials': specialsMenu,
        'Drinks': drinksMenu
    };

    // Handle tab click
    const handleCategoryClick = (category) => {
        setActiveCategory(category);
    };

    // Get current menu items based on active category
    const currentMenuItems = menuMap[activeCategory];

    return (
        <div className='menu'>
            <div className='menu-categories'>
                <ul>
                    {Object.keys(menuMap).map((category) => (
                        <li 
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={activeCategory === category ? 'active' : ''}
                        >
                            {category}
                        </li>
                    ))}
                </ul>
            </div>
            <div className='menu-items'>
                {currentMenuItems.map((item, index) => (
                    <div key={index}>
                        <div className='menu-item'>
                            <label>{item.name}</label>
                            <p>{item.description}</p>
                            <div className='menu-item-footer'>
                                <p><i>{item.calories} kcal</i></p>
                                <div className='dietary-labels'>
                                    {item.vegetarian && <div className='dietary-label vegetarian'><i>Vegetarian</i></div>}
                                    {item.vegan && <div className='dietary-label vegan'>Vegan</div>}
                                    {item.glutenFree && <div className='dietary-label gluten-free'><i>Gluten-free</i></div>}
                                </div>
                            </div>
                            <div className="menu-item-actions">
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
                        {index !== currentMenuItems.length - 1 && <span className='menu-divider'></span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Menu;