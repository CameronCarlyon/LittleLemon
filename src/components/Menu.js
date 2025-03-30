import React from 'react';

let breakfastMenu=[
    { name: "Shakshuka Skillet", description: "Poached eggs in a rich spiced tomato and bell pepper sauce, served with warm pita.", price: 11.99, calories: 420 },
    { name: "Mediterranean Avocado Toast", description: "Sourdough toast topped with avocado, feta, cherry tomatoes, za’atar, and a drizzle of olive oil.", price: 9.99, calories: 380 },
    { name: "Honey & Almond Greek Yogurt Bowl", description: "Thick Greek yogurt topped with honey, almonds, fresh figs, and a sprinkle of cinnamon.", price: 8.99, calories: 310 },
    { name: "Spinach & Feta Omelette", description: "Fluffy eggs folded with fresh spinach, feta cheese, and herbs, served with a side of roasted potatoes.", price: 10.99, calories: 450 },
    { name: "Orange Blossom Pancakes", description: "Soft pancakes infused with orange blossom water, topped with pistachios, syrup, and fresh berries.", price: 9.99, calories: 520 },
  ];
  
  let lunchMenu=[
    { name: "Lemon Chicken Pita Wrap", description: "Grilled lemon-marinated chicken with tzatziki, lettuce, tomatoes, and onions, wrapped in warm pita.", price: 12.99, calories: 570 },
    { name: "Falafel & Hummus Bowl", description: "Crispy falafel served with creamy hummus, cucumber salad, pickled turnips, and warm pita.", price: 11.99, calories: 590 },
    { name: "Mediterranean Quinoa Salad", description: "Quinoa, chickpeas, roasted red peppers, cucumbers, olives, and feta, drizzled with lemon dressing.", price: 10.99, calories: 430 },
    { name: "Spiced Lamb Meatballs", description: "Tender lamb meatballs in a tomato and harissa sauce, served with fluffy couscous.", price: 13.99, calories: 620 },
    { name: "Grilled Halloumi & Fig Flatbread", description: "Warm flatbread topped with grilled halloumi cheese, fig jam, arugula, and balsamic glaze.", price: 12.99, calories: 480 },
  ];

  let mainsMenu=[
    { name: "Lemon Herb Grilled Salmon", description: "Served with saffron rice, roasted vegetables, and a creamy tahini sauce.", price: 21.99, calories: 650 },
    { name: "Slow-Cooked Lamb Tagine", description: "Traditional Moroccan-style lamb stew with apricots, almonds, and warm spices, served with couscous.", price: 23.99, calories: 720 },
    { name: "Stuffed Eggplant with Spiced Couscous", description: "Roasted eggplant filled with spiced couscous, tomatoes, and pine nuts, topped with yogurt sauce.", price: 18.99, calories: 590 },
    { name: "Za’atar Crusted Chicken", description: "Juicy chicken breast coated in za’atar, served with garlic roasted potatoes and charred lemon.", price: 20.99, calories: 610 },
    { name: "Seafood Paella", description: "A fragrant blend of shrimp, mussels, and squid cooked with saffron-infused rice and fresh herbs.", price: 24.99, calories: 740 },
  ];

  let dessertsMenu=[
    { name: 'Hummus', price: 5.99 },
    { name: 'Tabbouleh', price: 6.99 },
    { name: 'Falafel', price: 7.99 },
  ];

  let aLaCarteMenu=[
    { name: 'Hummus', price: 5.99 },
    { name: 'Tabbouleh', price: 6.99 },
    { name: 'Falafel', price: 7.99 },
  ];

  let specialsMenu=[
    { name: 'Hummus', price: 5.99 },
    { name: 'Tabbouleh', price: 6.99 },
    { name: 'Falafel', price: 7.99 },
  ];

  let drinksMenu=[
    { name: 'Hummus', price: 5.99 },
    { name: 'Tabbouleh', price: 6.99 },
    { name: 'Falafel', price: 7.99 },
  ];

const Menu = () => {
    return (
        <div className="menu-item">
            {breakfastMenu.map((name, index) => (
                <div className='QA' key={index}>
                    <h1>{breakfastMenu[0].name}</h1>
            <h3>{breakfastMenu[0].description}</h3>
            <>
                <h3>{breakfastMenu[0].price}</h3>
                <h3>{breakfastMenu[0].calories}</h3>
            </>
                </div>
            ))}  
        </div>
    );
};

export default Menu;