import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item, quantity = 1) => {
        setCartItems(currentItems => {
            const existingItem = currentItems.find(i => i.name === item.name);
            
            if (existingItem) {
                return currentItems.map(i =>
                    i.name === item.name 
                        ? { ...i, quantity: i.quantity + quantity }
                        : i
                );
            }
            
            return [...currentItems, { ...item, quantity }];
        });
    };

    const removeFromCart = (itemName) => {
        setCartItems(currentItems => 
            currentItems.filter(item => item.name !== itemName)
        );
    };

    const updateQuantity = (itemName, newQuantity) => {
        setCartItems(currentItems =>
            currentItems.map(item =>
                item.name === itemName
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            removeFromCart, 
            updateQuantity 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}